/**
 * Seed script: imports all Markdown posts from content/posts/ into MongoDB.
 * Run with: node server/seed.js
 *
 * Posts are upserted by slug — existing posts with the same slug are updated,
 * new posts are created. This makes it safe to run repeatedly.
 */
import "dotenv/config";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";
import connectDB from "./db.js";
import Post from "./models/Post.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDirectory = path.join(__dirname, "..", "content", "posts");

async function seed() {
  await connectDB();

  if (!fs.existsSync(postsDirectory)) {
    console.log("No content/posts directory found — nothing to seed.");
    process.exit(0);
  }

  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".md"));

  let created = 0;
  let updated = 0;

  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, file);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(raw);

    const doc = {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString().split("T")[0],
      excerpt: data.excerpt || "",
      tags: data.tags || [],
      content: content.trim(),
    };

    const existing = await Post.findOne({ slug });
    if (existing) {
      await Post.updateOne({ slug }, doc);
      updated++;
      console.log(`  ↻ updated: ${slug}`);
    } else {
      await Post.create(doc);
      created++;
      console.log(`  ✓ created: ${slug}`);
    }
  }

  console.log(`\nDone — ${created} created, ${updated} updated, ${files.length} total files processed.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
