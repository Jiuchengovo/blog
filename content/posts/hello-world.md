---
title: "Building a Modern Blog with Next.js"
date: "2026-04-29"
excerpt: "Lessons learned from rebuilding my personal blog with Next.js, Tailwind CSS, and Markdown."
tags: ["nextjs", "tailwindcss", "markdown", "typescript"]
---

When I set out to rebuild my personal blog, I had three non-negotiable requirements: it had to be fast, it had to be simple to write for, and I had to own my content. No CMS, no database — just Markdown files and a static site generator.

## The Stack

I chose **Next.js** for its hybrid rendering model. With static generation, my blog posts are pre-built at deploy time, serving plain HTML to the reader. No loading spinners, no layout shift — just content.

For styling, **Tailwind CSS** v4 brings a utility-first approach that makes it trivial to iterate on design without accumulating dead CSS. The new CSS-first configuration is a genuine improvement over the old `tailwind.config.js` approach.

The key insights I gained:

- **Content ownership**: Storing posts as Markdown files in the repo means zero vendor lock-in. I can migrate to any static site generator in the future without changing a single post.
- **Performance**: Static pages served from a CDN edge are hard to beat. The initial HTML arrives in under 100ms from most locations.
- **Developer experience**: Writing in Markdown feels natural. The remark ecosystem handles everything from parsing to syntax highlighting with minimal configuration.

## Code Highlighting

One of the most enjoyable parts was setting up code blocks. With remark-rehype and a syntax highlighting plugin, code blocks come alive:

```typescript
interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
}

async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(content);

  return {
    slug,
    ...data,
    content: String(processedContent.value),
  } as BlogPost;
}
```

## Design Philosophy

> The best tools get out of your way and let you focus on what matters most — your content.

I wanted the design to stay out of the way. Clean typography, generous whitespace, and a restrained color palette. The blog should feel like reading a well-set book, not navigating a web app.

## What's Next

This is just the beginning. Over the coming weeks, I plan to add:

- RSS feed generation
- Full-text search
- Dark mode support
- Reading time estimates

If you're thinking about starting your own blog, I'd encourage you to keep it simple. Start with Markdown files and a static site generator. Add complexity only when you genuinely need it.
