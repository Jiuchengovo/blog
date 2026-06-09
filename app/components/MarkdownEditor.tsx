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
    <div className="rounded-xl border border-[#E8E7E4] overflow-hidden">
      {/* Tab bar — mobile toggle + desktop labels */}
      <div className="flex border-b border-[#E8E7E4] bg-[#FAFAF8]">
        <button
          type="button"
          onClick={() => setTab("write")}
          className={`flex-1 lg:flex-none lg:px-6 py-2.5 text-sm font-medium transition-colors ${
            tab === "write"
              ? "text-[#1F2933] border-b-2 border-[#6B7D6D] lg:border-b-0 lg:bg-white"
              : "text-[#9CA3AF] hover:text-[#6B7280]"
          }`}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={`flex-1 lg:flex-none lg:px-6 py-2.5 text-sm font-medium transition-colors ${
            tab === "preview"
              ? "text-[#1F2933] border-b-2 border-[#6B7D6D] lg:border-b-0 lg:bg-[#FAFAF8]"
              : "text-[#9CA3AF] hover:text-[#6B7280]"
          }`}
        >
          Preview
        </button>
        {/* desktop-only hint for the inactive pane */}
        <span className="hidden lg:block flex-1" />
      </div>

      {/* Desktop: side-by-side; Mobile: tabbed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-0 h-[70vh] lg:h-[650px] overflow-hidden bg-white">
        {/* Editor pane */}
        <div className={`${tab === "write" ? "overflow-y-auto" : "hidden lg:block lg:overflow-y-auto"} lg:border-r-2 lg:border-[#E8E7E4]`}>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your post in Markdown…"
            className="w-full h-full min-h-full p-6 text-sm font-mono text-[#1F2933] placeholder:text-[#9CA3AF] bg-white resize-none focus:outline-none leading-relaxed"
          />
        </div>

        {/* Preview pane */}
        <div className={`${tab === "preview" ? "overflow-y-auto" : "hidden lg:block lg:overflow-y-auto"} bg-[#FAFAF8]`}>
          <div className="p-6">
            {value.trim() ? (
              <div className={styles.markdown}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {value}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-[#9CA3AF]">Preview will appear here…</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
