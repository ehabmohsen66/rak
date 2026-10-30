<?php
// RAK 4 CREATIVE - Server-Side SEO Pre-Renderer for React SPA on cPanel (PHP 7.4 / 8.x)
// Keeps 100% of the visual React SPA untouched while delivering route-specific <title>,
// <meta name="description">, <link rel="canonical">, Open Graph tags, JSON-LD Schema,
// and <noscript> semantic HTML directly in the initial HTTP response for Googlebot, Bing, WhatsApp & AI crawlers.

error_reporting(0);
ini_set('display_errors', '0');

$indexFile = __DIR__ . '/index.html';
if (!file_exists($indexFile)) {
    http_response_code(404);
    echo 'Application bundle not found.';
    exit;
}

$html = @file_get_contents($indexFile);
if ($html === false || $html === '') {
    http_response_code(500);
    exit;
}

header('Content-Type: text/html; charset=UTF-8');

function rakEsc(string $val): string {
    return htmlspecialchars($val, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function rakReplaceTag(string $html, string $pattern, string $replacement): string {
    $updated = preg_replace_callback($pattern, function () use ($replacement) {
        return $replacement;
    }, $html, 1, $count);
    return ($updated !== null && $count > 0) ? $updated : $html;
}

// Load CMS data (and auto-upgrade legacy placeholder SEO values if needed)
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

$defaultTitles = [
    'home'         => 'Digital Marketing Agency in Lebanon | RAK 4 CREATIVE',
    'about'        => 'About RAK 4 CREATIVE | Creative & Digital Marketing Agency in Beirut',
    'services'     => 'Social Media, Paid Ads & Digital Marketing Services Lebanon | RAK 4 CREATIVE',
    'work'         => 'Digital Marketing, Branding & Paid Media Portfolio | RAK 4 CREATIVE Lebanon',
    'case-studies' => 'Digital Marketing & Paid Media Case Studies & ROI | RAK 4 CREATIVE',
    'careers'      => 'Digital Marketing & Creative Agency Careers in Beirut | RAK 4 CREATIVE',
    'blog'         => 'Digital Marketing, Paid Media & AI Strategy Insights | RAK 4 CREATIVE Blog',
    'blog-post'    => 'Digital Marketing Insight | RAK 4 CREATIVE',
    'contact'      => 'Contact Our Digital Marketing Agency in Beirut, Lebanon | RAK 4 CREATIVE',
    'admin'        => 'CMS Operations Portal | RAK 4 CREATIVE',
];

$defaultDescriptions = [
    'home'         => 'Full-service digital marketing agency in Beirut, Lebanon serving MENA, GCC & global brands. Social media marketing, Meta & Google paid ads, SEO, branding & web.',
    'about'        => 'Meet RAK 4 CREATIVE, your one-stop digital marketing and creative agency in Beirut, Lebanon and Toronto, uniting brand strategy, social media, paid ads & tech.',
    'services'     => "Explore RAK 4 CREATIVE's 8 agency pillars in Lebanon: social media marketing, Meta & Google PPC paid ads, SEO, web development, branding, OOH & video production.",
    'work'         => 'Browse selected creations by RAK 4 CREATIVE: paid media scaling, social media campaigns, brand identity, 3D web platforms & e-commerce across MENA & global markets.',
    'case-studies' => "See measurable ROI from RAK 4 CREATIVE's digital marketing, Meta & PPC ad scaling, brand overhauls, and high-conversion web platforms for ambitious enterprises.",
    'careers'      => 'Join RAK 4 CREATIVE in Beirut, Lebanon or remote. Explore open roles in paid media buying, brand strategy, social media, UI/UX design & full-stack web engineering.',
    'blog'         => "Insights from RAK 4 CREATIVE's strategy team in Lebanon on digital marketing, paid media ROI, AI workflows, high-conversion web architecture & omnichannel growth.",
    'blog-post'    => 'Executive insights on digital marketing, social media, paid ads, brand strategy, and web performance by RAK 4 CREATIVE.',
    'contact'      => 'Partner with RAK 4 CREATIVE in Beirut, Lebanon (Badaro) or Toronto. Request a proposal for social media marketing, Meta & Google paid ads, SEO, branding & web.',
    'admin'        => 'Internal CMS Operations Portal for RAK 4 CREATIVE.',
];

$legacyTitles = [
    'home'         => 'RAK 4 CREATIVE | Global Digital & Brand Innovation Agency',
    'about'        => 'About Us | RAK 4 CREATIVE Brand Architecture',
    'services'     => 'Services & Capabilities | RAK 4 CREATIVE',
    'work'         => 'Selected Portfolio Work | RAK 4 CREATIVE',
    'case-studies' => 'Enterprise Case Studies & ROI | RAK 4 CREATIVE',
    'careers'      => 'Careers & Open Roles | RAK 4 CREATIVE',
    'blog'         => 'Executive Editorial & Insights | RAK 4 CREATIVE',
    'blog-post'    => 'Editorial Insight | RAK 4 CREATIVE',
    'contact'      => 'Contact & Executive Inquiry | RAK 4 CREATIVE',
];

$seo = isset($content['seo']) && is_array($content['seo']) ? $content['seo'] : [];
$baseUrl = rtrim((string)($seo['canonicalUrl'] ?? 'https://rak4creative.com'), '/');
if ($baseUrl === '') {
    $baseUrl = 'https://rak4creative.com';
}

function rakAbsoluteUrl(string $url, string $baseUrl): string {
    $trimmed = trim($url);
    if ($trimmed === '') {
        return $baseUrl . '/og-logo.png';
    }
    if (preg_match('#^https?://#i', $trimmed)) {
        return str_replace(' ', '%20', $trimmed);
    }
    return $baseUrl . '/' . str_replace(' ', '%20', ltrim($trimmed, '/'));
}

$ogImage = (string)($seo['ogImage'] ?? ($baseUrl . '/og-logo.png'));
if ($ogImage === '' || strpos($ogImage, 'photo-1618005182384-a83a8bd57fbe') !== false) {
    $ogImage = $baseUrl . '/og-logo.png';
} else {
    $ogImage = rakAbsoluteUrl($ogImage, $baseUrl);
}

$keywords = (string)($seo['metaKeywords'] ?? '');
if ($keywords === '' || $keywords === 'RAK 4 Creative, Brand Strategy, UI/UX Design, Web Development, CRO, Digital Transformation, Enterprise Agency') {
    $keywords = 'Digital Marketing Agency Lebanon, Digital Marketing Agency in Beirut, Social Media Marketing Lebanon, Paid Media Agency Lebanon, Meta Ads Agency Beirut, Google Ads PPC Lebanon, SEO Agency Lebanon, Creative Agency Beirut, Branding & Web Development Lebanon, RAK 4 Creative';
}

// Parse request path
$requestUri = (string)($_SERVER['REQUEST_URI'] ?? '/');
$rawPath = parse_url($requestUri, PHP_URL_PATH);
$cleanPath = '/' . trim((string)$rawPath, '/');
$lowerPath = strtolower($cleanPath);

$routeMap = [
    '/'             => ['tab' => 'home',         'canonical' => '/',             'label' => 'Home'],
    '/home'         => ['tab' => 'home',         'canonical' => '/',             'label' => 'Home'],
    '/about'        => ['tab' => 'about',        'canonical' => '/about',        'label' => 'About'],
    '/services'     => ['tab' => 'services',     'canonical' => '/services',     'label' => 'Services & Pillars'],
    '/work'         => ['tab' => 'work',         'canonical' => '/work',         'label' => 'Portfolio'],
    '/case-studies' => ['tab' => 'case-studies', 'canonical' => '/case-studies', 'label' => 'Case Studies'],
    '/careers'      => ['tab' => 'careers',      'canonical' => '/careers',      'label' => 'Careers'],
    '/blog'         => ['tab' => 'blog',         'canonical' => '/blog',         'label' => 'Blog'],
    '/contact'      => ['tab' => 'contact',      'canonical' => '/contact',      'label' => 'Contact'],
    '/admin'        => ['tab' => 'admin',        'canonical' => '/admin',        'label' => 'Admin'],
    '/cms'          => ['tab' => 'admin',        'canonical' => '/admin',        'label' => 'Admin'],
];

$tab = 'home';
$canonicalPath = '/';
$breadcrumbLabel = 'Home';
$matchedPost = null;
$isNotFound = false;

if (isset($routeMap[$lowerPath])) {
    $tab = $routeMap[$lowerPath]['tab'];
    $canonicalPath = $routeMap[$lowerPath]['canonical'];
    $breadcrumbLabel = $routeMap[$lowerPath]['label'];
} elseif (strpos($lowerPath, '/blog/') === 0 && strlen($cleanPath) > 6) {
    $slug = rawurldecode(substr($cleanPath, 6));
    $blogPosts = isset($content['blogPosts']) && is_array($content['blogPosts']) ? $content['blogPosts'] : [];
    foreach ($blogPosts as $p) {
        if (isset($p['id']) && strcasecmp((string)$p['id'], $slug) === 0) {
            $matchedPost = $p;
            break;
        }
    }
    if ($matchedPost !== null) {
        $tab = 'blog-post';
        $canonicalPath = '/blog/' . $matchedPost['id'];
        $breadcrumbLabel = (string)($matchedPost['title'] ?? 'Article');
    } else {
        $isNotFound = true;
    }
} else {
    $isNotFound = true;
}

if ($isNotFound) {
    http_response_code(404);
    header('Cache-Control: no-store, no-cache, must-revalidate');
}

// Resolve route title & meta description
$savedTitle = (string)($seo['pageTitles'][$tab] ?? '');
if ($savedTitle === '' || (isset($legacyTitles[$tab]) && $savedTitle === $legacyTitles[$tab])) {
    $pageTitle = $defaultTitles[$tab] ?? $defaultTitles['home'];
} else {
    $pageTitle = $savedTitle;
}

$savedDesc = (string)($seo['pageDescriptions'][$tab] ?? '');
if ($savedDesc === '') {
    $pageDesc = $defaultDescriptions[$tab] ?? $defaultDescriptions['home'];
} else {
    $pageDesc = $savedDesc;
}

$ogType = 'website';
if ($tab === 'blog-post' && $matchedPost !== null) {
    $ogType = 'article';
    if (!empty($matchedPost['title'])) {
        $pageTitle = $matchedPost['title'] . ' | RAK 4 CREATIVE';
    }
    if (!empty($matchedPost['excerpt'])) {
        $pageDesc = (string)$matchedPost['excerpt'];
    } elseif (!empty($matchedPost['subtitle'])) {
        $pageDesc = (string)$matchedPost['subtitle'];
    }
    if (!empty($matchedPost['image'])) {
        $ogImage = rakAbsoluteUrl((string)$matchedPost['image'], $baseUrl);
    }
}

$fullCanonical = ($canonicalPath === '/') ? ($baseUrl . '/') : ($baseUrl . $canonicalPath);
$robotsDirective = ($tab === 'admin' || $isNotFound)
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

// Inject route-specific Head tags safely
$eTitle = rakEsc($pageTitle);
$eDesc = rakEsc($pageDesc);
$eKeywords = rakEsc($keywords);
$eCanonical = rakEsc($fullCanonical);
$eOgImage = rakEsc($ogImage);
$eOgType = rakEsc($ogType);
$eRobots = rakEsc($robotsDirective);

$html = rakReplaceTag($html, '/<title>.*?<\/title>/is', "<title>{$eTitle}</title>");
$html = rakReplaceTag($html, '/<meta\s+name="title"\s+content="[^"]*"\s*\/?>/i', "<meta name=\"title\" content=\"{$eTitle}\" />");
$html = rakReplaceTag($html, '/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i', "<meta name=\"description\" content=\"{$eDesc}\" />");
$html = rakReplaceTag($html, '/<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/i', "<meta name=\"keywords\" content=\"{$eKeywords}\" />");
$html = rakReplaceTag($html, '/<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i', "<meta name=\"robots\" content=\"{$eRobots}\" />");
$html = rakReplaceTag($html, '/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i', "<link rel=\"canonical\" href=\"{$eCanonical}\" />");

$html = rakReplaceTag($html, '/<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i', "<meta property=\"og:type\" content=\"{$eOgType}\" />");
$html = rakReplaceTag($html, '/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i', "<meta property=\"og:url\" content=\"{$eCanonical}\" />");
$html = rakReplaceTag($html, '/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i', "<meta property=\"og:title\" content=\"{$eTitle}\" />");
$html = rakReplaceTag($html, '/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i', "<meta property=\"og:description\" content=\"{$eDesc}\" />");
$html = rakReplaceTag($html, '/<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i', "<meta property=\"og:image\" content=\"{$eOgImage}\" />");

$html = rakReplaceTag($html, '/<meta\s+property="twitter:url"\s+content="[^"]*"\s*\/?>/i', "<meta property=\"twitter:url\" content=\"{$eCanonical}\" />");
$html = rakReplaceTag($html, '/<meta\s+property="twitter:title"\s+content="[^"]*"\s*\/?>/i', "<meta property=\"twitter:title\" content=\"{$eTitle}\" />");
$html = rakReplaceTag($html, '/<meta\s+property="twitter:description"\s+content="[^"]*"\s*\/?>/i', "<meta property=\"twitter:description\" content=\"{$eDesc}\" />");
$html = rakReplaceTag($html, '/<meta\s+property="twitter:image"\s+content="[^"]*"\s*\/?>/i', "<meta property=\"twitter:image\" content=\"{$eOgImage}\" />");

// Build Route-Specific JSON-LD Schema (Breadcrumbs + WebPage / BlogPosting / JobPosting)
if ($tab !== 'admin' && !$isNotFound) {
    $routeGraph = [];

    $breadcrumbs = [
        [
            '@type' => 'ListItem',
            'position' => 1,
            'name' => 'Home',
            'item' => $baseUrl . '/'
        ]
    ];
    if ($tab === 'blog-post' && $matchedPost !== null) {
        $breadcrumbs[] = [
            '@type' => 'ListItem',
            'position' => 2,
            'name' => 'Blog',
            'item' => $baseUrl . '/blog'
        ];
        $breadcrumbs[] = [
            '@type' => 'ListItem',
            'position' => 3,
            'name' => $breadcrumbLabel,
            'item' => $fullCanonical
        ];
    } elseif ($tab !== 'home') {
        $breadcrumbs[] = [
            '@type' => 'ListItem',
            'position' => 2,
            'name' => $breadcrumbLabel,
            'item' => $fullCanonical
        ];
    }

    $routeGraph[] = [
        '@type' => 'BreadcrumbList',
        'itemListElement' => $breadcrumbs
    ];

    $pageSchemaType = 'WebPage';
    if ($tab === 'about') $pageSchemaType = 'AboutPage';
    elseif ($tab === 'contact') $pageSchemaType = 'ContactPage';
    elseif ($tab === 'work' || $tab === 'case-studies' || $tab === 'blog' || $tab === 'services') $pageSchemaType = 'CollectionPage';

    $routeGraph[] = [
        '@type' => $pageSchemaType,
        '@id' => $fullCanonical . '#webpage',
        'url' => $fullCanonical,
        'name' => $pageTitle,
        'description' => $pageDesc,
        'isPartOf' => ['@id' => $baseUrl . '/#website'],
        'about' => ['@id' => $baseUrl . '/#agency'],
        'inLanguage' => 'en'
    ];

    if ($tab === 'blog-post' && $matchedPost !== null) {
        $routeGraph[] = [
            '@type' => 'BlogPosting',
            'headline' => (string)($matchedPost['title'] ?? ''),
            'description' => $pageDesc,
            'image' => $ogImage,
            'author' => [
                '@type' => 'Organization',
                'name' => is_string($matchedPost['author'] ?? null) ? $matchedPost['author'] : 'RAK 4 CREATIVE'
            ],
            'publisher' => [
                '@type' => 'Organization',
                '@id' => $baseUrl . '/#agency',
                'name' => 'RAK 4 CREATIVE',
                'logo' => [
                    '@type' => 'ImageObject',
                    'url' => $baseUrl . '/og-logo.png'
                ]
            ],
            'mainEntityOfPage' => [
                '@type' => 'WebPage',
                '@id' => $fullCanonical
            ]
        ];
    }

    if ($tab === 'careers' && !empty($content['openRoles']) && is_array($content['openRoles'])) {
        foreach ($content['openRoles'] as $role) {
            if (($role['active'] ?? true) === false || empty($role['title'])) {
                continue;
            }
            $locStr = (string)($role['location'] ?? 'Beirut');
            $isLebanon = stripos($locStr, 'Beirut') !== false || stripos($locStr, 'Lebanon') !== false;
            $routeGraph[] = [
                '@type' => 'JobPosting',
                'title' => (string)$role['title'],
                'description' => (string)($role['description'] ?? ''),
                'employmentType' => 'FULL_TIME',
                'datePosted' => '2026-07-01',
                'hiringOrganization' => [
                    '@type' => 'Organization',
                    '@id' => $baseUrl . '/#agency',
                    'name' => 'RAK 4 CREATIVE',
                    'sameAs' => $baseUrl . '/'
                ],
                'jobLocation' => [
                    '@type' => 'Place',
                    'address' => [
                        '@type' => 'PostalAddress',
                        'addressLocality' => $isLebanon ? 'Beirut' : 'Toronto',
                        'addressCountry' => $isLebanon ? 'LB' : 'CA'
                    ]
                ]
            ];
        }
    }

    $routeJsonLd = json_encode([
        '@context' => 'https://schema.org',
        '@graph' => $routeGraph
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    if ($routeJsonLd !== false) {
        $scriptTag = "\n    <script type=\"application/ld+json\">{$routeJsonLd}</script>\n  </head>";
        $html = rakReplaceTag($html, '/<\/head>/i', $scriptTag);
    }

    // Build semantic <noscript> fallback strictly from the exact existing CMS content for this route
    $brand = isset($content['brandInfo']) && is_array($content['brandInfo']) ? $content['brandInfo'] : [];
    $pillars = isset($content['pillars']) && is_array($content['pillars']) ? $content['pillars'] : [];
    $projects = isset($content['projects']) && is_array($content['projects']) ? $content['projects'] : [];
    $blogs = isset($content['blogPosts']) && is_array($content['blogPosts']) ? $content['blogPosts'] : [];
    $offices = isset($content['offices']) && is_array($content['offices']) ? $content['offices'] : [];
    $roles = isset($content['openRoles']) && is_array($content['openRoles']) ? $content['openRoles'] : [];
    $values = isset($content['values']) && is_array($content['values']) ? $content['values'] : [];

    $ns = "<noscript><main>";
    $ns .= "<nav><a href=\"{$baseUrl}/\">Home</a> | <a href=\"{$baseUrl}/about\">About</a> | <a href=\"{$baseUrl}/services\">Services</a> | <a href=\"{$baseUrl}/work\">Portfolio</a> | <a href=\"{$baseUrl}/case-studies\">Case Studies</a> | <a href=\"{$baseUrl}/careers\">Careers</a> | <a href=\"{$baseUrl}/blog\">Blog</a> | <a href=\"{$baseUrl}/contact\">Contact</a></nav>";

    if ($tab === 'home') {
        $homeHeroTitle = (string)($content['banners']['home']['title'] ?? $brand['headline'] ?? '');
        $ns .= '<h1>' . rakEsc((string)($brand['name'] ?? 'RAK4Creative')) . ': ' . rakEsc((string)($brand['tagline'] ?? 'Your One-Stop Agency')) . '</h1>';
        $ns .= '<p>' . rakEsc(str_replace('*', '', $homeHeroTitle)) . '</p>';
        $ns .= '<p>' . rakEsc((string)($brand['description'] ?? '')) . '</p>';
        foreach ($pillars as $pl) {
            $ns .= '<section><h2>' . rakEsc((string)($pl['title'] ?? '')) . '</h2><p>' . rakEsc((string)($pl['description'] ?? '')) . '</p></section>';
        }
    } elseif ($tab === 'services') {
        $ns .= '<h1>' . count($pillars) . ' Core Pillars: ' . rakEsc((string)($brand['name'] ?? 'RAK4Creative')) . '</h1>';
        $ns .= '<p>' . rakEsc((string)($brand['whatWeDo'] ?? '')) . '</p>';
        foreach ($pillars as $pl) {
            $ns .= '<section><h2>' . rakEsc((string)($pl['title'] ?? '')) . '</h2><p>' . rakEsc((string)($pl['description'] ?? '')) . '</p>';
            if (!empty($pl['items']) && is_array($pl['items'])) {
                $ns .= '<ul>';
                foreach ($pl['items'] as $it) {
                    $ns .= '<li>' . rakEsc((string)$it) . '</li>';
                }
                $ns .= '</ul>';
            }
            $ns .= '</section>';
        }
    } elseif ($tab === 'about') {
        $ns .= '<h1>About ' . rakEsc((string)($brand['name'] ?? 'RAK4Creative')) . '</h1>';
        $ns .= '<p>' . rakEsc((string)($brand['differentiation'] ?? '')) . '</p>';
        $ns .= '<p>' . rakEsc((string)($brand['whatWeDo'] ?? '')) . '</p>';
        foreach ($values as $v) {
            $ns .= '<section><h2>' . rakEsc((string)($v['name'] ?? '')) . '</h2><p>' . rakEsc((string)($v['description'] ?? '')) . '</p></section>';
        }
    } elseif ($tab === 'work' || $tab === 'case-studies') {
        $ns .= '<h1>' . ($tab === 'work' ? 'The RAK4 Creations' : 'Case Studies & ROI') . '</h1>';
        foreach ($projects as $pr) {
            $ns .= '<article><h2>' . rakEsc((string)($pr['title'] ?? '')) . '</h2>';
            $ns .= '<p>' . rakEsc((string)($pr['summary'] ?? '')) . '</p>';
            if (!empty($pr['challenge'])) $ns .= '<p>' . rakEsc((string)$pr['challenge']) . '</p>';
            if (!empty($pr['solution'])) $ns .= '<p>' . rakEsc((string)$pr['solution']) . '</p>';
            $ns .= '</article>';
        }
    } elseif ($tab === 'careers') {
        $careersCopy = isset($content['careersCopy']) && is_array($content['careersCopy']) ? $content['careersCopy'] : [];
        $ns .= '<h1>' . rakEsc((string)($careersCopy['title'] ?? 'Careers at RAK4Creative')) . '</h1>';
        $ns .= '<p>' . rakEsc((string)($careersCopy['body'] ?? '')) . '</p>';
        foreach ($roles as $rl) {
            if (($rl['active'] ?? true) === false) continue;
            $ns .= '<section><h2>' . rakEsc((string)($rl['title'] ?? '')) . ' (' . rakEsc((string)($rl['location'] ?? '')) . ')</h2><p>' . rakEsc((string)($rl['description'] ?? '')) . '</p></section>';
        }
    } elseif ($tab === 'blog') {
        $ns .= '<h1>' . rakEsc($pageTitle) . '</h1>';
        foreach ($blogs as $bp) {
            $bSlug = rakEsc((string)($bp['id'] ?? ''));
            $ns .= '<article><h2><a href="' . $baseUrl . '/blog/' . $bSlug . '">' . rakEsc((string)($bp['title'] ?? '')) . '</a></h2>';
            $ns .= '<p>' . rakEsc((string)($bp['excerpt'] ?? '')) . '</p></article>';
        }
    } elseif ($tab === 'blog-post' && $matchedPost !== null) {
        $ns .= '<article><h1>' . rakEsc((string)($matchedPost['title'] ?? '')) . '</h1>';
        if (!empty($matchedPost['subtitle'])) {
            $ns .= '<p>' . rakEsc((string)$matchedPost['subtitle']) . '</p>';
        }
        $ns .= '<div>' . nl2br(rakEsc((string)($matchedPost['content'] ?? ''))) . '</div></article>';
    } elseif ($tab === 'contact') {
        $ns .= '<h1>Contact ' . rakEsc((string)($brand['name'] ?? 'RAK4Creative')) . '</h1>';
        foreach ($offices as $of) {
            $ns .= '<address><strong>' . rakEsc((string)($of['city'] ?? '') . ', ' . (string)($of['country'] ?? '')) . '</strong>: ' . rakEsc((string)($of['address'] ?? '')) . ' • ' . rakEsc((string)($of['phone'] ?? '')) . ' • ' . rakEsc((string)($of['email'] ?? '')) . '</address>';
        }
    }

    foreach ($offices as $of) {
        $ns .= '<footer>' . rakEsc((string)($of['city'] ?? '') . ', ' . (string)($of['country'] ?? '') . ': ' . (string)($of['address'] ?? '') . ' (' . (string)($of['phone'] ?? '') . ')') . '</footer>';
    }
    $ns .= '</main></noscript>';

    $html = rakReplaceTag($html, '/<div\s+id="root"\s*><\/div>/i', '<div id="root"></div>' . $ns);
}

echo $html;
