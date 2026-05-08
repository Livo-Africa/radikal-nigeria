import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/_next/', '/static/'],
            },
            {
                userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'CCBot', 'PerplexityBot', 'ClaudeBot', 'Applebot', 'anthropic-ai', 'Bytespider', 'cohere-ai'],
                allow: '/',
            }
        ],
        sitemap: 'https://radikalcreatech.com/sitemap.xml',
        host: 'https://radikalcreatech.com',
    };
}
