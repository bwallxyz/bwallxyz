// pages/api/markdown.js
import { markdownToMdx, markdownToHtml } from "../../lib/markdown";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { markdown, format = "mdx" } = req.body;

  if (!markdown) {
    return res.status(400).json({ message: "Markdown content is required" });
  }

  try {
    let result;
    
    if (format === "html") {
      result = await markdownToHtml(markdown);
      return res.status(200).json({ htmlContent: result });
    } else {
      result = await markdownToMdx(markdown);
      return res.status(200).json({ mdxContent: result });
    }
  } catch (error) {
    console.error("Error converting markdown:", error);
    return res.status(500).json({ message: "Error converting markdown" });
  }
}