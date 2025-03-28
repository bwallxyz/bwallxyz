import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  // Extract session from pageProps if it exists
  const { session, ...restPageProps } = pageProps;
  
  return (
    <SessionProvider session={session}>
      <Component {...restPageProps} />
    </SessionProvider>
  );
}