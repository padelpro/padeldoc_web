// The homepage reviews (SU1, Kevin 18 Oct 2026; padel-share-api signup.js, GET /v1/reviews): reviews Kevin approved and
// the writer said were OK to show, as stars, text, first name and role. Pure, tested in reviews.test.ts.

export type Review = { stars: number; body: string; name: string; role: string }

// Well-formed entries with some text only; a star rating with no words says little on a homepage.
export function publicReviews(data: unknown): Review[] {
  const list = data && typeof data === 'object' ? (data as { reviews?: unknown }).reviews : null
  if (!Array.isArray(list)) return []
  return list.flatMap((r) => {
    if (!r || typeof r !== 'object') return []
    const { stars, body, name, role } = r as Record<string, unknown>
    if (!Number.isInteger(stars) || (stars as number) < 1 || (stars as number) > 5) return []
    if (typeof body !== 'string' || !body.trim() || typeof name !== 'string' || typeof role !== 'string') return []
    return [{ stars: stars as number, body: body.trim(), name: name.trim(), role }]
  }).slice(0, 6)
}
