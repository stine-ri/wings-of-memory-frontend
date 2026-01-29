const fs = require('fs');
const path = require('path');

// Your routes from App.tsx
const routes = [
  { path: '', priority: 1.0, changefreq: 'weekly', lastmod: '2026-01-29' },
  { path: 'about', priority: 0.9, changefreq: 'monthly', lastmod: '2026-01-29' },
  { path: 'services', priority: 0.9, changefreq: 'monthly', lastmod: '2026-01-29' },
  { path: 'contact', priority: 0.8, changefreq: 'monthly', lastmod: '2026-01-29' },
  { path: 'pricing', priority: 0.9, changefreq: 'monthly', lastmod: '2026-01-29' },
  { path: 'how-it-works', priority: 0.8, changefreq: 'monthly', lastmod: '2026-01-29' },
  { path: 'guide', priority: 0.7, changefreq: 'monthly', lastmod: '2026-01-29' },
  { path: 'help', priority: 0.7, changefreq: 'monthly', lastmod: '2026-01-29' },
  { path: 'terms', priority: 0.5, changefreq: 'yearly', lastmod: '2026-01-29' },
  { path: 'privacy', priority: 0.5, changefreq: 'yearly', lastmod: '2026-01-29' },
  { path: 'login', priority: 0.6, changefreq: 'monthly', lastmod: '2026-01-29' },
  { path: 'register', priority: 0.6, changefreq: 'monthly', lastmod: '2026-01-29' },
];

const baseUrl = 'https://4revah.com';

const generateUrlEntry = (route) => {
  const url = route.path ? `${baseUrl}/${route.path}` : baseUrl;
  return `
  <url>
    <loc>${url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
};

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(generateUrlEntry).join('')}
</urlset>`;

// Write to public folder
fs.writeFileSync(
  path.join(__dirname, '../public/sitemap.xml'),
  sitemapContent
);

console.log('✅ Sitemap generated successfully!');
console.log(`📁 Location: ${path.join(__dirname, '../public/sitemap.xml')}`);