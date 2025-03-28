// pages/api/blog/published.js
import { connectToDatabase } from "../../../lib/db";
import BlogPost from "../../../models/BlogPost";

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectToDatabase();
    
    const posts = await BlogPost.find({ published: true })
      .sort({ createdAt: -1 })
      .populate("author", "name")
      .lean();
    
    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching published blog posts:", error);
    return res.status(500).json({ message: "Server error" });
  }
}