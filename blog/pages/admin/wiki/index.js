// pages/admin/wiki/index.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import AdminLayout from '../../../components/AdminLayout';

export default function AdminWikiArticles() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch('/api/wiki');
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        setArticles(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError(error.message);
        setIsLoading(false);
      }
    }
    
    fetchArticles();
  }, []);

  async function deleteArticle(id) {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/wiki/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete article');
      }
      
      setArticles(articles.filter(article => article._id !== id));
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article. Please try again.');
    }
  }

  if (isLoading) {
    return (
      <AdminLayout title="Wiki Articles">
        <div className="flex justify-center items-center h-64">
          <p>Loading articles...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Wiki Articles">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
        <Link href="/admin" className="text-indigo-600 hover:text-indigo-800">
          ← Back to Dashboard
        </Link>
      </AdminLayout>
    );
  }

  // Group articles by category
  const articlesByCategory = articles.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {});

  return (
    <AdminLayout title="Wiki Articles">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">{articles.length} articles found</p>
        <Link href="/admin/wiki/new" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          Add New Article
        </Link>
      </div>
      
      {Object.keys(articlesByCategory).length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">No articles found.</p>
          <Link href="/admin/wiki/new" className="text-indigo-600 hover:text-indigo-800">
            Create your first wiki article
          </Link>
        </div>
      ) : (
        Object.keys(articlesByCategory).sort().map(category => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{category}</h2>
            <div className="bg-white overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articlesByCategory[category].map(article => (
                    <tr key={article._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{article.title}</div>
                        <div className="text-sm text-gray-500">/wiki/{article.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          article.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {article.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(article.updatedAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {article.tags.map(tag => (
                            <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/wiki/${article.slug}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                          View
                        </Link>
                        <Link href={`/admin/wiki/edit/${article._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                          Edit
                        </Link>
                        <button 
                          onClick={() => deleteArticle(article._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </AdminLayout>
  );
}