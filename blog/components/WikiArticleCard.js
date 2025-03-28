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