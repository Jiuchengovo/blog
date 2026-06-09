import Reveal from "./components/Reveal";

const experiences = [
  {
    role: "X-Lab",
    company: "intern",
    period: "2026.4 — Present",
    desc: "X-Lab实习中ww 希望能提升自己能力",
  },
  {
    role: "Zhejiang University",
    company: "SE Student",
    period: "2025.8 - Present",
    desc: "新的开始!",
  },
];

export default function Home() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 pt-28">
      {/* ── Hero Section ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-28">
        {/* Left */}
        <div>
          <Reveal delay={100}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E0DED9] bg-[#FAFAF8] px-4 py-1.5 text-xs font-semibold tracking-widest text-[#6B7280] uppercase mb-6">
              <span className="size-2 rounded-full bg-[#6B7D6D]" />
              HELLO, I&rsquo;M
            </span>
          </Reveal>

          <Reveal delay={200}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4 text-[#1F2933]">
              Peng Yuming
              <span className="text-[#6B7D6D]">.</span>
            </h1>
          </Reveal>

          <Reveal delay={300}>
            <p className="text-2xl sm:text-3xl font-semibold text-[#1F2933] mb-4">
              浙江大学软件工程大一在读
            </p>
          </Reveal>

          <Reveal delay={400}>
            <p className="text-[#6B7280] leading-relaxed mb-4">
              这里是彭禹铭的个人主页（也可以叫我久诚或者eta!）之后会更新一些经历，项目
              ，会掉落一些碎碎念，欢迎大家互动！我们的一生皆是征途🎶
            </p>
            <p className="text-sm text-[#9CA3AF] mb-8">
              如果您也想发布博文或笔记，可以联系我获得管理员权限~
            </p>
          </Reveal>

          <Reveal delay={500}>
            <div className="flex flex-wrap gap-3">
              <a
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full bg-[#6B7D6D] px-6 py-3 text-sm font-medium text-white hover:bg-[#5C6E5E] transition-colors"
              >
                View Blog
                <svg
                  className="size-4"
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
              </a>
              <a
                href="/about#chat"
                className="inline-flex items-center gap-2 rounded-full border border-[#D1CEC7] bg-[#FAFAF8] px-6 py-3 text-sm font-medium text-[#6B7280] hover:border-[#B0ACA3] hover:text-[#1F2933] transition-colors"
              >
                Chat with me！
              </a>
            </div>

          </Reveal>
        </div>

        {/* Right: Contact card */}
        <Reveal delay={300}>
          <div className="rounded-3xl border border-[#E8E7E4] bg-white shadow-sm p-8 flex flex-col items-center text-center">
            {/* Avatar */}
            <img
              src={`/avatar.jpg?v=${Date.now()}`}
              alt="Jiucheng"
              className="size-12 rounded-full object-cover ring-2 ring-[#E8E7E4] mb-3"
            />

            <h3 className="text-base font-semibold text-[#1F2933] mb-4">Jiucheng</h3>

            <div className="w-full space-y-2.5 text-sm">
              <a
                href="https://github.com/Jiuchengovo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-[#E8E7E4] bg-[#FAFAF8] px-4 py-3 text-[#1F2933] hover:border-[#6B7D6D] hover:bg-white transition-colors"
              >
                <svg className="size-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub</span>
                <span className="ml-auto text-[#9CA3AF]">Jiuchengovo</span>
              </a>

              <a
                href="mailto:1809691744@qq.com"
                className="flex items-center gap-3 rounded-xl border border-[#E8E7E4] bg-[#FAFAF8] px-4 py-3 text-[#1F2933] hover:border-[#6B7D6D] hover:bg-white transition-colors"
              >
                <svg className="size-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span>Email</span>
                <span className="ml-auto text-[#9CA3AF] truncate max-w-[160px]">1809691744@qq.com</span>
              </a>

              <div className="flex items-center gap-3 rounded-xl border border-[#E8E7E4] bg-[#FAFAF8] px-4 py-3 text-[#1F2933]">
                <svg className="size-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
                <span>微信</span>
                <span className="ml-auto text-[#9CA3AF]">P2007330</span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Bottom Cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Experience */}
        <Reveal delay={400}>
          <section className="rounded-3xl border border-[#E8E7E4] bg-white shadow-sm p-8 sm:p-10">
            <h2 className="text-sm font-bold text-[#6B7280] uppercase tracking-wider mb-8">
              Experience
            </h2>
            <div className="relative">
              <div className="absolute left-[7px] top-1.5 bottom-1.5 w-px bg-[#E8E7E4]" />

              <div className="space-y-2">
                {experiences.map((exp, i) => (
                  <div key={i} className="relative pl-8 py-3">
                    <div
                      className={`absolute left-0 top-4 size-[15px] rounded-full border-4 border-white ${
                        i === 0 ? "bg-[#6B7D6D]" : "bg-[#D1CEC7]"
                      }`}
                    />

                    <time className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                      {exp.period}
                    </time>
                    <h3 className="text-[#1F2933] font-semibold mt-0.5">
                      {exp.role}{" "}
                      <span className="text-[#6B7280] font-normal">
                        — {exp.company}
                      </span>
                    </h3>
                    <p className="mt-1.5 text-sm text-[#6B7280] leading-relaxed">
                      {exp.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* Tools */}
        <Reveal delay={500}>
          <section className="rounded-3xl border border-[#E8E7E4] bg-white shadow-sm p-8 sm:p-10">
            <h2 className="text-sm font-bold text-[#6B7280] uppercase tracking-wider mb-8">
              Tools
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {[
                { label: "Next.js", emoji: "▲", color: "slate" },
                { label: "React", emoji: "⚛️", color: "sage" },
                { label: "Express", emoji: "🚂", color: "warm" },
                { label: "Tailwind CSS", emoji: "🎨", color: "mauve" },
                { label: "MongoDB", emoji: "🍃", color: "dust" },
                { label: "TypeScript", emoji: "📘", color: "mist" },
                { label: "Docker", emoji: "🐳", color: "clay" },
                { label: "GitHub Actions", emoji: "⚡", color: "bark" },
              ].map((item) => {
                const colorClasses: Record<string, string> = {
                  sage: "bg-[#e8ece5] text-[#5a6b59] hover:bg-[#dce3d7]",
                  mauve: "bg-[#ece6ee] text-[#6b5d6e] hover:bg-[#e3dae6]",
                  slate: "bg-[#e6e8ec] text-[#4d5968] hover:bg-[#d9dde3]",
                  dust: "bg-[#ede6e8] text-[#6e5d60] hover:bg-[#e3d9dc]",
                  warm: "bg-[#ede8e0] text-[#6b5f4f] hover:bg-[#e3dcd1]",
                  clay: "bg-[#ede6df] text-[#6d5c4e] hover:bg-[#e3dad0]",
                  mist: "bg-[#e6e8ed] text-[#4d5568] hover:bg-[#d9dde3]",
                  bark: "bg-[#ebe6e4] text-[#6b5e58] hover:bg-[#e1dad7]",
                };
                return (
                  <span
                    key={item.label}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-default ${
                      colorClasses[item.color] ?? colorClasses.sage
                    }`}
                  >
                    <span className="text-base">{item.emoji}</span>
                    {item.label}
                  </span>
                );
              })}
            </div>
          </section>
        </Reveal>
      </div>

    </div>
    </>
  );
}
