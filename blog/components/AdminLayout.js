// components/AdminLayout.js
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';
import Layout from './Layout';

export default function AdminLayout({ children, title = 'Admin Dashboard' }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    // Only redirect if we're not loading and either not authenticated or not an admin
    if (status !== 'loading' && (!session || session.user.role !== 'admin')) {
      console.log('Redirecting to login: Not admin or not authenticated', { session });
      router.push('/auth/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <Layout title={title}>
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }
  
  // Don't render admin content until we know the user is an admin
  if (!session || session.user.role !== 'admin') {
    return (
      <Layout title="Access Denied">
        <div className="flex justify-center items-center h-64">
          <p>Checking credentials...</p>
        </div>
      </Layout>
    );
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