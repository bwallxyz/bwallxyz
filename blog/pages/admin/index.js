// pages/admin/index.js
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    blogPosts: { total: 0, published: 0, draft: 0 },
    wikiArticles: { total: 0, published: 0, draft: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch blog stats
        const blogRes = await fetch('/api/blog');
        const blogPosts = await blogRes.json();
        
        // Fetch wiki stats
        const wikiRes = await fetch('/api/wiki');
        const wikiArticles = await wikiRes.json();
        
        setStats({
          blogPosts: {
            total: blogPosts.length,
            published: blogPosts.filter(post => post.published).length,
            draft: blogPosts.filter(post => !post.published).length,
          },
          wikiArticles: {
            total: wikiArticles.length,
            published: wikiArticles.filter(article => article.published).length,
            draft: wikiArticles.filter(article => !article.published).length,
          },
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setIsLoading(false);
      }
    }
    
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <p>Loading dashboard data...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Blog Posts</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm">Total</p>
              <p className="text-3xl font-bold text-gray-900">{stats.blogPosts.total}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-green-600 text-sm">Published</p>
              <p className="text-3xl font-bold text-green-700">{stats.blogPosts.published}</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-600 text-sm">Drafts</p>
              <p className="text-3xl font-bold text-yellow-700">{stats.blogPosts.draft}</p>
            </div>
          </div>
          <div className="flex justify-between">
            <Link href="/admin/blog" className="text-indigo-600 hover:text-indigo-800">
              Manage posts →
            </Link>
            <Link href="/admin/blog/new" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Add new post
            </Link>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Wiki Articles</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm">Total</p>
              <p className="text-3xl font-bold text-gray-900">{stats.wikiArticles.total}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-green-600 text-sm">Published</p>
              <p className="text-3xl font-bold text-green-700">{stats.wikiArticles.published}</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-600 text-sm">Drafts</p>
              <p className="text-3xl font-bold text-yellow-700">{stats.wikiArticles.draft}</p>
            </div>
          </div>
          <div className="flex justify-between">
            <Link href="/admin/wiki" className="text-indigo-600 hover:text-indigo-800">
              Manage articles →
            </Link>
            <Link href="/admin/wiki/new" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Add new article
            </Link>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold mb-4">Quick Start</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-3">Blog Posts</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <span className="mr-2">•</span>
                <span>Create technical articles with Markdown formatting</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                <span>Add tags to categorize and make posts discoverable</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                <span>Save as draft or publish immediately</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">Wiki Articles</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <span className="mr-2">•</span>
                <span>Create structured knowledge documentation</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                <span>Organize articles in categories for easy navigation</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                <span>Link related articles for a comprehensive knowledge base</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}