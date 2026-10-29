<?php
// RAK 4 CREATIVE - Complete cPanel PHP CMS Backend Controller
// Compatible with PHP 7.4, 8.0, 8.1, 8.2, 8.3+ on Apache/LiteSpeed cPanel servers.

error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE);
ini_set('display_errors', '0');

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CMS-Token');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/smtp.php';

define('STORAGE_DIR', __DIR__ . '/storage');
define('UPLOADS_DIR', dirname(__DIR__) . '/uploads');

if (!is_dir(STORAGE_DIR)) {
    @mkdir(STORAGE_DIR, 0775, true);
}
if (!is_dir(UPLOADS_DIR)) {
    @mkdir(UPLOADS_DIR, 0775, true);
}

function respond(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function readJsonFile(string $filename, $default = []) {
    $path = STORAGE_DIR . '/' . $filename;
    if (!file_exists($path)) {
        return $default;
    }
    $raw = @file_get_contents($path);
    if ($raw === false || trim($raw) === '') {
        return $default;
    }
    $decoded = json_decode($raw, true);
    return (json_last_error() === JSON_ERROR_NONE && $decoded !== null) ? $decoded : $default;
}

function writeJsonFile(string $filename, $data): bool {
    $path = STORAGE_DIR . '/' . $filename;
    $tmpPath = $path . '.tmp.' . uniqid('', true);
    $encoded = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($encoded === false) {
        return false;
    }
    if (@file_put_contents($tmpPath, $encoded, LOCK_EX) === false) {
        return false;
    }
    return @rename($tmpPath, $path);
}

function getAuthConfig(): array {
    $auth = readJsonFile('auth.json', []);
    if (empty($auth['passwordHash']) || empty($auth['secret'])) {
        $auth = [
            'username' => 'admin',
            'email' => 'hello@rak4creative.com',
            'passwordHash' => password_hash('RAK4Creative!2026', PASSWORD_DEFAULT),
            'secret' => bin2hex(random_bytes(32)),
            'updatedAt' => gmdate('c')
        ];
        writeJsonFile('auth.json', $auth);
    }
    return $auth;
}

function issueToken(string $username, string $secret): array {
    $expiresAt = time() + (86400 * 7);
    $payload = base64_encode(json_encode([
        'sub' => $username,
        'exp' => $expiresAt,
        'iat' => time()
    ]));
    $sig = hash_hmac('sha256', $payload, $secret);
    return [
        'token' => $payload . '.' . $sig,
        'expiresAt' => gmdate('c', $expiresAt)
    ];
}

function getRequestToken(): string {
    if (!empty($_SERVER['HTTP_X_CMS_TOKEN'])) {
        return trim($_SERVER['HTTP_X_CMS_TOKEN']);
    }
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if ($authHeader === '' && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        foreach ($headers as $k => $v) {
            if (strtolower($k) === 'x-cms-token') {
                return trim($v);
            }
            if (strtolower($k) === 'authorization') {
                $authHeader = $v;
            }
        }
    }
    if (stripos($authHeader, 'Bearer ') === 0) {
        return trim(substr($authHeader, 7));
    }
    return '';
}

function requireAdminAuth(): array {
    $token = getRequestToken();
    if ($token === '' || strpos($token, '.') === false) {
        respond(['ok' => false, 'error' => 'Unauthorized: Missing or invalid CMS session token.'], 401);
    }
    [$payloadB64, $sig] = explode('.', $token, 2);
    $auth = getAuthConfig();
    $expectedSig = hash_hmac('sha256', $payloadB64, $auth['secret']);
    if (!hash_equals($expectedSig, $sig)) {
        respond(['ok' => false, 'error' => 'Unauthorized: Session signature mismatch.'], 401);
    }
    $payload = json_decode(base64_decode($payloadB64), true);
    if (!is_array($payload) || empty($payload['exp']) || $payload['exp'] < time()) {
        respond(['ok' => false, 'error' => 'Unauthorized: Session expired. Please sign in again.'], 401);
    }
    return $payload;
}

function getJsonBody(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function resolveRoute(): string {
    if (!empty($_GET['route'])) {
        return trim((string)$_GET['route'], '/');
    }
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $uri = preg_replace('#^.*/api/index\.php/?#', '', $uri);
    $uri = preg_replace('#^.*/api/?#', '', $uri);
    return trim((string)$uri, '/');
}

function handleFileUpload(array $file, string $subDir = ''): array {
    if (!isset($file['error']) || is_array($file['error'])) {
        return ['ok' => false, 'error' => 'Invalid upload parameters.'];
    }
    if ($file['error'] !== UPLOAD_ERR_OK) {
        return ['ok' => false, 'error' => 'File upload error code: ' . $file['error']];
    }
    $maxBytes = 12 * 1024 * 1024;
    if ($file['size'] > $maxBytes) {
        return ['ok' => false, 'error' => 'File exceeds maximum allowed size of 12MB.'];
    }
    $origName = basename((string)$file['name']);
    $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
    $allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif', 'mp4', 'pdf', 'doc', 'docx'];
    if (!in_array($ext, $allowedExts, true)) {
        return ['ok' => false, 'error' => 'Unsupported file extension: .' . $ext];
    }
    $safeBase = preg_replace('/[^a-zA-Z0-9_-]/', '-', pathinfo($origName, PATHINFO_FILENAME));
    $safeBase = trim(substr($safeBase ?: 'asset', 0, 48), '-');
    $targetFolder = UPLOADS_DIR . ($subDir ? '/' . trim($subDir, '/') : '');
    if (!is_dir($targetFolder)) {
        @mkdir($targetFolder, 0775, true);
    }
    $finalName = $safeBase . '-' . gmdate('YmdHis') . '-' . substr(bin2hex(random_bytes(4)), 0, 6) . '.' . $ext;
    $destPath = $targetFolder . '/' . $finalName;
    if (!@move_uploaded_file($file['tmp_name'], $destPath)) {
        return ['ok' => false, 'error' => 'Failed to move uploaded file into /uploads directory. Check folder permissions.'];
    }
    $publicPath = '/uploads' . ($subDir ? '/' . trim($subDir, '/') : '') . '/' . $finalName;
    return [
        'ok' => true,
        'url' => $publicPath,
        'fileName' => $origName,
        'storedName' => $finalName,
        'size' => (int)$file['size']
    ];
}

function handleBase64Upload(string $fileName, string $dataUrl, string $subDir = ''): array {
    if (!preg_match('/^data:([^;]+);base64,(.+)$/', $dataUrl, $matches)) {
        return ['ok' => false, 'error' => 'Invalid base64 data URL format.'];
    }
    $binary = base64_decode($matches[2], true);
    if ($binary === false) {
        return ['ok' => false, 'error' => 'Failed to decode base64 file payload.'];
    }
    if (strlen($binary) > 12 * 1024 * 1024) {
        return ['ok' => false, 'error' => 'File exceeds maximum allowed size of 12MB.'];
    }
    $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    $allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif', 'mp4', 'pdf', 'doc', 'docx'];
    if (!in_array($ext, $allowedExts, true)) {
        return ['ok' => false, 'error' => 'Unsupported file extension: .' . $ext];
    }
    $safeBase = preg_replace('/[^a-zA-Z0-9_-]/', '-', pathinfo($fileName, PATHINFO_FILENAME));
    $safeBase = trim(substr($safeBase ?: 'asset', 0, 48), '-');
    $targetFolder = UPLOADS_DIR . ($subDir ? '/' . trim($subDir, '/') : '');
    if (!is_dir($targetFolder)) {
        @mkdir($targetFolder, 0775, true);
    }
    $finalName = $safeBase . '-' . gmdate('YmdHis') . '-' . substr(bin2hex(random_bytes(4)), 0, 6) . '.' . $ext;
    $destPath = $targetFolder . '/' . $finalName;
    if (@file_put_contents($destPath, $binary) === false) {
        return ['ok' => false, 'error' => 'Unable to write uploaded file to disk.'];
    }
    $publicPath = '/uploads' . ($subDir ? '/' . trim($subDir, '/') : '') . '/' . $finalName;
    return [
        'ok' => true,
        'url' => $publicPath,
        'fileName' => $fileName,
        'storedName' => $finalName,
        'size' => strlen($binary)
    ];
}

function dispatchLeadEmails(array $lead): array {
    $emailSettings = readJsonFile('email_settings.json', []);
    if (empty($emailSettings)) {
        return ['adminSent' => false, 'autoResponderSent' => false, 'note' => 'Email settings not initialized.'];
    }

    $mailer = new RakMailer($emailSettings);
    $logs = is_array($emailSettings['deliveryLogs'] ?? null) ? $emailSettings['deliveryLogs'] : [];
    $adminSent = false;
    $autoResponderSent = false;

    $sourceLabel = strtoupper($lead['source'] ?? 'CONTACT');
    $prefix = trim($emailSettings['subjectPrefix'] ?? '[RAK4Creative Lead]');
    $subject = "{$prefix} New {$sourceLabel} Submission from " . ($lead['name'] ?? 'Website Visitor');

    if (!empty($emailSettings['enableAdminNotification'])) {
        $rawNotify = (string)($emailSettings['notifyEmails'] ?? 'hello@rak4creative.com');
        $recipients = array_values(array_filter(array_map('trim', preg_split('/[,;]+/', $rawNotify)), function ($e) {
            return filter_var($e, FILTER_VALIDATE_EMAIL);
        }));
        $ccList = array_values(array_filter(array_map('trim', preg_split('/[,;]+/', (string)($emailSettings['ccEmails'] ?? ''))), function ($e) {
            return filter_var($e, FILTER_VALIDATE_EMAIL);
        }));

        $rowsHtml = '';
        $fields = [
            'Lead ID' => $lead['id'] ?? '',
            'Source' => $sourceLabel,
            'Submitted At' => $lead['createdAt'] ?? gmdate('c'),
            'Full Name' => $lead['name'] ?? '',
            'Email' => $lead['email'] ?? '',
            'Phone' => $lead['phone'] ?? '',
            'Company' => $lead['company'] ?? '',
            'Service / Capability' => $lead['service'] ?? '',
            'Selected Services' => !empty($lead['selectedServices']) ? implode(', ', (array)$lead['selectedServices']) : '',
            'Budget Bracket' => $lead['budget'] ?? '',
            'Timeline' => $lead['timeline'] ?? '',
            'Role Applied' => $lead['roleTitle'] ?? '',
            'LinkedIn' => $lead['linkedin'] ?? '',
            'Portfolio URL' => $lead['portfolio'] ?? '',
            'Resume Attachment' => $lead['resumeUrl'] ?? '',
            'Message / Brief' => $lead['message'] ?? ''
        ];
        foreach ($fields as $label => $val) {
            if (trim((string)$val) !== '') {
                $escapedLabel = htmlspecialchars($label, ENT_QUOTES, 'UTF-8');
                $escapedVal = nl2br(htmlspecialchars((string)$val, ENT_QUOTES, 'UTF-8'));
                $rowsHtml .= "<tr><td style=\"padding:10px 14px;border-bottom:1px solid #1e293b;color:#94a3b8;font-weight:bold;width:180px;\">{$escapedLabel}</td><td style=\"padding:10px 14px;border-bottom:1px solid #1e293b;color:#f8fafc;\">{$escapedVal}</td></tr>";
            }
        }

        $htmlBody = "<!DOCTYPE html><html><body style=\"background:#07080B;color:#F8FAFC;font-family:Arial,sans-serif;padding:24px;\">"
            . "<div style=\"max-width:640px;margin:0 auto;background:#0F172A;border:1px solid #EC008C;border-radius:16px;overflow:hidden;\">"
            . "<div style=\"background:#EC008C;color:#FFFFFF;padding:18px 24px;font-size:18px;font-weight:bold;\">RAK 4 CREATIVE • New {$sourceLabel} Lead</div>"
            . "<div style=\"padding:20px 24px;\"><table style=\"width:100%;border-collapse:collapse;font-size:14px;\">{$rowsHtml}</table></div>"
            . "</div></body></html>";

        foreach ($recipients as $idx => $toAddr) {
            $res = $mailer->send($toAddr, $subject, $htmlBody, '', $lead['email'] ?? '', $idx === 0 ? $ccList : []);
            if ($res['ok']) {
                $adminSent = true;
            }
            array_unshift($logs, [
                'id' => 'log-' . uniqid(),
                'type' => 'admin_notification',
                'leadId' => $lead['id'] ?? null,
                'recipient' => $toAddr,
                'subject' => $subject,
                'driver' => $res['driver'],
                'ok' => $res['ok'],
                'message' => $res['message'],
                'timestamp' => gmdate('c')
            ]);
        }
    }

    if (!empty($emailSettings['enableAutoResponder']) && !empty($lead['email']) && filter_var($lead['email'], FILTER_VALIDATE_EMAIL)) {
        $autoSubj = (string)($emailSettings['autoResponderSubject'] ?? 'We received your inquiry | RAK 4 CREATIVE');
        $autoTemplate = (string)($emailSettings['autoResponderBody'] ?? "Hello {{name}},\n\nThank you for contacting RAK 4 CREATIVE.");
        $replacements = [
            '{{name}}' => $lead['name'] ?? 'there',
            '{{company}}' => $lead['company'] ?? 'your organization',
            '{{service}}' => $lead['service'] ?? ($lead['roleTitle'] ?? 'your inquiry'),
            '{{role}}' => $lead['roleTitle'] ?? ($lead['service'] ?? 'your application'),
            '{{budget}}' => $lead['budget'] ?? ''
        ];
        $autoText = strtr($autoTemplate, $replacements);
        $autoSubj = strtr($autoSubj, $replacements);
        $autoHtml = "<!DOCTYPE html><html><body style=\"background:#07080B;color:#F8FAFC;font-family:Arial,sans-serif;padding:24px;\">"
            . "<div style=\"max-width:600px;margin:0 auto;background:#0F172A;border:1px solid #334155;border-radius:16px;padding:28px;line-height:1.6;color:#E2E8F0;\">"
            . "<div style=\"color:#EC008C;font-weight:bold;font-size:14px;letter-spacing:1px;text-transform:uppercase;margin-bottom:16px;\">RAK 4 CREATIVE</div>"
            . "<div>" . nl2br(htmlspecialchars($autoText, ENT_QUOTES, 'UTF-8')) . "</div>"
            . "</div></body></html>";

        $resAuto = $mailer->send($lead['email'], $autoSubj, $autoHtml, $autoText);
        $autoResponderSent = $resAuto['ok'];
        array_unshift($logs, [
            'id' => 'log-' . uniqid(),
            'type' => 'auto_responder',
            'leadId' => $lead['id'] ?? null,
            'recipient' => $lead['email'],
            'subject' => $autoSubj,
            'driver' => $resAuto['driver'],
            'ok' => $resAuto['ok'],
            'message' => $resAuto['message'],
            'timestamp' => gmdate('c')
        ]);
    }

    $emailSettings['deliveryLogs'] = array_slice($logs, 0, 50);
    writeJsonFile('email_settings.json', $emailSettings);

    return [
        'adminSent' => $adminSent,
        'autoResponderSent' => $autoResponderSent
    ];
}

function buildAuditReport(): array {
    $checks = [];

    $phpOk = version_compare(PHP_VERSION, '7.4.0', '>=');
    $checks[] = [
        'id' => 'php-runtime',
        'category' => 'cPanel Server & PHP Runtime',
        'title' => 'PHP Version & Core Extensions',
        'status' => $phpOk ? 'pass' : 'fail',
        'detail' => 'Running PHP ' . PHP_VERSION . ' with json=' . (extension_loaded('json') ? 'yes' : 'no') . ', openssl=' . (extension_loaded('openssl') ? 'yes' : 'no'),
        'recommendation' => $phpOk ? 'Compatible with cPanel PHP 7.4/8.x.' : 'Upgrade PHP to 7.4 or 8.x in cPanel MultiPHP Manager.'
    ];

    $storageWritable = is_dir(STORAGE_DIR) && is_writable(STORAGE_DIR);
    $storageHtaccess = file_exists(STORAGE_DIR . '/.htaccess');
    $checks[] = [
        'id' => 'storage-security',
        'category' => 'Security & Storage',
        'title' => 'CMS Storage Writability & .htaccess Protection',
        'status' => ($storageWritable && $storageHtaccess) ? 'pass' : ($storageWritable ? 'warn' : 'fail'),
        'detail' => 'Storage writable: ' . ($storageWritable ? 'yes' : 'no') . ' • Direct HTTP deny (.htaccess): ' . ($storageHtaccess ? 'active' : 'missing'),
        'recommendation' => ($storageWritable && $storageHtaccess) ? 'Database files are writable by PHP and blocked from public web access.' : 'Ensure api/storage has 0755/0775 permissions and contains .htaccess.'
    ];

    $uploadsWritable = is_dir(UPLOADS_DIR) && is_writable(UPLOADS_DIR);
    $uploadsHtaccess = file_exists(UPLOADS_DIR . '/.htaccess');
    $checks[] = [
        'id' => 'uploads-security',
        'category' => 'Security & Storage',
        'title' => 'Media & CV Uploads Directory Security',
        'status' => ($uploadsWritable && $uploadsHtaccess) ? 'pass' : ($uploadsWritable ? 'warn' : 'fail'),
        'detail' => 'Uploads writable: ' . ($uploadsWritable ? 'yes' : 'no') . ' • PHP execution disabled (.htaccess): ' . ($uploadsHtaccess ? 'active' : 'missing'),
        'recommendation' => 'Uploaded media and candidate resumes are isolated from script execution.'
    ];

    $content = readJsonFile('cms_data.json', []);
    $hasPillars = !empty($content['pillars']) && is_array($content['pillars']);
    $hasProjects = !empty($content['projects']) && is_array($content['projects']);
    $hasBlogs = !empty($content['blogPosts']) && is_array($content['blogPosts']);
    $hasRoles = isset($content['openRoles']) && is_array($content['openRoles']);
    $contentOk = $hasPillars && $hasProjects && $hasBlogs && $hasRoles;
    $checks[] = [
        'id' => 'content-integrity',
        'category' => 'Content Studio',
        'title' => 'Website Content Schema & Collections Integrity',
        'status' => $contentOk ? 'pass' : 'fail',
        'detail' => sprintf(
            'Pillars: %d • Creations: %d • Blog Articles: %d • Open Roles: %d • Offices: %d • Testimonials: %d',
            count($content['pillars'] ?? []),
            count($content['projects'] ?? []),
            count($content['blogPosts'] ?? []),
            count($content['openRoles'] ?? []),
            count($content['offices'] ?? []),
            count($content['testimonials'] ?? [])
        ),
        'recommendation' => $contentOk ? 'All website sections are hydrated and editable from the CMS.' : 'Restore or save content in Content Studio.'
    ];

    $pixels = readJsonFile('pixels.json', []);
    $activePixels = [];
    if (!empty($pixels['metaPixelEnabled']) && !empty($pixels['metaPixelId'])) $activePixels[] = 'Meta (' . $pixels['metaPixelId'] . ')';
    if (!empty($pixels['gtmEnabled']) && !empty($pixels['gtmId'])) $activePixels[] = 'GTM (' . $pixels['gtmId'] . ')';
    if (!empty($pixels['ga4Enabled']) && !empty($pixels['ga4Id'])) $activePixels[] = 'GA4 (' . $pixels['ga4Id'] . ')';
    if (!empty($pixels['tiktokPixelEnabled']) && !empty($pixels['tiktokPixelId'])) $activePixels[] = 'TikTok (' . $pixels['tiktokPixelId'] . ')';
    if (!empty($pixels['linkedinEnabled']) && !empty($pixels['linkedinPartnerId'])) $activePixels[] = 'LinkedIn (' . $pixels['linkedinPartnerId'] . ')';
    $checks[] = [
        'id' => 'pixels-engine',
        'category' => 'Pixels & Tracking',
        'title' => 'Marketing Pixels & Conversion Event Injection Engine',
        'status' => 'pass',
        'detail' => empty($activePixels)
            ? 'Engine ready. No third-party pixel IDs enabled yet (0 active).'
            : 'Active pixels: ' . implode(', ', $activePixels),
        'recommendation' => 'Configure Meta, GTM, GA4, TikTok, or LinkedIn IDs in the Pixels tab before running paid media.'
    ];

    $leads = readJsonFile('leads.json', []);
    $checks[] = [
        'id' => 'leads-pipeline',
        'category' => 'Leads CRM',
        'title' => 'Lead Capture Endpoints (Contact, Project Planner, Careers)',
        'status' => is_array($leads) ? 'pass' : 'fail',
        'detail' => 'Total stored leads: ' . (is_array($leads) ? count($leads) : 0) . ' • Endpoints wired: Contact Form, Project Estimator, Career Applications',
        'recommendation' => 'Use the "Run End-to-End Lead Test" button in the Audit tab to verify live capture.'
    ];

    $email = readJsonFile('email_settings.json', []);
    $driver = $email['driver'] ?? 'mail';
    $fromValid = filter_var($email['fromEmail'] ?? '', FILTER_VALIDATE_EMAIL) !== false;
    $smtpReady = ($driver !== 'smtp') || (!empty($email['smtpHost']) && !empty($email['smtpPort']) && !empty($email['smtpUser']));
    $checks[] = [
        'id' => 'email-routing',
        'category' => 'Email & SMTP',
        'title' => 'Email Notification & Auto-Responder Configuration',
        'status' => ($fromValid && $smtpReady) ? 'pass' : 'warn',
        'detail' => 'Driver: ' . strtoupper($driver) . ' • From: ' . ($email['fromEmail'] ?? 'not set') . ' • Notify: ' . ($email['notifyEmails'] ?? 'not set'),
        'recommendation' => ($fromValid && $smtpReady) ? 'Email routing configured. Send a test email in the Email Settings tab after deploying to cPanel.' : 'Complete sender email and SMTP credentials in Email Settings.'
    ];

    $rootHtaccess = file_exists(dirname(__DIR__) . '/.htaccess');
    $checks[] = [
        'id' => 'cpanel-htaccess',
        'category' => 'cPanel Server & PHP Runtime',
        'title' => 'Apache .htaccess SPA + API Rewrite Configuration',
        'status' => $rootHtaccess ? 'pass' : 'warn',
        'detail' => 'Root .htaccess present: ' . ($rootHtaccess ? 'yes' : 'no') . ' • API .htaccess present: ' . (file_exists(__DIR__ . '/.htaccess') ? 'yes' : 'no'),
        'recommendation' => 'Ensure dotfiles (.htaccess) are included when uploading or deploying via .cpanel.yml.'
    ];

    $passCount = count(array_filter($checks, function ($c) { return $c['status'] === 'pass'; }));
    $warnCount = count(array_filter($checks, function ($c) { return $c['status'] === 'warn'; }));
    $failCount = count(array_filter($checks, function ($c) { return $c['status'] === 'fail'; }));

    return [
        'ok' => true,
        'environment' => 'cpanel-php',
        'phpVersion' => PHP_VERSION,
        'checkedAt' => gmdate('c'),
        'summary' => [
            'total' => count($checks),
            'pass' => $passCount,
            'warn' => $warnCount,
            'fail' => $failCount,
            'readyForLive' => $failCount === 0
        ],
        'checks' => $checks
    ];
}

$route = resolveRoute();
$method = $_SERVER['REQUEST_METHOD'];

// 1. PUBLIC BOOTSTRAP (Content + Pixels)
if ($route === 'bootstrap' && $method === 'GET') {
    $content = readJsonFile('cms_data.json', []);
    $pixels = readJsonFile('pixels.json', []);
    respond([
        'ok' => true,
        'environment' => 'cpanel-php',
        'phpVersion' => PHP_VERSION,
        'content' => $content,
        'pixels' => $pixels
    ]);
}

// 2. ADMIN LOGIN
if ($route === 'login' && $method === 'POST') {
    $body = getJsonBody();
    $username = trim((string)($body['username'] ?? ''));
    $password = (string)($body['password'] ?? '');
    $auth = getAuthConfig();

    $userMatch = (strcasecmp($username, $auth['username']) === 0) || (strcasecmp($username, $auth['email'] ?? '') === 0);
    if (!$userMatch || !password_verify($password, $auth['passwordHash'])) {
        respond(['ok' => false, 'error' => 'Invalid username or password.'], 401);
    }

    $session = issueToken($auth['username'], $auth['secret']);
    respond([
        'ok' => true,
        'token' => $session['token'],
        'expiresAt' => $session['expiresAt'],
        'user' => [
            'username' => $auth['username'],
            'email' => $auth['email'] ?? 'hello@rak4creative.com'
        ]
    ]);
}

// 3. CHANGE ADMIN PASSWORD
if ($route === 'change-password' && $method === 'POST') {
    requireAdminAuth();
    $body = getJsonBody();
    $currentPassword = (string)($body['currentPassword'] ?? '');
    $newUsername = trim((string)($body['newUsername'] ?? ''));
    $newPassword = (string)($body['newPassword'] ?? '');

    $auth = getAuthConfig();
    if (!password_verify($currentPassword, $auth['passwordHash'])) {
        respond(['ok' => false, 'error' => 'Current password is incorrect.'], 400);
    }
    if (strlen($newPassword) < 8) {
        respond(['ok' => false, 'error' => 'New password must be at least 8 characters.'], 400);
    }

    if ($newUsername !== '') {
        $auth['username'] = $newUsername;
    }
    $auth['passwordHash'] = password_hash($newPassword, PASSWORD_DEFAULT);
    $auth['updatedAt'] = gmdate('c');
    writeJsonFile('auth.json', $auth);

    $session = issueToken($auth['username'], $auth['secret']);
    respond([
        'ok' => true,
        'message' => 'Admin credentials updated.',
        'token' => $session['token'],
        'user' => ['username' => $auth['username'], 'email' => $auth['email'] ?? '']
    ]);
}

// 4. CONTENT MANAGEMENT
if ($route === 'content') {
    if ($method === 'GET') {
        respond(['ok' => true, 'content' => readJsonFile('cms_data.json', [])]);
    }
    if ($method === 'PUT' || $method === 'POST') {
        requireAdminAuth();
        $body = getJsonBody();
        $newContent = isset($body['content']) && is_array($body['content']) ? $body['content'] : $body;
        if (empty($newContent) || !is_array($newContent)) {
            respond(['ok' => false, 'error' => 'Invalid content payload.'], 400);
        }
        $existing = readJsonFile('cms_data.json', []);
        if (!empty($existing)) {
            writeJsonFile('cms_data.backup.json', $existing);
        }
        if (!writeJsonFile('cms_data.json', $newContent)) {
            respond(['ok' => false, 'error' => 'Failed to write cms_data.json. Check api/storage folder permissions.'], 500);
        }
        respond([
            'ok' => true,
            'updatedAt' => gmdate('c'),
            'content' => $newContent
        ]);
    }
}

// 5. PIXELS & TRACKING MANAGEMENT
if ($route === 'pixels') {
    if ($method === 'GET') {
        respond(['ok' => true, 'pixels' => readJsonFile('pixels.json', [])]);
    }
    if ($method === 'PUT' || $method === 'POST') {
        requireAdminAuth();
        $body = getJsonBody();
        $pixels = isset($body['pixels']) && is_array($body['pixels']) ? $body['pixels'] : $body;
        if (!writeJsonFile('pixels.json', $pixels)) {
            respond(['ok' => false, 'error' => 'Failed to save pixels configuration.'], 500);
        }
        respond([
            'ok' => true,
            'updatedAt' => gmdate('c'),
            'pixels' => $pixels
        ]);
    }
}

// 6. LEADS MANAGEMENT (PUBLIC POST + ADMIN GET/PATCH/DELETE)
if ($route === 'leads') {
    if ($method === 'POST') {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        $payload = [];
        $resumeAttachment = null;

        if (stripos($contentType, 'multipart/form-data') !== false) {
            $payload = $_POST;
            if (!empty($_FILES['resume']) && $_FILES['resume']['error'] !== UPLOAD_ERR_NO_FILE) {
                $uploadRes = handleFileUpload($_FILES['resume'], 'resumes');
                if (!$uploadRes['ok']) {
                    respond($uploadRes, 400);
                }
                $resumeAttachment = $uploadRes;
            }
        } else {
            $payload = getJsonBody();
            if (!empty($payload['resumeDataUrl']) && !empty($payload['resumeName'])) {
                $uploadRes = handleBase64Upload((string)$payload['resumeName'], (string)$payload['resumeDataUrl'], 'resumes');
                if ($uploadRes['ok']) {
                    $resumeAttachment = $uploadRes;
                }
            }
        }

        $name = trim((string)($payload['name'] ?? $payload['fullName'] ?? ''));
        $email = trim((string)($payload['email'] ?? ''));
        if ($name === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            respond(['ok' => false, 'error' => 'Please provide a valid name and email address.'], 400);
        }

        $selectedServices = $payload['selectedServices'] ?? [];
        if (is_string($selectedServices)) {
            $decodedServices = json_decode($selectedServices, true);
            $selectedServices = is_array($decodedServices) ? $decodedServices : array_filter(array_map('trim', explode(',', $selectedServices)));
        }

        $source = strtolower(trim((string)($payload['source'] ?? 'contact')));
        if (!in_array($source, ['contact', 'planner', 'career'], true)) {
            $source = 'contact';
        }

        $lead = [
            'id' => 'lead-' . gmdate('YmdHis') . '-' . substr(bin2hex(random_bytes(3)), 0, 6),
            'source' => $source,
            'status' => 'new',
            'priority' => $payload['priority'] ?? 'normal',
            'name' => $name,
            'email' => $email,
            'phone' => trim((string)($payload['phone'] ?? '')),
            'company' => trim((string)($payload['company'] ?? '')),
            'service' => trim((string)($payload['service'] ?? '')),
            'selectedServices' => array_values((array)$selectedServices),
            'budget' => trim((string)($payload['budget'] ?? '')),
            'timeline' => trim((string)($payload['timeline'] ?? '')),
            'message' => trim((string)($payload['message'] ?? $payload['brief'] ?? $payload['coverNote'] ?? '')),
            'roleId' => trim((string)($payload['roleId'] ?? '')),
            'roleTitle' => trim((string)($payload['roleTitle'] ?? '')),
            'linkedin' => trim((string)($payload['linkedin'] ?? '')),
            'portfolio' => trim((string)($payload['portfolio'] ?? '')),
            'resumeName' => $resumeAttachment['fileName'] ?? trim((string)($payload['resumeName'] ?? '')),
            'resumeUrl' => $resumeAttachment['url'] ?? '',
            'notes' => '',
            'pageUrl' => trim((string)($payload['pageUrl'] ?? '')),
            'createdAt' => gmdate('c'),
            'updatedAt' => gmdate('c')
        ];

        $leads = readJsonFile('leads.json', []);
        if (!is_array($leads)) {
            $leads = [];
        }

        $emailStatus = dispatchLeadEmails($lead);
        $lead['emailDelivery'] = $emailStatus;

        array_unshift($leads, $lead);
        writeJsonFile('leads.json', $leads);

        respond([
            'ok' => true,
            'lead' => $lead,
            'emailDelivery' => $emailStatus
        ], 201);
    }

    if ($method === 'GET') {
        requireAdminAuth();
        $leads = readJsonFile('leads.json', []);
        respond([
            'ok' => true,
            'leads' => is_array($leads) ? $leads : []
        ]);
    }

    if ($method === 'PATCH' || $method === 'PUT') {
        requireAdminAuth();
        $body = getJsonBody();
        $id = (string)($body['id'] ?? '');
        if ($id === '') {
            respond(['ok' => false, 'error' => 'Lead ID is required.'], 400);
        }
        $leads = readJsonFile('leads.json', []);
        $updatedLead = null;
        foreach ($leads as &$item) {
            if (($item['id'] ?? '') === $id) {
                if (isset($body['status'])) $item['status'] = (string)$body['status'];
                if (isset($body['priority'])) $item['priority'] = (string)$body['priority'];
                if (isset($body['notes'])) $item['notes'] = (string)$body['notes'];
                $item['updatedAt'] = gmdate('c');
                $updatedLead = $item;
                break;
            }
        }
        unset($item);
        if (!$updatedLead) {
            respond(['ok' => false, 'error' => 'Lead not found.'], 404);
        }
        writeJsonFile('leads.json', $leads);
        respond(['ok' => true, 'lead' => $updatedLead, 'leads' => $leads]);
    }

    if ($method === 'DELETE') {
        requireAdminAuth();
        $body = getJsonBody();
        $id = (string)($_GET['id'] ?? $body['id'] ?? '');
        if ($id === '') {
            respond(['ok' => false, 'error' => 'Lead ID is required for deletion.'], 400);
        }
        $leads = readJsonFile('leads.json', []);
        $filtered = array_values(array_filter($leads, function ($item) use ($id) {
            return ($item['id'] ?? '') !== $id;
        }));
        writeJsonFile('leads.json', $filtered);
        respond(['ok' => true, 'leads' => $filtered]);
    }
}

// 7. EMAIL & SMTP SETTINGS
if ($route === 'email-settings') {
    requireAdminAuth();
    if ($method === 'GET') {
        $settings = readJsonFile('email_settings.json', []);
        respond(['ok' => true, 'emailSettings' => $settings]);
    }
    if ($method === 'PUT' || $method === 'POST') {
        $body = getJsonBody();
        $incoming = isset($body['emailSettings']) && is_array($body['emailSettings']) ? $body['emailSettings'] : $body;
        $existing = readJsonFile('email_settings.json', []);
        if (!isset($incoming['deliveryLogs']) && isset($existing['deliveryLogs'])) {
            $incoming['deliveryLogs'] = $existing['deliveryLogs'];
        }
        if (!writeJsonFile('email_settings.json', $incoming)) {
            respond(['ok' => false, 'error' => 'Failed to save email settings.'], 500);
        }
        respond([
            'ok' => true,
            'updatedAt' => gmdate('c'),
            'emailSettings' => $incoming
        ]);
    }
}

// 8. SEND TEST EMAIL
if ($route === 'test-email' && $method === 'POST') {
    requireAdminAuth();
    $body = getJsonBody();
    $settings = isset($body['emailSettings']) && is_array($body['emailSettings'])
        ? $body['emailSettings']
        : readJsonFile('email_settings.json', []);
    $recipient = trim((string)($body['recipient'] ?? $settings['fromEmail'] ?? ''));
    if ($recipient === '' || !filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
        respond(['ok' => false, 'error' => 'Provide a valid recipient email address for the test.'], 400);
    }

    $mailer = new RakMailer($settings);
    $subject = '[RAK 4 CREATIVE CMS] Diagnostic Test Email (' . strtoupper($settings['driver'] ?? 'mail') . ')';
    $html = "<!DOCTYPE html><html><body style=\"background:#07080B;color:#F8FAFC;font-family:Arial,sans-serif;padding:24px;\">"
        . "<div style=\"max-width:560px;margin:0 auto;background:#0F172A;border:1px solid #EC008C;border-radius:16px;padding:28px;\">"
        . "<h2 style=\"color:#EC008C;margin-top:0;\">RAK 4 CREATIVE • Email Pipeline Verified</h2>"
        . "<p style=\"color:#E2E8F0;line-height:1.6;\">This diagnostic message confirms that your cPanel PHP email configuration is active.</p>"
        . "<ul style=\"color:#94A3B8;font-size:13px;line-height:1.8;\">"
        . "<li><strong>Driver:</strong> " . htmlspecialchars(strtoupper($settings['driver'] ?? 'mail')) . "</li>"
        . "<li><strong>From:</strong> " . htmlspecialchars(($settings['fromName'] ?? '') . ' <' . ($settings['fromEmail'] ?? '') . '>') . "</li>"
        . "<li><strong>Server Time (UTC):</strong> " . gmdate('Y-m-d H:i:s') . "</li>"
        . "</ul></div></body></html>";

    $result = $mailer->send($recipient, $subject, $html);

    $storedSettings = readJsonFile('email_settings.json', $settings);
    $logs = is_array($storedSettings['deliveryLogs'] ?? null) ? $storedSettings['deliveryLogs'] : [];
    array_unshift($logs, [
        'id' => 'log-' . uniqid(),
        'type' => 'diagnostic_test',
        'recipient' => $recipient,
        'subject' => $subject,
        'driver' => $result['driver'],
        'ok' => $result['ok'],
        'message' => $result['message'],
        'timestamp' => gmdate('c')
    ]);
    $storedSettings['deliveryLogs'] = array_slice($logs, 0, 50);
    writeJsonFile('email_settings.json', $storedSettings);

    respond([
        'ok' => $result['ok'],
        'result' => $result,
        'deliveryLogs' => $storedSettings['deliveryLogs']
    ]);
}

// 9. MEDIA UPLOAD (ADMIN)
if ($route === 'upload' && $method === 'POST') {
    requireAdminAuth();
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    if (stripos($contentType, 'multipart/form-data') !== false && !empty($_FILES['file'])) {
        $res = handleFileUpload($_FILES['file'], 'media');
        respond($res, $res['ok'] ? 201 : 400);
    }
    $body = getJsonBody();
    if (!empty($body['fileName']) && !empty($body['dataUrl'])) {
        $res = handleBase64Upload((string)$body['fileName'], (string)$body['dataUrl'], 'media');
        respond($res, $res['ok'] ? 201 : 400);
    }
    respond(['ok' => false, 'error' => 'No file provided in upload request.'], 400);
}

// 10. SYSTEM AUDIT (ADMIN)
if ($route === 'audit' && $method === 'GET') {
    requireAdminAuth();
    respond(buildAuditReport());
}

respond(['ok' => false, 'error' => 'Unknown API route: ' . $route], 404);
