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
      console.error("Error fetching blog posts:", error);
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
      console.error("Error creating blog post:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}