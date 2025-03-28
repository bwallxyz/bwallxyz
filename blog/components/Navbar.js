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