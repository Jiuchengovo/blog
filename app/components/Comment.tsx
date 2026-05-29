"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface User {
  id: string;
  username: string;
  avatar: string;
}

interface CommentData {
  _id: string;
  postSlug: string;
  author: User;
  content: string;
  parent: string | null;
  createdAt: string;
  replies: CommentData[];
}

interface InteractionState {
  likesCount: number;
  favoritesCount: number;
  liked: boolean;
  favorited: boolean;
}

export default function Comment({ postSlug }: { postSlug: string }) {
  const auth = useAuth();

  return (
    <section className="rounded-2xl border border-[#E8E7E4] bg-[#FAFAF8] p-8 sm:p-10 shadow-sm">
      <h2 className="text-xl font-semibold tracking-tight text-[#1F2933] mb-8">
        Comments
      </h2>

      <AuthBar />
      <InteractionBar postSlug={postSlug} />
      <CommentList postSlug={postSlug} />
    </section>
  );
}

/* ── AuthBar ─────────────────────────────────── */

function AuthBar() {
  const { user, token, loading, login, register, logout } = useAuth();
  const [mode, setMode] = useState<"idle" | "login" | "register">("idle");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  if (loading) return null;

  if (user && token) {
    return (
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E8E7E4]">
        <div className="size-9 rounded-full bg-[#6B7D6D] flex items-center justify-center text-white font-bold text-sm">
          {user.avatar ? (
            <img src={user.avatar} alt="" className="size-full rounded-full object-cover" />
          ) : (
            user.username.charAt(0).toUpperCase()
          )}
        </div>
        <span className="text-sm font-medium text-[#1F2933]">{user.username}</span>
        <button
          onClick={logout}
          className="ml-auto text-xs text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
        >
          Log out
        </button>
      </div>
    );
  }

  if (mode === "idle") {
    return (
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E8E7E4]">
        <span className="text-sm text-[#6B7280]">Sign in to comment</span>
        <button
          onClick={() => setMode("login")}
          className="text-sm font-medium text-[#6B7D6D] hover:text-[#5C6E5E] transition-colors"
        >
          Log in
        </button>
        <span className="text-[#D1CEC7]">|</span>
        <button
          onClick={() => setMode("register")}
          className="text-sm text-[#6B7280] hover:text-[#1F2933] transition-colors"
        >
          Register
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
      setMode("idle");
      setEmail("");
      setPassword("");
      setUsername("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 pb-4 border-b border-[#E8E7E4]">
      <div className="flex flex-wrap gap-3">
        {mode === "register" && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="flex-1 min-w-[120px] rounded-lg border border-[#E8E7E4] bg-white px-3 py-2 text-sm text-[#1F2933] placeholder-[#9CA3AF] focus:outline-none focus:border-[#6B7D6D]"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 min-w-[160px] rounded-lg border border-[#E8E7E4] bg-white px-3 py-2 text-sm text-[#1F2933] placeholder-[#9CA3AF] focus:outline-none focus:border-[#6B7D6D]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="flex-1 min-w-[120px] rounded-lg border border-[#E8E7E4] bg-white px-3 py-2 text-sm text-[#1F2933] placeholder-[#9CA3AF] focus:outline-none focus:border-[#6B7D6D]"
        />
        <button
          type="submit"
          className="rounded-lg bg-[#6B7D6D] px-5 py-2 text-sm font-medium text-white hover:bg-[#5C6E5E] transition-colors"
        >
          {mode === "login" ? "Log in" : "Register"}
        </button>
        <button
          type="button"
          onClick={() => { setMode("idle"); setError(""); }}
          className="text-sm text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
        >
          Cancel
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </form>
  );
}

/* ── InteractionBar ──────────────────────────── */

function InteractionBar({ postSlug }: { postSlug: string }) {
  const { token } = useAuth();
  const [state, setState] = useState<InteractionState>({
    likesCount: 0, favoritesCount: 0, liked: false, favorited: false,
  });

  const fetchStatus = useCallback(async () => {
    try {
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`${API}/likes/${encodeURIComponent(postSlug)}/status`, { headers });
      if (res.ok) setState(await res.json());
    } catch {}
  }, [postSlug, token]);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const toggle = async (type: "like" | "favorite") => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/likes/${encodeURIComponent(postSlug)}/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type }),
      });
      if (res.status === 401) { localStorage.removeItem("token"); return; }
      if (res.ok) {
        const data = await res.json();
        setState((prev) => ({
          ...prev,
          ...(type === "like"
            ? { liked: data.active, likesCount: data.count }
            : { favorited: data.active, favoritesCount: data.count }),
        }));
      }
    } catch {}
  };

  return (
    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#E8E7E4]">
      <button
        onClick={() => toggle("like")}
        style={{ color: state.liked ? "#ef4444" : "#6B7280" }}
        className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        onMouseEnter={(e) => { if (!state.liked) e.currentTarget.style.color = "#f87171"; }}
        onMouseLeave={(e) => { if (!state.liked) e.currentTarget.style.color = "#6B7280"; }}
      >
        <svg style={{ width: 20, height: 20 }} fill={state.liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
        {state.likesCount}
      </button>

      <button
        onClick={() => toggle("favorite")}
        style={{ color: state.favorited ? "#f59e0b" : "#6B7280" }}
        className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        onMouseEnter={(e) => { if (!state.favorited) e.currentTarget.style.color = "#fbbf24"; }}
        onMouseLeave={(e) => { if (!state.favorited) e.currentTarget.style.color = "#6B7280"; }}
      >
        <svg style={{ width: 20, height: 20 }} fill={state.favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
        {state.favoritesCount}
      </button>
    </div>
  );
}

/* ── CommentForm ─────────────────────────────── */

function CommentForm({
  postSlug,
  replyTo,
  onCancelReply,
  onSubmitted,
}: {
  postSlug: string;
  replyTo?: { id: string; username: string } | null;
  onCancelReply?: () => void;
  onSubmitted?: () => void;
}) {
  const { user, token } = useAuth();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!user || !token) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/comments/post/${encodeURIComponent(postSlug)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: content.trim(),
          parent: replyTo?.id || null,
        }),
      });
      if (res.status === 401) {
        localStorage.removeItem("token");
        return;
      }
      if (res.ok) {
        setContent("");
        onCancelReply?.();
        onSubmitted?.();
      }
    } catch {} finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      {replyTo && (
        <div className="flex items-center gap-2 mb-2 text-sm text-[#6B7280]">
          <span>Replying to</span>
          <span className="font-medium text-[#6B7D6D]">@{replyTo.username}</span>
          <button type="button" onClick={onCancelReply} className="text-[#9CA3AF] hover:text-[#1F2933] transition-colors">
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={replyTo ? `Reply to ${replyTo.username}...` : "Write a comment..."}
        rows={3}
        className="w-full rounded-xl border border-[#E8E7E4] bg-white px-4 py-3 text-sm text-[#1F2933] placeholder-[#9CA3AF] focus:outline-none focus:border-[#6B7D6D] focus:ring-1 focus:ring-[#6B7D6D] transition-colors resize-none"
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="rounded-lg bg-[#6B7D6D] px-5 py-2 text-sm font-medium text-white hover:bg-[#5C6E5E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Posting..." : "Post comment"}
        </button>
      </div>
    </form>
  );
}

