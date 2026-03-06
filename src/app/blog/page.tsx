import { getBlogPosts } from '@/lib/google-sheets';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/shared/Navigation';

export const revalidate = 3600; // Revalidate at most every hour

export default async function BlogPage() {
    const allPosts = await getBlogPosts();
    const publishedPosts = allPosts.filter(post => post.published);

    return (
        <div className="min-h-screen bg-primary-black text-clean-white pt-32 pb-24">
            <Navigation />
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-6">
                        Insights & <span className="text-primary-gold">Inspiration</span>
                    </h1>
                    <p className="text-light-grey/80 text-lg md:text-xl max-w-2xl mx-auto">
                        Discover the latest trends, tips, and stories from the Radikal team.
                    </p>
                </div>

                {/* Blog Grid */}
                {publishedPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {publishedPosts.map((post) => (
                            <Link href={`/blog/${post.slug}`} key={post.slug} className="group block">
                                <article className="bg-[#111111] rounded-2xl overflow-hidden border border-white/5 transition-all duration-300 hover:border-primary-gold/30 hover:shadow-[0_0_30px_rgba(238,241,14,0.1)] hover:-translate-y-1">

                                    {/* Image Container */}
                                    <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
                                        {post.featuredImage ? (
                                            <Image
                                                src={post.featuredImage}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-white/20">
                                                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Category Badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-primary-gold text-primary-black text-xs font-bold uppercase tracking-wider rounded-full">
                                                {post.category || 'Article'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Container */}
                                    <div className="p-6">
                                        <div className="text-primary-gold text-sm font-medium mb-3">
                                            {post.date}
                                        </div>
                                        <h2 className="font-playfair text-2xl font-bold mb-3 line-clamp-2 group-hover:text-primary-gold transition-colors">
                                            {post.title}
                                        </h2>

                                        <div className="flex items-center text-sm text-light-grey/60 font-medium">
                                            <span>Read Article</span>
                                            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-[#111111] rounded-2xl border border-white/5 max-w-3xl mx-auto">
                        <h3 className="font-playfair text-2xl text-light-grey mb-2">No posts yet</h3>
                        <p className="text-light-grey/60">Check back soon for our latest insights and stories.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
