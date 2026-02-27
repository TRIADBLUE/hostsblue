/**
 * Website Renderer — Pure function: (project, page, theme) → HTML string
 * Produces self-contained HTML/CSS with no JS dependencies.
 */

import type { WebsiteBlock, WebsiteTheme } from '../../shared/block-types.js';

interface RenderContext {
  theme: WebsiteTheme;
  businessName: string;
  seo?: { title?: string; description?: string; ogImage?: string };
  pages?: { slug: string; title: string; showInNav: boolean }[];
  baseUrl?: string;
  siteSlug?: string;
  settings?: {
    whiteLabel?: boolean;
    customFavicon?: string;
    customFooterText?: string;
  };
}

// ============================================================================
// MAIN RENDER FUNCTION
// ============================================================================

export function renderPage(blocks: WebsiteBlock[], ctx: RenderContext): string {
  const { theme, seo } = ctx;
  const title = seo?.title || ctx.businessName;
  const description = seo?.description || `${ctx.businessName} — powered by hostsblue`;

  const visibleBlocks = blocks.filter(b => !b.style?.hidden);

  // Collect custom-code blocks for head/body-end injection
  const headCode: string[] = [];
  const bodyEndCode: string[] = [];
  for (const b of visibleBlocks) {
    if (b.type === 'custom-code') {
      if (b.data.position === 'head') headCode.push(renderCustomCode(b.data, 'head'));
      else if (b.data.position === 'body-end') bodyEndCode.push(renderCustomCode(b.data, 'body-end'));
    }
  }

  const blocksHtml = visibleBlocks
    .filter(b => !(b.type === 'custom-code' && (b.data.position === 'head' || b.data.position === 'body-end')))
    .map(b => renderBlock(b, ctx))
    .join('\n');

  const scripts = renderScripts(ctx);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escHtml(title)}</title>
  <meta name="description" content="${escHtml(description)}">
  ${seo?.ogImage ? `<meta property="og:image" content="${escHtml(seo.ogImage)}">` : ''}
  <meta property="og:title" content="${escHtml(title)}">
  <meta property="og:description" content="${escHtml(description)}">
  ${ctx.settings?.customFavicon ? `<link rel="icon" href="${escHtml(ctx.settings.customFavicon)}">` : ''}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(theme.fontHeading)}:wght@400;600;700;800&family=${encodeURIComponent(theme.fontBody)}:wght@400;500;600&display=swap" rel="stylesheet">
  <style>${generateCSS(theme)}</style>
