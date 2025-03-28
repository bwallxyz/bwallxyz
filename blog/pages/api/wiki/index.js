// pages/api/wiki/index.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDatabase } from "../../../lib/db";
import WikiArticle from "../../../models/WikiArticle";
import { slugify } from "../../../lib/content";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  // For read operations, allow access without authentication
  if (req.method !== "GET" && (!session || session.user.role !== "admin")) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  await connectToDatabase();

  // Get all wiki articles
  if (req.method === "GET") {
    try {
      const articles = await WikiArticle.find(session?.user?.role !== "admin" ? { published: true } : {})
        .sort({ category: 1, title: 1 })
        .populate("author", "name")
        .lean();
      
      return res.status(200).json(articles);
    } catch (error) {
      console.error("Error fetching wiki articles:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Create a new wiki article
  if (req.method === "POST") {
    const { title, content, category, tags, published } = req.body;

    if (!title || !content || !category) {
      return res.status(422).json({ message: "Invalid input - all fields are required" });
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
      console.error("Error creating wiki article:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
  
  return res.status(405).json({ message: "Method not allowed" });
}