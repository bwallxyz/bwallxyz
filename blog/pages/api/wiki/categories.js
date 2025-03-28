// pages/api/wiki/categories.js
import { connectToDatabase } from "../../../lib/db";
import WikiArticle from "../../../models/WikiArticle";

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectToDatabase();
    
    const categories = await WikiArticle.aggregate([
      { $match: { published: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    return res.status(200).json(categories.map(cat => ({
      name: cat._id,
      count: cat.count
    })));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ message: "Server error" });
  }
}