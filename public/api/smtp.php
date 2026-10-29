<?php
// Native PHP mail and SMTP client for cPanel shared or dedicated servers.

class RakMailer {
    private $settings;

    public function __construct(array $settings) {
        $this->settings = $settings;
    }

    public function send(string $to, string $subject, string $htmlBody, string $textBody = '', string $replyTo = '', array $ccList = []): array {
        $driver = $this->settings['driver'] ?? 'mail';
        $fromEmail = trim($this->settings['fromEmail'] ?? 'noreply@rak4creative.com');
        $fromName = trim($this->settings['fromName'] ?? 'RAK 4 CREATIVE');
        $effectiveReplyTo = trim($replyTo !== '' ? $replyTo : ($this->settings['replyToEmail'] ?? $fromEmail));

        if ($textBody === '') {
            $textBody = trim(strip_tags(str_replace(['<br>', '<br/>', '<br />', '</p>', '</div>', '</tr>'], "\n", $htmlBody)));
        }

        if ($driver === 'smtp') {
            return $this->sendViaSmtp($to, $subject, $htmlBody, $textBody, $fromEmail, $fromName, $effectiveReplyTo, $ccList);
        }

        return $this->sendViaPhpMail($to, $subject, $htmlBody, $textBody, $fromEmail, $fromName, $effectiveReplyTo, $ccList);
    }

