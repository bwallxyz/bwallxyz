// pages/api/wiki/[slug].js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { supabase } from "../../../lib/supabase";
import { slugify } from "../../../lib/content";

export default async function handler(req, res) {
  const { slug } = req.query;

  // For read operations, allow access without authentication
  if (req.method === "GET") {
    try {
      // Check if it's a UUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

      let query = supabase
        .from('wiki_articles')
        .select(`
          *,
          author:users!author_id(name)
        `);

      if (isUUID) {
        query = query.eq('id', slug);
      } else {
        query = query.eq('slug', slug);
      }

      const { data: article, error } = await query.single();

      if (error || !article) {
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

  // Update wiki article
  if (req.method === "PUT") {
    const { title, content, category, tags, published } = req.body;

    if (!title || !content || !category) {
      return res.status(422).json({ message: "Invalid input - all fields are required" });
    }

    try {
      const newSlug = slugify(title);

      // Find the article (either by ID or slug)
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

      let query = supabase.from('wiki_articles').select('*');
      if (isUUID) {
        query = query.eq('id', slug);
      } else {
        query = query.eq('slug', slug);
      }

      const { data: article, error: fetchError } = await query.single();

      if (fetchError || !article) {
        return res.status(404).json({ message: "Article not found" });
      }

      // Check if new slug already exists (for another article)
      if (newSlug !== article.slug) {
        const { data: existingArticle } = await supabase
          .from('wiki_articles')
          .select('id')
          .eq('slug', newSlug)
          .neq('id', article.id)
          .single();

        if (existingArticle) {
          return res.status(422).json({ message: "Article with this title already exists" });
        }
      }

      // Update the article
      const { data: updatedArticle, error: updateError } = await supabase
        .from('wiki_articles')
        .update({
          title,
          slug: newSlug,
          content,
          category,
          tags: tags || [],
          published: published || false,
        })
        .eq('id', article.id)
        .select()
        .single();

      if (updateError) throw updateError;

      return res.status(200).json(updatedArticle);
    } catch (error) {
      console.error("Error updating article:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Delete wiki article
  if (req.method === "DELETE") {
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

      let query = supabase.from('wiki_articles').delete();
      if (isUUID) {
        query = query.eq('id', slug);
      } else {
        query = query.eq('slug', slug);
      }

      const { error } = await query;

      if (error) {
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