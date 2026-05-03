"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 flex justify-center transition-all duration-300 ${
        isScrolled ? "pt-4 px-5" : "pt-6 px-5"
      }`}
    >
      <nav
        className={`flex items-center justify-between w-full max-w-7xl rounded-full border transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl border-[#E8E7E4] shadow-md px-6 py-3"
            : "bg-transparent border-transparent shadow-none px-6 py-3.5"
        }`}
      >
        {/* Left: avatar + name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 hover:opacity-80 transition-opacity"
        >
          <div
            className={`rounded-full bg-[#6B7D6D] flex items-center justify-center text-white font-bold transition-all duration-300 ${
              isScrolled ? "size-8 text-xs" : "size-9 text-sm"
            }`}
          >
            A
          </div>
          <span
            className={`font-semibold text-[#1F2933] transition-all duration-300 ${
              isScrolled ? "text-sm" : "text-base"
            }`}
          >
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
                className={`relative rounded-full font-medium transition-all duration-300 ${
                  isScrolled ? "px-4 py-2 text-sm" : "px-5 py-2.5 text-base"
                } ${
                  isActive
                    ? "text-[#1F2933]"
                    : "text-[#1F2933]/60 hover:text-[#1F2933]"
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
          className={`shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[#6B7D6D] text-white hover:bg-[#5C6E5E] transition-all duration-300 ${
            isScrolled ? "px-5 py-2 text-sm" : "px-6 py-2.5 text-base"
          }`}
        >
          Let&rsquo;s Talk
          <svg
            className={`transition-all duration-300 ${
              isScrolled ? "size-3.5" : "size-4"
            }`}
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
