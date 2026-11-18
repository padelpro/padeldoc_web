import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Footer, SiteHeader } from '../site-parts'
import { IS_DEMO, MAIN_SITE } from '../site'
import copy from '../_copy/research.json'
import { imageUrl, loadPosts, longDate, postPath, SITE } from './posts'

// /research: every post, newest first (padel-coach-src specs/research-blog-spec.md). Built at build time; on the demo
// build it is thepadeldoc.com's page (next.config.ts sends it there first: no copy of it on demo.thepadeldoc.com).
export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: copy.indexTitle,
  description: copy.indexDescription,
  alternates: { canonical: '/research', types: { 'application/rss+xml': [{ url: '/research/feed.xml', title: copy.rssTitle }] } },
  openGraph: { type: 'website', siteName: 'The Padel Doc', url: '/research', title: `${copy.indexTitle} · The Padel Doc`,
    description: copy.indexDescription, images: [{ url: '/og.png', width: 1200, height: 630, alt: 'The Padel Doc' }] },
  twitter: { card: 'summary_large_image', title: `${copy.indexTitle} · The Padel Doc`, description: copy.indexDescription,
    images: [{ url: '/og.png', alt: 'The Padel Doc' }] },
}

export default function ResearchIndex() {
  if (IS_DEMO) redirect(`${MAIN_SITE}/research`)
  const posts = loadPosts()
  const blog = {
    '@context': 'https://schema.org', '@type': 'Blog', name: copy.rssTitle, url: `${SITE}/research`, description: copy.indexDescription,
    blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: `${SITE}${postPath(p.slug)}`, datePublished: p.date })),
  }
  return (
    <>
      <SiteHeader />
      <div className="mx-auto max-w-[720px] px-4 sm:px-6 pt-10 sm:pt-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{copy.heading}</h1>
        <p className="mt-4 text-base sm:text-[17px] leading-[1.6] text-text/85">{copy.intro}</p>

        {posts.length === 0 ? (
          <p className="mt-10 rounded-xl border border-edge bg-panel p-6 text-muted">{copy.empty}</p>
        ) : (
          <ul className="mt-10 space-y-5">
            {posts.map((p) => (
              <li key={p.slug}>
                <a href={postPath(p.slug)} className="group flex flex-col sm:flex-row gap-4 rounded-xl border border-edge bg-panel p-4 hover:border-accent/60">
                  <img src={imageUrl(p.image)} alt="" className="w-full sm:w-40 aspect-[16/9] sm:aspect-square object-cover rounded-lg bg-panel-2 shrink-0" loading="lazy" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
                      <time dateTime={p.date}>{longDate(p.date)}</time>
                      <span className="rounded-full border border-accent/50 px-2 py-0.5 text-xs font-semibold text-accent">{copy.types[p.type]}</span>
                      {p.draft && <span className="rounded-full bg-panel-2 px-2 py-0.5 text-xs font-semibold">{copy.draft}</span>}
                    </div>
                    <h2 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight leading-snug group-hover:text-accent">{p.title}</h2>
                    <p className="mt-2 text-base sm:text-[17px] leading-[1.6] text-text/85">{p.summary}</p>
                    <span className="mt-3 inline-flex items-center min-h-11 font-semibold text-accent-2">{copy.read}</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-10">
          <a href="/research/feed.xml" className="inline-flex items-center min-h-11 text-sm text-accent-2 hover:underline">{copy.rss}</a>
        </p>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blog).replace(/</g, '\\u003c') }} />
      <div className="mx-auto max-w-6xl px-6">
        <Footer />
      </div>
    </>
  )
}
