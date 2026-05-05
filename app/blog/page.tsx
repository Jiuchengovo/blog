import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import type { Metadata } from "next";
import Reveal from "@/app/components/Reveal";

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
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#9CA3AF] mb-4">
                All articles
              </h3>
              {posts.length === 0 ? (
                <p className="text-sm text-[#9CA3AF]">No articles yet.</p>
              ) : (
                <ul className="space-y-1.5 border-l border-[#E8E7E4]">
                  {posts.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group block pl-3 py-1"
                      >
                        <time className="text-xs text-[#9CA3AF] block leading-none mb-0.5">
                          {post.date}
                        </time>
                        <span className="text-base text-[#6B7280] group-hover:text-[#1F2933] transition-colors line-clamp-2 leading-snug">
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
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1F2933] mb-4">
              Blog
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-lg text-[#6B7280] mb-12">
              Thoughts on software, design, and building things.
            </p>
          </Reveal>

          {posts.length === 0 ? (
            <Reveal delay={300}>
              <p className="text-[#6B7280] py-12 text-center">
                No posts yet.
              </p>
            </Reveal>
          ) : (
            <ul className="divide-y divide-[#E8E7E4]">
              {posts.map((post, i) => (
                <li key={post.slug}>
                  <Reveal delay={250 + i * 80}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group block py-6 -mx-3 px-3 rounded-lg hover:bg-[#FAFAF8] transition-colors"
                    >
                      <div className="flex items-baseline gap-4 mb-1">
                        <time
                          dateTime={post.date}
                          className="shrink-0 text-sm text-[#6B7280] group-hover:text-[#1F2933] transition-colors"
                        >
                          {post.date}
                        </time>
                        <h2 className="text-[#1F2933] font-semibold">
                          {post.title}
                        </h2>
                      </div>
                      {post.excerpt && (
                        <p className="text-sm text-[#6B7280] transition-colors line-clamp-1 pl-0 sm:pl-[7.5rem]">
                          {post.excerpt}
                        </p>
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