/* ── CommentList ─────────────────────────────── */

function CommentList({ postSlug }: { postSlug: string }) {
  const { token } = useAuth();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`${API}/comments/post/${encodeURIComponent(postSlug)}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch {}
  }, [postSlug]);

  useEffect(() => { fetchComments(); }, [fetchComments, refreshKey]);

  const handleSubmitted = () => setRefreshKey((k) => k + 1);

  return (
    <div>
      <CommentForm postSlug={postSlug} onSubmitted={handleSubmitted} />
      {comments.length === 0 ? (
        <p className="text-sm text-[#9CA3AF] text-center py-8">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-1">
          {comments.map((c) => (
            <CommentItem key={c._id} comment={c} postSlug={postSlug} onReplied={handleSubmitted} depth={0} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── CommentItem (recursive) ─────────────────── */

function CommentItem({
  comment,
  postSlug,
  onReplied,
  depth,
}: {
  comment: CommentData;
  postSlug: string;
  onReplied: () => void;
  depth: number;
}) {
  const { user, token } = useAuth();
  const [replying, setReplying] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!token) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}/comments/${comment._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { localStorage.removeItem("token"); return; }
      if (res.ok) onReplied();
    } catch {} finally {
      setDeleting(false);
    }
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className={`${depth > 0 ? "ml-6 pl-4 border-l-2 border-[#E8E7E4]" : ""}`}>
      <div className="group py-3">
        <div className="flex items-start gap-3">
          <div className="size-8 rounded-full bg-[#6B7D6D] flex items-center justify-center text-white font-bold text-xs shrink-0 mt-0.5">
            {comment.author.avatar ? (
              <img src={comment.author.avatar} alt="" className="size-full rounded-full object-cover" />
            ) : (
              comment.author.username.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-sm font-semibold text-[#1F2933]">{comment.author.username}</span>
              <span className="text-xs text-[#9CA3AF]">{formatDate(comment.createdAt)}</span>
            </div>
            <p className="text-sm text-[#4a5563] leading-relaxed whitespace-pre-wrap">{comment.content}</p>
            <div className="flex items-center gap-3 mt-1.5">
              {token && (
                <button
                  onClick={() => setReplying(!replying)}
                  className="text-xs text-[#9CA3AF] hover:text-[#6B7D6D] transition-colors"
                >
                  {replying ? "Cancel" : "Reply"}
                </button>
              )}
              {user && comment.author.id === user.id && (
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="text-xs text-[#9CA3AF] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  {deleting ? "..." : "Delete"}
                </button>
              )}
            </div>

            {replying && (
              <div className="mt-3">
                <CommentForm
                  postSlug={postSlug}
                  replyTo={{ id: comment._id, username: comment.author.username }}
                  onCancelReply={() => setReplying(false)}
                  onSubmitted={() => { setReplying(false); onReplied(); }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {comment.replies?.map((reply) => (
        <CommentItem key={reply._id} comment={reply} postSlug={postSlug} onReplied={onReplied} depth={depth + 1} />
      ))}
    </div>
  );
}
