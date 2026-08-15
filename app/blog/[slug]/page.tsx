import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getAllPosts, getPrevNextPosts } from "@/lib/posts";
import type { Metadata } from "next";
import styles from "./markdown.module.css";
import Comment from "@/app/components/Comment";
import Reveal from "@/app/components/Reveal";

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
  nextjs: "bg-[#e8ece5] text-[#5a6b59] dark:bg-[#26302a] dark:text-[#a5b4a3]",
  tailwindcss: "bg-[#e6eaec] text-[#4d5d64] dark:bg-[#262d31] dark:text-[#a2b1b6]",
  markdown: "bg-[#ece6e8] text-[#6b5d62] dark:bg-[#2e2933] dark:text-[#b3a7ac]",
  typescript: "bg-[#e6e8ec] text-[#4d5568] dark:bg-[#272c34] dark:text-[#a2adba]",
  react: "bg-[#e8ece6] text-[#5a6b5d] dark:bg-[#26302a] dark:text-[#a5b4a3]",
  css: "bg-[#e6e6ec] text-[#5d5d6b] dark:bg-[#292932] dark:text-[#a9a9b5]",
};

function TagBadge({ tag }: { tag: string }) {
  const colorClass =
    tagColorMap[tag.toLowerCase()] ?? "bg-chip text-ink-secondary";
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

  const { prev, next } = getPrevNextPosts(slug);
  const allPosts = getAllPosts();
  const recentPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 5);

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-7xl px-6 pt-28 sm:pt-32 pb-20 sm:pb-24">
        <div className="flex gap-10">
          {/* Left: Table of Contents */}
          <aside className="w-56 shrink-0 hidden lg:block">
            <Reveal delay={300}>
              <nav className="sticky top-32">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-ink-muted mb-3">
                  On this page
                </h4>
                {post.headings.length > 0 ? (
                  <ul className="space-y-0.5 border-l border-line">
                    {post.headings.map((h) => (
                      <li key={h.id}>
                        <a
                          href={`#${h.id}`}
                          className={`block text-base text-ink-secondary hover:text-ink transition-colors py-1 leading-snug ${
                            h.level === 3 ? "pl-4" : "pl-3"
                          }`}
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-ink-muted">No headings</p>
                )}
              </nav>
            </Reveal>
          </aside>

          {/* Center: Article */}
          <article className="flex-1 min-w-0">
            <Reveal delay={100}>
              <Link
                href="/blog"
                className="mb-8 inline-flex items-center gap-1.5 text-sm text-ink-secondary hover:text-ink transition-colors"
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
            </Reveal>

            <Reveal delay={200}>
              <div className="rounded-2xl border border-line bg-card-alt p-8 sm:p-10 shadow-sm">
                <header className="mb-12">
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-4">
                    {post.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <time dateTime={post.date} className="text-ink-secondary">
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
            </Reveal>

            {/* Comments */}
            <Reveal delay={400}>
              <div className="mt-10">
                <Comment postSlug={post.slug} />
              </div>
            </Reveal>
          </article>

          {/* Right: Other articles */}
          <aside className="w-56 shrink-0 hidden lg:block">
            <Reveal delay={300}>
              <div className="sticky top-32 space-y-8">
                {/* Prev / Next navigation */}
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-ink-muted mb-3">
                    Navigate
                  </h4>
                  <div className="space-y-2">
                    {prev ? (
                      <Link
                        href={`/blog/${prev.slug}`}
                        className="group block rounded-lg border border-line bg-card p-3 hover:border-accent transition-colors"
                      >
                        <span className="text-xs uppercase tracking-wider text-ink-muted">
                          Previous
                        </span>
                        <p className="text-base font-medium text-ink group-hover:text-accent transition-colors line-clamp-2 mt-0.5">
                          {prev.title}
                        </p>
                      </Link>
                    ) : (
                      <div className="rounded-lg border border-line bg-card p-3 opacity-50">
                        <span className="text-xs uppercase tracking-wider text-ink-muted">
                          Previous
                        </span>
                        <p className="text-base text-ink-muted mt-0.5">None</p>
                      </div>
                    )}

                    {next ? (
                      <Link
                        href={`/blog/${next.slug}`}
                        className="group block rounded-lg border border-line bg-card p-3 hover:border-accent transition-colors"
                      >
                        <span className="text-xs uppercase tracking-wider text-ink-muted">
                          Next
                        </span>
                        <p className="text-base font-medium text-ink group-hover:text-accent transition-colors line-clamp-2 mt-0.5">
                          {next.title}
                        </p>
                      </Link>
                    ) : (
                      <div className="rounded-lg border border-line bg-card p-3 opacity-50">
                        <span className="text-xs uppercase tracking-wider text-ink-muted">
                          Next
                        </span>
                        <p className="text-base text-ink-muted mt-0.5">None</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent posts */}
                {recentPosts.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-ink-muted mb-3">
                      Recent posts
                    </h4>
                    <ul className="space-y-2">
                      {recentPosts.map((rp) => (
                        <li key={rp.slug}>
                          <Link
                            href={`/blog/${rp.slug}`}
                            className="group block"
                          >
                            <time className="text-xs text-ink-muted">
                              {rp.date}
                            </time>
                            <p className="text-base text-ink-secondary group-hover:text-ink transition-colors line-clamp-2 leading-snug">
                              {rp.title}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Reveal>
          </aside>
        </div>
      </div>
    </div>
  );
}
