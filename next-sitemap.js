module.exports = {
  siteUrl: process.env.NEXT_SITE_URL,
  generateRobotsTxt: true,
  exclude: ['/sitemap-products.xml', '/uikit'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_SITE_URL}/sitemap-products.xml`,
    ],
  },
}