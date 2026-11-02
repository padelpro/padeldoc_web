// npm run shots [-- --only tagger,phone-dark-hero] [--out <dir>] [--dark]
// Retakes the site's screenshots (public/shots) from the local build and the local Worker, signed in as the demo world
// (padel-share-api: npm run seed:demo:local, then wrangler dev on 127.0.0.1:8787). Every file keeps its name and size:
// desktop shots at their current width in the light theme (the site default), phone shots at 390 px wide (2x) in the dark
// theme. Kevin 2 Nov 2026.
//
// - The pages come from this repo's public/ (what `npm run release -- --site padeldoc` put there), served on
//   127.0.0.1:5174 with netlify.toml's rewrites, so /coach, /community, /club and /league/me open as they do live.
//   Each page is given ?api=<local Worker> (the tools only take it on a local host).
// - Signed in by the demo keys (../padel-share-api/.wrangler/demo-keys.json, or DEMO_KEYS), put in localStorage before
//   the page starts, as a sign-in would.
// - Waits for the network to go quiet, the fonts and every image, hides cookie banners and dev-only bits, then shoots.
// - Each PNG is squeezed with ffmpeg (a 256-colour palette) when it's over 300 KB, if ffmpeg is on the PATH.
// - Playwright isn't a dependency here: it's found in node_modules, PLAYWRIGHT_DIR, or a sibling project that has it.
// - Look, don't touch: the pages' writes to the Worker (marking things read) are answered here, so the demo world stays
//   as seeded and every run comes out the same.
// - The tools keep their work on the device, so each is set up first the way someone would use it (a play on the
//   board, a dozen shots tracked, a schedule built, a score part played, tape on a racket).
// - The Tagger and Analyser need a real video: SHOTS_VIDEO=<a match clip>. Without one those two are left as they are.
//
// --out <dir>: write somewhere else (to compare before replacing). --only: some shots. --dark: desktop shots in the
// dark theme (phones are always dark). --test-video: the Tagger and Analyser with the small test clip (to check their
// set-up). --serve: just serve the site, to look around. Two extra shots for later, not used on any page yet:
// community.png and marketplace.png. Six more for the role pages: my-page, club-members, coach-messages, coach-booking,
// coach-profile and community-group (coach-booking is spare).
import { createServer } from "node:http";
import { readFile, stat, writeFile, mkdir } from "node:fs/promises";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join, extname, normalize, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { profilePath } from "../app/profile-path.ts";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const PUBLIC = join(ROOT, "public");
const arg = (name) => { const i = process.argv.indexOf(name); return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : null; };
const OUT = resolve(arg("--out") || join(PUBLIC, "shots"));
const ONLY = (arg("--only") || "").split(",").map((s) => s.trim()).filter(Boolean);
const DARK_DESK = process.argv.includes("--dark");   // desktop shots are light (the site default) unless --dark
const API = arg("--api") || "http://127.0.0.1:8787";
const PORT = 5174;   // one of the local Worker's dev origins (padel-share-api .dev.vars CORS_DEV_ORIGINS)
const SITE = `http://127.0.0.1:${PORT}`;
const MAX_BYTES = 300 * 1024;

const KEYS_FILE = process.env.DEMO_KEYS || join(ROOT, "..", "padel-share-api", ".wrangler", "demo-keys.json");
if (!existsSync(KEYS_FILE)) {
  console.error(`shots: no demo keys at ${KEYS_FILE}. Run \`npm run seed:demo:local\` in padel-share-api first (or set DEMO_KEYS).`);
  process.exit(1);
}
const D = JSON.parse(readFileSync(KEYS_FILE, "utf8"));
// The Tagger and Analyser shots show a video: SHOTS_VIDEO (a real match clip). Without one they're left as they are,
// unless --test-video retakes them with the small test clip (colour bars, for checking the set-up only).
const TEST_CLIP = join(ROOT, "..", "padel-coach-src", "Claude outputs", "fx", "h264.mp4");
const CLIP = process.env.SHOTS_VIDEO && existsSync(process.env.SHOTS_VIDEO) ? process.env.SHOTS_VIDEO
  : process.argv.includes("--test-video") && existsSync(TEST_CLIP) ? TEST_CLIP : null;

