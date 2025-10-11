// pages/api/blog/published.js
import { supabase } from "../../../lib/supabase";

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:users!author_id(name)
      `)
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching published blog posts:", error);
    return res.status(500).json({ message: "Server error" });
  }
}