<?php
// RAK 4 CREATIVE - Dynamic llms.txt Generator (llmstxt.org Markdown Standard)
// Keeps /llms.txt automatically synchronized with live CMS services and blog posts.
error_reporting(0);
ini_set('display_errors', '0');

header('Content-Type: text/plain; charset=UTF-8');
header('Cache-Control: public, max-age=3600');

$cmsFile = __DIR__ . '/api/storage/cms_data.json';
$content = [];
if (file_exists($cmsFile)) {
    $raw = @file_get_contents($cmsFile);
    if ($raw !== false) {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            $content = $decoded;
        }
    }
}

$baseUrl = rtrim((string)($content['seo']['canonicalUrl'] ?? 'https://rak4creative.com'), '/');
if ($baseUrl === '') {
    $baseUrl = 'https://rak4creative.com';
}

$brand = isset($content['brandInfo']) && is_array($content['brandInfo']) ? $content['brandInfo'] : [];
$ceoName = trim((string)($brand['ceoName'] ?? 'Farah Younes'));
$contactEmail = trim((string)($brand['contactEmail'] ?? 'hello@rak4creative.com'));

$lines = [];
$lines[] = '# RAK 4 CREATIVE';
$lines[] = '';
$lines[] = '> Full-service digital marketing and creative agency in Lebanon (Beirut HQ) and Toronto, serving MENA, GCC, Europe, Africa, and global brands across social media marketing, Meta & Google paid ads, SEO, branding, web development, media production, and out-of-home advertising.';
$lines[] = '';
$lines[] = "RAK 4 CREATIVE (part of RAK Group, led by General Manager & CEO {$ceoName}) is a one-stop agency uniting brand strategy, creative production, enterprise web engineering, and performance marketing under one roof—from market research and ideation to 360° execution, monitoring, and ROI evaluation.";
$lines[] = '';
$lines[] = '- Headquarters: Badaro Executive Tower, Level 6, Beirut, Lebanon (+961-1-380-400 | lebanon@rak4creative.com)';
$lines[] = '- North America Hub: 100 King Street West, Suite 5600, Toronto, ON, Canada (+1-416-800-4820 | canada@rak4creative.com)';
$lines[] = "- General Inquiries: {$contactEmail}";
$lines[] = '';
$lines[] = '## Core Pages';
$lines[] = '';
$lines[] = "- [Home]({$baseUrl}/): Agency overview, core digital marketing capabilities, featured client creations, and verified partner reviews.";
$lines[] = "- [Services & Core Pillars]({$baseUrl}/services): Social media marketing, paid media & PPC, SEO/SEM, web & e-commerce, branding & OOH, content production, consultancy, and analytics.";
$lines[] = "- [About Us]({$baseUrl}/about): Agency story, leadership spotlight on CEO {$ceoName}, core values, and interdisciplinary creative & tech team.";
$lines[] = "- [Selected Portfolio Work]({$baseUrl}/work): Showcases across brand identity, 3D WebGL experiences, e-commerce platforms, and omnichannel paid media campaigns.";
$lines[] = "- [Enterprise Case Studies & ROI]({$baseUrl}/case-studies): Deep-dive business challenges, strategic solutions, and measurable conversion & revenue outcomes.";
$lines[] = "- [Editorial Blog & Insights]({$baseUrl}/blog): Articles on AI workflows, paid media scaling, high-conversion web architecture, and consumer intelligence.";
$lines[] = "- [Careers & Open Roles]({$baseUrl}/careers): Open positions in brand strategy, paid media buying, UI/UX design systems, and full-stack creative engineering.";
$lines[] = "- [Contact & Project Planner]({$baseUrl}/contact): Beirut and Toronto office details and executive project inquiry form.";

$blogPosts = isset($content['blogPosts']) && is_array($content['blogPosts']) ? $content['blogPosts'] : [];
if (!empty($blogPosts)) {
    $lines[] = '';
    $lines[] = '## Editorial & Strategic Insights';
    $lines[] = '';
    foreach ($blogPosts as $post) {
        $slug = trim((string)($post['id'] ?? ''));
        $title = trim((string)($post['title'] ?? ''));
        if ($slug === '' || $title === '') {
            continue;
        }
        $summary = trim((string)($post['subtitle'] ?? $post['excerpt'] ?? ''));
        $summary = preg_replace('/\s+/', ' ', $summary);
        if (strlen($summary) > 160) {
            $summary = rtrim(substr($summary, 0, 157)) . '...';
        }
        $url = $baseUrl . '/blog/' . rawurlencode($slug);
        $lines[] = $summary !== '' ? "- [{$title}]({$url}): {$summary}" : "- [{$title}]({$url})";
    }
}

$lines[] = '';
$lines[] = '## Optional';
$lines[] = '';
$lines[] = "- [Full Agency Context for LLMs]({$baseUrl}/llms-full.txt): Complete plain-text reference of RAK 4 CREATIVE services, leadership, case studies, and contact details.";
$lines[] = "- [XML Sitemap]({$baseUrl}/sitemap.xml): Complete machine-readable index of public URLs on rak4creative.com.";
$lines[] = '';

echo implode("\n", $lines);
