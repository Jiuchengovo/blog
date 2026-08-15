"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import MarkdownEditor from "@/app/components/MarkdownEditor";
import Reveal from "@/app/components/Reveal";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface PostData {
  _id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
  createdAt: string;
  updatedAt: string;
}

type View = "list" | "edit";

const EMPTY_FORM = {
  slug: "",
  title: "",
  date: new Date().toISOString().split("T")[0],
  excerpt: "",
  tags: "",
  content: "",
};

export default function AdminPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState<PostData[]>([]);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [view, setView] = useState<View>("list");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PostData | null>(null);

  // ── Auth guard ──
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/admin");
    }
  }, [user, loading, router]);

  // ── Fetch posts (list, without content) ──
  const fetchPosts = useCallback(async () => {
    if (!token) return;
    setFetching(true);
    setFetchError(null);
    try {
      const res = await fetch(`${API}/posts`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err: any) {
      setFetchError(err.message || "Failed to load posts");
    } finally {
      setFetching(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchPosts();
  }, [token, fetchPosts]);

  // ── Handlers ──
  const handleNew = () => {
    setEditingSlug(null);
    setForm({
      ...EMPTY_FORM,
      date: new Date().toISOString().split("T")[0],
    });
    setSaveMsg(null);
    setView("edit");
  };

  const handleEdit = async (post: PostData) => {
    setEditingSlug(post.slug);
    // Pre-fill everything we already have, then fetch full content
    setForm({
      slug: post.slug,
      title: post.title,
      date: post.date,
      excerpt: post.excerpt || "",
      tags: (post.tags || []).join(", "),
      content: "", // loading…
    });
    setSaveMsg(null);
    setView("edit");
    setLoadingEdit(true);

    try {
      const res = await fetch(`${API}/posts/${encodeURIComponent(post.slug)}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          slug: data.post.slug,
          title: data.post.title,
          date: data.post.date,
          excerpt: data.post.excerpt || "",
          tags: (data.post.tags || []).join(", "),
          content: data.post.content || "",
        });
      }
    } catch {} finally {
      setLoadingEdit(false);
    }
  };

  const handleCancel = () => {
    setView("list");
    setEditingSlug(null);
    setSaveMsg(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !form.title.trim() || !form.slug.trim() || !form.content.trim()) return;

    setSaving(true);
    setSaveMsg(null);

    const body = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      date: form.date,
      excerpt: form.excerpt.trim(),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      content: form.content.trim(),
    };

    try {
      const method = editingSlug ? "PATCH" : "POST";
      const url = editingSlug
        ? `${API}/posts/${encodeURIComponent(editingSlug)}`
        : `${API}/posts`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
        throw new Error(err.message || `HTTP ${res.status}`);
      }

      setSaveMsg({ type: "success", text: editingSlug ? "Post updated." : "Post created." });
      fetchPosts();

      setTimeout(() => {
        setView("list");
        setEditingSlug(null);
      }, 800);
    } catch (err: any) {
      setSaveMsg({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !deleteTarget) return;

    try {
      const res = await fetch(`${API}/posts/${encodeURIComponent(deleteTarget.slug)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
        throw new Error(err.message || `HTTP ${res.status}`);
      }

      setDeleteTarget(null);
      fetchPosts();
    } catch (err: any) {
      setSaveMsg({ type: "error", text: err.message });
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 pt-32 text-center">
        <p className="text-ink-muted">Loading…</p>
      </div>
    );
  }

  if (!user) return null;

  // ── Access denied ──
  if (user.role !== "admin") {
    return (
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-20 text-center">
        <h1 className="text-3xl font-bold text-ink mb-3">Access Denied</h1>
        <p className="text-ink-secondary">
          You need admin privileges to access this page.
        </p>
      </div>
    );
  }

  // ── List view ──
  if (view === "list") {
    return (
      <div className="mx-auto max-w-7xl px-6 pt-28 pb-20 sm:pt-32 sm:pb-24">
        <Reveal delay={100}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-2">
                Admin
              </h1>
              <p className="text-ink-secondary">Manage your blog posts.</p>
            </div>
            <button
              onClick={handleNew}
              className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
            >
              + New Post
            </button>
          </div>
        </Reveal>

        <Reveal delay={200}>
          {fetchError && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-6">
              {fetchError}
              <button onClick={fetchPosts} className="ml-3 underline">Retry</button>
            </div>
          )}

          {fetching ? (
            <p className="text-ink-muted py-12 text-center">Loading posts…</p>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-line bg-card-alt p-12 text-center">
              <p className="text-ink-secondary mb-4">No posts yet.</p>
              <button
                onClick={handleNew}
                className="text-sm font-medium text-accent hover:text-accent-hover transition-colors"
              >
                Create your first post
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="rounded-2xl border border-line bg-card-alt p-8 sm:p-10 shadow-sm hover:bg-card transition-colors"
                >
                  <div className="flex items-start justify-between gap-8">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-4 mb-3">
                        <h3 className="text-xl font-semibold text-ink truncate">
                          {post.title}
                        </h3>
                        <span className="text-base text-ink-muted shrink-0 hidden sm:inline">
                          /{post.slug}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-base mb-3">
                        <time className="text-ink-secondary">{post.date}</time>
                        {post.excerpt && (
                          <>
                            <span className="text-line-soft">·</span>
                            <span className="text-ink-muted">{post.excerpt}</span>
                          </>
                        )}
                      </div>
                      {(post.tags || []).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {(post.tags || []).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex rounded-full bg-chip px-3 py-0.5 text-sm font-medium text-ink-secondary"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => handleEdit(post)}
                        className="rounded-xl border border-line-soft bg-card px-5 py-2.5 text-sm font-medium text-ink hover:bg-card-alt hover:border-line transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(post)}
                        className="rounded-xl px-3 py-2.5 text-sm text-ink-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/60 transition-colors"
                      >
                        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Reveal>

        {/* Delete confirmation modal */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="rounded-2xl border border-line bg-card shadow-xl p-8 max-w-sm mx-4">
              <h3 className="text-lg font-semibold text-ink mb-2">Delete post?</h3>
              <p className="text-sm text-ink-secondary mb-1">
                This will permanently delete <strong>{deleteTarget.title}</strong>.
              </p>
              <p className="text-xs text-ink-muted mb-6">
                The .md file and MongoDB record will both be removed.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-xl border border-line-soft px-4 py-2 text-sm font-medium text-ink-secondary hover:bg-card-alt transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Edit / New view ──
  return (
    <div className="mx-auto max-w-7xl px-6 pt-28 pb-20 sm:pt-32 sm:pb-24">
      <Reveal delay={100}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink">
            {editingSlug ? "Edit Post" : "New Post"}
          </h1>
          <button
            onClick={handleCancel}
            className="text-sm text-ink-muted hover:text-ink-secondary transition-colors"
          >
            ← Back to list
          </button>
        </div>
      </Reveal>

      <Reveal delay={200}>
        {saveMsg && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm mb-6 ${
              saveMsg.type === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {saveMsg.text}
          </div>
        )}

        {loadingEdit ? (
          <div className="rounded-2xl border border-line bg-card-alt p-12 text-center">
            <p className="text-ink-muted">Loading post content…</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Metadata fields */}
            <div className="rounded-2xl border border-line bg-card-alt p-8 sm:p-10 shadow-sm">
              <h2 className="text-lg font-semibold text-ink mb-6">Metadata</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <label className="block">
                  <span className="text-sm font-medium text-ink">Slug *</span>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    disabled={!!editingSlug}
                    placeholder="my-post-slug"
                    className={`mt-1.5 block w-full rounded-xl border border-line bg-card px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-shadow ${
                      editingSlug ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  />
                  {editingSlug && (
                    <span className="text-xs text-ink-muted mt-1">Slug cannot be changed after creation.</span>
                  )}
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-ink">Date *</span>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="mt-1.5 block w-full rounded-xl border border-line bg-card px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-shadow"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium text-ink">Title *</span>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Your post title"
                    className="mt-1.5 block w-full rounded-xl border border-line bg-card px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-shadow"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium text-ink">Excerpt</span>
                  <input
                    type="text"
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    placeholder="A short summary shown in search results and lists"
                    className="mt-1.5 block w-full rounded-xl border border-line bg-card px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-shadow"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium text-ink">Tags</span>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="nextjs, react, tutorial"
                    className="mt-1.5 block w-full rounded-xl border border-line bg-card px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-shadow"
                  />
                  <span className="text-xs text-ink-muted mt-1">
                    Comma-separated
                  </span>
                </label>
              </div>
            </div>

            {/* Content editor */}
            <div className="rounded-2xl border border-line bg-card-alt p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-ink mb-5">Content *</h2>
              <MarkdownEditor
                value={form.content}
                onChange={(v) => setForm({ ...form, content: v })}
              />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-xl border border-line-soft px-5 py-2.5 text-sm font-medium text-ink-secondary hover:bg-card-alt transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !form.title.trim() || !form.slug.trim() || !form.content.trim()}
                className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? "Saving…" : editingSlug ? "Update Post" : "Publish Post"}
              </button>
            </div>
          </form>
        )}
      </Reveal>
    </div>
  );
}
