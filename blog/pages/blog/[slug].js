// pages/blog/[slug].js
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import Link from 'next/link';
import { format } from 'date-fns';
import { getAllBlogPosts, getBlogPostBySlug, markdownToMdx } from '../../lib/content';

export default function BlogPost({ post, mdxContent }) {
  // If we have server-side props, use them
  const [postData, setPostData] = useState(post);
  const [content, setContent] = useState(mdxContent);
  const [isLoading, setIsLoading] = useState(!post);
  const [error, setError] = useState(null);
  
  // If fallback is true, fetch the data client-side
  useEffect(() => {
    if (!post && typeof window !== 'undefined') {
      const { slug } = window.location.pathname.match(/\/blog\/([^\/]+)/);
      
      async function fetchPost() {
        try {
          const response = await fetch(`/api/blog/${slug}`);
          if (!response.ok) {
            throw new Error('Failed to fetch post');
          }
          
          const postData = await response.json();
          setPostData(postData);
          
          // Convert markdown to MDX
          const mdxResponse = await fetch('/api/markdown', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ markdown: postData.content }),
          });
          
          if (mdxResponse.ok) {
            const { mdxContent } = await mdxResponse.json();
            setContent(mdxContent);
          }
          
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching post:', error);
          setError('Failed to load blog post. Please try again later.');
          setIsLoading(false);
        }
      }
      
      fetchPost();
    }
  }, [post]);

  if (isLoading) {
    return (
      <Layout title="Loading...">
        <div className="flex justify-center items-center h-64">
          <p>Loading post...</p>
        </div>
      </Layout>
    );
  }

  if (error || !postData) {
    return (
      <Layout title="Post Not Found">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error || 'Post not found'}</p>
          </div>
          <Link href="/blog" className="text-indigo-600 hover:text-indigo-800">
            ← Back to Blog
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={postData.title}>
      <article className="max-w-3xl mx-auto">
        <Link href="/blog" className="text-indigo-600 hover:text-indigo-800 mb-6 inline-block">
          ← Back to Blog
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{postData.title}</h1>
        
        <div className="flex items-center text-gray-600 mb-8">
          <span>{format(new Date(postData.created_at), 'MMMM d, yyyy')}</span>
          {postData.author && (
            <>
              <span className="mx-2">•</span>
              <span>By {postData.author.name}</span>
            </>
          )}
        </div>

        {postData.cover_image && (
          <div className="mb-8">
            <img
              src={postData.cover_image}
              alt={postData.title}
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
        
        <div className="prose prose-indigo lg:prose-lg">
          {content ? (
            <MarkdownRenderer content={content} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: postData.content }} />
          )}
        </div>
        
        {postData.tags && postData.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {postData.tags.map(tag => (
                <span 
                  key={tag} 
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  try {
    const post = await getBlogPostBySlug(params.slug);

    if (!post || !post.published) {
      return {
        notFound: true,
      };
    }

    // Serialize post for Supabase
    const serializedPost = {
      ...post,
      // Ensure dates are strings
      created_at: post.created_at ? new Date(post.created_at).toISOString() : new Date().toISOString(),
      updated_at: post.updated_at ? new Date(post.updated_at).toISOString() : new Date().toISOString(),
    };

    const mdxContent = await markdownToMdx(post.content);

    return {
      props: {
        post: serializedPost,
        mdxContent,
      },
      // Revalidate the post every hour
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      notFound: true,
    };
  }
}

export async function getStaticPaths() {
  try {
    const posts = await getAllBlogPosts();
    
    // Only pre-render published posts
    const paths = posts
      .filter(post => post.published)
      .map(post => ({
        params: { slug: post.slug },
      }));
    
    return {
      paths,
      // Enable ISR for blog posts
      fallback: true,
    };
  } catch (error) {
    console.error('Error in getStaticPaths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}