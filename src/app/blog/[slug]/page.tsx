import { getBlogPosts } from '@/lib/google-sheets';
import { getGoogleDocContent } from '@/lib/google-docs';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export const revalidate = 3600; // Revalidate at most every hour

interface Props {
    params: { slug: string };
}

export async function generateStaticParams() {
    const posts = await getBlogPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const posts = await getBlogPosts();
    const post = posts.find((p) => p.slug === params.slug);

    if (!post) {
        return { title: 'Post Not Found' };
    }

    return {
        title: `${post.title} | Radikal Blog`,
        description: `Read ${post.title} on the Radikal blog.`,
        openGraph: {
            title: post.title,
            images: post.featuredImage ? [post.featuredImage] : [],
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const posts = await getBlogPosts();
    const post = posts.find((p) => p.slug === params.slug);

    if (!post || !post.docId) {
        notFound();
    }

    // Fetch HTML directly from the Google Doc
    const contentHtml = await getGoogleDocContent(post.docId);

    return (
        <div className="min-h-screen bg-primary-black text-clean-white pt-32 pb-24">
            <article className="max-w-3xl mx-auto px-4">
                {/* Back Link */}
                <div className="mb-8">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-light-grey/60 hover:text-primary-gold transition-colors text-sm font-medium"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to all posts
                    </Link>
                </div>

                {/* Header */}
                <header className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="px-3 py-1 bg-primary-gold text-primary-black text-xs font-bold uppercase tracking-wider rounded-full">
                            {post.category || 'Article'}
                        </span>
                        <time className="text-light-grey/60 text-sm font-medium">
                            {post.date}
                        </time>
                    </div>

                    <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                        {post.title}
                    </h1>

                    {post.featuredImage && (
                        <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden mt-8 border border-white/10">
                            <Image
                                src={post.featuredImage}
                                alt={post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}
                </header>

                {/* Content */}
                {/* The prose prose-invert classes come from @tailwindcss/typography plugin */}
                <div
                    className="prose prose-invert prose-lg max-w-none prose-headings:font-playfair prose-headings:font-bold prose-p:text-light-grey/80 prose-a:text-primary-gold hover:prose-a:text-primary-gold/80 prose-img:rounded-xl prose-img:mx-auto"
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                />

                {/* Footer */}
                <footer className="mt-16 pt-8 border-t border-white/10">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-light-grey/60 text-sm">
                            Published on {post.date} in {post.category || 'Article'}
                        </p>

                        <div className="flex gap-4">
                            {/* Share Buttons Placeholder */}
                            <button className="text-light-grey/60 hover:text-white transition-colors">
                                Share on Twitter
                            </button>
                            <button className="text-light-grey/60 hover:text-white transition-colors">
                                Share on LinkedIn
                            </button>
                        </div>
                    </div>
                </footer>
            </article>
        </div>
    );
}
