const fs = require('fs');
const path = require('path');

const SITE = 'https://www.veloza-ai.online';
const SEO_DIR = path.join(__dirname, '..', 'seo');

const m20 = JSON.parse(fs.readFileSync(path.join(SEO_DIR, 'manifest-20k.json'), 'utf8'));
const orig21 = fs
  .readdirSync(SEO_DIR)
  .filter((f) => /-([0-9]|1[0-9]|20)\.html$/.test(f))
  .sort();

const urls = [
  ...orig21.map((f) => `${SITE}/seo/${f}`),
  ...m20.map((p) => p.url)
];

const entries = urls.map(
  (u) => `  <url>\n    <loc>${u}</loc>\n    <lastmod>2026-11-14</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
);

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;
const outPath = path.join(SEO_DIR, 'sitemap-seo.xml');
fs.writeFileSync(outPath, xml, 'utf8');

console.log(`Built ${outPath}: ${urls.length} URLs (${(Buffer.byteLength(xml) / 1024 / 1024).toFixed(2)} MB)`);
