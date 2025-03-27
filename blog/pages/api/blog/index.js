// pages/api/blog/index.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDatabase } from "../../../lib/db";
import BlogPost from "../../../models/BlogPost";
import { slugify } from "../../../lib/content";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || session.user.role !== "admin") {
    return res.status(401).json({ message: "Not authenticated" });
  }

  await connectToDatabase();

  // Get all blog posts
  if (req.method === "GET") {
    try {
      const posts = await BlogPost.find()
        .sort({ createdAt: -1 })
        .populate("author", "name")
        .lean();
      
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Create a new blog post
  if (req.method === "POST") {
    const { title, content, excerpt, tags, published } = req.body;

    if (!title || !content) {
      return res.status(422).json({ message: "Invalid input" });
    }

    try {
      const slug = slugify(title);
      
      // Check if slug already exists
      const existingPost = await BlogPost.findOne({ slug });
      if (existingPost) {
        return res.status(422).json({ message: "Post with this title already exists" });
      }

      const post = new BlogPost({
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 150) + "...",
        tags: tags || [],
        published: published || false,
        author: session.user.id,
      });

      await post.save();
      return res.status(201).json(post);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}

// pages/api/blog/[id].js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDatabase } from "../../../lib/db";
import BlogPost from "../../../models/BlogPost";
import { slugify } from "../../../lib/content";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || session.user.role !== "admin") {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { id } = req.query;

  await connectToDatabase();

  // Update a blog post
  if (req.method === "PUT") {
    const { title, content, excerpt, tags, published } = req.body;

    if (!title || !content) {
      return res.status(422).json({ message: "Invalid input" });
    }

    try {
      const slug = slugify(title);
      
      // Check if slug already exists (for another post)
      const existingPost = await BlogPost.findOne({ slug, _id: { $ne: id } });
      if (existingPost) {
        return res.status(422).json({ message: "Post with this title already exists" });
      }

      const post = await BlogPost.findByIdAndUpdate(
        id,
        {
          title,
          slug,
          content,
          excerpt: excerpt || content.substring(0, 150) + "...",
          tags: tags || [],
          published: published || false,
          updatedAt: Date.now(),
        },
        { new: true }
      );

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Delete a blog post
  if (req.method === "DELETE") {
    try {
      const post = await BlogPost.findByIdAndDelete(id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json({ message: "Post deleted" });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Get a specific blog post
  if (req.method === "GET") {
    try {
      const post = await BlogPost.findById(id)
        .populate("author", "name")
        .lean();

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}

// pages/api/wiki/index.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDatabase } from "../../../lib/db";
import WikiArticle from "../../../models/WikiArticle";
import { slugify } from "../../../lib/content";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || session.user.role !== "admin") {
    return res.status(401).json({ message: "Not authenticated" });
  }

  await connectToDatabase();

  // Get all wiki articles
  if (req.method === "GET") {
    try {
      const articles = await WikiArticle.find()
        .sort({ category: 1, title: 1 })
        .populate("author", "name")
        .lean();
      
      return res.status(200).json(articles);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Create a new wiki article
  if (req.method === "POST") {
    const { title, content, category, tags, published } = req.body;

    if (!title || !content || !category) {
      return res.status(422).json({ message: "Invalid input" });
    }

    try {
      const slug = slugify(title);
      
      // Check if slug already exists
      const existingArticle = await WikiArticle.findOne({ slug });
      if (existingArticle) {
        return res.status(422).json({ message: "Article with this title already exists" });
      }

      const article = new WikiArticle({
        title,
        slug,
        content,
        category,
        tags: tags || [],
        published: published || false,
        author: session.user.id,
      });

      await article.save();
      return res.status(201).json(article);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
}