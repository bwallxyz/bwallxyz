// lib/content.js
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { supabase } from "./supabase";
import { serialize } from 'next-mdx-remote/serialize';
import { remark } from 'remark';
import html from 'remark-html';

export async function getAllBlogPosts() {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:users!author_id(name)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return posts;
}

export async function getBlogPostBySlug(slug) {
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:users!author_id(name)
    `)
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return post;
}

export async function getAllWikiArticles() {
  const { data: articles, error } = await supabase
    .from('wiki_articles')
    .select(`
      *,
      author:users!author_id(name)
    `)
    .order('category', { ascending: true })
    .order('title', { ascending: true });

  if (error) throw error;
  return articles;
}

export async function getWikiArticleBySlug(slug) {
  const { data: article, error } = await supabase
    .from('wiki_articles')
    .select(`
      *,
      author:users!author_id(name)
    `)
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return article;
}

export async function getWikiCategories() {
  const { data: articles, error } = await supabase
    .from('wiki_articles')
    .select('category')
    .eq('published', true);

  if (error) throw error;

  // Group by category and count
  const categoryMap = {};
  articles.forEach(article => {
    categoryMap[article.category] = (categoryMap[article.category] || 0) + 1;
  });

  // Convert to array and sort
  const categories = Object.entries(categoryMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return categories;
}

// Function to generate slug from title
export function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

// Function to convert markdown to MDX
export async function markdownToMdx(content) {
  // Import these dynamically only when needed to avoid server/client mismatch
  return serialize(content, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
  });
}

// Function to convert markdown to HTML
export async function markdownToHtml(markdown) {
  // Import these dynamically only when needed
  const result = await remark().use(html).process(markdown);
  return result.toString();
}