// --- Playwright, wherever it's installed ----------------------------------------------------------------------------
function loadPlaywright() {
  const tries = [join(ROOT, "package.json"), process.env.PLAYWRIGHT_DIR && join(process.env.PLAYWRIGHT_DIR, "..", "package.json"),
    ...["padel-content", "ippa"].map((p) => join(ROOT, "..", p, "package.json"))].filter(Boolean);
  for (const t of tries) {
    try { return createRequire(t)("playwright"); } catch { /* next */ }
  }
  console.error("shots: Playwright not found. Install it somewhere (npm i -D playwright) or set PLAYWRIGHT_DIR to its folder.");
  process.exit(1);
}

// --- the site, with netlify.toml's rewrites ------------------------------------------------------------------------
const REWRITES = [];
{
  const toml = readFileSync(join(ROOT, "netlify.toml"), "utf8");
  for (const block of toml.split("[[redirects]]").slice(1)) {
    const from = /from\s*=\s*"([^"]+)"/.exec(block), to = /to\s*=\s*"([^"]+)"/.exec(block), status = /status\s*=\s*(\d+)/.exec(block);
    if (from && to && status && status[1] === "200" && to[1].startsWith("/")) REWRITES.push({ from: from[1], to: to[1] });
  }
}
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".webp": "image/webp",
  ".svg": "image/svg+xml", ".json": "application/json", ".ico": "image/x-icon", ".webmanifest": "application/manifest+json", ".jpg": "image/jpeg", ".woff2": "font/woff2" };
async function fileFor(path) {
  const clean = normalize(decodeURIComponent(path)).replace(/^([\\/])+/, "");
  const full = join(PUBLIC, clean);
  if (!full.startsWith(PUBLIC)) return null;
  try {
    const s = await stat(full);
    if (s.isFile()) return full;
    if (s.isDirectory() && existsSync(join(full, "index.html"))) return join(full, "index.html");
  } catch { /* fall through */ }
  for (const r of REWRITES) {
    const hit = r.from.endsWith("/*") ? path === r.from.slice(0, -2) || path.startsWith(r.from.slice(0, -1)) : path === r.from;
    if (hit) return join(PUBLIC, r.to);
  }
  // A public profile, thepadeldoc.com/<name>: the player bundle, as the edge function serves it (netlify/edge-functions/profile.ts).
  if (profilePath(path)?.kind === "profile") return join(PUBLIC, "player", "index.html");
  return null;
}
const server = createServer(async (req, res) => {
  const path = new URL(req.url, SITE).pathname;
  const f = await fileFor(path);
  if (!f) { res.writeHead(404); res.end("not found"); return; }
  res.writeHead(200, { "Content-Type": TYPES[extname(f)] || "application/octet-stream", "Cache-Control": "no-store" });
  res.end(await readFile(f));
});

// --- each shot ------------------------------------------------------------------------------------------------------
const P = D.players;
const desk = (w, h) => ({ viewport: { width: w, height: h }, scale: 1, dark: DARK_DESK });
const phone = { viewport: { width: 390, height: 760 }, scale: 2, dark: true, mobile: true };
const coach = { key: D.kevin.key };
const button = (page, name) => page.getByRole("button", { name, exact: true }).first();
const tap = async (page, name) => { await button(page, name).click(); await page.waitForTimeout(150); };

