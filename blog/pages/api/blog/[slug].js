// pages/api/blog/[slug].js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDatabase } from "../../../lib/db";
import BlogPost from "../../../models/BlogPost";
import { slugify } from "../../../lib/content";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  // For GET requests, we don't require authentication
  if (req.method !== "GET" && (!session || session.user.role !== "admin")) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { slug } = req.query;
  
  await connectToDatabase();

  // Get a specific blog post
  if (req.method === "GET") {
    try {
      // If this is a MongoDB ObjectId, find by ID
      let post;
      if (/^[0-9a-fA-F]{24}$/.test(slug)) {
        post = await BlogPost.findById(slug)
          .populate("author", "name")
          .lean();
      } else {
        // Otherwise, find by slug
        post = await BlogPost.findOne({ slug })
          .populate("author", "name")
          .lean();
      }

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Update a blog post
  if (req.method === "PUT") {
    const { title, content, excerpt, tags, published } = req.body;

    if (!title || !content) {
      return res.status(422).json({ message: "Invalid input" });
    }

    try {
      const newSlug = slugify(title);
      
      // Find the post (either by ID or slug)
      let post;
      if (/^[0-9a-fA-F]{24}$/.test(slug)) {
        post = await BlogPost.findById(slug);
      } else {
        post = await BlogPost.findOne({ slug });
      }
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Check if new slug already exists (for another post)
      if (newSlug !== post.slug) {
        const existingPost = await BlogPost.findOne({ 
          slug: newSlug, 
          _id: { $ne: post._id } 
        });
        
        if (existingPost) {
          return res.status(422).json({ message: "Post with this title already exists" });
        }
      }

      // Update the post
      post.title = title;
      post.slug = newSlug;
      post.content = content;
      post.excerpt = excerpt || content.substring(0, 150) + "...";
      post.tags = tags || [];
      post.published = published || false;
      post.updatedAt = Date.now();
      
      await post.save();
      
      return res.status(200).json(post);
    } catch (error) {
      console.error("Error updating post:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Delete a blog post
  if (req.method === "DELETE") {
    try {
      let post;
      if (/^[0-9a-fA-F]{24}$/.test(slug)) {
        post = await BlogPost.findByIdAndDelete(slug);
      } else {
        post = await BlogPost.findOneAndDelete({ slug });
      }

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json({ message: "Post deleted" });
    } catch (error) {
      console.error("Error deleting post:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}