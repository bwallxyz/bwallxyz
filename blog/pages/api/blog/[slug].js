// pages/api/blog/[slug].js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { supabase } from "../../../lib/supabase";
import { slugify } from "../../../lib/content";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // For GET requests, we don't require authentication
  if (req.method !== "GET" && (!session || session.user.role !== "admin")) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { slug } = req.query;

  // Get a specific blog post
  if (req.method === "GET") {
    try {
      // Check if it's a UUID (try to get by ID first, then by slug)
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          author:users!author_id(name)
        `);

      if (isUUID) {
        query = query.eq('id', slug);
      } else {
        query = query.eq('slug', slug);
      }

      const { data: post, error } = await query.single();

      if (error || !post) {
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
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

      let query = supabase.from('blog_posts').select('*');
      if (isUUID) {
        query = query.eq('id', slug);
      } else {
        query = query.eq('slug', slug);
      }

      const { data: post, error: fetchError } = await query.single();

      if (fetchError || !post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Check if new slug already exists (for another post)
      if (newSlug !== post.slug) {
        const { data: existingPost } = await supabase
          .from('blog_posts')
          .select('id')
          .eq('slug', newSlug)
          .neq('id', post.id)
          .single();

        if (existingPost) {
          return res.status(422).json({ message: "Post with this title already exists" });
        }
      }

      // Update the post
      const { data: updatedPost, error: updateError } = await supabase
        .from('blog_posts')
        .update({
          title,
          slug: newSlug,
          content,
          excerpt: excerpt || content.substring(0, 150) + "...",
          tags: tags || [],
          published: published || false,
        })
        .eq('id', post.id)
        .select()
        .single();

      if (updateError) throw updateError;

      return res.status(200).json(updatedPost);
    } catch (error) {
      console.error("Error updating post:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Delete a blog post
  if (req.method === "DELETE") {
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

      let query = supabase.from('blog_posts').delete();
      if (isUUID) {
        query = query.eq('id', slug);
      } else {
        query = query.eq('slug', slug);
      }

      const { error } = await query;

      if (error) {
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