// The tools keep their work on the device, so each is set up the way someone would use it.
async function tracker(page) {
  await page.getByRole("button", { name: "Dismiss tour tip" }).click().catch(() => {});
  const court = await page.locator("svg").filter({ has: page.locator("pattern, line") }).last().boundingBox();
  const at = (team, fx, fy) => ({ x: court.x + court.width * (0.12 + fx * 0.76), y: court.y + court.height * (team === "A" ? 0.56 + fy * 0.36 : 0.08 + fy * 0.36) });
  const SHOTS_LOGGED = [["A1", "Winner", "Volley", 0.3, 0.1], ["B2", "Unforced", "Lob", 0.7, 0.8], ["A2", "Forced", "Overhead", 0.8, 0.2], ["B1", "Winner", "Groundstroke", 0.2, 0.9],
    ["A1", "Unforced", "Return", 0.1, 0.9], ["A2", "Winner", "Overhead", 0.7, 0.05], ["B2", "Forced", "Volley", 0.75, 0.15], ["A1", "Winner", "Chiquita", 0.35, 0.3],
    ["B1", "Unforced", "Bajada", 0.25, 0.6], ["A2", "Unforced", "Drop", 0.85, 0.2], ["B2", "Winner", "Volley", 0.6, 0.1], ["A1", "Forced", "Lob", 0.2, 0.85]];
  for (const [who, outcome, shot, fx, fy] of SHOTS_LOGGED) {
    await page.getByRole("button", { name: new RegExp(`^${who}\\b`) }).first().click();
    await tap(page, outcome);
    await tap(page, shot);
    const hand = page.getByRole("button", { name: fx < 0.5 ? "Forehand" : "Backhand", exact: true });
    if (await hand.count()) await hand.first().click().catch(() => {});
    const p = at(who[0], fx, fy);
    await page.mouse.click(p.x, p.y);
    await page.waitForTimeout(250);
  }
  // the next shot picked, not yet placed (as the shot is usually taken mid-match)
  await page.getByRole("button", { name: /^B1\b/ }).first().click();
  await tap(page, "Winner");
  await tap(page, "Volley");
}
async function scoreboard(page) {
  await page.getByRole("textbox", { name: "Team 1 name" }).fill("Naas Vets");
  await page.getByRole("textbox", { name: "Team 2 name" }).fill("Carlow Smashers");
  await page.getByRole("button", { name: "Team A", exact: true }).click().catch(() => page.getByRole("button", { name: "Naas Vets", exact: true }).click());
  await tap(page, "Start match");
  await page.waitForTimeout(500);
  const plus = page.getByRole("button", { name: /point/i });
  const point = async (team) => { await plus.nth(team === "A" ? 0 : 1).click(); await page.waitForTimeout(120); };
  for (const g of "ABABABA") for (let i = 0; i < 4; i++) await point(g);
  for (const t of "AAB") await point(t);
}
async function americano(page) {
  const names = ["Pedro", "Luke", "John L", "Alba", "Frank", "Jose", "Richard", "Declan", "Louis", "Mark", "John M", "Mary"];
  const box = page.getByPlaceholder("Player name");
  for (const n of names) { await box.fill(n); await box.press("Enter"); }
  await page.getByRole("button", { name: "+", exact: true }).first().click();   // 3 courts
  const times = page.locator('input[type="time"]');
  await times.nth(0).fill("21:00");
  await times.nth(1).fill("22:30");
  await tap(page, "Build schedule");
  await page.waitForTimeout(600);
  await page.getByText(/\d+ players, \d+ courts/).first().evaluate((el) => { el.scrollIntoView({ block: "start" }); window.scrollBy(0, -70); });
}
// The Tagger: one of Kevin's tagged matches from his cloud, its video attached (SHOTS_VIDEO, else the test clip), the
// Coach report open.
async function tagger(page) {
  await page.getByRole("button", { name: "Got it", exact: true }).click().catch(() => {});
  await page.getByRole("button", { name: "Tag it as it is", exact: true }).click().catch(() => {});
  await page.getByRole("button", { name: /^Video/ }).first().click();
  await page.getByRole("button", { name: /^Cloud/ }).first().click();
  await page.waitForTimeout(1200);
  const row = page.getByText(D.tagger.title, { exact: true }).first().locator("xpath=ancestor::*[.//button[normalize-space()='Open']][1]");
  await row.scrollIntoViewIfNeeded();
  await row.getByRole("button", { name: "Open", exact: true }).click();
  await page.waitForTimeout(1500);
  await page.getByRole("button", { name: "Done", exact: true }).click().catch(() => {});
  if (CLIP) {
    await chooseFile(page, async () => {
      await page.getByRole("button", { name: /^Video/ }).first().click();
      await page.getByRole("button", { name: /^File on this device/ }).first().click();
    }, CLIP).catch((e) => console.warn(`  tagger: no video (${String(e.message).split("\n")[0].trim()})`));
  }
  await page.waitForTimeout(1500);
  await page.getByRole("button", { name: "Keep the tags and use this video anyway", exact: true }).click().catch(() => {});
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Dismiss", exact: true }).click().catch(() => {});
  await page.getByRole("button", { name: "Tag it as it is", exact: true }).click().catch(() => {});
}
async function analyse(page) {
  await page.getByText("Just me", { exact: true }).first().click();
  await page.waitForTimeout(800);
  if (CLIP) await chooseFile(page, () => page.getByText("Choose a video", { exact: true }).first().click(), CLIP);
  await page.waitForTimeout(1500);
  await page.getByRole("button", { name: "Use this section", exact: true }).click().catch(() => {});
  await page.waitForTimeout(1500);
}
// A file picked the way a person would: the page's own chooser, answered with `file`.
async function chooseFile(page, open, file) {
  const [chooser] = await Promise.all([page.waitForEvent("filechooser", { timeout: 8000 }), open()]);
  await chooser.setFiles(file);
}
const BALANCE = { M: 364, B: 268, shape: "round", frameColor: "#3a3f45", tapeType: "lead", leadG: 8, leadLen: 5, tapeGPerCm: 1.6, tapeUnit: "gpcm",
  strips: [{ id: "s1", mass: 8, t: 455 }, { id: "s2", mass: 8, t: 407, side: -1 }, { id: "s3", mass: 8, t: 407, side: 1 }] };

