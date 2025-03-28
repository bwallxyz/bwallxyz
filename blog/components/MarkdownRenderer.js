
// components/MarkdownRenderer.js
import { MDXRemote } from 'next-mdx-remote';

export default function MarkdownRenderer({ content }) {
  return (
    <div className="prose prose-indigo max-w-none">
      <MDXRemote {...content} />
    </div>
  );
}