import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import type { Metadata } from "next";
import Reveal from "@/app/components/Reveal";
import BlogSearch from "@/app/components/BlogSearch";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on software, design, and building things.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-7xl px-6 pt-28 pb-20 sm:pt-32 sm:pb-24">
      <div className="flex gap-10">
        {/* Left: Article directory sidebar */}
        <aside className="w-64 shrink-0 hidden lg:block">
          <Reveal delay={300}>
            <nav className="sticky top-32">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-muted mb-4">
                All articles
              </h3>
              {posts.length === 0 ? (
                <p className="text-sm text-ink-muted">No articles yet.</p>
              ) : (
                <ul className="space-y-1.5 border-l border-line">
                  {posts.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group block pl-3 py-1"
                      >
                        <time className="text-xs text-ink-muted block leading-none mb-0.5">
                          {post.date}
                        </time>
                        <span className="text-base text-ink-secondary group-hover:text-ink transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </nav>
          </Reveal>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <Reveal delay={100}>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink mb-4">
              Blog
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-lg text-ink-secondary mb-8">
              Thoughts on software, design, and building things.
            </p>
          </Reveal>

          <Reveal delay={250}>
            <BlogSearch />
          </Reveal>

          {posts.length === 0 ? (
            <Reveal delay={300}>
              <p className="text-ink-secondary py-12 text-center">
                No posts yet.
              </p>
            </Reveal>
          ) : (
            <ul className="space-y-5">
              {posts.map((post, i) => (
                <li key={post.slug}>
                  <Reveal delay={250 + i * 80}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group block rounded-2xl border border-line bg-card-alt p-8 sm:p-10 shadow-sm hover:bg-card transition-colors"
                    >
                      <div className="flex items-baseline gap-4 mb-3">
                        <time
                          dateTime={post.date}
                          className="shrink-0 text-base text-ink-secondary group-hover:text-ink transition-colors"
                        >
                          {post.date}
                        </time>
                        <h2 className="text-xl text-ink font-semibold group-hover:text-accent transition-colors">
                          {post.title}
                        </h2>
                      </div>
                      {post.excerpt && (
                        <p className="text-base text-ink-secondary transition-colors line-clamp-2 pl-0 sm:pl-[8.5rem] leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 pl-0 sm:pl-[8.5rem]">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex rounded-full bg-chip px-3 py-0.5 text-sm font-medium text-ink-secondary"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}

        </div>
      </div>
    </div>
  );
}
