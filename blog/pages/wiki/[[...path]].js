// pages/wiki/[[...path]].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Link from 'next/link';
import WikiSidebar from '../../components/WikiSidebar';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import { format } from 'date-fns';
import { 
  getAllWikiArticles, 
  getWikiArticleBySlug, 
  getWikiCategories,
  markdownToMdx 
} from '../../lib/content';

export default function WikiPage({ 
  initialArticles, 
  initialCategories, 
  article, 
  mdxContent,
  categoryName
}) {
  const router = useRouter();
  
  // If router is not ready yet or fallback is rendering
  if (router.isFallback) {
    return (
      <Layout title="Loading...">
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  // Parse the path from the URL
  const { path } = router.query;
  
  // Determine what type of page we're rendering
  const isIndex = !path || path.length === 0;
  const isCategory = path && path.length === 2 && path[0] === 'category';
  const isArticle = path && path.length === 1 && path[0] !== 'category';
  
  const currentCategory = isCategory ? path[1] : categoryName;
  
  // If rendering a single article
  if (isArticle || article) {
    return <WikiArticlePage article={article} mdxContent={mdxContent} slug={path && path[0]} />;
  }
  
  // If rendering a category page
  if (isCategory) {
    return <WikiCategoryPage 
      initialArticles={initialArticles} 
      initialCategories={initialCategories} 
      category={currentCategory} 
    />;
  }
  
  // If rendering the index page
  return <WikiIndexPage 
    initialArticles={initialArticles} 
    initialCategories={initialCategories} 
  />;
}

// Component for a single Wiki article
function WikiArticlePage({ article: initialArticle, mdxContent: initialContent, slug }) {
  const [article, setArticle] = useState(initialArticle);
  const [content, setContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(!initialArticle);
  const [error, setError] = useState(null);
  
  // Fetch article client-side if not available from props
  useEffect(() => {
    if (!initialArticle && slug) {
      async function fetchArticle() {
        try {
          const response = await fetch(`/api/wiki/${slug}`);
          if (!response.ok) {
            throw new Error('Failed to fetch article');
          }
          
          const articleData = await response.json();
          setArticle(articleData);
          
          // Convert markdown to MDX
          const mdxResponse = await fetch('/api/markdown', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ markdown: articleData.content }),
          });
          
          if (mdxResponse.ok) {
            const { mdxContent } = await mdxResponse.json();
            setContent(mdxContent);
          }
          
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching article:', error);
          setError('Failed to load wiki article. Please try again later.');
          setIsLoading(false);
        }
      }
      
      fetchArticle();
    }
  }, [initialArticle, slug]);

  if (isLoading) {
    return (
      <Layout title="Loading...">
        <div className="flex justify-center items-center h-64">
          <p>Loading article...</p>
        </div>
      </Layout>
    );
  }

  if (error || !article) {
    return (
      <Layout title="Article Not Found">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error || 'Article not found'}</p>
          </div>
          <Link href="/wiki" className="text-indigo-600 hover:text-indigo-800">
            ← Back to Wiki
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={article.title}>
      <article className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Link href="/wiki" className="text-indigo-600 hover:text-indigo-800">
            ← Back to Wiki
          </Link>
          <Link href={`/wiki/category/${article.category}`} className="text-indigo-600 hover:text-indigo-800">
            Category: {article.category}
          </Link>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
        
        <div className="flex items-center text-gray-600 mb-8">
          <span>Updated: {format(new Date(article.updatedAt), 'MMMM d, yyyy')}</span>
          {article.author && (
            <>
              <span className="mx-2">•</span>
              <span>By {article.author.name}</span>
            </>
          )}
        </div>
        
        <div className="prose prose-indigo lg:prose-lg">
          {content ? (
            <MarkdownRenderer content={content} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          )}
        </div>
        
        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
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

// Component for Wiki Category page
function WikiCategoryPage({ initialArticles, initialCategories, category }) {
  const [articles, setArticles] = useState(initialArticles || []);
  const [categories, setCategories] = useState(initialCategories || []);
  const [isLoading, setIsLoading] = useState(!initialArticles && !initialCategories);
  const [error, setError] = useState(null);

  useEffect(() => {
    if ((!initialArticles || !initialCategories) && category) {
      async function fetchData() {
        try {
          // Fetch all articles
          const articlesRes = await fetch('/api/wiki');
          if (!articlesRes.ok) {
            throw new Error('Failed to fetch articles');
          }
          const allArticles = await articlesRes.json();
          // Filter by category
          setArticles(allArticles.filter(article => 
            article.category.toLowerCase() === category.toLowerCase()));
          
          // Fetch categories
          const categoriesRes = await fetch('/api/wiki/categories');
          if (!categoriesRes.ok) {
            throw new Error('Failed to fetch categories');
          }
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        } catch (error) {
          console.error('Error fetching wiki data:', error);
          setError('Failed to load wiki category. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      }
      
      fetchData();
    }
  }, [initialArticles, initialCategories, category]);

  if (isLoading) {
    return (
      <Layout title="Loading...">
        <div className="flex justify-center items-center h-64">
          <p>Loading articles...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Error">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
          <Link href="/wiki" className="text-indigo-600 hover:text-indigo-800">
            ← Back to Wiki
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Wiki - ${category}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {category}
          </h1>
          <p className="text-gray-600">
            Browse articles in the {category} category
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-64">
            <WikiSidebar categories={categories} currentCategory={category} />
          </div>
          
          <div className="flex-1">
            {articles.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-600 mb-4">No articles found in this category.</p>
                <Link href="/wiki" className="text-indigo-600 hover:text-indigo-800">
                  Browse all articles
                </Link>
              </div>
            ) : (
              <div>
                <ul className="space-y-4">
                  {articles.map(article => (
                    <li key={article._id} className="bg-white shadow-sm rounded-lg p-4 hover:shadow-md transition-shadow">
                      <Link href={`/wiki/${article.slug}`} className="block">
                        <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600">
                          {article.title}
                        </h3>
                        {article.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {article.tags.map(tag => (
                              <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Component for Wiki Index page
function WikiIndexPage({ initialArticles, initialCategories }) {
  const [articles, setArticles] = useState(initialArticles || []);
  const [categories, setCategories] = useState(initialCategories || []);
  const [isLoading, setIsLoading] = useState(!initialArticles);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!initialArticles || !initialCategories) {
      async function fetchData() {
        try {
          // Fetch articles
          const articlesRes = await fetch('/api/wiki');
          if (!articlesRes.ok) {
            throw new Error('Failed to fetch articles');
          }
          const articlesData = await articlesRes.json();
          setArticles(articlesData);
          
          // Fetch categories
          const categoriesRes = await fetch('/api/wiki/categories');
          if (!categoriesRes.ok) {
            throw new Error('Failed to fetch categories');
          }
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        } catch (error) {
          console.error('Error fetching wiki data:', error);
          setError('Failed to load wiki. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      }
      
      fetchData();
    }
  }, [initialArticles, initialCategories]);

  // Group articles by category
  const articlesByCategory = articles.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <Layout title="Wiki">
        <div className="flex justify-center items-center h-64">
          <p>Loading wiki...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Wiki">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Wiki">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Knowledge Wiki</h1>
          <p className="text-gray-600">Browse our technical knowledge base by category</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-64">
            <WikiSidebar categories={categories} />
          </div>
          
          <div className="flex-1">
            {Object.keys(articlesByCategory).length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-600 mb-4">No articles found.</p>
              </div>
            ) : (
              Object.keys(articlesByCategory).sort().map(category => (
                <div key={category} className="mb-10">
                  <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
                    {category}
                  </h2>
                  <ul className="space-y-3">
                    {articlesByCategory[category].map(article => (
                      <li key={article._id} className="bg-white shadow-sm rounded-lg p-4 hover:shadow-md transition-shadow">
                        <Link href={`/wiki/${article.slug}`} className="block">
                          <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600">
                            {article.title}
                          </h3>
                          {article.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {article.tags.map(tag => (
                                <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  try {
    const { path } = params || { path: [] };
    
    // Helper function to serialize MongoDB documents
    const serializeMongoDoc = (doc) => {
      if (!doc) return null;
      
      const serialized = { ...doc };
      
      // Convert ObjectIds to strings
      if (serialized._id) 
        serialized._id = serialized._id.toString();
      
      // Convert Date objects to strings
      if (serialized.createdAt) 
        serialized.createdAt = serialized.createdAt.toString();
      
      if (serialized.updatedAt) 
        serialized.updatedAt = serialized.updatedAt.toString();
      
      // Handle nested author object
      if (serialized.author && typeof serialized.author === 'object') {
        serialized.author = {
          ...serialized.author,
          _id: serialized.author._id ? serialized.author._id.toString() : null
        };
      }
      
      return serialized;
    };
    
    // Handle index page
    if (!path || path.length === 0) {
      const articles = await getAllWikiArticles();
      const categories = await getWikiCategories();
      
      const serializedArticles = articles
        .filter(article => article.published)
        .map(serializeMongoDoc);
      
      return {
        props: {
          initialArticles: serializedArticles || [],
          initialCategories: categories || [],
        },
        revalidate: 3600,
      };
    }
    
    // Handle category page
    if (path.length === 2 && path[0] === 'category') {
      const allArticles = await getAllWikiArticles();
      const categories = await getWikiCategories();
      
      const categoryName = path[1];
      
      // Filter articles by category
      const articles = allArticles.filter(
        article => article.published && 
        article.category.toLowerCase() === categoryName.toLowerCase()
      );
      
      const serializedArticles = articles.map(serializeMongoDoc);
      
      return {
        props: {
          initialArticles: serializedArticles,
          initialCategories: categories,
          categoryName,
        },
        revalidate: 3600,
      };
    }
    
    // Handle single article page
    if (path.length === 1) {
      const article = await getWikiArticleBySlug(path[0]);
      
      if (!article || !article.published) {
        return {
          notFound: true,
        };
      }

      const mdxContent = await markdownToMdx(article.content);
      const serializedArticle = serializeMongoDoc(article);
      
      return {
        props: {
          article: serializedArticle,
          mdxContent,
        },
        revalidate: 3600,
      };
    }

    return {
      notFound: true,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {},
      revalidate: 60,
    };
  }
}

export async function getStaticPaths() {
  try {
    const articles = await getAllWikiArticles();
    const categories = await getWikiCategories();
    
    // Create paths for article pages
    const articlePaths = articles
      .filter(article => article.published)
      .map(article => ({
        params: { path: [article.slug] }
      }));
    
    // Create paths for category pages
    const categoryPaths = categories.map(category => ({
      params: { path: ['category', category.name] }
    }));
    
    // Include the index path
    const paths = [
      { params: { path: [] } },
      ...articlePaths,
      ...categoryPaths
    ];
    
    return {
      paths,
      fallback: true,
    };
  } catch (error) {
    console.error('Error in getStaticPaths:', error);
    return {
      paths: [],
      fallback: true,
    };
  }
}