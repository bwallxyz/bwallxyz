// components/BlogCard.js
import Link from 'next/link';
import { format } from 'date-fns';

export default function BlogCard({ post }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {post.cover_image && (
        <div className="h-48 w-full overflow-hidden">
          <img
            src={post.cover_image}
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
          <span>{format(new Date(post.created_at), 'MMMM d, yyyy')}</span>
          {post.author && (
            <span> • By {post.author.name}</span>
          )}
        </div>
        <p className="text-gray-600 mb-4">{post.excerpt}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
        <Link href={`/blog/${post.slug}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
          Read more →
        </Link>
      </div>
    </div>
  );
}