    private function sendViaPhpMail(string $to, string $subject, string $htmlBody, string $textBody, string $fromEmail, string $fromName, string $replyTo, array $ccList): array {
        $boundary = '==RAK_MIME_' . md5((string)microtime(true));
        $encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

        $headers = [];
        $headers[] = "MIME-Version: 1.0";
        $headers[] = "From: {$encodedFromName} <{$fromEmail}>";
        if ($replyTo !== '') {
            $headers[] = "Reply-To: {$replyTo}";
        }
        if (!empty($ccList)) {
            $validCc = array_filter(array_map('trim', $ccList), function ($email) {
                return filter_var($email, FILTER_VALIDATE_EMAIL);
            });
            if (!empty($validCc)) {
                $headers[] = "Cc: " . implode(', ', $validCc);
            }
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

        $ok = @mail($to, $encodedSubject, $body, $headerString, $params);
        if (!$ok) {
            $ok = @mail($to, $encodedSubject, $body, $headerString);
        }

        return [
            'ok' => (bool)$ok,
            'driver' => 'mail',
            'recipient' => $to,
            'timestamp' => gmdate('c'),
            'message' => $ok
                ? 'Accepted by cPanel local MTA via PHP mail().'
                : 'PHP mail() returned false. Verify cPanel Email Routing or switch driver to SMTP.'
        ];
    }

    private function sendViaSmtp(string $to, string $subject, string $htmlBody, string $textBody, string $fromEmail, string $fromName, string $replyTo, array $ccList): array {
        $host = trim($this->settings['smtpHost'] ?? '');
        $port = (int)($this->settings['smtpPort'] ?? 465);
        $encryption = strtolower(trim($this->settings['smtpEncryption'] ?? 'ssl'));
        $username = trim($this->settings['smtpUser'] ?? '');
        $password = (string)($this->settings['smtpPass'] ?? '');
        $timeout = 12;

        if ($host === '' || $port <= 0) {
            return [
                'ok' => false,
                'driver' => 'smtp',
                'recipient' => $to,
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
            return [
                'ok' => false,
                'driver' => 'smtp',
                'recipient' => $to,
                'timestamp' => gmdate('c'),
                'message' => "SMTP connection failed ({$errno}): {$errstr}"
            ];
        }

        stream_set_timeout($socket, $timeout);
        $greeting = $this->readSmtpResponse($socket);
        if (strpos($greeting, '220') !== 0) {
            fclose($socket);
            return [
                'ok' => false,
                'driver' => 'smtp',
                'recipient' => $to,
                'timestamp' => gmdate('c'),
                'message' => "Unexpected SMTP greeting: {$greeting}"
            ];
        }

        $serverName = $_SERVER['SERVER_NAME'] ?? 'rak4creative.com';
        $ehlo = $this->sendSmtpCommand($socket, "EHLO {$serverName}", ['250']);
        if (!$ehlo['ok']) {
            fclose($socket);
            return $this->smtpError($to, 'EHLO failed: ' . $ehlo['response']);
        }

        if ($encryption === 'tls') {
            $startTls = $this->sendSmtpCommand($socket, "STARTTLS", ['220']);
            if (!$startTls['ok']) {
                fclose($socket);
                return $this->smtpError($to, 'STARTTLS failed: ' . $startTls['response']);
            }
            $cryptoOk = @stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
            if (!$cryptoOk) {
                fclose($socket);
                return $this->smtpError($to, 'Failed to negotiate TLS encryption.');
            }
            $ehloTls = $this->sendSmtpCommand($socket, "EHLO {$serverName}", ['250']);
            if (!$ehloTls['ok']) {
                fclose($socket);
                return $this->smtpError($to, 'Post-TLS EHLO failed: ' . $ehloTls['response']);
            }
        }

        if ($username !== '') {
            $auth = $this->sendSmtpCommand($socket, "AUTH LOGIN", ['334']);
            if (!$auth['ok']) {
                fclose($socket);
                return $this->smtpError($to, 'SMTP AUTH LOGIN rejected: ' . $auth['response']);
            }
            $userStep = $this->sendSmtpCommand($socket, base64_encode($username), ['334']);
            if (!$userStep['ok']) {
                fclose($socket);
                return $this->smtpError($to, 'SMTP username rejected: ' . $userStep['response']);
            }
            $passStep = $this->sendSmtpCommand($socket, base64_encode($password), ['235']);
            if (!$passStep['ok']) {
                fclose($socket);
                return $this->smtpError($to, 'SMTP password authentication failed: ' . $passStep['response']);
            }
        }

        $mailFrom = $this->sendSmtpCommand($socket, "MAIL FROM:<{$fromEmail}>", ['250']);
        if (!$mailFrom['ok']) {
            fclose($socket);
            return $this->smtpError($to, 'MAIL FROM rejected: ' . $mailFrom['response']);
        }

        $allRecipients = array_unique(array_filter(array_merge([$to], $ccList), function ($addr) {
            return filter_var(trim($addr), FILTER_VALIDATE_EMAIL);
        }));

        foreach ($allRecipients as $rcpt) {
            $rcptCmd = $this->sendSmtpCommand($socket, "RCPT TO:<" . trim($rcpt) . ">", ['250', '251']);
            if (!$rcptCmd['ok']) {
                fclose($socket);
                return $this->smtpError($to, "RCPT TO <{$rcpt}> rejected: " . $rcptCmd['response']);
            }
        }

        $dataCmd = $this->sendSmtpCommand($socket, "DATA", ['354']);
        if (!$dataCmd['ok']) {
            fclose($socket);
            return $this->smtpError($to, 'SMTP DATA command rejected: ' . $dataCmd['response']);
        }

        $boundary = '==RAK_SMTP_' . md5((string)microtime(true));
        $encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

        $msgHeaders = [];
        $msgHeaders[] = "Date: " . date('r');
        $msgHeaders[] = "To: <{$to}>";
        $msgHeaders[] = "From: {$encodedFromName} <{$fromEmail}>";
        if ($replyTo !== '') {
            $msgHeaders[] = "Reply-To: <{$replyTo}>";
        }
        if (!empty($ccList)) {
            $msgHeaders[] = "Cc: " . implode(', ', $ccList);
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
            return $this->smtpError($to, 'SMTP message transmission failed: ' . $sendData['response']);
        }

        return [
            'ok' => true,
            'driver' => 'smtp',
            'recipient' => $to,
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
