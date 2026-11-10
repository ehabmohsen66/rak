<?php
// RAK 4 CREATIVE - Dynamic llms.txt & llms-full.txt Generator (llmstxt.org Markdown Standard)
// Keeps /llms.txt and /llms-full.txt automatically synchronized with live CMS services, FAQs, and blog posts.
error_reporting(0);
ini_set('display_errors', '0');

header('Content-Type: text/plain; charset=UTF-8');
header('Cache-Control: public, max-age=3600');

require_once __DIR__ . '/api/seo_defaults.php';

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

if (rakUpgradeCmsSeoContent($content) && is_writable($cmsFile)) {
    @file_put_contents($cmsFile, json_encode($content, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);
}

$baseUrl = rtrim((string)($content['seo']['canonicalUrl'] ?? 'https://rak4creative.com'), '/');
if ($baseUrl === '') {
    $baseUrl = 'https://rak4creative.com';
}

$requestUri = (string)($_SERVER['REQUEST_URI'] ?? '');
$isFull = !empty($_GET['full']) || strpos($requestUri, 'llms-full.txt') !== false;

$brand = isset($content['brandInfo']) && is_array($content['brandInfo']) ? $content['brandInfo'] : [];
$ceoName = trim((string)($brand['ceoName'] ?? 'Farah Younes'));
$contactEmail = trim((string)($brand['contactEmail'] ?? 'hello@rak4creative.com'));

$lines = [];
$lines[] = '# RAK 4 CREATIVE';
$lines[] = '';
$lines[] = '> Full-service digital marketing agency in Lebanon (Beirut HQ) and Toronto, serving MENA, GCC, Europe, Africa, and North American brands across social media marketing, Meta & Google paid ads, bilingual Arabic/English SEO, branding, enterprise web development, media production, and out-of-home advertising.';
$lines[] = '';
$lines[] = "RAK 4 CREATIVE (part of RAK Group, led by General Manager & CEO {$ceoName}) is a full-service creative and digital marketing agency in Beirut, Lebanon and Toronto, Canada uniting brand strategy, creative production, enterprise web engineering, and performance marketing under one roof, from market research and ideation to 360° execution, monitoring, and ROI evaluation.";
$lines[] = '';
$lines[] = '- Headquarters: Badaro Executive Tower, Level 6, Beirut, Lebanon (+961-1-380-400 | lebanon@rak4creative.com)';
$lines[] = '- North America Hub: 100 King Street West, Suite 5600, Toronto, ON, Canada (+1-416-800-4820 | canada@rak4creative.com)';
$lines[] = "- General Inquiries: {$contactEmail}";
$lines[] = '';
$lines[] = '## Core Pages';
$lines[] = '';
$lines[] = "- [Home]({$baseUrl}/): Digital marketing agency in Lebanon overview, 8 core marketing and creative capabilities, featured portfolio creations, and Beirut FAQ guide.";
$lines[] = "- [Services & 8 Core Pillars]({$baseUrl}/services): Social media marketing, paid media & PPC, SEO/SEM, web & e-commerce, branding & OOH, content production, consultancy, and analytics.";
$lines[] = "- [About Us]({$baseUrl}/about): Agency story, leadership spotlight on CEO {$ceoName}, core values, and interdisciplinary creative & engineering team.";
$lines[] = "- [Selected Portfolio Work]({$baseUrl}/work): Showcases across brand identity, 3D WebGL experiences, e-commerce platforms, and omnichannel paid media campaigns.";
$lines[] = "- [Enterprise Case Studies & ROI]({$baseUrl}/case-studies): Deep-dive business challenges, strategic solutions, and measurable conversion & revenue outcomes.";
$lines[] = "- [Editorial Blog & Insights]({$baseUrl}/blog): Guides on choosing a digital marketing agency in Lebanon, GCC cross-border paid media & SEO, AI workflows, and high-conversion web architecture.";
$lines[] = "- [Careers & Open Roles]({$baseUrl}/careers): Open positions in brand strategy, paid media buying, UI/UX design systems, and full-stack creative engineering.";
$lines[] = "- [Contact & Project Planner]({$baseUrl}/contact): Beirut and Toronto office details and executive project inquiry form.";

if ($isFull) {
    $pillars = isset($content['pillars']) && is_array($content['pillars']) ? $content['pillars'] : [];
    if (!empty($pillars)) {
        $lines[] = '';
        $lines[] = '## 8 Core Service Pillars (Lebanon, MENA, GCC & Global)';
        foreach ($pillars as $p) {
            $pTitle = trim((string)($p['title'] ?? ''));
            $pTag = trim((string)($p['tagline'] ?? ''));
            $pDesc = trim((string)($p['description'] ?? ''));
            if ($pTitle === '') {
                continue;
            }
            $lines[] = '';
            $lines[] = "### {$pTitle}" . ($pTag !== '' ? " ({$pTag})" : '');
            if ($pDesc !== '') {
                $lines[] = $pDesc;
            }
            if (!empty($p['items']) && is_array($p['items'])) {
                foreach ($p['items'] as $item) {
                    $itemStr = trim((string)$item);
                    if ($itemStr !== '') {
                        $lines[] = "- {$itemStr}";
                    }
                }
            }
        }
    }

    $caseStudies = isset($content['caseStudies']) && is_array($content['caseStudies']) ? $content['caseStudies'] : [];
    if (!empty($caseStudies)) {
        $lines[] = '';
        $lines[] = '## Selected Case Studies & Measurable Outcomes';
        $lines[] = '';
        foreach ($caseStudies as $cs) {
            $csClient = trim((string)($cs['client'] ?? ''));
            $csTitle = trim((string)($cs['title'] ?? ''));
            $csImpact = trim((string)($cs['impact'] ?? ''));
            $csChallenge = trim((string)($cs['challenge'] ?? ''));
            $csSolution = trim((string)($cs['solution'] ?? ''));
            if ($csClient === '' && $csTitle === '') {
                continue;
            }
            $lines[] = "- **{$csClient}: {$csTitle}**" . ($csImpact !== '' ? " (Impact: {$csImpact})" : '');
            if ($csChallenge !== '') {
                $lines[] = "  - Challenge: {$csChallenge}";
            }
            if ($csSolution !== '') {
                $lines[] = "  - Solution: {$csSolution}";
            }
        }
    }

    $faqs = isset($content['faqs']) && is_array($content['faqs']) && !empty($content['faqs'])
        ? $content['faqs']
        : rakGetDefaultLebanonFaqs();
    if (!empty($faqs)) {
        $lines[] = '';
        $lines[] = '## Frequently Asked Questions (Digital Marketing Agency in Lebanon)';
        foreach ($faqs as $faq) {
            $q = trim((string)($faq['question'] ?? ''));
            $a = trim((string)($faq['answer'] ?? ''));
            if ($q === '' || $a === '') {
                continue;
            }
            $lines[] = '';
            $lines[] = "### {$q}";
            $lines[] = $a;
        }
    }
}

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
        if (!$isFull && strlen($summary) > 160) {
            $summary = rtrim(substr($summary, 0, 157)) . '...';
        }
        $url = $baseUrl . '/blog/' . rawurlencode($slug);
        $lines[] = $summary !== '' ? "- [{$title}]({$url}): {$summary}" : "- [{$title}]({$url})";
    }
}

$lines[] = '';
$lines[] = '## Optional';
$lines[] = '';
$lines[] = "- [Full Agency Context for LLMs]({$baseUrl}/llms-full.txt): Complete plain-text reference of RAK 4 CREATIVE services, leadership, case studies, FAQs, and contact details.";
$lines[] = "- [XML Sitemap]({$baseUrl}/sitemap.xml): Complete machine-readable index of public URLs on rak4creative.com.";
$lines[] = '';

echo implode("\n", $lines);
