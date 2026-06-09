import fs from "fs";
import path from "path";
import { syncPostsToGit } from "./gitSync.js";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function ensureDirectory() {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }
}

function escapeYaml(str) {
  return str.replace(/"/g, '\\"');
}

/**
 * Write a blog post .md file to content/posts/<slug>.md
 * Frontmatter format matches what seed.js and lib/posts.ts expect.
 */
export function writePostFile(slug, { title, date, excerpt, tags, content }) {
  ensureDirectory();

  const lines = ["---"];
  lines.push(`title: "${escapeYaml(title)}"`);
  lines.push(`date: "${date}"`);
  if (excerpt) {
    lines.push(`excerpt: "${escapeYaml(excerpt)}"`);
  }
  if (tags && tags.length > 0) {
    lines.push(`tags: [${tags.map((t) => `"${t}"`).join(", ")}]`);
  }
  lines.push("---");
  lines.push("");
  lines.push(content.trim());

  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  fs.writeFileSync(filePath, lines.join("\n") + "\n", "utf8");

  // Trigger GitHub Pages rebuild (fire-and-forget)
  syncPostsToGit(slug, "update");
}

/**
 * Delete a blog post .md file from content/posts/<slug>.md
 */
export function deletePostFile(slug) {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Trigger GitHub Pages rebuild (fire-and-forget)
  syncPostsToGit(slug, "delete");
}
