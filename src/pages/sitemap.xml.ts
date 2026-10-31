import type { APIRoute } from 'astro';

// Every page in src/pages becomes a sitemap entry, except utility pages.
const pageFiles = Object.keys(import.meta.glob('./**/*.astro'));
const excluded = new Set(['/404/', '/success/', '/message-sent/']);

export const GET: APIRoute = ({ site }) => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = pageFiles
    .map((file) => file.replace(/^\.\//, '/').replace(/(index)?\.astro$/, '').replace(/\/?$/, '/'))
    .filter((path) => !excluded.has(path))
    .sort()
    .map((path) => `  <url>\n    <loc>${new URL(path, site).href}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
