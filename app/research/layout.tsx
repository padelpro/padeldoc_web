import { THEME_BOOT } from './theme'

// Every research page: the visitor's theme first (theme.ts), then the page. [data-research] scopes the dark tokens and
// the post styles (globals.css) to this section.
export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-research className="min-h-screen bg-bg text-text">
      <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      {children}
    </div>
  )
}
