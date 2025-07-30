export default function robots() {
    return {
      rules: [
        {
          userAgent: 'Googlebot',
          allow: ['/'],
          disallow: ['/admin', '/about'],
        },
        {
          userAgent: ['Applebot', 'Bingbot'],
          disallow: ['/'],
        },
      ],
      sitemap: 'https://booking.com/sitemap.xml',
    }
  }