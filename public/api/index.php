<?php
// RAK 4 CREATIVE - Complete cPanel PHP CMS Backend Controller
// Compatible with PHP 7.4, 8.0, 8.1, 8.2, 8.3+ on Apache/LiteSpeed cPanel servers.

error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE);
ini_set('display_errors', '0');

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($requestOrigin !== '') {
    $originHost = strtolower((string)(parse_url($requestOrigin, PHP_URL_HOST) ?: ''));
    $serverHost = strtolower((string)preg_replace('/:\d+$/', '', (string)($_SERVER['HTTP_HOST'] ?? '')));
    $allowedOrigins = array_filter([$serverHost, 'rak4creative.com', 'www.rak4creative.com', 'localhost', '127.0.0.1']);
    if (in_array($originHost, $allowedOrigins, true)) {
        header('Access-Control-Allow-Origin: ' . $requestOrigin);
        header('Vary: Origin');
    }
}
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

// Atomic read-modify-write under an exclusive file lock to prevent concurrent lead or log loss.
function updateJsonFile(string $filename, callable $mutator, $default = []): array {
    $path = STORAGE_DIR . '/' . $filename;
    $fp = @fopen($path, 'c+');
    if ($fp === false) {
        return ['ok' => false, 'data' => $default];
    }
    if (!@flock($fp, LOCK_EX)) {
        @fclose($fp);
        return ['ok' => false, 'data' => $default];
    }
    $raw = stream_get_contents($fp);
    $current = $default;
    if ($raw !== false && trim($raw) !== '') {
        $decoded = json_decode($raw, true);
        if (json_last_error() === JSON_ERROR_NONE && $decoded !== null) {
            $current = $decoded;
        }
    }
    $next = $mutator($current);
    $encoded = json_encode($next, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $ok = false;
    if ($encoded !== false) {
        @ftruncate($fp, 0);
        @rewind($fp);
        $written = @fwrite($fp, $encoded);
        @fflush($fp);
        $ok = ($written !== false);
    }
    @flock($fp, LOCK_UN);
    @fclose($fp);
    return ['ok' => $ok, 'data' => $next];
}

function getClientIp(): string {
    $cfIp = trim((string)($_SERVER['HTTP_CF_CONNECTING_IP'] ?? ''));
    if ($cfIp !== '' && filter_var($cfIp, FILTER_VALIDATE_IP)) {
        return $cfIp;
    }
    $remote = trim((string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'));
    return filter_var($remote, FILTER_VALIDATE_IP) ? $remote : '0.0.0.0';
}

function consumeRateLimit(string $bucketKey, int $maxHits, int $windowSeconds): bool {
    $now = time();
    $allowed = true;
    updateJsonFile('rate_limits.json', function ($state) use ($bucketKey, $maxHits, $windowSeconds, $now, &$allowed) {
        if (!is_array($state)) {
            $state = [];
        }
        foreach ($state as $k => $timestamps) {
            if (!is_array($timestamps)) {
                unset($state[$k]);
                continue;
            }
            $fresh = array_values(array_filter($timestamps, function ($ts) use ($now) {
                return is_int($ts) && ($now - $ts) < 3600;
            }));
            if (empty($fresh)) {
                unset($state[$k]);
            } else {
                $state[$k] = $fresh;
            }
        }
        $existing = isset($state[$bucketKey]) && is_array($state[$bucketKey]) ? $state[$bucketKey] : [];
        $inWindow = array_values(array_filter($existing, function ($ts) use ($now, $windowSeconds) {
            return is_int($ts) && ($now - $ts) < $windowSeconds;
        }));
        if (count($inWindow) >= $maxHits) {
            $allowed = false;
            $state[$bucketKey] = $inWindow;
            return $state;
        }
        $inWindow[] = $now;
        $state[$bucketKey] = $inWindow;
        $allowed = true;
        return $state;
    }, []);
    return $allowed;
}

function clearRateLimit(string $bucketKey): void {
    updateJsonFile('rate_limits.json', function ($state) use ($bucketKey) {
        if (is_array($state) && isset($state[$bucketKey])) {
            unset($state[$bucketKey]);
        }
        return is_array($state) ? $state : [];
    }, []);
}

function readCmsContent(): array {
    $content = readJsonFile('cms_data.json', []);
    if (empty($content) || !is_array($content)) {
        return [];
    }

    $defaultSeo = [
        'siteTitle' => 'Digital Marketing Agency in Lebanon | RAK 4 CREATIVE',
        'metaDescription' => 'Full-service digital marketing agency in Beirut, Lebanon serving MENA, GCC & global brands. Social media marketing, Meta & Google paid ads, SEO, branding & web.',
        'metaKeywords' => 'Digital Marketing Agency Lebanon, Digital Marketing Agency in Beirut, Social Media Marketing Lebanon, Paid Media Agency Lebanon, Meta Ads Agency Beirut, Google Ads PPC Lebanon, SEO Agency Lebanon, Creative Agency Beirut, Branding & Web Development Lebanon, RAK 4 Creative',
        'ogImage' => 'https://rak4creative.com/og-logo.png',
        'canonicalUrl' => 'https://rak4creative.com',
        'pageTitles' => [
            'home' => 'Digital Marketing Agency in Lebanon | RAK 4 CREATIVE',
            'about' => 'About RAK 4 CREATIVE | Creative & Digital Marketing Agency in Beirut',
            'services' => 'Social Media, Paid Ads & Digital Marketing Services Lebanon | RAK 4 CREATIVE',
            'work' => 'Digital Marketing, Branding & Paid Media Portfolio | RAK 4 CREATIVE Lebanon',
            'case-studies' => 'Digital Marketing & Paid Media Case Studies & ROI | RAK 4 CREATIVE',
            'careers' => 'Digital Marketing & Creative Agency Careers in Beirut | RAK 4 CREATIVE',
            'blog' => 'Digital Marketing, Paid Media & AI Strategy Insights | RAK 4 CREATIVE Blog',
            'blog-post' => 'Digital Marketing Insight | RAK 4 CREATIVE',
            'contact' => 'Contact Our Digital Marketing Agency in Beirut, Lebanon | RAK 4 CREATIVE',
            'admin' => 'CMS Operations Portal | RAK 4 CREATIVE'
        ],
        'pageDescriptions' => [
            'home' => 'Full-service digital marketing agency in Beirut, Lebanon serving MENA, GCC & global brands. Social media marketing, Meta & Google paid ads, SEO, branding & web.',
            'about' => 'Meet RAK 4 CREATIVE, your one-stop digital marketing and creative agency in Beirut, Lebanon and Toronto, uniting brand strategy, social media, paid ads & tech.',
            'services' => "Explore RAK 4 CREATIVE's 8 agency pillars in Lebanon: social media marketing, Meta & Google PPC paid ads, SEO, web development, branding, OOH & video production.",
            'work' => 'Browse selected creations by RAK 4 CREATIVE: paid media scaling, social media campaigns, brand identity, 3D web platforms & e-commerce across MENA & global markets.',
            'case-studies' => "See measurable ROI from RAK 4 CREATIVE's digital marketing, Meta & PPC ad scaling, brand overhauls, and high-conversion web platforms for ambitious enterprises.",
            'careers' => 'Join RAK 4 CREATIVE in Beirut, Lebanon or remote. Explore open roles in paid media buying, brand strategy, social media, UI/UX design & full-stack web engineering.',
            'blog' => "Insights from RAK 4 CREATIVE's strategy team in Lebanon on digital marketing, paid media ROI, AI workflows, high-conversion web architecture & omnichannel growth.",
            'blog-post' => 'Executive insights on digital marketing, social media, paid ads, brand strategy, and web performance by RAK 4 CREATIVE.',
            'contact' => 'Partner with RAK 4 CREATIVE in Beirut, Lebanon (Badaro) or Toronto. Request a proposal for social media marketing, Meta & Google paid ads, SEO, branding & web.',
            'admin' => 'Internal CMS Operations Portal for RAK 4 CREATIVE.'
        ]
    ];

    $legacyPageTitles = [
        'home' => 'RAK 4 CREATIVE | Global Digital & Brand Innovation Agency',
        'about' => 'About Us | RAK 4 CREATIVE Brand Architecture',
        'services' => 'Services & Capabilities | RAK 4 CREATIVE',
        'work' => 'Selected Portfolio Work | RAK 4 CREATIVE',
        'case-studies' => 'Enterprise Case Studies & ROI | RAK 4 CREATIVE',
        'careers' => 'Careers & Open Roles | RAK 4 CREATIVE',
        'blog' => 'Executive Editorial & Insights | RAK 4 CREATIVE',
        'blog-post' => 'Editorial Insight | RAK 4 CREATIVE',
        'contact' => 'Contact & Executive Inquiry | RAK 4 CREATIVE'
    ];

    $changed = false;
    if (!isset($content['seo']) || !is_array($content['seo'])) {
        $content['seo'] = $defaultSeo;
        $changed = true;
    } else {
        $seo = &$content['seo'];
        if (empty($seo['ogImage']) || strpos((string)$seo['ogImage'], 'photo-1618005182384-a83a8bd57fbe') !== false) {
            $seo['ogImage'] = $defaultSeo['ogImage'];
            $changed = true;
        }
        if (empty($seo['siteTitle']) || $seo['siteTitle'] === 'RAK 4 CREATIVE | Global Digital & Brand Innovation Agency') {
            $seo['siteTitle'] = $defaultSeo['siteTitle'];
            $changed = true;
        }
        if (empty($seo['metaDescription']) || strpos((string)$seo['metaDescription'], 'RAK 4 CREATIVE transforms ambitious enterprises into market leaders') === 0) {
            $seo['metaDescription'] = $defaultSeo['metaDescription'];
            $changed = true;
        }
        if (empty($seo['metaKeywords']) || $seo['metaKeywords'] === 'RAK 4 Creative, Brand Strategy, UI/UX Design, Web Development, CRO, Digital Transformation, Enterprise Agency') {
            $seo['metaKeywords'] = $defaultSeo['metaKeywords'];
            $changed = true;
        }
        if (!isset($seo['pageTitles']) || !is_array($seo['pageTitles'])) {
            $seo['pageTitles'] = $defaultSeo['pageTitles'];
            $changed = true;
        } else {
            foreach ($defaultSeo['pageTitles'] as $k => $defVal) {
                $cur = $seo['pageTitles'][$k] ?? '';
                if ($cur === '' || (isset($legacyPageTitles[$k]) && $cur === $legacyPageTitles[$k])) {
                    $seo['pageTitles'][$k] = $defVal;
                    $changed = true;
                }
            }
        }
        if (!isset($seo['pageDescriptions']) || !is_array($seo['pageDescriptions'])) {
            $seo['pageDescriptions'] = $defaultSeo['pageDescriptions'];
            $changed = true;
        } else {
            foreach ($defaultSeo['pageDescriptions'] as $k => $defVal) {
                if (empty($seo['pageDescriptions'][$k])) {
                    $seo['pageDescriptions'][$k] = $defVal;
                    $changed = true;
                }
            }
        }
    }

    if ($changed) {
        writeJsonFile('cms_data.json', $content);
    }

    return $content;
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

function hasValidAdminAuth(): bool {
    $token = getRequestToken();
    if ($token === '' || strpos($token, '.') === false) {
        return false;
    }
    [$payloadB64, $sig] = explode('.', $token, 2);
    $auth = getAuthConfig();
    $expectedSig = hash_hmac('sha256', $payloadB64, $auth['secret']);
    if (!hash_equals($expectedSig, $sig)) {
        return false;
    }
    $payload = json_decode(base64_decode($payloadB64), true);
    return is_array($payload) && !empty($payload['exp']) && $payload['exp'] >= time();
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

define('MAX_UPLOAD_BYTES', 12 * 1024 * 1024);
define('MAX_VIDEO_UPLOAD_BYTES', 64 * 1024 * 1024);
define('ALLOWED_MEDIA_EXTS', ['jpg', 'jpeg', 'png', 'webp', 'avif', 'svg', 'gif', 'ico', 'mp4', 'webm', 'mov', 'mp3', 'wav', 'ogg', 'pdf', 'doc', 'docx']);
define('ALLOWED_RESUME_EXTS', ['pdf', 'doc', 'docx']);
define('SECRET_MASK', '••••••••••••');

function maxBytesForExtension(string $ext): int {
    return in_array($ext, ['mp4', 'webm', 'mov'], true) ? MAX_VIDEO_UPLOAD_BYTES : MAX_UPLOAD_BYTES;
}

function maskEmailSettings(array $settings): array {
    $masked = $settings;
    if (!empty($masked['smtpPass'])) {
        $masked['smtpPass'] = SECRET_MASK;
    }
    if (!empty($masked['resendApiKey'])) {
        $masked['resendApiKey'] = SECRET_MASK;
    }
    return $masked;
}

function unmaskEmailSettings(array $incoming, array $existing): array {
    $resolved = $incoming;
    if (($resolved['smtpPass'] ?? '') === SECRET_MASK) {
        $resolved['smtpPass'] = $existing['smtpPass'] ?? '';
    }
    if (($resolved['resendApiKey'] ?? '') === SECRET_MASK) {
        $resolved['resendApiKey'] = $existing['resendApiKey'] ?? '';
    }
    return $resolved;
}

function ensureResumesHtaccess(string $folder): void {
    $htaccessPath = rtrim($folder, '/') . '/.htaccess';
    if (file_exists($htaccessPath)) {
        return;
    }
    $rules = "Options -Indexes -ExecCGI\n"
        . "<IfModule mod_headers.c>\n"
        . "  Header set X-Content-Type-Options \"nosniff\"\n"
        . "  Header set Content-Disposition \"attachment\"\n"
        . "  Header set Content-Security-Policy \"default-src 'none'; sandbox\"\n"
        . "</IfModule>\n";
    @file_put_contents($htaccessPath, $rules);
}

// Inspect file magic bytes and MIME type to block polyglot or script uploads.
function validateUploadedContent(string $filePath, string $ext, string $subDir): ?string {
    $allowedExts = ($subDir === 'resumes') ? ALLOWED_RESUME_EXTS : ALLOWED_MEDIA_EXTS;
    if (!in_array($ext, $allowedExts, true)) {
        return 'Unsupported file extension: .' . $ext;
    }
    $head = (string)@file_get_contents($filePath, false, null, 0, 4096);
    $mime = '';
    if (function_exists('finfo_open')) {
        $finfo = @finfo_open(FILEINFO_MIME_TYPE);
        if ($finfo) {
            $detected = @finfo_file($finfo, $filePath);
            if (is_string($detected)) {
                $mime = strtolower($detected);
            }
            @finfo_close($finfo);
        }
    }
    $blockedMimes = [
        'text/x-php',
        'application/x-httpd-php',
        'text/html',
        'application/xhtml+xml',
        'application/javascript',
        'text/javascript',
        'application/x-sh',
        'application/x-dosexec'
    ];
    if ($mime !== '' && in_array($mime, $blockedMimes, true)) {
        return 'File content rejected for security reasons.';
    }
    if (preg_match('/<\?(php|=)/i', $head)) {
        return 'Executable script content is not allowed.';
    }
    if ($subDir === 'resumes') {
        if (preg_match('/<(svg|html|script|iframe)/i', $head)) {
            return 'Invalid resume document format.';
        }
        if ($ext === 'pdf' && strpos($head, '%PDF-') === false) {
            return 'Uploaded PDF file does not have a valid PDF header.';
        }
        if ($ext === 'docx' && substr($head, 0, 2) !== 'PK') {
            return 'Uploaded DOCX file is not a valid Office document.';
        }
        if ($mime !== '') {
            $allowedResumeMimes = [
                'application/pdf',
                'application/msword',
                'application/vnd.ms-office',
                'application/cdfv2',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/zip',
                'application/octet-stream'
            ];
            if (!in_array($mime, $allowedResumeMimes, true)) {
                return 'Resume file content (' . $mime . ') does not match PDF or Word format.';
            }
        }
    }
    if ($ext === 'svg') {
        $fullSvg = (string)@file_get_contents($filePath);
        if (preg_match('/(<script\b|javascript:|vbscript:|\bon[a-z]+\s*=|<foreignobject\b|<iframe\b)/i', $fullSvg)) {
            return 'SVG files containing scripts or event handlers are not allowed.';
        }
    }
    return null;
}

function uploadErrorMessage(int $code): string {
    switch ($code) {
        case UPLOAD_ERR_INI_SIZE:
            return 'File exceeds the server upload_max_filesize (' . ini_get('upload_max_filesize') . '). Raise it in cPanel > MultiPHP INI Editor.';
        case UPLOAD_ERR_FORM_SIZE:
            return 'File exceeds the allowed form size.';
        case UPLOAD_ERR_PARTIAL:
            return 'File was only partially uploaded. Please try again.';
        case UPLOAD_ERR_NO_FILE:
            return 'No file was uploaded.';
        case UPLOAD_ERR_NO_TMP_DIR:
        case UPLOAD_ERR_CANT_WRITE:
            return 'Server could not store the uploaded file (temporary folder missing or not writable).';
        default:
            return 'File upload error code: ' . $code;
    }
}

function handleFileUpload(array $file, string $subDir = '', bool $allowLargeVideo = false): array {
    if (!isset($file['error']) || is_array($file['error'])) {
        return ['ok' => false, 'error' => 'Invalid upload parameters.'];
    }
    if ($file['error'] !== UPLOAD_ERR_OK) {
        return ['ok' => false, 'error' => uploadErrorMessage((int)$file['error'])];
    }
    $origName = basename((string)$file['name']);
    $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
    $allowedExts = ($subDir === 'resumes') ? ALLOWED_RESUME_EXTS : ALLOWED_MEDIA_EXTS;
    if (!in_array($ext, $allowedExts, true)) {
        return ['ok' => false, 'error' => 'Unsupported file extension: .' . $ext];
    }
    $maxBytes = $allowLargeVideo ? maxBytesForExtension($ext) : MAX_UPLOAD_BYTES;
    if ($file['size'] > $maxBytes) {
        return ['ok' => false, 'error' => 'File exceeds maximum allowed size of ' . round($maxBytes / 1048576) . 'MB.'];
    }
    $validationError = validateUploadedContent((string)$file['tmp_name'], $ext, $subDir);
    if ($validationError !== null) {
        return ['ok' => false, 'error' => $validationError];
    }
    $safeBase = preg_replace('/[^a-zA-Z0-9_-]/', '-', pathinfo($origName, PATHINFO_FILENAME));
    $safeBase = trim(substr($safeBase ?: 'asset', 0, 48), '-');
    $targetFolder = UPLOADS_DIR . ($subDir ? '/' . trim($subDir, '/') : '');
    if (!is_dir($targetFolder)) {
        @mkdir($targetFolder, 0775, true);
    }
    if ($subDir === 'resumes') {
        ensureResumesHtaccess($targetFolder);
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
    $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    $allowedExts = ($subDir === 'resumes') ? ALLOWED_RESUME_EXTS : ALLOWED_MEDIA_EXTS;
    if (!in_array($ext, $allowedExts, true)) {
        return ['ok' => false, 'error' => 'Unsupported file extension: .' . $ext];
    }
    $base64Max = $subDir === 'media' ? maxBytesForExtension($ext) : MAX_UPLOAD_BYTES;
    if (strlen($binary) > $base64Max) {
        return ['ok' => false, 'error' => 'File exceeds maximum allowed size of ' . round($base64Max / 1048576) . 'MB.'];
    }
    $safeBase = preg_replace('/[^a-zA-Z0-9_-]/', '-', pathinfo($fileName, PATHINFO_FILENAME));
    $safeBase = trim(substr($safeBase ?: 'asset', 0, 48), '-');
    $targetFolder = UPLOADS_DIR . ($subDir ? '/' . trim($subDir, '/') : '');
    if (!is_dir($targetFolder)) {
        @mkdir($targetFolder, 0775, true);
    }
    if ($subDir === 'resumes') {
        ensureResumesHtaccess($targetFolder);
    }
    $finalName = $safeBase . '-' . gmdate('YmdHis') . '-' . substr(bin2hex(random_bytes(4)), 0, 6) . '.' . $ext;
    $destPath = $targetFolder . '/' . $finalName;
    if (@file_put_contents($destPath, $binary) === false) {
        return ['ok' => false, 'error' => 'Unable to write uploaded file to disk.'];
    }
    $validationError = validateUploadedContent($destPath, $ext, $subDir);
    if ($validationError !== null) {
        @unlink($destPath);
        return ['ok' => false, 'error' => $validationError];
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

function appendDeliveryLogs(array $newEntries): array {
    if (empty($newEntries)) {
        $existing = readJsonFile('email_settings.json', []);
        return is_array($existing['deliveryLogs'] ?? null) ? $existing['deliveryLogs'] : [];
    }
    $res = updateJsonFile('email_settings.json', function ($settings) use ($newEntries) {
        if (!is_array($settings)) {
            $settings = [];
        }
        $logs = is_array($settings['deliveryLogs'] ?? null) ? $settings['deliveryLogs'] : [];
        foreach (array_reverse($newEntries) as $entry) {
            array_unshift($logs, $entry);
        }
        $settings['deliveryLogs'] = array_slice($logs, 0, 50);
        return $settings;
    }, []);
    return is_array($res['data']['deliveryLogs'] ?? null) ? $res['data']['deliveryLogs'] : [];
}

function dispatchLeadEmails(array $lead): array {
    $emailSettings = readJsonFile('email_settings.json', []);
    if (empty($emailSettings)) {
        return ['adminSent' => false, 'autoResponderSent' => false, 'note' => 'Email settings not initialized.'];
    }

    $mailer = new RakMailer($emailSettings);
    $newLogs = [];
    $adminSent = false;
    $autoResponderSent = false;

    $sourceLabel = strtoupper($lead['source'] ?? 'CONTACT');
    $prefix = trim($emailSettings['subjectPrefix'] ?? '[RAK4Creative Lead]');
    $subject = "{$prefix} New {$sourceLabel} Submission from " . ($lead['name'] ?? 'Website Visitor');

    if (!empty($emailSettings['enableAdminNotification'])) {
        $rawNotify = (string)($emailSettings['notifyEmails'] ?? 'Farah Younes <farah@rak4cloud.com>, ehab.m@rak4digital.com');
        $parsedRecipients = RakMailer::parseAddressList($rawNotify);
        $parsedCc = RakMailer::parseAddressList((string)($emailSettings['ccEmails'] ?? ''));
        $ccRawList = array_map(function ($item) {
            return $item['display'];
        }, $parsedCc);

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

        foreach ($parsedRecipients as $idx => $rcptItem) {
            $toDisplay = $rcptItem['display'];
            $res = $mailer->send($toDisplay, $subject, $htmlBody, '', $lead['email'] ?? '', $idx === 0 ? $ccRawList : []);
            if ($res['ok']) {
                $adminSent = true;
            }
            $newLogs[] = [
                'id' => 'log-' . uniqid(),
                'type' => 'admin_notification',
                'leadId' => $lead['id'] ?? null,
                'recipient' => $toDisplay,
                'subject' => $subject,
                'driver' => $res['driver'],
                'ok' => $res['ok'],
                'message' => $res['message'],
                'timestamp' => gmdate('c')
            ];
        }
    }

    if (!empty($emailSettings['enableAutoResponder']) && !empty($lead['email']) && filter_var($lead['email'], FILTER_VALIDATE_EMAIL)) {
        $rcptBucket = 'autoresp:' . strtolower(trim((string)$lead['email']));
        // Cap auto-responders to 1 per recipient address per hour to prevent third-party email bombing.
        if (consumeRateLimit($rcptBucket, 1, 3600)) {
            $autoSubj = trim((string)($emailSettings['autoResponderSubject'] ?? ''));
            if ($autoSubj === '') {
                $autoSubj = 'Thank you! We received your request | RAK 4 CREATIVE';
            }
            $autoTemplate = trim((string)($emailSettings['autoResponderBody'] ?? ''));
            if ($autoTemplate === '') {
                $autoTemplate = "Hello {{name}},\n\nThank you for contacting RAK 4 CREATIVE. We have received your request and our team will review your details and get back to you shortly.\n\nIf you would like to share any additional information in the meantime, simply reply directly to this email.\n\nBest regards,\nRAK 4 CREATIVE Team\nhttps://rak4creative.com";
            }
            $leadName = trim((string)($lead['name'] ?? '')) !== '' ? trim((string)$lead['name']) : 'there';
            $leadCompany = trim((string)($lead['company'] ?? '')) !== '' ? trim((string)$lead['company']) : 'your organization';
            $leadService = trim((string)($lead['service'] ?? '')) !== ''
                ? trim((string)$lead['service'])
                : (trim((string)($lead['roleTitle'] ?? '')) !== '' ? trim((string)$lead['roleTitle']) : 'your request');
            $leadRole = trim((string)($lead['roleTitle'] ?? '')) !== '' ? trim((string)$lead['roleTitle']) : $leadService;

            $replacements = [
                '{{name}}' => $leadName,
                '{{company}}' => $leadCompany,
                '{{service}}' => $leadService,
                '{{role}}' => $leadRole,
                '{{budget}}' => trim((string)($lead['budget'] ?? ''))
            ];
            $autoText = strtr($autoTemplate, $replacements);
            $autoSubj = strtr($autoSubj, $replacements);
            $autoHtml = "<!DOCTYPE html><html><body style=\"background:#07080B;color:#F8FAFC;font-family:Arial,sans-serif;padding:24px;margin:0;\">"
                . "<div style=\"max-width:600px;margin:0 auto;background:#0F172A;border:1px solid #EC008C;border-radius:16px;overflow:hidden;\">"
                . "<div style=\"background:#EC008C;color:#FFFFFF;padding:18px 24px;font-size:16px;font-weight:bold;letter-spacing:0.5px;\">RAK 4 CREATIVE • Request Received</div>"
                . "<div style=\"padding:28px 24px;line-height:1.7;color:#E2E8F0;font-size:15px;\">"
                . nl2br(htmlspecialchars($autoText, ENT_QUOTES, 'UTF-8'))
                . "</div>"
                . "<div style=\"padding:14px 24px;background:#07080B;border-top:1px solid #1E293B;font-size:12px;color:#94A3B8;\">"
                . "RAK 4 CREATIVE • Your One-Stop Agency • <a href=\"https://rak4creative.com\" style=\"color:#FF66C4;text-decoration:none;\">rak4creative.com</a>"
                . "</div>"
                . "</div></body></html>";

            $resAuto = $mailer->send($lead['email'], $autoSubj, $autoHtml, $autoText);
            $autoResponderSent = $resAuto['ok'];
            $newLogs[] = [
                'id' => 'log-' . uniqid(),
                'type' => 'auto_responder',
                'leadId' => $lead['id'] ?? null,
                'recipient' => $lead['email'],
                'subject' => $autoSubj,
                'driver' => $resAuto['driver'],
                'ok' => $resAuto['ok'],
                'message' => $resAuto['message'],
                'timestamp' => gmdate('c')
            ];
        }
    }

    appendDeliveryLogs($newLogs);

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

    $content = readCmsContent();
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
    if (!empty($pixels['snapPixelEnabled']) && !empty($pixels['snapPixelId'])) $activePixels[] = 'Snap (' . $pixels['snapPixelId'] . ')';
    if (!empty($pixels['twitterPixelEnabled']) && !empty($pixels['twitterPixelId'])) $activePixels[] = 'X (' . $pixels['twitterPixelId'] . ')';
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
    $fromParsed = RakMailer::parseAddress((string)($email['fromEmail'] ?? ''));
    $notifyParsed = RakMailer::parseAddressList((string)($email['notifyEmails'] ?? ''));
    $fromValid = $fromParsed !== null && count($notifyParsed) > 0;
    $resendKey = trim((string)($email['resendApiKey'] ?? ''));
    if ($resendKey === '' && strpos(trim((string)($email['smtpPass'] ?? '')), 're_') === 0) {
        $resendKey = trim((string)$email['smtpPass']);
    }
    if ($driver === 'resend') {
        $transportReady = $resendKey !== '';
    } elseif ($driver === 'smtp') {
        $transportReady = !empty($email['smtpHost']) && !empty($email['smtpPort']) && !empty($email['smtpUser']);
    } else {
        $transportReady = true;
    }
    $notifySummary = implode(', ', array_map(function ($item) { return $item['display']; }, $notifyParsed));
    $checks[] = [
        'id' => 'email-routing',
        'category' => 'Email & SMTP',
        'title' => 'Email Notification & Auto-Responder Configuration',
        'status' => ($fromValid && $transportReady) ? 'pass' : 'warn',
        'detail' => 'Driver: ' . strtoupper($driver) . ' • From: ' . ($email['fromEmail'] ?? 'not set') . ' • Recipients (' . count($notifyParsed) . '): ' . ($notifySummary !== '' ? $notifySummary : 'none'),
        'recommendation' => ($fromValid && $transportReady) ? 'Email routing configured. Send a test email in the Email Settings tab after deploying to cPanel.' : 'Complete sender email and transport credentials in Email Settings.'
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

    $seoRouterOk = file_exists(dirname(__DIR__) . '/seo.php');
    $sitemapOk = file_exists(dirname(__DIR__) . '/sitemap.php');
    $robotsOk = file_exists(dirname(__DIR__) . '/robots.txt');
    $checks[] = [
        'id' => 'seo-engine',
        'category' => 'SEO & Indexing',
        'title' => 'Server-Side SEO Pre-Renderer, Dynamic Sitemap & Robots.txt',
        'status' => ($seoRouterOk && $sitemapOk && $robotsOk) ? 'pass' : 'warn',
        'detail' => 'seo.php: ' . ($seoRouterOk ? 'active' : 'missing') . ' • sitemap.xml: ' . ($sitemapOk ? 'active' : 'missing') . ' • robots.txt: ' . ($robotsOk ? 'active' : 'missing'),
        'recommendation' => 'Submit https://rak4creative.com/sitemap.xml in Google Search Console.'
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
    $content = readCmsContent();
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
    $loginBucket = 'login:' . getClientIp();
    if (!consumeRateLimit($loginBucket, 8, 600)) {
        respond(['ok' => false, 'error' => 'Too many sign-in attempts. Please wait 10 minutes and try again.'], 429);
    }

    $body = getJsonBody();
    $username = trim((string)($body['username'] ?? ''));
    $password = (string)($body['password'] ?? '');
    $auth = getAuthConfig();

    $userMatch = (strcasecmp($username, $auth['username']) === 0) || (strcasecmp($username, $auth['email'] ?? '') === 0);
    if (!$userMatch || !password_verify($password, $auth['passwordHash'])) {
        respond(['ok' => false, 'error' => 'Invalid username or password.'], 401);
    }

    clearRateLimit($loginBucket);
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
    // Rotate signing secret so previously issued tokens are revoked immediately.
    $auth['secret'] = bin2hex(random_bytes(32));
    $auth['updatedAt'] = gmdate('c');
    writeJsonFile('auth.json', $auth);

    $session = issueToken($auth['username'], $auth['secret']);
    respond([
        'ok' => true,
        'message' => 'Admin credentials updated.',
        'token' => $session['token'],
        'expiresAt' => $session['expiresAt'],
        'user' => ['username' => $auth['username'], 'email' => $auth['email'] ?? '']
    ]);
}

// 4. CONTENT MANAGEMENT
if ($route === 'content') {
    if ($method === 'GET') {
        respond(['ok' => true, 'content' => readCmsContent()]);
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
        $isMultipart = stripos($contentType, 'multipart/form-data') !== false;
        $payload = $isMultipart ? $_POST : getJsonBody();

        // Silently discard automated bot submissions that fill the hidden honeypot field.
        if (!empty($payload['website_url_hp'])) {
            respond([
                'ok' => true,
                'lead' => ['id' => 'lead-filtered'],
                'emailDelivery' => ['adminSent' => false, 'autoResponderSent' => false]
            ], 200);
        }

        $isDiagnostic = !empty($payload['isDiagnostic']) && $payload['isDiagnostic'] !== 'false' && hasValidAdminAuth();
        if (!$isDiagnostic && !consumeRateLimit('leads:' . getClientIp(), 8, 900)) {
            respond([
                'ok' => false,
                'error' => 'Too many submissions from this connection. Please wait a few minutes or email us directly.'
            ], 429);
        }

        $resumeAttachment = null;
        if ($isMultipart) {
            if (!empty($_FILES['resume']) && $_FILES['resume']['error'] !== UPLOAD_ERR_NO_FILE) {
                $uploadRes = handleFileUpload($_FILES['resume'], 'resumes');
                if (!$uploadRes['ok']) {
                    respond($uploadRes, 400);
                }
                $resumeAttachment = $uploadRes;
            }
        } elseif (!empty($payload['resumeDataUrl']) && !empty($payload['resumeName'])) {
            $uploadRes = handleBase64Upload((string)$payload['resumeName'], (string)$payload['resumeDataUrl'], 'resumes');
            if (!$uploadRes['ok']) {
                respond($uploadRes, 400);
            }
            $resumeAttachment = $uploadRes;
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
            'emailDelivery' => ['adminSent' => false, 'autoResponderSent' => false, 'pending' => true],
            'createdAt' => gmdate('c'),
            'updatedAt' => gmdate('c')
        ];

        // Persist lead atomically before opening outbound mail sockets so slow SMTP never drops leads.
        updateJsonFile('leads.json', function ($existingLeads) use ($lead) {
            $list = is_array($existingLeads) ? $existingLeads : [];
            array_unshift($list, $lead);
            return $list;
        }, []);

        if ($isDiagnostic) {
            $emailStatus = [
                'adminSent' => false,
                'autoResponderSent' => false,
                'skipped' => true,
                'note' => 'Diagnostic self-test (outbound emails suppressed).'
            ];
        } else {
            $emailStatus = dispatchLeadEmails($lead);
        }
        $lead['emailDelivery'] = $emailStatus;

        $leadId = $lead['id'];
        updateJsonFile('leads.json', function ($existingLeads) use ($leadId, $emailStatus) {
            if (!is_array($existingLeads)) {
                return [];
            }
            foreach ($existingLeads as &$item) {
                if (($item['id'] ?? '') === $leadId) {
                    $item['emailDelivery'] = $emailStatus;
                    break;
                }
            }
            unset($item);
            return $existingLeads;
        }, []);

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
        $updatedLead = null;
        $res = updateJsonFile('leads.json', function ($existingLeads) use ($id, $body, &$updatedLead) {
            $list = is_array($existingLeads) ? $existingLeads : [];
            foreach ($list as &$item) {
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
            return $list;
        }, []);
        if (!$updatedLead) {
            respond(['ok' => false, 'error' => 'Lead not found.'], 404);
        }
        respond(['ok' => true, 'lead' => $updatedLead, 'leads' => $res['data']]);
    }

    if ($method === 'DELETE') {
        requireAdminAuth();
        $body = getJsonBody();
        $id = (string)($_GET['id'] ?? $body['id'] ?? '');
        if ($id === '') {
            respond(['ok' => false, 'error' => 'Lead ID is required for deletion.'], 400);
        }
        $res = updateJsonFile('leads.json', function ($existingLeads) use ($id) {
            $list = is_array($existingLeads) ? $existingLeads : [];
            return array_values(array_filter($list, function ($item) use ($id) {
                return ($item['id'] ?? '') !== $id;
            }));
        }, []);
        respond(['ok' => true, 'leads' => $res['data']]);
    }
}

// 7. EMAIL & SMTP SETTINGS
if ($route === 'email-settings') {
    requireAdminAuth();
    if ($method === 'GET') {
        $settings = readJsonFile('email_settings.json', []);
        respond(['ok' => true, 'emailSettings' => maskEmailSettings(is_array($settings) ? $settings : [])]);
    }
    if ($method === 'PUT' || $method === 'POST') {
        $body = getJsonBody();
        $incoming = isset($body['emailSettings']) && is_array($body['emailSettings']) ? $body['emailSettings'] : $body;
        $res = updateJsonFile('email_settings.json', function ($existing) use ($incoming) {
            $base = is_array($existing) ? $existing : [];
            $unmasked = unmaskEmailSettings($incoming, $base);
            $merged = array_merge($base, $unmasked);
            if (!isset($incoming['deliveryLogs']) && isset($base['deliveryLogs'])) {
                $merged['deliveryLogs'] = $base['deliveryLogs'];
            }
            return $merged;
        }, []);
        if (!$res['ok']) {
            respond(['ok' => false, 'error' => 'Failed to save email settings.'], 500);
        }
        respond([
            'ok' => true,
            'updatedAt' => gmdate('c'),
            'emailSettings' => maskEmailSettings($res['data'])
        ]);
    }
}

// 8. SEND TEST EMAIL
if ($route === 'test-email' && $method === 'POST') {
    requireAdminAuth();
    $body = getJsonBody();
    $storedSettings = readJsonFile('email_settings.json', []);
    $storedBase = is_array($storedSettings) ? $storedSettings : [];
    $rawIncoming = isset($body['emailSettings']) && is_array($body['emailSettings'])
        ? $body['emailSettings']
        : $storedBase;
    $settings = unmaskEmailSettings($rawIncoming, $storedBase);
    $rawRecipients = trim((string)($body['recipient'] ?? $body['to'] ?? $settings['notifyEmails'] ?? $settings['fromEmail'] ?? ''));
    $parsedTargets = RakMailer::parseAddressList($rawRecipients);
    if (empty($parsedTargets)) {
        respond(['ok' => false, 'error' => 'Provide at least one valid recipient email address for the test.'], 400);
    }

    $mailer = new RakMailer($settings);
    $subject = '[RAK 4 CREATIVE CMS] Lead Pipeline Verification (' . strtoupper($settings['driver'] ?? 'mail') . ')';
    $html = "<!DOCTYPE html><html><body style=\"background:#07080B;color:#F8FAFC;font-family:Arial,sans-serif;padding:24px;\">"
        . "<div style=\"max-width:560px;margin:0 auto;background:#0F172A;border:1px solid #EC008C;border-radius:16px;padding:28px;\">"
        . "<h2 style=\"color:#EC008C;margin-top:0;\">RAK 4 CREATIVE • Lead Notification Pipeline Verified</h2>"
        . "<p style=\"color:#E2E8F0;line-height:1.6;\">This diagnostic message confirms that lead notifications from <strong>rak4creative.com</strong> are delivering cleanly to your inbox.</p>"
        . "<ul style=\"color:#94A3B8;font-size:13px;line-height:1.8;\">"
        . "<li><strong>Driver:</strong> " . htmlspecialchars(strtoupper($settings['driver'] ?? 'mail')) . "</li>"
        . "<li><strong>From:</strong> " . htmlspecialchars(($settings['fromName'] ?? '') . ' <' . ($settings['fromEmail'] ?? '') . '>') . "</li>"
        . "<li><strong>Active Lead Recipients:</strong> " . htmlspecialchars((string)($settings['notifyEmails'] ?? '')) . "</li>"
        . "<li><strong>Server Time (UTC):</strong> " . gmdate('Y-m-d H:i:s') . "</li>"
        . "</ul></div></body></html>";

    $newLogs = [];
    $results = [];
    $allOk = true;

    foreach ($parsedTargets as $target) {
        $res = $mailer->send($target['display'], $subject, $html);
        $results[] = $res;
        if (!$res['ok']) {
            $allOk = false;
        }
        $newLogs[] = [
            'id' => 'log-' . uniqid(),
            'type' => 'diagnostic_test',
            'recipient' => $target['display'],
            'subject' => $subject,
            'driver' => $res['driver'],
            'ok' => $res['ok'],
            'message' => $res['message'],
            'timestamp' => gmdate('c')
        ];
    }

    $updatedLogs = appendDeliveryLogs($newLogs);

    $summaryMsg = count($results) > 1
        ? ('Dispatched diagnostic test to ' . count($results) . ' recipients: ' . implode(', ', array_map(function ($r) { return $r['recipient']; }, $results)))
        : ($results[0]['message'] ?? 'Test email completed.');

    respond([
        'ok' => $allOk,
        'result' => [
            'ok' => $allOk,
            'message' => $summaryMsg,
            'results' => $results
        ],
        'deliveryLogs' => $updatedLogs
    ]);
}

// 9. MEDIA UPLOAD (ADMIN)
if ($route === 'upload' && $method === 'POST') {
    requireAdminAuth();
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    if (stripos($contentType, 'multipart/form-data') !== false && !empty($_FILES['file'])) {
        $res = handleFileUpload($_FILES['file'], 'media', true);
        respond($res, $res['ok'] ? 201 : 400);
    }
    $body = getJsonBody();
    if (!empty($body['fileName']) && !empty($body['dataUrl'])) {
        $res = handleBase64Upload((string)$body['fileName'], (string)$body['dataUrl'], 'media');
        respond($res, $res['ok'] ? 201 : 400);
    }
    $contentLength = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($contentLength > 0 && stripos($contentType, 'multipart/form-data') !== false && empty($_FILES)) {
        respond([
            'ok' => false,
            'error' => 'File is larger than the server post_max_size (' . ini_get('post_max_size') . '). Raise post_max_size and upload_max_filesize in cPanel > MultiPHP INI Editor.'
        ], 413);
    }
    respond(['ok' => false, 'error' => 'No file provided in upload request.'], 400);
}

// 9b. MEDIA LIBRARY (ADMIN): uploaded media plus built-in site videos & logos
if ($route === 'media') {
    requireAdminAuth();
    if ($method === 'GET') {
        $publicRoot = dirname(__DIR__);
        $sources = [
            ['dir' => UPLOADS_DIR . '/media', 'url' => '/uploads/media', 'source' => 'upload', 'deletable' => true],
            ['dir' => $publicRoot . '/videos', 'url' => '/videos', 'source' => 'site', 'deletable' => false],
            ['dir' => $publicRoot . '/client-logos', 'url' => '/client-logos', 'source' => 'site', 'deletable' => false]
        ];
        $imageExts = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'svg', 'gif', 'ico'];
        $videoExts = ['mp4', 'webm', 'mov'];
        $items = [];
        foreach ($sources as $src) {
            if (!is_dir($src['dir'])) {
                continue;
            }
            foreach (scandir($src['dir']) ?: [] as $name) {
                if ($name === '' || $name[0] === '.') {
                    continue;
                }
                $path = $src['dir'] . '/' . $name;
                if (!is_file($path)) {
                    continue;
                }
                $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
                $type = in_array($ext, $imageExts, true) ? 'image' : (in_array($ext, $videoExts, true) ? 'video' : 'file');
                $items[] = [
                    'name' => $name,
                    'url' => $src['url'] . '/' . rawurlencode($name),
                    'type' => $type,
                    'size' => (int)@filesize($path),
                    'modified' => gmdate('c', (int)@filemtime($path)),
                    'source' => $src['source'],
                    'deletable' => $src['deletable']
                ];
            }
        }
        usort($items, function ($a, $b) {
            return strcmp($b['modified'], $a['modified']);
        });
        respond([
            'ok' => true,
            'items' => $items,
            'limits' => [
                'imageMB' => MAX_UPLOAD_BYTES / 1048576,
                'videoMB' => MAX_VIDEO_UPLOAD_BYTES / 1048576,
                'serverUploadMax' => ini_get('upload_max_filesize'),
                'serverPostMax' => ini_get('post_max_size')
            ]
        ]);
    }

    if ($method === 'DELETE') {
        $body = getJsonBody();
        $targetUrl = trim((string)($_GET['url'] ?? ($body['url'] ?? '')));
        if ($targetUrl === '') {
            respond(['ok' => false, 'error' => 'Media URL is required for deletion.'], 400);
        }
        $parsedPath = rawurldecode((string)(parse_url($targetUrl, PHP_URL_PATH) ?: ''));
        if (strpos($parsedPath, '/uploads/media/') !== 0) {
            respond(['ok' => false, 'error' => 'Only files uploaded to /uploads/media/ can be deleted.'], 403);
        }
        $fileName = basename($parsedPath);
        if ($fileName === '' || $fileName[0] === '.' || $parsedPath !== '/uploads/media/' . $fileName) {
            respond(['ok' => false, 'error' => 'Invalid media filename.'], 400);
        }
        $mediaRoot = realpath(UPLOADS_DIR . '/media');
        $targetFile = $mediaRoot ? realpath($mediaRoot . '/' . $fileName) : false;
        if (!$mediaRoot || !$targetFile || strpos($targetFile, $mediaRoot . DIRECTORY_SEPARATOR) !== 0 || !is_file($targetFile)) {
            respond(['ok' => false, 'error' => 'Uploaded media file not found.'], 404);
        }
        if (!@unlink($targetFile)) {
            respond(['ok' => false, 'error' => 'Could not delete media file from disk.'], 500);
        }
        respond(['ok' => true, 'deleted' => $targetUrl]);
    }
}

// 10. SYSTEM AUDIT (ADMIN)
if ($route === 'audit' && $method === 'GET') {
    requireAdminAuth();
    respond(buildAuditReport());
}

respond(['ok' => false, 'error' => 'Unknown API route: ' . $route], 404);
