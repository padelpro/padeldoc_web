// The "Used by" strip's data (padel-share-api logos.js, GET /v1/used-by; box-league-spec.md decision 27): clubs that
// agreed to be shown, that Kevin switched on, and that have a logo, in his order. Pure, tested in used-by.test.ts.

export type Club = { name: string; logoUrl: string }

// Only well-formed entries with an https logo; anything else is dropped, so a bad body shows nothing.
export function usedByClubs(data: unknown): Club[] {
  const list = data && typeof data === 'object' ? (data as { clubs?: unknown }).clubs : null
  if (!Array.isArray(list)) return []
  return list.flatMap((c) => {
    if (!c || typeof c !== 'object') return []
    const { name, logoUrl } = c as { name?: unknown; logoUrl?: unknown }
    if (typeof name !== 'string' || !name.trim() || typeof logoUrl !== 'string' || !logoUrl.startsWith('https://')) return []
    return [{ name: name.trim(), logoUrl }]
  })
}
