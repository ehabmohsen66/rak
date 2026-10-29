<?php
// Native PHP mail and SMTP client for cPanel shared or dedicated servers.

class RakMailer {
    private $settings;

    public function __construct(array $settings) {
        $this->settings = $settings;
    }

    public static function parseAddress(string $raw): ?array {
        $trimmed = trim($raw);
        if ($trimmed === '') {
            return null;
        }
        if (preg_match('/^(.*?)<\s*([^<>@\s]+@[^<>@\s]+)\s*>$/', $trimmed, $m)) {
            $name = trim($m[1], " \t\n\r\0\x0B\"'");
            $email = trim($m[2]);
            if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $formatted = $name !== ''
                    ? ('=?UTF-8?B?' . base64_encode($name) . '?= <' . $email . '>')
                    : $email;
                return [
                    'name' => $name,
                    'email' => $email,
                    'display' => $name !== '' ? "{$name} <{$email}>" : $email,
                    'formatted' => $formatted
                ];
            }
            return null;
        }
        if (filter_var($trimmed, FILTER_VALIDATE_EMAIL)) {
            return [
                'name' => '',
                'email' => $trimmed,
                'display' => $trimmed,
                'formatted' => $trimmed
            ];
        }
        return null;
    }

    public static function parseAddressList($raw): array {
        if (is_array($raw)) {
            $parts = $raw;
        } else {
            $parts = preg_split('/[,;]+/', (string)$raw) ?: [];
        }
        $parsed = [];
        $seen = [];
        foreach ($parts as $part) {
            $item = self::parseAddress((string)$part);
            if ($item && !isset($seen[strtolower($item['email'])])) {
                $seen[strtolower($item['email'])] = true;
                $parsed[] = $item;
            }
        }
        return $parsed;
    }

    public function send(string $to, string $subject, string $htmlBody, string $textBody = '', string $replyTo = '', array $ccList = []): array {
        $driver = $this->settings['driver'] ?? 'mail';
        $fromParsed = self::parseAddress((string)($this->settings['fromEmail'] ?? 'noreply@rak4creative.com'));
        $fromEmail = $fromParsed ? $fromParsed['email'] : 'noreply@rak4creative.com';
        $fromName = trim((string)($this->settings['fromName'] ?? 'RAK 4 CREATIVE'));

        $rawReply = trim($replyTo !== '' ? $replyTo : (string)($this->settings['replyToEmail'] ?? $fromEmail));
        $replyParsed = self::parseAddress($rawReply);
        $effectiveReplyTo = $replyParsed ? $replyParsed['email'] : $fromEmail;

        $toParsed = self::parseAddress($to);
        if (!$toParsed) {
            return [
                'ok' => false,
                'driver' => $driver,
                'recipient' => $to,
                'timestamp' => gmdate('c'),
                'message' => 'Invalid recipient email address: ' . $to
            ];
        }

        $parsedCc = self::parseAddressList($ccList);

        if ($textBody === '') {
            $textBody = trim(strip_tags(str_replace(['<br>', '<br/>', '<br />', '</p>', '</div>', '</tr>'], "\n", $htmlBody)));
        }

        if ($driver === 'resend') {
            return $this->sendViaResendApi($toParsed, $subject, $htmlBody, $textBody, $fromEmail, $fromName, $effectiveReplyTo, $parsedCc);
        }

        if ($driver === 'smtp') {
            return $this->sendViaSmtp($toParsed, $subject, $htmlBody, $textBody, $fromEmail, $fromName, $effectiveReplyTo, $parsedCc);
        }

        return $this->sendViaPhpMail($toParsed, $subject, $htmlBody, $textBody, $fromEmail, $fromName, $effectiveReplyTo, $parsedCc);
    }

    private function sendViaResendApi(array $toParsed, string $subject, string $htmlBody, string $textBody, string $fromEmail, string $fromName, string $replyTo, array $parsedCc): array {
        $apiKey = trim((string)($this->settings['resendApiKey'] ?? ''));
        if ($apiKey === '') {
            $smtpCandidate = trim((string)($this->settings['smtpPass'] ?? ''));
            if (strpos($smtpCandidate, 're_') === 0) {
                $apiKey = $smtpCandidate;
            }
        }

        if ($apiKey === '') {
            return [
                'ok' => false,
                'driver' => 'resend',
                'recipient' => $toParsed['display'],
                'timestamp' => gmdate('c'),
                'message' => 'Resend API key (re_...) is required when Resend API driver is active.'
            ];
        }

        $fromHeader = $fromName !== '' ? "{$fromName} <{$fromEmail}>" : $fromEmail;
        $payload = [
            'from' => $fromHeader,
            'to' => [$toParsed['display']],
            'subject' => $subject,
            'html' => $htmlBody,
            'text' => $textBody
        ];
        if ($replyTo !== '') {
            $payload['reply_to'] = $replyTo;
        }
        if (!empty($parsedCc)) {
            $payload['cc'] = array_values(array_map(function ($item) {
                return $item['display'];
            }, $parsedCc));
        }

        $jsonPayload = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $endpoint = 'https://api.resend.com/emails';
        $httpCode = 0;
        $rawResponse = '';
        $transportErr = '';

        if (function_exists('curl_init')) {
            $ch = curl_init($endpoint);
            curl_setopt_array($ch, [
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => $jsonPayload,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT => 20,
                CURLOPT_CONNECTTIMEOUT => 10,
                CURLOPT_HTTPHEADER => [
                    'Authorization: Bearer ' . $apiKey,
                    'Content-Type: application/json',
                    'Accept: application/json',
                    'User-Agent: RAK4Creative-CMS-PHP/' . PHP_VERSION
                ]
            ]);
            $resBody = curl_exec($ch);
            if ($resBody === false) {
                $transportErr = curl_error($ch);
            } else {
                $rawResponse = (string)$resBody;
            }
            $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
        } else {
            $ctx = stream_context_create([
                'http' => [
                    'method' => 'POST',
                    'header' => "Authorization: Bearer {$apiKey}\r\nContent-Type: application/json\r\nAccept: application/json\r\nUser-Agent: RAK4Creative-CMS-PHP/" . PHP_VERSION . "\r\n",
                    'content' => $jsonPayload,
                    'timeout' => 20,
                    'ignore_errors' => true
                ]
            ]);
            $resBody = @file_get_contents($endpoint, false, $ctx);
            if ($resBody === false) {
                $transportErr = 'HTTPS stream connection to api.resend.com failed.';
            } else {
                $rawResponse = (string)$resBody;
            }
            if (isset($http_response_header) && is_array($http_response_header)) {
                foreach ($http_response_header as $hdr) {
                    if (preg_match('/^HTTP\/\S+\s+(\d{3})/', $hdr, $m)) {
                        $httpCode = (int)$m[1];
                    }
                }
            }
        }

        if ($transportErr !== '') {
            return [
                'ok' => false,
                'driver' => 'resend',
                'recipient' => $toParsed['display'],
                'timestamp' => gmdate('c'),
                'message' => 'Resend HTTPS connection failed: ' . $transportErr
            ];
        }

        $decoded = json_decode($rawResponse, true);
        if ($httpCode >= 200 && $httpCode < 300 && is_array($decoded) && !empty($decoded['id'])) {
            return [
                'ok' => true,
                'driver' => 'resend',
                'emailId' => (string)$decoded['id'],
                'recipient' => $toParsed['display'],
                'timestamp' => gmdate('c'),
                'message' => 'Delivered via Resend HTTPS API (ID: ' . $decoded['id'] . ').'
            ];
        }

        $errMsg = is_array($decoded) && !empty($decoded['message'])
            ? (string)$decoded['message']
            : trim(substr($rawResponse, 0, 260));

        return [
            'ok' => false,
            'driver' => 'resend',
            'recipient' => $toParsed['display'],
            'timestamp' => gmdate('c'),
            'message' => "Resend API rejected message ({$httpCode}): {$errMsg}"
        ];
    }

    private function sendViaPhpMail(array $toParsed, string $subject, string $htmlBody, string $textBody, string $fromEmail, string $fromName, string $replyTo, array $parsedCc): array {
        $boundary = '==RAK_MIME_' . md5((string)microtime(true));
        $encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
        $domainParts = explode('@', $fromEmail);
        $msgDomain = $domainParts[1] ?? ($_SERVER['SERVER_NAME'] ?? 'rak4creative.com');

        $headers = [];
        $headers[] = "Date: " . date('r');
        $headers[] = "Message-ID: <" . md5(uniqid((string)mt_rand(), true)) . "@{$msgDomain}>";
        $headers[] = "MIME-Version: 1.0";
        $headers[] = "From: {$encodedFromName} <{$fromEmail}>";
        if ($replyTo !== '') {
            $headers[] = "Reply-To: {$replyTo}";
        }
        if (!empty($parsedCc)) {
            $ccHeaders = array_map(function ($item) {
                return $item['formatted'];
            }, $parsedCc);
            $headers[] = "Cc: " . implode(', ', $ccHeaders);
        }
        $headers[] = "Content-Type: multipart/alternative; boundary=\"{$boundary}\"";
        $headers[] = "X-Mailer: RAK4Creative-CMS-PHP/" . PHP_VERSION;

        $body = "--{$boundary}\r\n";
        $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= chunk_split(base64_encode($textBody)) . "\r\n";

        $body .= "--{$boundary}\r\n";
        $body .= "Content-Type: text/html; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= chunk_split(base64_encode($htmlBody)) . "\r\n";
        $body .= "--{$boundary}--\r\n";

        $headerString = implode("\r\n", $headers);
        $params = filter_var($fromEmail, FILTER_VALIDATE_EMAIL) ? "-f{$fromEmail}" : "";

        $toHeader = $toParsed['formatted'];
        $ok = @mail($toHeader, $encodedSubject, $body, $headerString, $params);
        if (!$ok) {
            $ok = @mail($toParsed['email'], $encodedSubject, $body, $headerString);
        }

        return [
            'ok' => (bool)$ok,
            'driver' => 'mail',
            'recipient' => $toParsed['display'],
            'timestamp' => gmdate('c'),
            'message' => $ok
                ? 'Accepted by cPanel local Exim MTA via PHP mail().'
                : 'PHP mail() returned false. Verify cPanel Email Routing or switch driver to SMTP.'
        ];
    }

    private function sendViaSmtp(array $toParsed, string $subject, string $htmlBody, string $textBody, string $fromEmail, string $fromName, string $replyTo, array $parsedCc): array {
        $host = trim((string)($this->settings['smtpHost'] ?? ''));
        $port = (int)($this->settings['smtpPort'] ?? 465);
        $encryption = strtolower(trim((string)($this->settings['smtpEncryption'] ?? 'ssl')));
        $username = trim((string)($this->settings['smtpUser'] ?? ''));
        $password = (string)($this->settings['smtpPass'] ?? '');
        $timeout = 15;

        if ($host === '' || $port <= 0) {
            return [
                'ok' => false,
                'driver' => 'smtp',
                'recipient' => $toParsed['display'],
                'timestamp' => gmdate('c'),
                'message' => 'SMTP host and port are required when SMTP driver is active.'
            ];
        }

        $remoteHost = ($encryption === 'ssl') ? "ssl://{$host}" : $host;
        $errno = 0;
        $errstr = '';

        $context = stream_context_create([
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            ]
        ]);

        $socket = @stream_socket_client(
            "{$remoteHost}:{$port}",
            $errno,
            $errstr,
            $timeout,
            STREAM_CLIENT_CONNECT,
            $context
        );

        if (!$socket) {
            if (stripos($host, 'resend.com') !== false && (strpos($password, 're_') === 0 || trim((string)($this->settings['resendApiKey'] ?? '')) !== '')) {
                return $this->sendViaResendApi($toParsed, $subject, $htmlBody, $textBody, $fromEmail, $fromName, $replyTo, $parsedCc);
            }
            return [
                'ok' => false,
                'driver' => 'smtp',
                'recipient' => $toParsed['display'],
                'timestamp' => gmdate('c'),
                'message' => "SMTP connection failed ({$errno}): {$errstr}"
            ];
        }

        stream_set_timeout($socket, $timeout);
        $greeting = $this->readSmtpResponse($socket);
        if (strpos($greeting, '220') !== 0) {
            fclose($socket);
            return $this->smtpError($toParsed['display'], "Unexpected SMTP greeting: {$greeting}");
        }

        $domainParts = explode('@', $fromEmail);
        $serverName = $_SERVER['SERVER_NAME'] ?? ($domainParts[1] ?? 'rak4creative.com');
        $ehlo = $this->sendSmtpCommand($socket, "EHLO {$serverName}", ['250']);
        if (!$ehlo['ok']) {
            fclose($socket);
            return $this->smtpError($toParsed['display'], 'EHLO failed: ' . $ehlo['response']);
        }

        if ($encryption === 'tls') {
            $startTls = $this->sendSmtpCommand($socket, "STARTTLS", ['220']);
            if (!$startTls['ok']) {
                fclose($socket);
                return $this->smtpError($toParsed['display'], 'STARTTLS failed: ' . $startTls['response']);
            }
            $cryptoMethod = STREAM_CRYPTO_METHOD_TLS_CLIENT;
            if (defined('STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT')) {
                $cryptoMethod |= STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT;
            }
            if (defined('STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT')) {
                $cryptoMethod |= STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT;
            }
            $cryptoOk = @stream_socket_enable_crypto($socket, true, $cryptoMethod);
            if (!$cryptoOk) {
                fclose($socket);
                return $this->smtpError($toParsed['display'], 'Failed to negotiate TLS 1.2/1.3 encryption.');
            }
            $ehloTls = $this->sendSmtpCommand($socket, "EHLO {$serverName}", ['250']);
            if (!$ehloTls['ok']) {
                fclose($socket);
                return $this->smtpError($toParsed['display'], 'Post-TLS EHLO failed: ' . $ehloTls['response']);
            }
        }

        if ($username !== '') {
            $auth = $this->sendSmtpCommand($socket, "AUTH LOGIN", ['334']);
            if (!$auth['ok']) {
                fclose($socket);
                return $this->smtpError($toParsed['display'], 'SMTP AUTH LOGIN rejected: ' . $auth['response']);
            }
            $userStep = $this->sendSmtpCommand($socket, base64_encode($username), ['334']);
            if (!$userStep['ok']) {
                fclose($socket);
                return $this->smtpError($toParsed['display'], 'SMTP username rejected: ' . $userStep['response']);
            }
            $passStep = $this->sendSmtpCommand($socket, base64_encode($password), ['235']);
            if (!$passStep['ok']) {
                fclose($socket);
                return $this->smtpError($toParsed['display'], 'SMTP password authentication failed: ' . $passStep['response']);
            }
        }

        $mailFrom = $this->sendSmtpCommand($socket, "MAIL FROM:<{$fromEmail}>", ['250']);
        if (!$mailFrom['ok']) {
            fclose($socket);
            return $this->smtpError($toParsed['display'], 'MAIL FROM rejected: ' . $mailFrom['response']);
        }

        $rcptEmails = [$toParsed['email']];
        foreach ($parsedCc as $ccItem) {
            if (!in_array($ccItem['email'], $rcptEmails, true)) {
                $rcptEmails[] = $ccItem['email'];
            }
        }

        foreach ($rcptEmails as $rcptAddr) {
            $rcptCmd = $this->sendSmtpCommand($socket, "RCPT TO:<{$rcptAddr}>", ['250', '251']);
            if (!$rcptCmd['ok']) {
                fclose($socket);
                return $this->smtpError($toParsed['display'], "RCPT TO <{$rcptAddr}> rejected: " . $rcptCmd['response']);
            }
        }

        $dataCmd = $this->sendSmtpCommand($socket, "DATA", ['354']);
        if (!$dataCmd['ok']) {
            fclose($socket);
            return $this->smtpError($toParsed['display'], 'SMTP DATA command rejected: ' . $dataCmd['response']);
        }

        $boundary = '==RAK_SMTP_' . md5((string)microtime(true));
        $encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

        $msgHeaders = [];
        $msgHeaders[] = "Date: " . date('r');
        $msgHeaders[] = "To: {$toParsed['formatted']}";
        $msgHeaders[] = "From: {$encodedFromName} <{$fromEmail}>";
        if ($replyTo !== '') {
            $msgHeaders[] = "Reply-To: <{$replyTo}>";
        }
        if (!empty($parsedCc)) {
            $ccHeaders = array_map(function ($item) {
                return $item['formatted'];
            }, $parsedCc);
            $msgHeaders[] = "Cc: " . implode(', ', $ccHeaders);
        }
        $msgHeaders[] = "Subject: {$encodedSubject}";
        $msgHeaders[] = "Message-ID: <" . md5(uniqid((string)mt_rand(), true)) . "@{$serverName}>";
        $msgHeaders[] = "MIME-Version: 1.0";
        $msgHeaders[] = "Content-Type: multipart/alternative; boundary=\"{$boundary}\"";

        $rawMessage = implode("\r\n", $msgHeaders) . "\r\n\r\n";
        $rawMessage .= "--{$boundary}\r\n";
        $rawMessage .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $rawMessage .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $rawMessage .= chunk_split(base64_encode($textBody)) . "\r\n";
        $rawMessage .= "--{$boundary}\r\n";
        $rawMessage .= "Content-Type: text/html; charset=UTF-8\r\n";
        $rawMessage .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $rawMessage .= chunk_split(base64_encode($htmlBody)) . "\r\n";
        $rawMessage .= "--{$boundary}--\r\n.";

        $sendData = $this->sendSmtpCommand($socket, $rawMessage, ['250']);
        $this->sendSmtpCommand($socket, "QUIT", ['221', '250']);
        fclose($socket);

        if (!$sendData['ok']) {
            return $this->smtpError($toParsed['display'], 'SMTP message transmission failed: ' . $sendData['response']);
        }

        return [
            'ok' => true,
            'driver' => 'smtp',
            'recipient' => $toParsed['display'],
            'timestamp' => gmdate('c'),
            'message' => 'Delivered via SMTP (' . $host . ':' . $port . ').'
        ];
    }

    private function sendSmtpCommand($socket, string $command, array $expectedCodes): array {
        fwrite($socket, $command . "\r\n");
        $response = $this->readSmtpResponse($socket);
        $code = substr(trim($response), 0, 3);
        return [
            'ok' => in_array($code, $expectedCodes, true),
            'code' => $code,
            'response' => trim($response)
        ];
    }

    private function readSmtpResponse($socket): string {
        $data = '';
        while ($line = fgets($socket, 515)) {
            $data .= $line;
            if (isset($line[3]) && $line[3] === ' ') {
                break;
            }
        }
        return $data;
    }

    private function smtpError(string $recipient, string $errorMsg): array {
        return [
            'ok' => false,
            'driver' => 'smtp',
            'recipient' => $recipient,
            'timestamp' => gmdate('c'),
            'message' => $errorMsg
        ];
    }
}