const SHOTS = [
  // The coach's player page (Sessions tab), and the dashboard on a phone: the busy coach day.
  { name: "player", ...desk(1440, 900), ...coach, path: `/coach?open=${P.aoife.page}`, tab: "Sessions" },
  // The hero: the top of the dashboard, Hi Kevin and the player cards, the bell in the top bar and the nav below.
  { name: "phone-dark-hero", ...phone, ...coach, path: "/coach" },
  { name: "phone-dark-coach", ...phone, ...coach, path: `/coach?open=${P.aoife.page}`, tab: "Ratings" },
  // A player's own home, and their box on the league page.
  { name: "phone-dark-player", ...phone, key: P.aoife.key, path: "/me" },
  { name: "phone-dark-club", ...phone, key: P.aoife.key, member: D.member.token, path: "/league/me" },
  // The club's league page.
  { name: "box-league", ...desk(1440, 900), club: D.club.key, path: `/club`, before: async (page) => {
    await tap(page, "Leagues");
    const row = page.getByText("Naas Winter Box League", { exact: true }).first();
    await row.waitFor();
    await row.click();
    // the live round's boxes, as a club sees them mid-month
    const live = page.getByText("Rounds", { exact: true }).first();
    await live.waitFor({ timeout: 8000 });
    await live.evaluate((el) => { el.scrollIntoView({ block: "start" }); window.scrollBy(0, -70); });
  } },
  // The tools.
  { name: "tactics", ...desk(1040, 650), ...coach, path: "/tactics", store: { pc_board_draft: JSON.stringify(D.board.play), pc_board_players: JSON.stringify(D.board.names),
    pc_current_player: JSON.stringify({ code: P.aoife.page, name: P.aoife.name }) } },
  { name: "tracker", ...desk(1440, 900), ...coach, path: "/tracker", before: tracker },
  { name: "tagger", ...desk(1440, 900), ...coach, path: "/tagger", before: tagger, video: true },
  { name: "analyse", ...desk(1440, 900), ...coach, path: "/analyse", before: analyse, video: true },
  { name: "americano", ...desk(765, 770), ...coach, path: "/americano", before: americano },
  { name: "scoreboard", ...desk(1440, 900), path: "/scoreboard", before: scoreboard },
  { name: "balance", ...desk(1440, 900), ...coach, path: "/balance", store: { pc_balance: JSON.stringify(BALANCE) } },
  // For later (not on any page yet).
  { name: "community", ...desk(1440, 900), ...coach, path: "/community" },
  { name: "marketplace", ...desk(1440, 900), ...coach, path: "/community/market" },
  // For the role pages (padel-coach-src Claude outputs/site-shots/TODO.md), not on any page until Kevin picks them.
  // A player's own My page, as they see it.
  { name: "my-page", ...desk(1440, 900), key: P.aoife.key, path: "/me" },
  // The club's Members tab: the list, with Import beside it.
  { name: "club-members", ...desk(1440, 900), club: D.club.key, path: "/club", before: (page) => tap(page, "Members") },
  // The Messages tab on a player's page, and the next lesson booked, on a phone.
  { name: "coach-messages", ...phone, ...coach, path: `/coach?open=${P.aoife.page}`, before: async (page) => {
    await page.getByRole("button", { name: /^Messages/ }).first().click();
  } },
  { name: "coach-booking", ...phone, ...coach, path: `/coach?open=${P.aoife.page}`, tab: "Next" },
  // Kevin's public profile, with the answer a player marked as helping. Not usable yet: the profile page reads the live
  // Worker whatever ?api= says (padel-coach-src src/profile/profileName.js profilePageApi), so this shows the live profile.
  { name: "coach-profile", ...desk(1440, 900), ...coach, path: "/kevin-obrien" },
  // The club's own group in the Community (Naas LTC members), as a member sees it.
  { name: "community-group", ...desk(1440, 900), key: P.aoife.key, path: `/community/g/${D.community.clubGroup}` },
];

