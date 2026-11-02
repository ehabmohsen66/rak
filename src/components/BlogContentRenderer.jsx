import React, { useMemo } from 'react';

const BLOCK_HTML_REGEX =
  /<\/?(?:!doctype|html|head|body|style|div|section|article|header|footer|main|aside|nav|h[1-6]|p|ul|ol|li|dl|dt|dd|table|thead|tbody|tfoot|tr|th|td|blockquote|pre|figure|figcaption|video|audio|iframe|details|summary|hr|form|fieldset)\b[^>]*>/i;

const ANY_HTML_TAG_REGEX =
  /<\/?[a-z][a-z0-9-]*(?:\s+[^<>]*)?>/i;

const ENCODED_HTML_REGEX =
  /&lt;\/?(?:!doctype|html|head|body|style|div|section|article|h[1-6]|p|ul|ol|li|table|blockquote|span|strong|b|em|i|a|img|br|hr)\b/i;

function unwrapMarkdownCodeFence(raw = '') {
  const trimmed = String(raw || '').trim();
  const fenceMatch = trimmed.match(/^```(?:html|htm|xml)?\s*\r?\n([\s\S]*?)\r?\n```$/i);
  if (fenceMatch) {
    return fenceMatch[1].trim();
  }
  return String(raw || '');
}

function decodeEntitiesIfEscapedHtml(raw = '') {
  const str = String(raw || '');
  if (!ANY_HTML_TAG_REGEX.test(str) && ENCODED_HTML_REGEX.test(str)) {
    return str
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;|&apos;/gi, "'")
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&');
  }
  return str;
}

function scopeStyleCss(cssText = '') {
  return String(cssText || '').replace(
    /(^|[},;\s])(?:html|body)(?=\s*[{,.:#>~+\[])/gi,
    '$1.rak-blog-html'
  );
}

function normalizeFullHtmlDocument(html = '') {
  let working = String(html || '');

  // Extract any <style> blocks and scope top-level html/body selectors to .rak-blog-html
  const styleBlocks = [];
  working = working.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (_, cssContent) => {
    const scoped = scopeStyleCss(cssContent);
    if (scoped.trim()) {
      styleBlocks.push(`<style>${scoped}</style>`);
    }
    return '';
  });

  // Preserve external font/stylesheet <link> tags if someone pasted a full HTML head
  const fontLinks = [];
  const headMatch = working.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i);
  if (headMatch) {
    const linkMatches = headMatch[1].match(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi);
    if (linkMatches) {
      fontLinks.push(...linkMatches);
    }
  }

  // If a <body> tag exists, extract its inner content
  const bodyMatch = working.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    working = bodyMatch[1];
  } else {
    // Strip outer document wrapper tags if present
    working = working
      .replace(/<!doctype[^>]*>/gi, '')
      .replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, '')
      .replace(/<\/?(?:html|head|body)\b[^>]*>/gi, '');
  }

  return [...fontLinks, ...styleBlocks, working.trim()].join('\n');
}

function formatInlineMarkdownPreservingHtml(text = '') {
  return String(text || '')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

function convertMarkdownToHtml(raw = '') {
  const blocks = String(raw || '')
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/);

  return blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';

      // If this individual block is already a block-level HTML element, keep it as-is
      if (BLOCK_HTML_REGEX.test(trimmed)) {
        return trimmed;
      }

      if (trimmed.startsWith('#### ')) {
        return `<h4>${formatInlineMarkdownPreservingHtml(trimmed.slice(5))}</h4>`;
      }
      if (trimmed.startsWith('### ')) {
        return `<h3>${formatInlineMarkdownPreservingHtml(trimmed.slice(4))}</h3>`;
      }
      if (trimmed.startsWith('## ')) {
        return `<h2>${formatInlineMarkdownPreservingHtml(trimmed.slice(3))}</h2>`;
      }
      if (trimmed.startsWith('# ')) {
        return `<h1>${formatInlineMarkdownPreservingHtml(trimmed.slice(2))}</h1>`;
      }

      const lines = trimmed.split('\n');
      const isBulletList = lines.every((l) => /^[-*]\s+/.test(l.trim()));
      if (isBulletList) {
        const items = lines
          .map((l) => `<li>${formatInlineMarkdownPreservingHtml(l.trim().replace(/^[-*]\s+/, ''))}</li>`)
          .join('');
        return `<ul>${items}</ul>`;
      }

      const isNumberedList = lines.every((l) => /^\d+\.\s+/.test(l.trim()));
      if (isNumberedList) {
        const items = lines
          .map((l) => `<li>${formatInlineMarkdownPreservingHtml(l.trim().replace(/^\d+\.\s+/, ''))}</li>`)
          .join('');
        return `<ol>${items}</ol>`;
      }

      if (trimmed.startsWith('> ')) {
        const quoteBody = lines
          .map((l) => formatInlineMarkdownPreservingHtml(l.trim().replace(/^>\s?/, '')))
          .join('<br/>');
        return `<blockquote>${quoteBody}</blockquote>`;
      }

      const paragraphHtml = lines
        .map((line) => formatInlineMarkdownPreservingHtml(line))
        .join('<br/>');
      return `<p>${paragraphHtml}</p>`;
    })
    .filter(Boolean)
    .join('\n');
}

export function isLikelyHtmlContent(raw = '', contentFormat = '') {
  if (contentFormat === 'html') return true;
  const unwrapped = decodeEntitiesIfEscapedHtml(unwrapMarkdownCodeFence(raw));
  return BLOCK_HTML_REGEX.test(unwrapped);
}

export function prepareBlogHtml(rawContent = '', contentFormat = '') {
  if (!rawContent) return '';
  const unwrapped = unwrapMarkdownCodeFence(rawContent);
  const decoded = decodeEntitiesIfEscapedHtml(unwrapped);

  if (contentFormat === 'html' || BLOCK_HTML_REGEX.test(decoded)) {
    const normalized = normalizeFullHtmlDocument(decoded);
    // If the user selected HTML mode but typed plain text without any HTML tags, still convert line breaks cleanly
    if (!ANY_HTML_TAG_REGEX.test(normalized)) {
      return convertMarkdownToHtml(normalized);
    }
    return normalized;
  }

  return convertMarkdownToHtml(decoded);
}

export function BlogContentRenderer({ content = '', contentFormat = '', className = '' }) {
  const html = useMemo(() => prepareBlogHtml(content, contentFormat), [content, contentFormat]);

  if (!html) return null;

  return (
    <div
      className={`rak-blog-html max-w-none text-slate-800 dark:text-rak-slate-200 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default BlogContentRenderer;
