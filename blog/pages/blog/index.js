// pages/blog/index.js
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import BlogCard from '../../components/BlogCard';
import Link from 'next/link';
import { getAllBlogPosts } from '../../lib/content';

export default function BlogIndex({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts || []);
  const [isLoading, setIsLoading] = useState(!initialPosts);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!initialPosts) {
      async function fetchPosts() {
        try {
          const response = await fetch('/api/blog/published');
          if (!response.ok) {
            throw new Error('Failed to fetch posts');
          }
          const data = await response.json();
          setPosts(data);
        } catch (error) {
          console.error('Error fetching posts:', error);
          setError('Failed to load blog posts. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      }
      
      fetchPosts();
    }
  }, [initialPosts]);

  if (isLoading) {
    return (
      <Layout title="Blog">
        <div className="flex justify-center items-center h-64">
          <p>Loading posts...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Blog">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Blog">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Posts</h1>
          <p className="text-gray-600">Explore our latest articles, tutorials, and insights</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600 mb-4">No posts found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {posts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const posts = await getAllBlogPosts();

    // Filter and serialize posts for Supabase
    const serializedPosts = posts
      .filter(post => post.published)
      .map(post => ({
        ...post,
        // Ensure dates are strings
        created_at: post.created_at ? new Date(post.created_at).toISOString() : new Date().toISOString(),
        updated_at: post.updated_at ? new Date(post.updated_at).toISOString() : new Date().toISOString(),
      }));

    return {
      props: {
        initialPosts: serializedPosts || [],
      },
      // Revalidate every hour
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching posts in getStaticProps:', error);
    return {
      props: {
        initialPosts: [],
      },
      revalidate: 60,
    };
  }
}