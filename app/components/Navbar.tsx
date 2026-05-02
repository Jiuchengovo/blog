"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center pt-5 px-4">
      <nav className="flex items-center justify-between w-full max-w-7xl bg-white/80 backdrop-blur-xl border border-[#E8E7E4] shadow-sm rounded-full px-5 py-3">
        {/* Left: avatar + name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 hover:opacity-80 transition-opacity"
        >
          <div className="size-8 rounded-full bg-[#6B7D6D] flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
          <span className="font-semibold text-[#1F2933] text-sm">
            Peng Yuming&rsquo;s Home
          </span>
        </Link>

        {/* Center: nav links */}
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  isActive
                    ? "text-[#1F2933]"
                    : "text-[#6B7280] hover:text-[#1F2933]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-[#6B7D6D]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right: CTA button */}
        <Link
          href="/blog"
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[#6B7D6D] px-5 py-2 text-sm font-medium text-white hover:bg-[#5C6E5E] transition-colors"
        >
          Let&rsquo;s Talk
          <svg
            className="size-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </nav>
    </header>
  );
}
