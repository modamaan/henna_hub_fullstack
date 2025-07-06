/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://hennahub.shop',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/private/'],
      },
    ],
    additionalSitemaps: [
      'https://hennahub.shop/sitemap.xml',
    ],
  },
  exclude: ['/admin/*', '/api/*', '/_next/*', '/private/*'],
  generateIndexSitemap: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
} 