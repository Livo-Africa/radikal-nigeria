import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://radikalcreatech.com'; // Note: Update this to the actual production URL

    // Main routes
    const routes = [
        '',
        '/services',
        '/transformations',
        '/wardrobe',
        '/testimonials',
        '/individuals',
        '/business',
        '/creators',
        '/individuals/book',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    return routes;
}
