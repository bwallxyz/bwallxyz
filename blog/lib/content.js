// lib/db.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
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
