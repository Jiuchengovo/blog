'use client'

import Giscus from '@giscus/react'

type GiscusRepo = `${string}/${string}`

export default function Comment() {
  const repo = (process.env.NEXT_PUBLIC_GISCUS_REPO ||
    'Jiuchengovo/blog') as GiscusRepo
  const repoId =
    process.env.NEXT_PUBLIC_GISCUS_REPO_ID || 'R_kgDOSSe6uA'
  const category =
    process.env.NEXT_PUBLIC_GISCUS_CATEGORY || 'Announcements'
  const categoryId =
    process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || 'DIC_kwDOSSe6uM4C8MJ5'

  return (
    <section className="rounded-2xl border border-[#E8E7E4] bg-[#FAFAF8] p-8 sm:p-10 shadow-sm">
      <h2 className="text-xl font-semibold tracking-tight text-[#1F2933] mb-8">
        Comments
      </h2>
      <Giscus
        repo={repo}
        repoId={repoId}
        category={category}
        categoryId={categoryId}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme="preferred_color_scheme"
        lang="zh-CN"
      />
    </section>
  )
}
