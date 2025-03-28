// lib/content.js
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { connectToDatabase } from "./db";
import BlogPost from "../models/BlogPost";
import WikiArticle from "../models/WikiArticle";

export async function getAllBlogPosts() {
  await connectToDatabase();
  
  const posts = await BlogPost.find({ published: true })
    .sort({ createdAt: -1 })
    .populate("author", "name")
    .lean();
  
  return posts;
}

export async function getBlogPostBySlug(slug) {
  await connectToDatabase();
  
  const post = await BlogPost.findOne({ slug, published: true })
    .populate("author", "name")
    .lean();
  
  return post;
}

export async function getAllWikiArticles() {
  await connectToDatabase();
  
  const articles = await WikiArticle.find({ published: true })
    .sort({ category: 1, title: 1 })
    .populate("author", "name")
    .lean();
  
  return articles;
}

export async function getWikiArticleBySlug(slug) {
  await connectToDatabase();
  
  const article = await WikiArticle.findOne({ slug, published: true })
    .populate("author", "name")
    .lean();
  
  return article;
}

export async function getWikiCategories() {
  await connectToDatabase();
  
  const categories = await WikiArticle.aggregate([
    { $match: { published: true } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  
  return categories.map(cat => ({
    name: cat._id,
    count: cat.count
  }));
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
  const { serialize } = await import('next-mdx-remote/serialize');
  
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
  const { remark } = await import('remark');
  const html = await import('remark-html');
  
  const result = await remark().use(html).process(markdown);
  return result.toString();
}