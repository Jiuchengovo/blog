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

const interests = [
  { label: "Design Systems", emoji: "🎨", color: "sage" },
  { label: "Typography", emoji: "🔤", color: "mauve" },
  { label: "Open Source", emoji: "💻", color: "slate" },
  { label: "Photography", emoji: "📷", color: "dust" },
  { label: "Minimalism", emoji: "✨", color: "warm" },
  { label: "Rust", emoji: "🦀", color: "clay" },
  { label: "Motion Design", emoji: "🎬", color: "mist" },
  { label: "Coffee", emoji: "☕", color: "bark" },
];

const photoCards = [
  { bg: "bg-[#dce5dd]", rotate: -20 },
  { bg: "bg-[#e0dce6]", rotate: -7 },
  { bg: "bg-[#e5dce0]", rotate: 7 },
  { bg: "bg-[#dce0e5]", rotate: 20 },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-28 pb-24">
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
            <p className="text-[#6B7280] leading-relaxed max-w-md mb-8">
              这里是彭禹铭的个人主页（也可以叫我久诚或者eta!）之后会更新一些经历，项目
              ，会掉落一些碎碎念，欢迎大家互动！我们的一生皆是征途🎶
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

        {/* Right: Photo cards */}
        <Reveal delay={300} className="relative h-[420px] flex items-center justify-center">
          <div className="relative w-64 h-96">
            {photoCards.map((card, i) => (
              <div
                key={i}
                className={`absolute inset-0 rounded-3xl ${card.bg} shadow-md`}
                style={{
                  transform: `rotate(${card.rotate}deg)`,
                  transformOrigin: "50% 100%",
                  zIndex: i,
                }}
              >
                <div className="absolute inset-3 rounded-2xl bg-white/30 flex items-center justify-center">
                  <svg
                    className="size-12 text-white/50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Slider dots */}
          <div className="absolute bottom-0 flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                className={`size-2.5 rounded-full transition-all ${
                  i === 0
                    ? "bg-[#6B7D6D] w-8"
                    : "bg-[#D1CEC7] hover:bg-[#B0ACA3]"
                }`}
              />
            ))}
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

        {/* Interests */}
        <Reveal delay={500}>
          <section className="rounded-3xl border border-[#E8E7E4] bg-white shadow-sm p-8 sm:p-10">
            <h2 className="text-sm font-bold text-[#6B7280] uppercase tracking-wider mb-8">
              Interests
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {interests.map((item) => {
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
  );
}