${headCode.join('\n')}
</head>
<body>
${blocksHtml}
${bodyEndCode.join('\n')}
${scripts}
</body>
</html>`;
}

// ============================================================================
// CSS GENERATION
// ============================================================================

function generateCSS(t: WebsiteTheme): string {
  const r = t.borderRadius || 7;
  return `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --primary:${t.primaryColor};--secondary:${t.secondaryColor};--accent:${t.accentColor};
  --bg:${t.bgColor};--text:${t.textColor};--radius:${r}px;
  --font-heading:'${t.fontHeading}',system-ui,sans-serif;
  --font-body:'${t.fontBody}',system-ui,sans-serif;
}
body{font-family:var(--font-body);color:var(--text);background:var(--bg);line-height:1.6;-webkit-font-smoothing:antialiased}
h1,h2,h3,h4{font-family:var(--font-heading);line-height:1.2;font-weight:700}
h1{font-size:clamp(2rem,5vw,3.5rem)}
h2{font-size:clamp(1.5rem,3vw,2.25rem);margin-bottom:0.5em}
h3{font-size:1.25rem}
p{margin-bottom:1em}
a{color:var(--primary);text-decoration:none}
a:hover{text-decoration:underline}
img{max-width:100%;height:auto;display:block}
.section{padding:4rem 1.5rem}
.section--sm{padding:2rem 1.5rem}
.section--xl{padding:6rem 1.5rem}
.container{max-width:1140px;margin:0 auto;width:100%}
.container--sm{max-width:720px}
.container--xl{max-width:1320px}
.container--full{max-width:100%}
.btn{display:inline-block;padding:0.75rem 1.75rem;border-radius:var(--radius);font-weight:600;font-size:0.95rem;cursor:pointer;border:none;transition:all .2s}
.btn--primary{background:var(--primary);color:#fff}
.btn--primary:hover{opacity:0.9;text-decoration:none}
.btn--secondary{background:var(--secondary);color:#fff}
.btn--secondary:hover{opacity:0.9;text-decoration:none}
.btn--outline{border:2px solid var(--primary);color:var(--primary);background:transparent}
.btn--outline:hover{background:var(--primary);color:#fff;text-decoration:none}
.text-center{text-align:center}
.text-left{text-align:left}
.grid{display:grid;gap:1.5rem}
.grid-2{grid-template-columns:repeat(2,1fr)}
.grid-3{grid-template-columns:repeat(3,1fr)}
.grid-4{grid-template-columns:repeat(4,1fr)}
.flex{display:flex;gap:1rem}
.flex-between{justify-content:space-between;align-items:center}
.flex-center{justify-content:center;align-items:center}
.card{background:#fff;border-radius:var(--radius);padding:1.5rem;box-shadow:0 1px 3px rgba(0,0,0,0.08)}
.card--bordered{border:1px solid #e5e7eb}
.card--highlighted{border:2px solid var(--primary);position:relative}
.card--highlighted::before{content:'Popular';position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--primary);color:#fff;padding:2px 12px;border-radius:99px;font-size:0.75rem;font-weight:600}
.badge{display:inline-block;padding:0.2rem 0.6rem;border-radius:99px;font-size:0.75rem;font-weight:600}
.muted{color:#6b7280}
.small{font-size:0.875rem}
@media(max-width:768px){
  .grid-2,.grid-3,.grid-4{grid-template-columns:1fr}
  .section{padding:3rem 1rem}
  .flex{flex-wrap:wrap}
  nav .nav-links{display:none}
}
`;
}

// ============================================================================
// BLOCK RENDERERS
// ============================================================================

function renderBlock(block: WebsiteBlock, ctx: RenderContext): string {
  const { type, data, style } = block;
  const sectionStyle = buildSectionStyle(style);
  const containerClass = containerClassForWidth(style?.maxWidth);

  switch (type) {
    case 'header': return renderHeader(data, ctx);
    case 'hero': return `<section class="section section--xl" ${sectionStyle}><div class="${containerClass}">${renderHero(data)}</div></section>`;
    case 'text': return `<section class="section" ${sectionStyle}><div class="${containerClass} container--sm">${data.content || ''}</div></section>`;
    case 'image': return `<section class="section" ${sectionStyle}><div class="${containerClass}">${renderImage(data)}</div></section>`;
    case 'features': return `<section class="section" ${sectionStyle}><div class="${containerClass}">${renderFeatures(data)}</div></section>`;
    case 'cta': return renderCta(data, style);
    case 'testimonials': return `<section class="section" ${sectionStyle}><div class="${containerClass}">${renderTestimonials(data)}</div></section>`;
    case 'pricing': return `<section class="section" ${sectionStyle}><div class="${containerClass}">${renderPricing(data)}</div></section>`;
    case 'faq': return `<section class="section" ${sectionStyle}><div class="${containerClass} container--sm">${renderFaq(data)}</div></section>`;
    case 'gallery': return `<section class="section" ${sectionStyle}><div class="${containerClass}">${renderGallery(data)}</div></section>`;
    case 'contact': return `<section class="section" ${sectionStyle}><div class="${containerClass}">${renderContact(data, ctx)}</div></section>`;
    case 'team': return `<section class="section" ${sectionStyle}><div class="${containerClass}">${renderTeam(data)}</div></section>`;
    case 'stats': return `<section class="section" ${sectionStyle}><div class="${containerClass}">${renderStats(data)}</div></section>`;
    case 'logo-cloud': return `<section class="section section--sm" ${sectionStyle}><div class="${containerClass}">${renderLogoCloud(data)}</div></section>`;
    case 'footer': return renderFooter(data, ctx);
    case 'custom-code': return renderCustomCode(data, 'inline');
    case 'product-grid': return `<section class="section" ${sectionStyle}><div class="${containerClass}">${renderProductGrid(data, ctx)}</div></section>`;
    case 'product-detail': return `<section class="section" ${sectionStyle}><div class="${containerClass}">${renderProductDetail(data)}</div></section>`;
    default: return `<!-- unknown block type: ${type} -->`;
  }
}

function buildSectionStyle(style?: Record<string, any>): string {
  const parts: string[] = [];
  if (style?.backgroundColor) parts.push(`background-color:${style.backgroundColor}`);
  if (style?.textColor) parts.push(`color:${style.textColor}`);
  return parts.length ? `style="${parts.join(';')}"` : '';
}

function containerClassForWidth(w?: string): string {
  switch (w) {
    case 'sm': return 'container container--sm';
    case 'xl': return 'container container--xl';
    case 'full': return 'container container--full';
    default: return 'container';
  }
}

// ---- Header ----
function renderHeader(d: any, ctx: RenderContext): string {
  const links = (d.navLinks || []).map((l: any) => `<a href="${escHtml(l.href)}" style="color:inherit;text-decoration:none;font-weight:500">${escHtml(l.label)}</a>`).join('');
  const cta = d.ctaText ? `<a href="${escHtml(d.ctaLink || '#')}" class="btn btn--primary" style="font-size:0.85rem;padding:0.5rem 1.25rem">${escHtml(d.ctaText)}</a>` : '';
  return `<header style="background:var(--primary);color:#fff;padding:1rem 1.5rem">
  <div class="container container--xl flex flex-between">
    <strong style="font-size:1.2rem;font-family:var(--font-heading)">${escHtml(d.logoText || ctx.businessName)}</strong>
    <nav class="flex nav-links" style="gap:1.5rem;align-items:center">${links}${cta}</nav>
  </div>
</header>`;
}

// ---- Hero ----
function renderHero(d: any): string {
  const align = d.alignment || 'center';
  const bgImg = d.backgroundImage ? `background-image:url('${d.backgroundImage}');background-size:cover;background-position:center;` : '';
  const overlay = d.layout === 'overlay' && d.backgroundImage ? 'background:rgba(0,0,0,0.5);padding:3rem;border-radius:var(--radius);color:#fff;' : '';

  let html = `<div style="text-align:${align};${overlay}">`;
  html += `<h1>${escHtml(d.heading || '')}</h1>`;
  if (d.subheading) html += `<p style="font-size:1.2rem;margin:1rem auto 2rem;max-width:640px;opacity:0.85">${escHtml(d.subheading)}</p>`;
  if (d.ctaText) html += `<a href="${escHtml(d.ctaLink || '#')}" class="btn btn--primary">${escHtml(d.ctaText)}</a> `;
  if (d.secondaryCtaText) html += `<a href="${escHtml(d.secondaryCtaLink || '#')}" class="btn btn--outline" style="margin-left:0.5rem">${escHtml(d.secondaryCtaText)}</a>`;
  html += `</div>`;

  if (bgImg) html = `<div style="${bgImg}padding:4rem 0">${html}</div>`;
  return html;
}

// ---- Image ----
function renderImage(d: any): string {
  const maxW = d.maxWidth === 'sm' ? '480px' : d.maxWidth === 'md' ? '640px' : d.maxWidth === 'full' ? '100%' : '800px';
  let html = `<figure style="max-width:${maxW};margin:0 auto"><img src="${escHtml(d.src || '')}" alt="${escHtml(d.alt || '')}" style="width:100%;border-radius:var(--radius)">`;
  if (d.caption) html += `<figcaption class="muted small" style="margin-top:0.5rem;text-align:center">${escHtml(d.caption)}</figcaption>`;
  html += `</figure>`;
  return html;
}

// ---- Features ----
function renderFeatures(d: any): string {
  const cols = Math.min(Math.max(d.columns || 3, 2), 4);
  let html = '';
  if (d.heading) html += `<h2 class="text-center">${escHtml(d.heading)}</h2>`;
  if (d.subheading) html += `<p class="text-center muted" style="margin-bottom:2rem">${escHtml(d.subheading)}</p>`;
  html += `<div class="grid grid-${cols}">`;
  for (const item of d.items || []) {
    html += `<div class="card card--bordered text-center" style="padding:2rem">`;
    if (item.icon) html += `<div style="font-size:2rem;margin-bottom:0.75rem;color:var(--primary)">&#9733;</div>`;
    html += `<h3>${escHtml(item.title || '')}</h3>`;
    html += `<p class="muted small" style="margin-top:0.5rem">${escHtml(item.description || '')}</p>`;
    html += `</div>`;
  }
  html += `</div>`;
  return html;
}

// ---- CTA ----
function renderCta(d: any, style?: Record<string, any>): string {
  const bg = d.backgroundColor || style?.backgroundColor || 'var(--primary)';
  const isLight = bg === '#ffffff' || bg === '#fff' || bg === 'var(--bg)';
  const textCol = isLight ? 'var(--text)' : '#fff';
  let html = `<section class="section" style="background:${bg};color:${textCol};text-align:center">`;
  html += `<div class="container container--sm">`;
  html += `<h2>${escHtml(d.heading || '')}</h2>`;
  if (d.text) html += `<p style="margin:1rem 0 2rem;opacity:0.9">${escHtml(d.text)}</p>`;
  html += `<a href="${escHtml(d.buttonLink || '#')}" class="btn" style="background:#fff;color:${bg === 'var(--primary)' ? 'var(--primary)' : bg};font-weight:600">${escHtml(d.buttonText || 'Get Started')}</a>`;
  html += `</div></section>`;
  return html;
}

// ---- Testimonials ----
function renderTestimonials(d: any): string {
  let html = '';
  if (d.heading) html += `<h2 class="text-center">${escHtml(d.heading)}</h2>`;
  html += `<div class="grid grid-${Math.min((d.items || []).length, 3)}" style="margin-top:2rem">`;
  for (const item of d.items || []) {
    html += `<div class="card card--bordered" style="padding:2rem">`;
    html += `<p style="font-style:italic;margin-bottom:1rem">"${escHtml(item.quote || '')}"</p>`;
    html += `<div><strong>${escHtml(item.name || '')}</strong>`;
    if (item.role) html += `<br><span class="muted small">${escHtml(item.role)}</span>`;
    html += `</div></div>`;
  }
  html += `</div>`;
  return html;
}

// ---- Pricing ----
function renderPricing(d: any): string {
  let html = '';
  if (d.heading) html += `<h2 class="text-center">${escHtml(d.heading)}</h2>`;
  if (d.subheading) html += `<p class="text-center muted" style="margin-bottom:2rem">${escHtml(d.subheading)}</p>`;
  const cols = Math.min((d.columns || []).length, 4);
  html += `<div class="grid grid-${cols}">`;
  for (const col of d.columns || []) {
    const cls = col.highlighted ? 'card card--highlighted' : 'card card--bordered';
    html += `<div class="${cls}" style="padding:2rem;text-align:center">`;
    html += `<h3>${escHtml(col.name || '')}</h3>`;
    html += `<div style="font-size:2.5rem;font-weight:800;margin:1rem 0;font-family:var(--font-heading)">${escHtml(col.price || '')}</div>`;
    if (col.period) html += `<p class="muted small">${escHtml(col.period)}</p>`;
    html += `<ul style="list-style:none;margin:1.5rem 0;text-align:left">`;
    for (const feat of col.features || []) {
      html += `<li style="padding:0.4rem 0;border-bottom:1px solid #f3f4f6">&#10003; ${escHtml(feat)}</li>`;
    }
    html += `</ul>`;
    if (col.ctaText) html += `<a href="#" class="btn ${col.highlighted ? 'btn--primary' : 'btn--outline'}" style="width:100%;text-align:center;display:block">${escHtml(col.ctaText)}</a>`;
    html += `</div>`;
  }
  html += `</div>`;
  return html;
}

// ---- FAQ ----
function renderFaq(d: any): string {
  let html = '';
  if (d.heading) html += `<h2 class="text-center">${escHtml(d.heading)}</h2>`;
  html += `<div style="margin-top:2rem">`;
  for (const item of d.items || []) {
    html += `<details style="border-bottom:1px solid #e5e7eb;padding:1rem 0">`;
    html += `<summary style="cursor:pointer;font-weight:600;font-size:1.05rem">${escHtml(item.question || '')}</summary>`;
    html += `<p style="margin-top:0.75rem;color:#6b7280">${escHtml(item.answer || '')}</p>`;
    html += `</details>`;
  }
  html += `</div>`;
  return html;
}

// ---- Gallery ----
function renderGallery(d: any): string {
  const cols = Math.min(Math.max(d.columns || 3, 2), 4);
  let html = '';
  if (d.heading) html += `<h2 class="text-center">${escHtml(d.heading)}</h2>`;
  html += `<div class="grid grid-${cols}" style="margin-top:1.5rem">`;
  for (const img of d.images || []) {
    html += `<img src="${escHtml(img.src || '')}" alt="${escHtml(img.alt || '')}" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:var(--radius)">`;
  }
  html += `</div>`;
  return html;
}

// ---- Contact ----
function renderContact(d: any, ctx: RenderContext): string {
  let html = '';
  if (d.heading) html += `<h2 class="text-center">${escHtml(d.heading)}</h2>`;
  html += `<div class="grid grid-2" style="margin-top:2rem">`;

  if (d.showForm) {
    const formId = `cf_${Math.random().toString(36).slice(2, 8)}`;
    html += `<div class="card card--bordered" style="padding:2rem">
      <form id="${formId}" onsubmit="return handleContactForm(event,'${formId}','${escHtml(ctx.siteSlug || '')}')">
        <div style="margin-bottom:1rem"><label style="display:block;font-weight:500;margin-bottom:0.25rem">Name</label><input type="text" name="name" required placeholder="Your name" style="width:100%;padding:0.75rem;border:1px solid #e5e7eb;border-radius:var(--radius);font-size:1rem"></div>
        <div style="margin-bottom:1rem"><label style="display:block;font-weight:500;margin-bottom:0.25rem">Email</label><input type="email" name="email" required placeholder="your@email.com" style="width:100%;padding:0.75rem;border:1px solid #e5e7eb;border-radius:var(--radius);font-size:1rem"></div>
        <div style="margin-bottom:1rem"><label style="display:block;font-weight:500;margin-bottom:0.25rem">Message</label><textarea name="message" rows="4" required placeholder="Your message..." style="width:100%;padding:0.75rem;border:1px solid #e5e7eb;border-radius:var(--radius);font-size:1rem;resize:vertical"></textarea></div>
        <button type="submit" class="btn btn--primary" style="width:100%">Send Message</button>
        <div id="${formId}_msg" style="margin-top:0.75rem;text-align:center;font-size:0.9rem"></div>
      </form>
    </div>`;
  }

  html += `<div style="padding:1rem">`;
  if (d.email) html += `<p style="margin-bottom:1rem"><strong>Email:</strong><br><a href="mailto:${escHtml(d.email)}">${escHtml(d.email)}</a></p>`;
  if (d.phone) html += `<p style="margin-bottom:1rem"><strong>Phone:</strong><br><a href="tel:${escHtml(d.phone)}">${escHtml(d.phone)}</a></p>`;
  if (d.address) html += `<p style="margin-bottom:1rem"><strong>Address:</strong><br>${escHtml(d.address)}</p>`;
  html += `</div></div>`;
  return html;
}

// ---- Team ----
function renderTeam(d: any): string {
  let html = '';
  if (d.heading) html += `<h2 class="text-center">${escHtml(d.heading)}</h2>`;
  const cols = Math.min((d.members || []).length, 4);
  html += `<div class="grid grid-${cols}" style="margin-top:2rem">`;
  for (const m of d.members || []) {
    html += `<div class="text-center">`;
    if (m.photo) html += `<img src="${escHtml(m.photo)}" alt="${escHtml(m.name || '')}" style="width:120px;height:120px;border-radius:50%;object-fit:cover;margin:0 auto 1rem">`;
    html += `<h3>${escHtml(m.name || '')}</h3>`;
    if (m.role) html += `<p class="muted small">${escHtml(m.role)}</p>`;
    if (m.bio) html += `<p class="small" style="margin-top:0.5rem">${escHtml(m.bio)}</p>`;
    html += `</div>`;
  }
  html += `</div>`;
  return html;
}

// ---- Stats ----
function renderStats(d: any): string {
  const items = d.items || [];
  const cols = Math.min(items.length, 4);
  let html = `<div class="grid grid-${cols} text-center">`;
  for (const s of items) {
    html += `<div style="padding:1.5rem">`;
    html += `<div style="font-size:2.5rem;font-weight:800;color:var(--primary);font-family:var(--font-heading)">${escHtml(s.prefix || '')}${escHtml(s.value || '')}${escHtml(s.suffix || '')}</div>`;
    html += `<div class="muted" style="margin-top:0.25rem">${escHtml(s.label || '')}</div>`;
    html += `</div>`;
  }
  html += `</div>`;
  return html;
}

// ---- Logo Cloud ----
function renderLogoCloud(d: any): string {
  let html = '';
  if (d.heading) html += `<p class="text-center muted small" style="margin-bottom:1.5rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">${escHtml(d.heading)}</p>`;
  html += `<div class="flex flex-center" style="flex-wrap:wrap;gap:2rem;opacity:0.6">`;
  for (const logo of d.logos || []) {
    const inner = `<img src="${escHtml(logo.src || '')}" alt="${escHtml(logo.alt || '')}" style="max-height:40px;width:auto">`;
    if (logo.url) {
      html += `<a href="${escHtml(logo.url)}" target="_blank" rel="noopener">${inner}</a>`;
    } else {
      html += inner;
    }
  }
  html += `</div>`;
  return html;
}

// ---- Footer ----
function renderFooter(d: any, ctx?: RenderContext): string {
  const isWhiteLabel = ctx?.settings?.whiteLabel === true;
  let html = `<footer style="background:var(--primary);color:rgba(255,255,255,0.85);padding:3rem 1.5rem">`;
  html += `<div class="container container--xl">`;
  html += `<div class="flex flex-between" style="flex-wrap:wrap;gap:2rem">`;
  html += `<div><strong style="font-size:1.1rem;color:#fff">${escHtml(d.companyName || '')}</strong></div>`;
  html += `<div class="flex" style="gap:2rem;flex-wrap:wrap">`;
  for (const group of d.links || []) {
    html += `<div class="flex" style="gap:1rem">`;
    for (const link of group || []) {
      html += `<a href="${escHtml(link.href || '#')}" style="color:rgba(255,255,255,0.7);font-size:0.9rem">${escHtml(link.label || '')}</a>`;
    }
    html += `</div>`;
  }
  html += `</div></div>`;
  if (d.copyright) html += `<p style="margin-top:2rem;font-size:0.8rem;opacity:0.5;text-align:center">${escHtml(d.copyright)}</p>`;
  if (ctx?.settings?.customFooterText) html += `<p style="margin-top:0.5rem;font-size:0.75rem;opacity:0.4;text-align:center">${escHtml(ctx.settings.customFooterText)}</p>`;
  if (!isWhiteLabel) html += `<p style="margin-top:1rem;font-size:0.7rem;opacity:0.3;text-align:center">Powered by <a href="https://hostsblue.com" style="color:rgba(255,255,255,0.5)">hostsblue</a></p>`;
  html += `</div></footer>`;
  return html;
}

// ---- Custom Code ----
function renderCustomCode(d: any, position: string): string {
  const parts: string[] = [];
  if (d.css) parts.push(`<style>${d.css}</style>`);
  if (position === 'inline' && d.html) parts.push(d.html);
  if (position === 'head' && d.html) parts.push(d.html);
  if (position === 'body-end' && d.html) parts.push(d.html);
  if (d.js) parts.push(`<script>${d.js}</script>`);
  return parts.join('\n');
}

// ---- Product Grid ----
function renderProductGrid(d: any, ctx: RenderContext): string {
  const cols = Math.min(Math.max(d.columns || 3, 2), 4);
  let html = '';
  if (d.heading) html += `<h2 class="text-center">${escHtml(d.heading)}</h2>`;
  html += `<div id="product-grid" class="grid grid-${cols}" style="margin-top:2rem"></div>`;
  // Client-side fetch for products
  if (ctx.siteSlug) {
    const catParam = d.categorySlug ? `&category=${escHtml(d.categorySlug)}` : '';
    html += `<script>
(function(){
  fetch('/api/v1/sites/${escHtml(ctx.siteSlug)}/store/products?limit=${d.maxProducts || 12}${catParam}')
  .then(function(r){return r.json()})
  .then(function(res){
    var g=document.getElementById('product-grid');if(!g||!res.data)return;
    res.data.forEach(function(p){
      var c=document.createElement('div');c.className='card card--bordered';c.style.cssText='padding:1rem;text-align:center';
      var img=p.images&&p.images[0]?'<img src="'+p.images[0]+'" alt="'+p.name+'" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:var(--radius);margin-bottom:0.75rem">':'';
      c.innerHTML=img+'<h3 style="font-size:1rem">'+p.name+'</h3>'+(${d.showPrice !== false}?'<p style="color:var(--primary);font-weight:700;margin:0.5rem 0">$'+(p.price/100).toFixed(2)+'</p>':'')+'<a href="/sites/${escHtml(ctx.siteSlug)}/store/'+p.slug+'" class="btn btn--primary" style="font-size:0.85rem;padding:0.5rem 1rem;margin-top:0.5rem">View</a>';
      g.appendChild(c);
    });
  });
})();
</script>`;
  }
  return html;
}

// ---- Product Detail ----
function renderProductDetail(d: any): string {
  if (!d.productSlug) return `<p class="text-center muted">No product selected</p>`;
  return `<div id="product-detail" class="grid grid-2" style="gap:2rem"><div style="background:#f3f4f6;aspect-ratio:1;border-radius:var(--radius)"></div><div><h2>Loading...</h2></div></div>`;
}

// ============================================================================
// SCRIPTS
// ============================================================================

function renderScripts(ctx: RenderContext): string {
  const parts: string[] = [];

  // Analytics tracking
  if (ctx.siteSlug) {
    parts.push(`<script>
(function(){
  var sid=sessionStorage.getItem('_hb_sid');
  if(!sid){sid=Math.random().toString(36).slice(2)+Date.now().toString(36);sessionStorage.setItem('_hb_sid',sid);}
  var d={slug:'${escHtml(ctx.siteSlug)}',pageSlug:location.pathname.split('/').pop()||'home',sessionId:sid,referrer:document.referrer||''};
  navigator.sendBeacon('/api/v1/analytics/collect',JSON.stringify(d));
})();
</script>`);
  }

  // Contact form handler
  if (ctx.siteSlug) {
    parts.push(`<script>
function handleContactForm(e,formId,slug){
  e.preventDefault();
  var f=document.getElementById(formId);
  var m=document.getElementById(formId+'_msg');
  var btn=f.querySelector('button[type="submit"]');
  var d={name:f.name.value,email:f.email.value,message:f.message.value};
  btn.disabled=true;btn.textContent='Sending...';
  fetch('/api/v1/sites/'+slug+'/forms',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)})
  .then(function(r){if(!r.ok)throw new Error();m.style.color='#008060';m.textContent='Message sent! We\\'ll get back to you soon.';f.reset();})
  .catch(function(){m.style.color='#dc2626';m.textContent='Something went wrong. Please try again.';})
  .finally(function(){btn.disabled=false;btn.textContent='Send Message';});
  return false;
}
</script>`);
  }

  return parts.join('\n');
}

// ============================================================================
// HELPERS
// ============================================================================

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
