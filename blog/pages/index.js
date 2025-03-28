// pages/index.js
import Layout from '../components/Layout';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to TechBlog & Wiki</h1>
          <p className="text-lg text-gray-600 mb-8">
            Your platform for technical content and knowledge sharing
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/blog" className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Browse Blog
            </Link>
            <Link href="/wiki" className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50">
              Explore Wiki
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Technical Blog</h2>
            <p className="text-gray-600 mb-4">
              Discover technical articles, tutorials, and insights on programming, web development, and the latest technologies.
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li>In-depth technical articles</li>
              <li>Tutorials and guides</li>
              <li>Best practices and tips</li>
            </ul>
            <Link href="/blog" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Read latest posts →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Knowledge Wiki</h2>
            <p className="text-gray-600 mb-4">
              Explore our structured knowledge base organized by categories. Find documentation, references, and technical explanations.
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li>Categorized technical documentation</li>
              <li>Reference materials</li>
              <li>Frequently asked questions</li>
            </ul>
            <Link href="/wiki" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Browse wiki articles →
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}