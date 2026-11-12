// The demo build's own words (demo.thepadeldoc.com; padel-coach-src specs/demo-site-spec.md 5.1, 9.4 and 10.2; Kevin
// 12 Nov 2026, D7). en-IE, no em dashes. The ribbon's line is the tools' own (padel-coach-src data/demo_copy.json).
import type { Block } from '../legal/privacy-content'

export const RIBBON = {
  label: 'Demo site',
  text: 'Demo, made-up people, resets every night',
  pick: 'Pick a role',
  privacy: 'Privacy',
}

export const NOTICE_TITLE = 'Privacy on the demo'
export const NOTICE_VERSION = 'Demo notice, 12 November 2026'
export const NOTICE_CONTACT = 'hello@padelpro.ie'

export const notice: Block[] = [
  { kind: 'p', text: 'This is a demo of The Padel Doc with made-up people. Everything in it goes back to the start every night.' },
  { kind: 'h3', text: 'The people' },
  { kind: 'list', items: [
    'The people are made up.',
    'Two pieces are real, shown with the permission of the people in them: a tagged match on YouTube (the players under made-up names) and a technique clip (under a made-up name).',
  ] },
  { kind: 'h3', text: 'What you type' },
  { kind: 'list', items: [
    'What you type stays in the demo’s made-up accounts, where other visitors can see it, until the reset that night (at most a day).',
    'No account, no email and no name are asked for.',
  ] },
  { kind: 'h3', text: 'Your device' },
  { kind: 'list', items: [
    'Your device keeps the demo’s key in its storage until you switch role or the reset. No cookies of ours.',
    'Your address is kept as a one-way hash for two days, for the limits.',
  ] },
  { kind: 'h3', text: 'Others' },
  { kind: 'list', items: [
    'Analytics: Plausible, with no cookies, counted as its own site, demo.thepadeldoc.com.',
    'YouTube’s own terms and cookies apply to the match video, as on thepadeldoc.com.',
  ] },
]
