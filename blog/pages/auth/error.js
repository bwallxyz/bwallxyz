// pages/auth/error.js
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;

  // Map error codes to user-friendly messages
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'CredentialsSignin':
        return 'Invalid email or password. Please try again.';
      case 'EmailSignin':
        return 'Error sending the email. Please try again.';
      case 'CallbackRouteError':
        return 'There was a problem with the authentication callback. Please try again.';
      case 'OAuthSignin':
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
      case 'OAuthAccountNotLinked':
        return 'There was a problem with the OAuth authentication. Please try again.';
      case 'EmailCreateAccount':
        return 'There was a problem creating your account. Please try again.';
      case 'Callback':
        return 'There was a problem with the authentication callback. Please try again.';
      case 'SessionRequired':
        return 'You need to be signed in to access this page.';
      default:
        return 'An unknown error occurred during authentication. Please try again.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error: {getErrorMessage(error)}</p>
          <p className="mt-2">Error code: {error}</p>
        </div>
        <div className="flex flex-col space-y-4">
          <Link href="/auth/login" 
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Back to login
          </Link>
          <Link href="/"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Go to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}