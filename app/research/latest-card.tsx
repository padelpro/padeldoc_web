import copy from '../_copy/research.json'
import { imageUrl, longDate, postPath, type Post } from './posts'

// The home page's Latest research card (Kevin 18 Nov 2026, spot A: above Help build padel-vision, so the two research
// items sit together). home-page.tsx gives it the newest released post (latestPost), read at build time, and draws
// nothing when there is none. The whole card is the link. Labels from _copy/research.json; the post's own words from its markdown.
export function LatestResearchCard({ post, className = '' }: { post: Post; className?: string }) {
  return (
    <a href={postPath(post.slug)} className={`group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 rounded-xl border border-edge bg-panel p-4 sm:p-6 hover:border-accent/60 ${className}`}>
      {/* alt "" as on /research: the title is in the same link, so a screen reader would read it twice. */}
      <img src={imageUrl(post.image)} alt="" className="w-full sm:w-44 aspect-[16/9] object-cover rounded-lg bg-panel-2 shrink-0" loading="lazy" />
      <div className="min-w-0">
        <p className="text-accent font-medium">{copy.latest}</p>
        <p className="mt-1 text-sm text-muted">
          <time dateTime={post.date}>{longDate(post.date)}</time> · {copy.types[post.type]}
        </p>
        <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight leading-snug group-hover:text-accent">{post.title}</h2>
        <span className="mt-2 inline-flex items-center min-h-11 font-semibold text-accent-2">{copy.read}</span>
      </div>
    </a>
  )
}
