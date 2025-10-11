// pages/api/wiki/index.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { supabase } from "../../../lib/supabase";
import { slugify } from "../../../lib/content";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // For read operations, allow access without authentication
  if (req.method !== "GET" && (!session || session.user.role !== "admin")) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  // Get all wiki articles
  if (req.method === "GET") {
    try {
      let query = supabase
        .from('wiki_articles')
        .select(`
          *,
          author:users!author_id(name)
        `)
        .order('category', { ascending: true })
        .order('title', { ascending: true });

      // Filter by published status if not admin
      if (session?.user?.role !== "admin") {
        query = query.eq('published', true);
      }

      const { data: articles, error } = await query;

      if (error) throw error;

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
      const { data: existingArticle } = await supabase
        .from('wiki_articles')
        .select('id')
        .eq('slug', slug)
        .single();

      if (existingArticle) {
        return res.status(422).json({ message: "Article with this title already exists" });
      }

      const { data: article, error } = await supabase
        .from('wiki_articles')
        .insert([{
          title,
          slug,
          content,
          category,
          tags: tags || [],
          published: published || false,
          author_id: session.user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json(article);
    } catch (error) {
      console.error("Error creating wiki article:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}