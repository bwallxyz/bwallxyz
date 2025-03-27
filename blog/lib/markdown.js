// lib/markdown.js
import { remark } from "remark";
import html from "remark-html";
import { serialize } from "next-mdx-remote/serialize";

export async function markdownToHtml(markdown) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export async function markdownToMdx(content) {
  return serialize(content, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
  });
}