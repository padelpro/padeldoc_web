// Every version line in the privacy page's history (Version 9 on) says it is a draft for expert review, until Kevin has
// the page reviewed (Kevin 9 Nov 2026: v20 had lost it; every version should match).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("privacy: every version from 9 on says it is a draft for expert review", () => {
  const src = readFileSync(new URL("./legal/privacy-content.ts", import.meta.url), "utf8");
  const lines = [...src.matchAll(/p\('Version (\d+) \([^']*'\)/g)].map((m) => ({ n: Number(m[1]), text: m[0] }));
  const from9 = lines.filter((l) => l.n >= 9);
  assert.ok(from9.length >= 12, `found ${from9.length} version lines from 9 on`);
  for (const l of from9) assert.match(l.text, / is a draft for expert review\./, `Version ${l.n}`);
});
