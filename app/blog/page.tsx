import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on software, design, and building things.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
      <Link
        href="/"
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
        Back to Home
      </Link>

      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1F2933] mb-4">
        Blog
      </h1>
      <p className="text-lg text-[#6B7280] mb-12">
        Thoughts on software, design, and building things.
      </p>

      {posts.length === 0 ? (
        <p className="text-[#6B7280] py-12 text-center">No posts yet.</p>
      ) : (
        <ul className="divide-y divide-[#E8E7E4]">
          {posts.map((post) => (
            <li key={post.slug}>
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