const HIDE = `
  [class*="cookie" i], [id*="cookie" i], [aria-label*="cookie" i], [class*="consent" i], [id*="consent" i],
  [data-dev], [data-dev-only], .dev-only, #__next-build-watcher, nextjs-portal { display: none !important; }
  *, *::before, *::after { caret-color: transparent !important; transition: none !important; animation-duration: 0s !important; animation-delay: 0s !important; }
`;

function urlFor(s) {
  const u = new URL(s.path, SITE);
  u.searchParams.set("api", API);
  return u.href + (s.hash || "");
}

async function settle(page) {
  await page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {});
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((img) => (img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; }))));
  });
  await page.waitForTimeout(600);
}

async function shoot(browser, s) {
  const context = await browser.newContext({ viewport: s.viewport, deviceScaleFactor: s.scale, isMobile: !!s.mobile, hasTouch: !!s.mobile,
    colorScheme: s.dark ? "dark" : "light", locale: "en-IE", timezoneId: "Europe/Dublin" });
  const store = { pc_theme: JSON.stringify(s.dark ? "dark" : "light") };
  if (s.key) store.pc_vtag_coachkey = JSON.stringify(s.key);
  if (s.club) store.pc_club_key = JSON.stringify(s.club);
  if (s.member) store.pd_league_member = s.member;
  Object.assign(store, s.store || {});
  await context.addInitScript((kv) => { for (const [k, v] of Object.entries(kv)) localStorage.setItem(k, v); }, store);
  // Look, don't touch: a write to the Worker (marking things read, a usage beacon) is answered here and never reaches it,
  // so every run sees the demo world exactly as the seed left it.
  await context.route(`${API}/**`, (route) => {
    const m = route.request().method();
    if (m === "GET" || m === "HEAD" || m === "OPTIONS") return route.continue();
    // marking read: done (nothing to say); anything else (a cloud save): the server's busy, which the tools take in their stride
    const ok = /\/(read|seen|usage)(\?|$)/.test(new URL(route.request().url()).pathname);
    return route.fulfill({ status: ok ? 204 : 503, headers: { "Access-Control-Allow-Origin": SITE, "Access-Control-Allow-Credentials": "true",
      ...(ok ? {} : { "Content-Type": "application/json" }) }, body: ok ? undefined : JSON.stringify({ error: "Writes are off while the screenshots are taken" }) });
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => console.warn(`  ${s.name}: page error: ${e.message}`));
  await page.goto(urlFor(s), { waitUntil: "domcontentloaded" });
  await page.addStyleTag({ content: HIDE });
  await settle(page);
  if (s.tab) { await page.getByRole("button", { name: s.tab, exact: true }).first().click().catch(() => page.getByText(s.tab, { exact: true }).first().click()); await settle(page); }
  if (s.before) {
    try { await s.before(page); } catch (e) { console.warn(`  ${s.name}: set-up stopped (${e.message.split(/\r?\n/)[0]}); shot as it stands`); }
    await settle(page);
  }
  const file = join(OUT, `${s.name}.png`);
  await page.screenshot({ path: file, fullPage: false, animations: "disabled" });
  await context.close();
  return file;
}

// Over 300 KB: down to a 256-colour palette (ffmpeg), which a flat UI hardly shows.
function squeeze(file) {
  const size = () => readFileSync(file).length;
  if (size() <= MAX_BYTES) return size();
  try {
    const tmp = file.replace(/\.png$/, ".q.png");
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", file, "-vf", "split[a][b];[a]palettegen=max_colors=256:stats_mode=full[p];[b][p]paletteuse=dither=sierra2_4a",
      "-compression_level", "100", tmp]);
    const before = size();
    if (readFileSync(tmp).length < before) execFileSync(process.platform === "win32" ? "cmd" : "mv", process.platform === "win32" ? ["/c", "move", "/y", tmp, file] : [tmp, file]);
  } catch (e) { console.warn(`  ${file}: not squeezed (${e.message.split("\n")[0]})`); }
  return size();
}

