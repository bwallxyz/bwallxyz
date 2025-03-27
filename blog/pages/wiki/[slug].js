// pages/wiki/[slug].js
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import { format } from 'date-fns';
import { getWikiArticleBySlug, getWikiCategories, markdownToMdx } from '../../lib/content';
import WikiSidebar from '../../components/WikiSidebar';

export default function WikiArticle({ article, content, categories }) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <Layout title="Loading...">
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout title="Article Not Found">
        <div className="max-w-3xl mx-auto text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The wiki article you are looking for does not exist.</p>
          <button
            onClick={() => router.push('/wiki')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700"
          >
            Back to Wiki
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${article.title} | Wiki`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-64 order-2 md:order-1">
            <WikiSidebar categories={categories} currentCategory={article.category} />
          </div>
          
          <div className="flex-1 order-1 md:order-2">
            <article className="bg-white shadow-md rounded-lg p-8">
              <div className="mb-6">
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{article.title}</h1>
                  <span className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full mt-2 md:mt-0">
                    {article.category}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-4">
                  <span>Updated {format(new Date(article.updatedAt), 'MMMM d, yyyy')}</span>
                  {article.author && (
                    <span> • By {article.author.name}</span>
                  )}
                </div>
                
                {article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {article.tags.map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="prose prose-lg prose-indigo max-w-none">
                <MarkdownRenderer content={content} />
              </div>
            </article>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const article = await getWikiArticleBySlug(params.slug);
    const categories = await getWikiCategories();
    
    if (!article) {
      return { 
        props: { 
          article: null, 
          content: null,
          categories: JSON.parse(JSON.stringify(categories)),
        } 
      };
    }
    
    const mdxSource = await markdownToMdx(article.content);
    
    return {
      props: {
        article: JSON.parse(JSON.stringify(article)),
        content: mdxSource,
        categories: JSON.parse(JSON.stringify(categories)),
      },
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    return {
      props: {
        article: null,
        content: null,
        categories: [],
      },
    };
  }
}
