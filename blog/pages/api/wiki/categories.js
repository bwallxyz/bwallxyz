// pages/api/wiki/categories.js
import { supabase } from "../../../lib/supabase";

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get all published articles with their categories
    const { data: articles, error } = await supabase
      .from('wiki_articles')
      .select('category')
      .eq('published', true);

    if (error) throw error;

    // Group by category and count
    const categoryMap = {};
    articles.forEach(article => {
      categoryMap[article.category] = (categoryMap[article.category] || 0) + 1;
    });

    // Convert to array and sort
    const categories = Object.entries(categoryMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ message: "Server error" });
  }
}