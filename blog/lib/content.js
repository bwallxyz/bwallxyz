// lib/content.js
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { connectToDatabase } from "./db";
import { serialize } from 'next-mdx-remote/serialize';
import { remark } from 'remark';
import html from 'remark-html';

// Import all models to ensure they're registered
import "../models/User";
import BlogPost from "../models/BlogPost";
import WikiArticle from "../models/WikiArticle";

// Ensure all models are registered before use
async function ensureModelsRegistered() {
  await connectToDatabase();
  // Additional initialization if needed
}

export async function getAllBlogPosts() {
  await ensureModelsRegistered();
  
  const posts = await BlogPost.find()
    .sort({ createdAt: -1 })
    .populate("author", "name")
    .lean();
  
  return posts;
}

export async function getBlogPostBySlug(slug) {
  await ensureModelsRegistered();
  
  const post = await BlogPost.findOne({ slug })
    .populate("author", "name")
    .lean();
  
  return post;
}

export async function getAllWikiArticles() {
  await ensureModelsRegistered();
  
  const articles = await WikiArticle.find()
    .sort({ category: 1, title: 1 })
    .populate("author", "name")
    .lean();
  
  return articles;
}

export async function getWikiArticleBySlug(slug) {
  await ensureModelsRegistered();
  
  const article = await WikiArticle.findOne({ slug })
    .populate("author", "name")
    .lean();
  
  return article;
}

export async function getWikiCategories() {
  await ensureModelsRegistered();
  
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