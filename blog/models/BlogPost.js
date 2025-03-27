// models/BlogPost.js
import mongoose from "mongoose";

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    default: "",
  },
  tags: {
    type: [String],
    default: [],
  },
  published: {
    type: Boolean,
    default: false,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema);

// models/WikiArticle.js
import mongoose from "mongoose";

const WikiArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  published: {
    type: Boolean,
    default: false,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.WikiArticle || mongoose.model("WikiArticle", WikiArticleSchema);

// lib/markdown.js
import { remark } from "remark";
import html from "remark-html";
import { serialize } from "next-mdx-remote/serialize";

export async function markdownToHtml(markdown) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export async function markdownToMdx(content) {
  return serialize(content, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
  });
}

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