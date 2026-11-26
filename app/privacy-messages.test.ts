// A page link never reaches the messages (Kevin 25 Nov 2026, messages private: the Worker answers 404 for every verb on
// /v1/player-view/:viewCode/messages). The privacy page must not say a link shows or sends them (T2, 26 Nov 2026).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("./legal/privacy-content.ts", import.meta.url), "utf8");

test("privacy: a page link never shows or sends the messages", () => {
  assert.doesNotMatch(src, /read the messages and send messages as you/);
  assert.doesNotMatch(src, /and on your private page link\./);
  assert.match(src, /A private page link never shows the messages and can’t send them\./);
});

test("privacy: the messages section has no em or en dashes", () => {
  const start = src.indexOf("h3('Messages between you and your coach");
  const end = src.indexOf("h3('If you add a photo of yourself");
  assert.ok(start > 0 && end > start);
  assert.doesNotMatch(src.slice(start, end), /[–—]/);
});
