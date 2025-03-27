// pages/404.js
import Link from 'next/link';
import Layout from '../components/Layout';

export default function Custom404() {
  return (
    <Layout title="Page Not Found">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
        <p className="text-gray-600 max-w-md mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Return Home
          </Link>
          <Link href="/blog" className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50">
            Browse Blog
          </Link>
          <Link href="/wiki" className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50">
            Browse Wiki
          </Link>
        </div>
      </div>
    </Layout>
  );
}

// pages/500.js
import Link from 'next/link';
import Layout from '../components/Layout';

export default function Custom500() {
  return (
    <Layout title="Server Error">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Server Error</h2>
        <p className="text-gray-600 max-w-md mb-8">
          Something went wrong on our servers. We're working to fix the issue.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Return Home
          </Link>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Try Again
          </button>
        </div>
      </div>
    </Layout>
  );
}

// styles/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

.prose pre {
  @apply bg-gray-800 text-white p-4 rounded-md overflow-x-auto;
}

.prose code {
  @apply text-gray-800 bg-gray-100 px-1 py-0.5 rounded;
}

.prose pre code {
  @apply text-white bg-transparent p-0;
}

.prose h1 {
  @apply text-3xl font-bold mt-8 mb-4;
}

.prose h2 {
  @apply text-2xl font-semibold mt-8 mb-4;
}

.prose h3 {
  @apply text-xl font-semibold mt-6 mb-3;
}

.prose p {
  @apply mb-4;
}

.prose ul {
  @apply list-disc pl-6 mb-4;
}

.prose ol {
  @apply list-decimal pl-6 mb-4;
}

.prose blockquote {
  @apply border-l-4 border-gray-300 pl-4 italic;
}

.prose a {
  @apply text-indigo-600 hover:text-indigo-800 font-medium;
}

.prose img {
  @apply rounded-lg my-6;
}

.prose table {
  @apply w-full border-collapse my-6;
}

.prose table th {
  @apply px-4 py-2 border border-gray-300 bg-gray-50 font-semibold;
}

.prose table td {
  @apply px-4 py-2 border border-gray-300;
}

/* Custom styles for the blog and wiki */
.tag-cloud span:hover {
  @apply bg-indigo-100 text-indigo-800 cursor-pointer;
}

/* Mobile responsiveness adjustments */
@media (max-width: 640px) {
  .prose h1 {
    @apply text-2xl;
  }
  
  .prose h2 {
    @apply text-xl;
  }
  
  .prose h3 {
    @apply text-lg;
  }
}

// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Technical Blog & Wiki Platform" />
        <meta property="og:title" content="Tech Blog & Wiki" />
        <meta property="og:description" content="Technical Blog & Wiki Platform" />
        <meta property="og:type" content="website" />
      </Head>
      <body className="bg-gray-50">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}