// --- go --------------------------------------------------------------------------------------------------------------
try {
  const r = await fetch(`${API}/v1/stats`).catch(() => null);
  if (!r) throw new Error();
} catch {
  console.error(`shots: the local Worker isn't answering at ${API}. Start it: cd padel-share-api && npx wrangler dev --port 8787 --ip 127.0.0.1`);
  process.exit(1);
}
if (process.argv.includes("--serve")) {   // just the site, to look around by hand: Ctrl+C to stop
  server.listen(PORT, "127.0.0.1", () => console.log(`${SITE}/coach?api=${API}  (sign in with the keys in ${KEYS_FILE})`));
  await new Promise(() => {});
}
const { chromium } = loadPlaywright();
await mkdir(OUT, { recursive: true });
await new Promise((r) => {
  server.once("error", (e) => { if (e.code !== "EADDRINUSE") throw e; console.log(`(using the site already served on ${SITE})`); r(); });
  server.listen(PORT, "127.0.0.1", r);
});
const browser = await chromium.launch();
const known = new Set(readdirSync(join(PUBLIC, "shots")).map((f) => f.replace(/\.png$/, "")));
try {
  for (const s of SHOTS.filter((x) => !ONLY.length || ONLY.includes(x.name))) {
    if (s.video && !CLIP) { console.log(`${s.name}.png  kept as it is (needs a match video: SHOTS_VIDEO=<file>, or --test-video)`); continue; }
    const file = await shoot(browser, s);
    const bytes = squeeze(file);
    console.log(`${s.name}.png  ${s.viewport.width * s.scale}x${s.viewport.height * s.scale}  ${Math.round(bytes / 1024)} KB${known.has(s.name) ? "" : "  (new)"}`);
  }
} finally {
  await browser.close();
  server.close();
}
