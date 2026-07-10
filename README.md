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

## Tool-update workflow (the normal path)

When a tool changes, **one command in `padel-coach-src` prepares BOTH deployment repos**
correctly — including the cross-domain canonical re-injection that a hand copy always
forgets (manual-sync item 2 below). Prefer it:

```bash
cd ~/padel-coach-src
npm run release            # use the existing dist/ bundles
npm run release -- --build # rebuild both brand sets first, then release
```

`scripts/release.mjs` copies the padelpro bundles into `padelpro_web/public/` and
re-injects the `canonical -> thepadeldoc.com/<route>` tag; copies the padeldoc bundles
(+ `standalone/balance.html`) into `padeldoc_web/public/` with canonical + Plausible
(absorbing `sync-tools.mjs`); then **verifies and hard-fails** on any miss (missing
canonical, a stray Google Fonts link on padelpro.ie, or a missing font/copper token on
thepadeldoc.com). It prints the per-repo file changes and the exact next steps. It
**never commits, pushes, or stages** — you review and commit each repo by hand. It also
prints a **loud reminder** that the padelpro balance page is a manual mirror (see
manual-sync item 1) — the script does not touch it.

After `npm run release`, skip to step 4 (commit + push). The manual routine below is the
fallback / explanation of what the script automates.

### Manual routine (fallback)

If you ever need to do it by hand, this is the full sequence:

1. **Edit source** in `padel-coach-src` (`src/…`).
2. **Build both brand sets:**
   ```bash
   cd ~/padel-coach-src
   node build/build.mjs        # emits dist/*.html AND dist/padeldoc/*.html
   ```
3. **Sync into each deployment repo's `public/`:**
   - **padelpro.ie** — copy `dist/*.html` into `padelpro_web/public/<tool>/index.html`
     (tactics=board, tracker, analyse, americano). Re-add the cross-domain canonical
     tags afterward (see manual-sync item 2 below).
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

1. **Balance Calculator is a hand-maintained vanilla file — and it is asymmetric.**
   The only balance source in `padel-coach-src` is `standalone/balance.html`, and that is
   the **padeldoc** copy (Style D Google Fonts + copper `#c1834e`, kept in sync manually
   with `src/brands/padeldoc.js`). `npm run release` (and `npm run sync-tools`) copies it
   into `padeldoc_web/public/balance/index.html` automatically. **padelpro.ie's balance
   page is different:** `padelpro_web/public/balance/index.html` is a *separate*
   hand-maintained file (system fonts, navy tokens, no web fonts) with **no bundle in
   `padel-coach-src`** — so no script can regenerate it. If the balance markup or maths
   changes, edit `standalone/balance.html` and mirror the change **by hand** into the
   padelpro file (stripping the Google Fonts, keeping the padelpro tokens). `npm run
   release` never touches the padelpro balance file and prints a **loud reminder** of this
   whenever it runs. If balance changes become frequent, promote it into the
   `padel-coach-src` build as a dual-brand entry so both copies regenerate from one source.

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

   - **`npm run release` (preferred):** `padel-coach-src/scripts/release.mjs` does the
     padelpro copy **and** the canonical re-injection in one step, then verifies every one
     of the five files carries exactly its canonical (and that none carry a Google Fonts
     link). This is the whole reason the script exists — you can no longer forget the tag.
   - **Checklist (manual):** in each file above, insert the matching `<link rel="canonical" …>`
     line immediately before the first `</head>`, then verify with
     `grep -c 'rel="canonical"' padelpro_web/public/*/index.html` (expect `1` per file).

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
