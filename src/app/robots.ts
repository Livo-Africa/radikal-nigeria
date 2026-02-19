import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admin/', '/orders/', '/lib/', '/hooks/', '/utils/'], // Add any paths you want to hide from search engines
        },
        sitemap: 'https://radikalcreatech.com/sitemap.xml',
    };
}
