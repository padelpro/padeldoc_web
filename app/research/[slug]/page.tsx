import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { Footer, SiteHeader } from '../../site-parts'
import { IS_DEMO, MAIN_SITE } from '../../site'
import copy from '../../_copy/research.json'
import { AUTHOR, articleJsonLd, imageUrl, latestPost, loadPosts, longDate, postPath, renderMarkdown } from '../posts'
import { SeenMark } from '../seen-mark'

// /research/<slug>: one post, its markdown turned into HTML at build time (posts.ts renderMarkdown, sanitised). Only the
// posts the build shows exist: a draft has no page in the release build. None on the demo build.
export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  if (IS_DEMO) return []
  return loadPosts().map((p) => ({ slug: p.slug }))
}

const find = (slug: string) => loadPosts().find((p) => p.slug === slug)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const p = find(slug)
  if (!p) return {}
  const img = { url: imageUrl(p.image), alt: copy.imageAlt.replace('{title}', p.title) }
  return {
    title: p.title,
    description: p.summary,
    keywords: p.tags,
    authors: [{ name: AUTHOR }],
    alternates: { canonical: postPath(p.slug) },
    openGraph: { type: 'article', siteName: 'The Padel Doc', url: postPath(p.slug), title: p.title, description: p.summary,
      publishedTime: p.date, authors: [AUTHOR], tags: p.tags, images: [img] },
    twitter: { card: 'summary_large_image', title: p.title, description: p.summary, images: [img] },
  }
}

export default async function ResearchPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (IS_DEMO) redirect(`${MAIN_SITE}${postPath(slug)}`)
  const p = find(slug)
  if (!p) notFound()
  return (
    <>
      <SiteHeader back={copy.backToApp} />
      <SeenMark date={latestPost(loadPosts())?.date ?? null} />
      <article className="mx-auto max-w-[720px] px-4 sm:px-6 pt-8 sm:pt-14">
        <a href="/research" className="inline-flex items-center min-h-11 text-sm text-muted hover:text-text">{copy.heading}</a>
        {p.kicker && <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-accent">{p.kicker}</p>}
        <h1 className={`${p.kicker ? 'mt-1' : 'mt-2'} text-[32px] sm:text-5xl font-bold tracking-tight leading-[1.1] text-balance`}>{p.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted">
          <time dateTime={p.date}>{longDate(p.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{AUTHOR}</span>
          <span className="rounded-full border border-accent/50 px-2 py-0.5 text-xs font-semibold text-accent">{copy.types[p.type]}</span>
          {p.draft && <span className="rounded-full bg-panel-2 px-2 py-0.5 text-xs font-semibold">{copy.draft}</span>}
        </div>
        <img src={imageUrl(p.image)} alt={copy.imageAlt.replace('{title}', p.title)} className="mt-8 w-full rounded-xl border border-edge bg-panel-2" />
        <div className="r-body mt-8" dangerouslySetInnerHTML={{ __html: renderMarkdown(p.body) }} />
        <footer className="mt-14 border-t border-edge pt-6">
          <p className="text-base sm:text-[17px] leading-[1.6] font-medium">{copy.footerLine}</p>
          <a href="/research" className="mt-1 inline-flex items-center min-h-11 font-semibold text-accent-2 hover:underline">{copy.back}</a>
        </footer>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleJsonLd(p) }} />
      <div className="mx-auto max-w-6xl px-6">
        <Footer />
      </div>
    </>
  )
}
