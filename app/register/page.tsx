"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import Reveal from "@/app/components/Reveal";

function RegisterForm() {
  const { user, register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) router.replace(redirect);
  }, [user, router, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    try {
      await register(username, email, password);
      router.push(redirect);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (user) return null;

  return (
    <div className="mx-auto max-w-md px-6 pt-28 pb-20 sm:pt-32 sm:pb-24">
      <Reveal delay={100}>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1F2933] mb-3">
          Join the community
        </h1>
      </Reveal>
      <Reveal delay={200}>
        <p className="text-[#6B7280] mb-10">
          Create an account to comment on posts and join the conversation.
        </p>
      </Reveal>

      <Reveal delay={300}>
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#E8E7E4] bg-[#FAFAF8] p-8 shadow-sm space-y-5"
        >
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <label className="block">
            <span className="text-sm font-medium text-[#1F2933]">Username</span>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="yourname"
              className="mt-1.5 block w-full rounded-xl border border-[#E8E7E4] bg-white px-4 py-2.5 text-sm text-[#1F2933] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6B7D6D]/30 focus:border-[#6B7D6D] transition-shadow"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#1F2933]">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1.5 block w-full rounded-xl border border-[#E8E7E4] bg-white px-4 py-2.5 text-sm text-[#1F2933] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6B7D6D]/30 focus:border-[#6B7D6D] transition-shadow"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#1F2933]">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="mt-1.5 block w-full rounded-xl border border-[#E8E7E4] bg-white px-4 py-2.5 text-sm text-[#1F2933] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6B7D6D]/30 focus:border-[#6B7D6D] transition-shadow"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[#6B7D6D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5C6E5E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "Creating account…" : "Create account"}
          </button>

          <p className="text-center text-sm text-[#6B7280]">
            Already have an account?{" "}
            <Link
              href={`/login${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
              className="font-medium text-[#6B7D6D] hover:text-[#5C6E5E] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </form>
      </Reveal>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
