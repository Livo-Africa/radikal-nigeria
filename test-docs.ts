import { getBlogPosts } from './src/lib/google-sheets';
import { getGoogleDocContent } from './src/lib/google-docs';
import { loadEnvConfig } from '@next/env';
loadEnvConfig('./');

async function test() {
    const posts = await getBlogPosts();
    console.log('Posts:', posts.length);
    for (const post of posts) {
        if (post.published) {
            console.log('Testing Post:', post.title, 'Doc ID:', post.docId);
            const content = await getGoogleDocContent(post.docId);
            console.log('Content Output Length:', content.length);
            console.log('Content Snippet:', content.substring(0, 500));
        }
    }
}

test().catch(console.error);
