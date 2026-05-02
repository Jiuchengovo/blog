import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import type { Metadata } from "next";
import styles from "./markdown.module.css";
import Comment from "@/app/components/Comment";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

const tagColorMap: Record<string, string> = {
  nextjs: "bg-[#e8ece5] text-[#5a6b59]",
  tailwindcss: "bg-[#e6eaec] text-[#4d5d64]",
  markdown: "bg-[#ece6e8] text-[#6b5d62]",
  typescript: "bg-[#e6e8ec] text-[#4d5568]",
  react: "bg-[#e8ece6] text-[#5a6b5d]",
  css: "bg-[#e6e6ec] text-[#5d5d6b]",
};

function TagBadge({ tag }: { tag: string }) {
  const colorClass =
    tagColorMap[tag.toLowerCase()] ?? "bg-[#e8e8e6] text-[#6B7280]";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium ${colorClass}`}
    >
      #{tag}
    </span>
  );
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-[#F5F5F3]">
      <article className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#1F2933] transition-colors"
        >
          <svg
            className="size-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 12H5m0 0l7 7m-7-7l7-7"
            />
          </svg>
          Back to all posts
        </Link>

        <div className="rounded-2xl border border-[#E8E7E4] bg-[#FAFAF8] p-8 sm:p-10 shadow-sm">
          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1F2933] mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <time dateTime={post.date} className="text-[#6B7280]">
                Published {formatDate(post.date)}
              </time>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
              )}
            </div>
          </header>

          <div
            className={styles.markdown}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      <div className="mx-auto max-w-2xl px-6 pb-16">
        <Comment />
      </div>
    </div>
  );
}
