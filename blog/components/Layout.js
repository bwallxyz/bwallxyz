// components/Layout.js
import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, title = 'Tech Blog & Wiki' }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Technical blog and knowledge wiki" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}

// components/Navbar.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl">TechBlog</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link href="/" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                router.pathname === '/' ? 'border-indigo-500' : 'border-transparent hover:border-gray-300'
              }`}>
                Home
              </Link>
              <Link href="/blog" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                router.pathname.startsWith('/blog') ? 'border-indigo-500' : 'border-transparent hover:border-gray-300'
              }`}>
                Blog
              </Link>
              <Link href="/wiki" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                router.pathname.startsWith('/wiki') ? 'border-indigo-500' : 'border-transparent hover:border-gray-300'
              }`}>
                Wiki
              </Link>
            </div>
          </div>
          
          <div className="hidden md:ml-6 md:flex md:items-center">
            {session ? (
              <>
                {session.user.role === 'admin' && (
                  <Link href="/admin" className="px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 mr-3">
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth/login" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700">
                Login
              </Link>
            )}
          </div>
          
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className={`block px-3 py-2 rounded-md text-base font-medium ${
              router.pathname === '/' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}>
              Home
            </Link>
            <Link href="/blog" className={`block px-3 py-2 rounded-md text-base font-medium ${
              router.pathname.startsWith('/blog') ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}>
              Blog
            </Link>
            <Link href="/wiki" className={`block px-3 py-2 rounded-md text-base font-medium ${
              router.pathname.startsWith('/wiki') ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}>
              Wiki
            </Link>
            {session ? (
              <>
                {session.user.role === 'admin' && (
                  <Link href="/admin" className={`block px-3 py-2 rounded-md text-base font-medium ${
                    router.pathname.startsWith('/admin') ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}>
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// components/Footer.js
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold">TechBlog & Wiki</h3>
            <p className="text-sm text-gray-400">Your knowledge sharing platform</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} TechBlog & Wiki. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// components/BlogCard.js
import Link from 'next/link';
import { format } from 'date-fns';

export default function BlogCard({ post }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {post.coverImage && (
        <div className="h-48 w-full overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">
          <Link href={`/blog/${post.slug}`} className="text-gray-900 hover:text-indigo-600">
            {post.title}
          </Link>
        </h2>
        <div className="text-sm text-gray-500 mb-4">
          <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
          {post.author && (
            <span> • By {post.author.name}</span>
          )}
        </div>
        <p className="text-gray-600 mb-4">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
        <Link href={`/blog/${post.slug}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
          Read more →
        </Link>
      </div>
    </div>
  );
}

// components/WikiSidebar.js
import Link from 'next/link';

export default function WikiSidebar({ categories, currentCategory }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Categories</h3>
      <ul className="space-y-2">
        <li>
          <Link href="/wiki" className={`block px-3 py-2 rounded ${
            !currentCategory ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
          }`}>
            All Articles
          </Link>
        </li>
        {categories.map(category => (
          <li key={category.name}>
            <Link href={`/wiki/category/${category.name}`} className={`block px-3 py-2 rounded ${
              currentCategory === category.name ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
            }`}>
              {category.name} <span className="text-gray-500 text-sm">({category.count})</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// components/WikiArticleCard.js
import Link from 'next/link';
import { format } from 'date-fns';

export default function WikiArticleCard({ article }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold">
            <Link href={`/wiki/${article.slug}`} className="text-gray-900 hover:text-indigo-600">
              {article.title}
            </Link>
          </h2>
          <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
            {article.category}
          </span>
        </div>
        <div className="text-sm text-gray-500 mb-4">
          <span>Updated {format(new Date(article.updatedAt), 'MMMM d, yyyy')}</span>
          {article.author && (
            <span> • By {article.author.name}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
        <Link href={`/wiki/${article.slug}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
          Read article →
        </Link>
      </div>
    </div>
  );
}

// components/MarkdownRenderer.js
import { MDXRemote } from 'next-mdx-remote';

export default function MarkdownRenderer({ content }) {
  return (
    <div className="prose prose-indigo max-w-none">
      <MDXRemote {...content} />
    </div>
  );
}

// components/AdminLayout.js
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from './Layout';

export default function AdminLayout({ children, title = 'Admin Dashboard' }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  if (status === 'loading') {
    return (
      <Layout title={title}>
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }
  
  if (!session || session.user.role !== 'admin') {
    router.push('/auth/login');
    return null;
  }
  
  return (
    <Layout title={title}>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-64 mb-8 md:mb-0 md:mr-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Admin Menu</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/admin" className={`block px-3 py-2 rounded ${
                  router.pathname === '/admin' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
                }`}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/blog" className={`block px-3 py-2 rounded ${
                  router.pathname.startsWith('/admin/blog') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
                }`}>
                  Blog Posts
                </Link>
              </li>
              <li>
                <Link href="/admin/wiki" className={`block px-3 py-2 rounded ${
                  router.pathname.startsWith('/admin/wiki') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
                }`}>
                  Wiki Articles
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">{title}</h1>
            {children}
          </div>
        </div>
      </div>
    </Layout>
  );
}