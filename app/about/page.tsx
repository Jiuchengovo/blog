import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import type { Metadata } from "next";
import styles from "../blog/[slug]/markdown.module.css";
import Comment from "@/app/components/Comment";
import Reveal from "@/app/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about me — my background, interests, and what I'm up to.",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function rehypeAddHeadingIds() {
  const knownIds: Record<string, string> = {
    "和我聊天！": "chat",
  };
  return (tree: any) => {
    function visit(node: any) {
      if (
        node.type === "element" &&
        (node.tagName === "h2" || node.tagName === "h3")
      ) {
        if (!node.properties) node.properties = {};
        if (!node.properties.id) {
          const text =
            node.children
              ?.filter((c: any) => c.type === "text")
              .map((c: any) => c.value)
              .join("") || "";
          node.properties.id = knownIds[text] || slugify(text);
        }
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    }
    visit(tree);
  };
}

async function getAboutContent() {
  const filePath = path.join(process.cwd(), "content/about.md");
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content: rawContent } = matter(fileContents);

  const processedContent = await remark()
    .use(remarkRehype)
    .use(rehypeAddHeadingIds)
    .use(rehypeStringify)
    .process(rawContent);
  const contentHtml = String(processedContent.value);

  return {
    title: data.title ?? "About",
    content: contentHtml,
  };
}

export default async function AboutPage() {
  const about = await getAboutContent();

  return (
    <div className="min-h-screen bg-[#F5F5F3]">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <div className="flex gap-10">
          {/* Left: placeholder sidebar — balances the centered feel */}
          <aside className="w-56 shrink-0 hidden lg:block" />

          {/* Center: Content */}
          <article className="flex-1 min-w-0">
            <Reveal delay={100}>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1F2933] mb-4">
                {about?.title ?? "About"}
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-lg text-[#6B7280] mb-12">
                A bit about who I am and what I do.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="rounded-2xl border border-[#E8E7E4] bg-[#FAFAF8] p-8 sm:p-10 shadow-sm">
                {about ? (
                  <div
                    className={styles.markdown}
                    dangerouslySetInnerHTML={{ __html: about.content }}
                  />
                ) : (
                  <p className="text-[#6B7280]">Nothing here yet.</p>
                )}
              </div>
            </Reveal>

            {/* Comments */}
            <Reveal delay={400}>
              <div className="mt-10">
                <Comment />
              </div>
            </Reveal>
          </article>

          {/* Right: placeholder sidebar */}
          <aside className="w-56 shrink-0 hidden lg:block" />
        </div>
      </div>
    </div>
  );
}
