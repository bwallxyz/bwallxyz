// pages/api/wiki/[slug].js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDatabase } from "../../../lib/db";
import WikiArticle from "../../../models/WikiArticle";
import { slugify } from "../../../lib/content";

export default async function handler(req, res) {
  const { slug } = req.query;
  
  // For read operations, allow access without authentication
  if (req.method === "GET") {
    await connectToDatabase();
    
    try {
      // If this is a MongoDB ObjectId, find by ID
      let article;
      if (/^[0-9a-fA-F]{24}$/.test(slug)) {
        article = await WikiArticle.findById(slug)
          .populate("author", "name")
          .lean();
      } else {
        // Otherwise, find by slug
        article = await WikiArticle.findOne({ slug })
          .populate("author", "name")
          .lean();
      }

      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      return res.status(200).json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
  
  // For write operations, require admin authentication
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || session.user.role !== "admin") {
    return res.status(401).json({ message: "Not authenticated" });
  }

  await connectToDatabase();

  // Update wiki article
  if (req.method === "PUT") {
    const { title, content, category, tags, published } = req.body;

    if (!title || !content || !category) {
      return res.status(422).json({ message: "Invalid input - all fields are required" });
    }

    try {
      const newSlug = slugify(title);
      
      // Find the article (either by ID or slug)
      let article;
      if (/^[0-9a-fA-F]{24}$/.test(slug)) {
        article = await WikiArticle.findById(slug);
      } else {
        article = await WikiArticle.findOne({ slug });
      }
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      // Check if new slug already exists (for another article)
      if (newSlug !== article.slug) {
        const existingArticle = await WikiArticle.findOne({ 
          slug: newSlug, 
          _id: { $ne: article._id } 
        });
        
        if (existingArticle) {
          return res.status(422).json({ message: "Article with this title already exists" });
        }
      }

      // Update the article
      article.title = title;
      article.slug = newSlug;
      article.content = content;
      article.category = category;
      article.tags = tags || [];
      article.published = published || false;
      article.updatedAt = Date.now();
      
      await article.save();
      
      return res.status(200).json(article);
    } catch (error) {
      console.error("Error updating article:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Delete wiki article
  if (req.method === "DELETE") {
    try {
      let article;
      if (/^[0-9a-fA-F]{24}$/.test(slug)) {
        article = await WikiArticle.findByIdAndDelete(slug);
      } else {
        article = await WikiArticle.findOneAndDelete({ slug });
      }

      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      return res.status(200).json({ message: "Article deleted" });
    } catch (error) {
      console.error("Error deleting article:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}