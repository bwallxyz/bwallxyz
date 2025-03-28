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