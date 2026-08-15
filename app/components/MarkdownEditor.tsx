"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "@/app/blog/[slug]/markdown.module.css";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: Props) {
  const [tab, setTab] = useState<"write" | "preview">("write");

  return (
    <div className="rounded-xl border border-line overflow-hidden">
      {/* Tab bar — mobile toggle + desktop labels */}
      <div className="flex border-b border-line bg-card-alt">
        <button
          type="button"
          onClick={() => setTab("write")}
          className={`flex-1 lg:flex-none lg:px-6 py-2.5 text-sm font-medium transition-colors ${
            tab === "write"
              ? "text-ink border-b-2 border-accent lg:border-b-0 lg:bg-card"
              : "text-ink-muted hover:text-ink-secondary"
          }`}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={`flex-1 lg:flex-none lg:px-6 py-2.5 text-sm font-medium transition-colors ${
            tab === "preview"
              ? "text-ink border-b-2 border-accent lg:border-b-0 lg:bg-card-alt"
              : "text-ink-muted hover:text-ink-secondary"
          }`}
        >
          Preview
        </button>
        {/* desktop-only hint for the inactive pane */}
        <span className="hidden lg:block flex-1" />
      </div>

      {/* Desktop: side-by-side; Mobile: tabbed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-0 h-[70vh] lg:h-[650px] overflow-hidden bg-card">
        {/* Editor pane */}
        <div className={`${tab === "write" ? "overflow-y-auto" : "hidden lg:block lg:overflow-y-auto"} lg:border-r-2 lg:border-line`}>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your post in Markdown…"
            className="w-full h-full min-h-full p-6 text-sm font-mono text-ink placeholder:text-ink-muted bg-card resize-none focus:outline-none leading-relaxed"
          />
        </div>

        {/* Preview pane */}
        <div className={`${tab === "preview" ? "overflow-y-auto" : "hidden lg:block lg:overflow-y-auto"} bg-card-alt`}>
          <div className="p-6">
            {value.trim() ? (
              <div className={styles.markdown}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {value}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-ink-muted">Preview will appear here…</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
