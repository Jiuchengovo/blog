"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface SearchResult {
  _id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

export default function BlogSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`${API}/posts/search?q=${encodeURIComponent(query.trim())}&limit=8`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.posts || []);
          setShowResults(true);
        }
      } catch {
        // search unavailable — silently ignore
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative mb-8">
      {/* Search input with flexbox — no absolute positioning */}
      <div className="flex items-center rounded-2xl border border-[#E8E7E4] bg-white focus-within:ring-2 focus-within:ring-[#6B7D6D]/30 focus-within:border-[#6B7D6D] transition-shadow overflow-hidden">
        {/* Search icon */}
        <span className="pl-4 shrink-0 text-[#9CA3AF]">
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder="Search posts…"
          className="block w-full px-3 py-3 text-sm text-[#1F2933] placeholder:text-[#9CA3AF] bg-transparent focus:outline-none"
        />

        {/* Loading spinner */}
        {searching && (
          <span className="shrink-0 pr-3">
            <div className="size-4 border-2 border-[#D1CEC7] border-t-[#6B7D6D] rounded-full animate-spin" />
          </span>
        )}

        {/* Clear button */}
        {query && !searching && (
          <button
            onClick={handleClear}
            className="shrink-0 pr-4 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {showResults && (
        <div className="absolute inset-x-0 top-full mt-2 rounded-2xl border border-[#E8E7E4] bg-white shadow-lg overflow-hidden z-40">
          {results.length === 0 ? (
            <p className="px-5 py-8 text-sm text-center text-[#9CA3AF]">
              No posts found for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <ul className="divide-y divide-[#E8E7E4] max-h-96 overflow-y-auto">
              {results.map((post) => (
                <li key={post._id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    onClick={() => setShowResults(false)}
                    className="block px-5 py-3.5 hover:bg-[#FAFAF8] transition-colors"
                  >
                    <div className="flex items-baseline gap-3">
                      <time className="shrink-0 text-xs text-[#9CA3AF]">{post.date}</time>
                      <span className="text-sm font-medium text-[#1F2933] truncate">{post.title}</span>
                    </div>
                    {post.excerpt && (
                      <p className="mt-1 text-xs text-[#6B7280] line-clamp-1 ml-0 sm:ml-[5.5rem]">
                        {post.excerpt}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
