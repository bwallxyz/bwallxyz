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