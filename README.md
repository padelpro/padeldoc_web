# padeldoc_web

Deployment repo for **thepadeldoc.com** — a lean Next.js 15 site that serves the
Padel Doc set of free padel tools. It mirrors `padelpro_web`'s stack (App Router,
Tailwind v4, `@netlify/plugin-nextjs`) but carries no auth or database: it is a
homepage plus five tool routes that rewrite to self-contained static HTML bundles
in `public/`.

## Layout

```
app/
  layout.tsx     Spline Sans + IBM Plex Mono (next/font), canonical base, Plausible
  page.tsx       homepage: About + five tools + feedback mailto
  globals.css    Padel Doc tokens (anthracite / copper / electric blue) via Tailwind v4
next.config.ts   rewrites /tactics /tracker /balance /analyse /americano -> public/*.html
public/<tool>/index.html   the Style D tool bundles (generated — see sync below)
scripts/sync-tools.mjs     copies the bundles in and injects canonical + Plausible tags
```

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (what Netlify runs)
```

## The two brands share one source

The React tools (Tactics Board, Match Tracker, Video Analyser, Americano Organizer)
and the vanilla Balance Calculator live in **`../padel-coach-src`**. That repo builds
the SAME app twice — once per brand — selecting a token file at build time:

- **padelpro** bundles -> `padel-coach-src/dist/*.html` (system fonts, navy/teal/lime)
- **padeldoc** bundles -> `padel-coach-src/dist/padeldoc/*.html` (Style D: Spline Sans
  + IBM Plex Mono, anthracite/copper/electric-blue)

`padelpro_web` and `padeldoc_web` are just the two deployment shells. Neither builds
the tools; both consume pre-built bundles committed into their own `public/`.

## Tool-update workflow (the full routine)

When a tool changes, do all of this so both live sites stay in step:

1. **Edit source** in `padel-coach-src` (`src/…`).
2. **Build both brand sets:**
   ```bash
   cd ~/padel-coach-src
   node build/build.mjs        # emits dist/*.html AND dist/padeldoc/*.html
   ```
3. **Sync into each deployment repo's `public/`:**
   - **padelpro.ie** — copy `dist/*.html` into `padelpro_web/public/<tool>/index.html`
     (tactics=board, tracker, analyse, americano). Re-add the cross-domain canonical
     tags afterward (see manual-sync item 1 below).
   - **thepadeldoc.com** — from this repo run:
     ```bash
     cd ~/padeldoc_web
     npm run sync-tools        # copies dist/padeldoc/*.html + standalone/balance.html,
                               # injecting canonical -> thepadeldoc.com/<route> + Plausible
     ```
4. **Commit and push each repo separately** — `padel-coach-src` (source of truth),
   `padelpro_web`, and `padeldoc_web` are three independent repos:
   ```bash
   cd ~/padel-coach-src && git add -A && git commit && git push
   cd ~/padelpro_web    && git add -A && git commit && git push
   cd ~/padeldoc_web    && git add -A && git commit && git push
   ```
5. **Netlify auto-deploys** both sites from their `main`/`master` on push. No manual
   Netlify step.

### Route -> bundle map (thepadeldoc.com)

| Route        | Source bundle (`padel-coach-src`)   |
|--------------|-------------------------------------|
| `/tactics`   | `dist/padeldoc/board.html`          |
| `/tracker`   | `dist/padeldoc/tracker.html`        |
| `/analyse`   | `dist/padeldoc/analyse.html`        |
| `/americano` | `dist/padeldoc/americano.html`      |
| `/balance`   | `standalone/balance.html`           |

## Known manual-sync items (do not let these drift)

1. **Standalone Balance Calculator copy.** `padel-coach-src/standalone/balance.html`
   is a hand-maintained vanilla-HTML copy that is **not** part of the esbuild pipeline.
   If the padelpro Balance tool changes (markup or maths), mirror the change into this
   file by hand, then re-run `npm run sync-tools`. Its `<head>` also carries the Style D
   Google Fonts link, kept in sync manually with `src/brands/padeldoc.js`.

2. **Cross-domain canonical tags on padelpro.ie.** Exactly five files carry an injected
   `<link rel="canonical" href="https://thepadeldoc.com/<route>">` so the duplicate tool
   content consolidates on thepadeldoc.com:

   | File in `padelpro_web` | Canonical href |
   |------------------------|----------------|
   | `public/tactics/index.html`   | `https://thepadeldoc.com/tactics`   |
   | `public/tracker/index.html`   | `https://thepadeldoc.com/tracker`   |
   | `public/analyse/index.html`   | `https://thepadeldoc.com/analyse`   |
   | `public/balance/index.html`   | `https://thepadeldoc.com/balance`   |
   | `public/americano/index.html` | `https://thepadeldoc.com/americano` |

   The tag is injected directly into each built bundle's `<head>` (just before `</head>`),
   **not** into any source file. So **any future copy of fresh padelpro bundles from
   `padel-coach-src/dist/` into `padelpro_web/public/` overwrites these files and drops the
   canonical tag.** After such a copy, and *before committing `padelpro_web`*, you must
   re-add the canonical line to each of the five files. Re-apply it one of two ways:

   - **Checklist (manual):** in each file above, insert the matching `<link rel="canonical" …>`
     line immediately before the first `</head>`, then verify with
     `grep -c 'rel="canonical"' padelpro_web/public/*/index.html` (expect `1` per file).
   - **Script (preferred):** keep a small injector alongside the copy step — the same
     idempotent replace-before-`</head>` logic this repo uses in `scripts/sync-tools.mjs`
     (which does canonical + Plausible for thepadeldoc.com). Point it at `padelpro_web/public`
     with the hrefs in the table above (canonical only, no Plausible), and run it after every
     padelpro bundle copy. Idempotent: it skips any file that already has a canonical.

3. **Inert-token trade-off in `build.mjs`.** `src/brand.js` statically imports both
   token files, so esbuild (which tree-shakes by symbol reachability) bundles both
   brands' token strings into every output. Editing `padeldoc.js` therefore perturbs
   the padelpro bundle bytes as **dead data** — padelpro selects its own tokens at
   runtime, so there is no visible or behavioural change. Accepted for now; the future
   fix (documented in `build/build.mjs`, do not attempt casually) is a per-brand esbuild
   `alias` / virtual module so each bundle carries only its own tokens.

## Deferred / not yet done

- **Email forwarding** — `hello@thepadeldoc.com` is not yet set up. The site's feedback
  link currently points at `hello@padelpro.ie`. Set up **ImprovMX** forwarding for
  `hello@thepadeldoc.com` and switch the mailto in `app/page.tsx` when ready.
- **Entitlements / payments** — no Supabase or Stripe integration here yet. The paid
  entitlement work (accounts, gating premium tool features, checkout) is a later phase
  and will need its own auth/data layer, unlike this currently static site.
