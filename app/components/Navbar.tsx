"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isBlogPage = pathname.startsWith("/blog");
  const [isScrolled, setIsScrolled] = useState(isBlogPage);
  const { user, loading } = useAuth();

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
            ? "bg-card/95 backdrop-blur-xl border-line shadow-md px-6 py-3"
            : "bg-transparent border-transparent shadow-none px-6 py-3.5"
        }`}
      >
        {/* Left: avatar + name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 hover:opacity-80 transition-opacity"
        >
          <div
            className={`rounded-full bg-accent flex items-center justify-center text-white font-bold transition-all duration-300 ${
              isScrolled ? "size-8 text-xs" : "size-9 text-sm"
            }`}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="size-full rounded-full object-cover" />
            ) : (
              "A"
            )}
          </div>
          <span
            className={`font-semibold text-ink transition-all duration-300 ${
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
                    ? "text-ink"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-accent" />
                )}
              </Link>
            );
          })}
          {loading ? null : user?.role === "admin" ? (
            <Link
              href="/admin"
              className={`relative rounded-full font-medium transition-all duration-300 ${
                isScrolled ? "px-4 py-2 text-sm" : "px-5 py-2.5 text-base"
              } ${
                pathname === "/admin"
                  ? "text-ink"
                  : "text-ink/60 hover:text-ink"
              }`}
            >
              Admin
              {pathname === "/admin" && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-accent" />
              )}
            </Link>
          ) : null}
          {loading ? null : user ? (
            <Link
              href="/profile"
              className={`relative rounded-full font-medium transition-all duration-300 ${
                isScrolled ? "px-4 py-2 text-sm" : "px-5 py-2.5 text-base"
              } ${
                pathname === "/profile"
                  ? "text-ink"
                  : "text-ink/60 hover:text-ink"
              }`}
            >
              Profile
              {pathname === "/profile" && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-accent" />
              )}
            </Link>
          ) : (
            <Link
              href="/login"
              className={`relative rounded-full font-medium transition-all duration-300 ${
                isScrolled ? "px-4 py-2 text-sm" : "px-5 py-2.5 text-base"
              } ${
                pathname === "/login"
                  ? "text-ink"
                  : "text-ink/60 hover:text-ink"
              }`}
            >
              Sign in
              {pathname === "/login" && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-accent" />
              )}
            </Link>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
