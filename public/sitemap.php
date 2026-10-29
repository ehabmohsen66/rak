<?php
// RAK 4 CREATIVE - Dynamic XML Sitemap Generator for Search Engines (Google, Bing, AI Crawlers)
error_reporting(0);
ini_set('display_errors', '0');

header('Content-Type: application/xml; charset=UTF-8');
header('X-Robots-Tag: noindex');

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

$baseUrl = rtrim($content['seo']['canonicalUrl'] ?? 'https://rak4creative.com', '/');
if ($baseUrl === '') {
    $baseUrl = 'https://rak4creative.com';
}

$lastmod = file_exists($cmsFile) ? gmdate('Y-m-d', filemtime($cmsFile)) : gmdate('Y-m-d');

$staticRoutes = [
    ['loc' => $baseUrl . '/',             'changefreq' => 'weekly',  'priority' => '1.0'],
    ['loc' => $baseUrl . '/services',     'changefreq' => 'weekly',  'priority' => '0.95'],
    ['loc' => $baseUrl . '/contact',      'changefreq' => 'monthly', 'priority' => '0.90'],
    ['loc' => $baseUrl . '/work',         'changefreq' => 'weekly',  'priority' => '0.85'],
    ['loc' => $baseUrl . '/case-studies', 'changefreq' => 'weekly',  'priority' => '0.85'],
    ['loc' => $baseUrl . '/about',        'changefreq' => 'monthly', 'priority' => '0.80'],
    ['loc' => $baseUrl . '/blog',         'changefreq' => 'weekly',  'priority' => '0.80'],
    ['loc' => $baseUrl . '/careers',      'changefreq' => 'weekly',  'priority' => '0.75'],
];

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

foreach ($staticRoutes as $route) {
    $loc = htmlspecialchars($route['loc'], ENT_XML1 | ENT_QUOTES, 'UTF-8');
    echo "  <url>\n";
    echo "    <loc>{$loc}</loc>\n";
    echo "    <lastmod>{$lastmod}</lastmod>\n";
    echo "    <changefreq>{$route['changefreq']}</changefreq>\n";
    echo "    <priority>{$route['priority']}</priority>\n";
    echo "  </url>\n";
}

$blogPosts = isset($content['blogPosts']) && is_array($content['blogPosts']) ? $content['blogPosts'] : [];
foreach ($blogPosts as $post) {
    $slug = trim((string)($post['id'] ?? ''));
    if ($slug === '') {
        continue;
    }
    $loc = htmlspecialchars($baseUrl . '/blog/' . rawurlencode($slug), ENT_XML1 | ENT_QUOTES, 'UTF-8');
    echo "  <url>\n";
    echo "    <loc>{$loc}</loc>\n";
    echo "    <lastmod>{$lastmod}</lastmod>\n";
    echo "    <changefreq>monthly</changefreq>\n";
    echo "    <priority>0.75</priority>\n";
    echo "  </url>\n";
}

echo "</urlset>\n";
