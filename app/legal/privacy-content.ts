// The privacy policy, as plain data, so the page is just markup around it (session GD1, Kevin 18 Oct 2026).
// The same text is published on padelpro.ie: keep the two copies identical, and bump VERSION on any change.
// Written from an audit of what the code actually stores, not from a template. Version 1 is a first draft
// for an expert to review, so every claim here should be true of the code on the day it is published.
//
// Version 20 (Kevin, 9 Nov 2026) adds coach payments' first phase (padel-coach-src specs/coach-payments-spec.md 2, 4, 5.1,
// 7.1 and 8.4; padel-share-api 0094), with no money taken yet: a coach's offers and prices on their public page, their
// call settings and the video link they paste (shown only to a player with a booked call), and free intro calls booked
// from the coach's hours: the time in UTC with both time zones, the status and who cancelled, both calendars and calendar
// links, a calendar file by a private link, Google, Outlook.com and Microsoft 365 links, reminders a day and an hour
// before, 18 and over, and calls kept 12 months after the date. Sections 2, 3, 4, 6 and 8 change. DRAFT FOR EXPERT
// REVIEW, as every version: the 12 months (spec open question 15), the 18 or over tick when no year of birth is held
// (we don't store the tick), and the video service being the coach's own (we think the coach controls the meeting). Like every
// version, its line in section 8 says it is a draft for expert review (Kevin 9 Nov 2026).
//
// Version 19 (Kevin, 9 Nov 2026) adds the player journey's first two phases (padel-coach-src
// specs/player-journey-spec.md 2, 1.2 and 7.4; padel-share-api 0093): the level a player picks at sign-up or in Settings
// (one of seven, or Not sure, which stores nothing), each change kept with its date and who set it, seen by the
// player's linked coach and, with the player's yes to the academy's staff, by its staff; never sent to an AI service,
// never public. And the home page's photos from Kevin's own sessions: only with the written OK of everyone in them (a
// parent's for a child), taken down within 7 days on request. Sections 2, 4 and 8 change. DRAFT FOR EXPERT REVIEW, as
// every version: whether the level needs anything beyond providing the account (we think not: it's the player's own
// placement, shown to people who already coach them), and the photo permission wording.
//
// Version 18 (Kevin, 8 Nov 2026) adds the AI gym draft with an interview (padel-share-api 0092; padel-coach-src
// specs/gym-plans-spec.md 5.2 and 5.5, niggles-spec.md 7): a coach, or a player for themselves, answers up to eight
// questions and Anthropic drafts a gym block from the answers and the library, checked in code before anyone sees it.
// What's sent is a fixed list: the answers (with names, emails and phone numbers taken out of anything typed), an age
// band (never the year of birth), the training age band (a new optional profile field beside the year of birth), the
// weeks of tournaments and calendar events in the plan's window (types and days only, never names, titles or places),
// ratings by area, the last four weeks' training load as numbers, and the library's exercises; never a name or a
// message. Niggles go only if the player switches on "Let the AI use my niggles" (Settings, Wellness and health; off by
// default): the area, the score out of 10 and the "worse with" choices, never notes or dates; a niggle at 6 or more is
// never sent and the plan says to see a physio. Every draft lands as a draft to check; a linked player's own draft is
// seen and can be changed by their coach. Sections 2 (gym, niggles, tournaments' AI line), 3 (Anthropic) and 7
// (retention) change. DRAFT FOR EXPERT REVIEW: niggles reaching an AI provider under the player's own switch (explicit
// consent for health data to a processor, beside the niggles consent itself, whose wording moves to version 2 to name
// the switch: a player who agreed to version 1 keeps everything it covered and is asked again, with the new wording,
// before the switch can go on); at 6 or more only the exercises that load that area are left out (Kevin 9 Nov 2026);
// the coach's draft using what the coach can already see of the player (we rely on the coaching
// relationship and the player's existing sharing choices, nothing new is read); and whether the age band and the
// load numbers need a word of their own.
//
// Version 17 (Kevin, 8 Nov 2026) adds opponent scouting, phase 1 (padel-share-api 0087; padel-coach-src
// specs/opponent-scouting-spec.md): a coach can ask for a short report on an opponent pair in a tournament, from the
// published competition results and rankings Padel API holds (Premier Padel and FIP events). Padel API is named as a new
// source; Anthropic gets the published rows to word the report, never anyone's notes; the report is shown only to the
// coach who asked and kept until the day after the tournament; Padel API's answers are kept 24 hours; a person can ask
// not to be scouted. Sections 2, 3 and 7 change. DRAFT FOR EXPERT REVIEW: the legal basis for processing data about people
// who aren't our users (we rely on legitimate interest: published results of professional competition, used to prepare
// for a match, with a way to object; the assessment itself is for the reviewer), the notice to them (this page, and the
// objection route), and whether an AI-worded summary of published results needs any further safeguard.
//
// Version 16 (Kevin, 8 Nov 2026) follows two more tweaks (padel-share-api 0091). The academy's wellness yes now never
// gives more than the player's own coach sees: it holds only while the player shares their check-ins with their coach,
// at that level; setting the coach's sharing to Nothing (or turning the check-in off) withdraws it, recorded, and turning
// the coach's sharing back up doesn't restore it. Both are set in one place, Settings, Wellness and health. And a coach's
// WhatsApp number reaches academy players only if the coach turns on "Share my number with academy players too" (off by
// default); the player's own coach's number shows as before. Section 2 (Settings, Profile; the academy) changes. DRAFT
// FOR EXPERT REVIEW: the academy's wellness yes depending on the coach's sharing (one consent bounded by another, and the
// withdrawal it triggers), and the coach's number reaching academy players with the coach's own switch.
//
// Version 15 (Kevin, 8 Nov 2026) adds two tweaks (padel-share-api 0090): a coach's optional WhatsApp number, shown with a
// WhatsApp button only to the coach's own linked players and to academy players who have said yes to the academy's
// coaches, never on a public profile; and a player's "Show my photo on my profile" switch, which puts their photo on
// their public profile page. Existing photos stay off it until the player switches it on; a photo uploaded after this
// version starts with the switch on, and the switch sits beside the upload. Sections 2 (the photo, the public profile,
// Settings, Profile) and 7 (retention) change. DRAFT FOR EXPERT REVIEW: whether the switch starting on for a new photo
// is a valid consent for showing it publicly (the player chooses to upload, sees the switch beside it and can turn it
// off at once; we could make it start off instead), and the coach's number reaching academy players (the coach's own
// choice to add it, their consent, withdrawable by removing it).
//
// Version 14 (Kevin, 8 Nov 2026) adds academies (padel-share-api 0082 and 0088; padel-coach-src specs/academy-spec.md 9,
// 11 and 14, the PadelPro pilot): a coach's coaching becoming part of an academy; the player's coach staying their lead
// coach; the academy's head coach, other coaches and specialists only after the player's own yes (the head coach too,
// Kevin's P1 review), never the messages; wellness and niggles only after a separate yes, 18 and over; both withdrawable at
// once in Settings; a junior only with a parent's or guardian's yes recorded by the academy, and no health sharing under
// 18; what happens on leaving; the consent records kept. Section 3 names the academy; section 6 adds juniors in an
// academy. DRAFT FOR EXPERT REVIEW: who controls what (the academy as controller of what its staff write and of its
// players' records, us as its processor, and the processor agreement, a formality for the pilot as Kevin owns both); the
// player's yes as the lawful basis for the academy's staff; a recorded parent's yes before verified parent accounts;
// what the academy keeps after a player leaves and for how long.
//
// Version 13 (Kevin, 8 Nov 2026) adds coach availability (padel-share-api 0085 and 0086): a coach's description of their
// working hours, typed or dictated through the phone keyboard, sent to Anthropic to be read (no name or account; the
// words never stored by us); what's kept (weekly hours, changes from a later date, blocked dates with the coach's own
// reason, the time zone, a reading for 24 hours at most and a record of it without the words); who sees it (the coach
// only: it shades their calendar, warns of clashes and finds free times; never shown to players, never in a calendar
// link); Find a time reading players' calendars only as far as each player lets their coach see it, and only as busy or
// free. The sentence "No other part of the tools sends your data to an AI service" is replaced. DRAFT FOR EXPERT REVIEW:
// Anthropic's retention under the API terms (this text says "a limited period", as for draws, not "never stored");
// whether a coach's hours are their personal data at all (we treat them as such); the lawful basis for Find a time
// using a player's calendar for their coach (we rely on the access level the player set).
//
// Version 12.1 (Kevin, 7 Nov 2026) adds partners and following (padel-share-api 0084): partner links (invite or a coach's
// proposal, both accept), what partners share (shared matches, pair stats and head-to-head, with each other and each one's
// linked coach), playing side and hand, pair keys on tournaments, partners' copies of shared matches that survive an
// account delete (other people's names as text), following (approve or open), the one visibility ladder (Only me, My
// coach, My partners, My followers, Community, Anyone with my link) with its ceilings, hide my club, and one block
// everywhere. Also: the diary's downloads moved to Settings, Privacy and data; a diary can link a partner's name to a
// partner when you confirm it. DRAFT FOR EXPERT REVIEW: the lawful basis for partners' copies after the other account is
// deleted, opponents' names in pair summaries, and following between adults only.
// Version 12 (Kevin, 7 Nov 2026) adds the match diary (padel-share-api 0083): diaries from calendar, tournament, box league,
// Tracker and Tagger matches; notes on opponents (other people's names and notes, never linked to an account, never shown to
// them, never sent to AI, kept 24 months after the last match); the two coach sharing switches, off by default, also an
// academy's on the same switches. Partners and following will add to it later. DRAFT FOR EXPERT REVIEW: the lawful basis
// for other people's data (legitimate interests, household-style use), the 24 months, and the sharing.
// Version 11 (Kevin, 7 Nov 2026) adds Share my age with my coach (padel-share-api 0081): the linked coach sees the age reached
// this year and the senior category, and the gym's over-45 answer, only while it's on; never the year. It also catches up
// on coach lessons (0079, in the calendar), Today (nothing new stored), and the bio, credentials and club and role on a
// profile (0080, under the links choice). DRAFT FOR EXPERT REVIEW, with the rest.
// Version 10.4 (Kevin, 6 Nov 2026) adds Add a booking (padel-share-api 0077): a Playtomic or MatchPoint share pasted or sent
// to the calendar, with the other players' names and levels kept on the player's own event. DRAFT FOR EXPERT REVIEW: other
// people's names (shown to the linked coach unless the player turns it off) and the legal basis for keeping them.
// Version 10.3 (Kevin, 6 Nov 2026) adds the player calendar (padel-share-api 0076): events a player or their coach adds,
// venues typed in, the coach's access levels, the private calendar link for Google, Apple and Outlook, "This is me" for box
// league matches, and the after-session load prompt. DRAFT FOR EXPERT REVIEW: an injury entry (health-related, kept to
// "Unavailable: injury" and dates), other people's first names on a player's own events, and the feed as a secret link.
// Version 10.2 (Kevin, 6 Nov 2026) adds the wellness check-in and training load (padel-share-api 0075): health information,
// on its own consent and the 18 and over rule, trialled with listed accounts first. DRAFT FOR EXPERT REVIEW: the legal basis
// (explicit consent for the check-in; logged load as part of the service), the sharing levels' wording, and retention.
// Version 10.1 (Kevin, 6 Nov 2026) follows three code fixes (padel-share-api 0072, padel-jobs): deleted Community items
// erased at once, rate-limit IP hashes keyed and changed daily, trimming videos off the runner within a day.
// Version 10 (Kevin, 6 Nov 2026) is a full re-audit of the Worker, the tools and the site. DRAFT FOR EXPERT REVIEW, like
// every version. Points for the reviewer in particular:
// - health information: the gym health check, and the heart rates and impact note a coach records on a player's page
//   (the legal basis for coach-entered health data);
// - Anthropic as a processor for draw reading: its retention period under the API terms, and the US transfer wording;
// - anonymous posts: the admin can see the author.

export const VERSION = 'Version 20, 9 November 2026'
export const CONTACT = 'hello@padelpro.ie'

export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'h3'; text: string }

export type Section = { id: string; title: string; blocks: Block[] }

const p = (text: string): Block => ({ kind: 'p', text })
const list = (...items: string[]): Block => ({ kind: 'list', items })
const h3 = (text: string): Block => ({ kind: 'h3', text })

export const intro: Block[] = [
  p('This policy covers thepadeldoc.com and padelpro.ie, and the coaching tools that run on both: the Match Tracker, Americano Organiser, Scoreboard, Technique Analyser, Tactics Board, Balance Calculator, Match Tagger, coach and player pages, public profile pages, Gym plans, Tournaments, Niggles, the wellness check-in and training load, My rackets, Community, the Marketplace and the Box League. The two sites share one backend, so one policy covers both.'),
  p('It is written in plain language on purpose. If anything here is unclear, email us and we will answer in plain language too.'),
]

export const sections: Section[] = [
  {
    id: 'who',
    title: '1. Who we are',
    blocks: [
      p('The data controller is Kevin O’Brien, trading as PadelPro.ie and The Padel Doc, based in Ireland. For anything about your data, email ' + CONTACT + '. There is no data protection officer; the sites are small enough that one person answers every request.'),
    ],
  },
  {
    id: 'what',
    title: '2. What we collect, and why',
    blocks: [
      p('Most of the tools work with nothing stored anywhere but your own browser. Data reaches us only when you save, share, sign up or send something. This section goes through it by who you are.'),

      h3('If you just visit'),
      p('We do not store your IP address. Pages on thepadeldoc.com use Plausible, an analytics service that counts visits without cookies and without identifying anyone. On both sites, the tools count how often each tool is opened and used. To count each visitor only once a day, we keep a one-way hash of your IP address, browser and the tool, which changes every day and is deleted after three days; the daily totals have no hash in them. When you open a live scoreboard, Americano or shared match, we count the open the same way, with a daily hash kept for 35 days. Neither hash can be turned back into you. To stop abuse, some actions are rate limited using a one-way hash of the IP address that is keyed with a secret and changes every day, so it can’t be turned back into an address or matched from one day to the next; sign-in emails are also limited by a hash of the email address. Both are kept for two days.'),
      p('Legal basis: our legitimate interest in running the sites securely and knowing roughly how many people use them.'),

      h3('If you sign in by email or get email alerts'),
      p('If your account has an email address you can sign in with it: we email you a link that works once and for 15 minutes, and opening it gives that device its own key for 90 days. We keep a one-way hash of each device key, a short label such as “Chrome on Windows” (worked out from your browser, never stored in full), and when it was last used. Signing out on a device cancels its key. An address you add or change is confirmed by a link before it is used.'),
      p('If you turn on email alerts, the same things you would get as a phone alert also come by email: one email at most every ten minutes, listing everything since the last. If you watch anything in Community or the Marketplace, a daily summary email is also on unless you turn it off. Each email has a link that turns them off. We keep a copy of what we sent for seven days, in case it needs to be sent again.'),
      p('Legal basis: providing the sign-in and the alerts you asked for.'),

      h3('If you run a live scoreboard or Americano'),
      p('The names you type and the scores are sent to our server so the live link works. Anyone with the link can see them. The share is deleted 30 days after the last change. Names on a share come from the person running it, who should only add people who are happy to be shown.'),
      p('Legal basis: providing the live link you asked for.'),

      h3('If you are a coach'),
      p('We hold your name, your email if you gave one, and a hashed copy of your key (we cannot see the key itself). When you sign up on thepadeldoc.com you give your name, email, club or area and, if you choose, a phone number. Only we see the phone number, we use it only to contact you about your account, and it is encrypted in our database. Your email is used to sign you in by link and, if you turn them on, for email alerts. A sign-up whose confirm link is never opened is deleted after seven days. A request for coach access made before sign-up was opened keeps your name, email, club and note: a declined request is deleted overnight, one still waiting after 90 days is deleted, and an approved one is kept until your account is deleted. If you ask us for room for more players or storage, we keep your note until your account is deleted. Everything you save, such as tagged matches, Tracker matches, player pages, clips, notes and Tactics Board plays with their voice-overs, is stored under your account until you delete it. A match you tag is saved to your account as soon as you add the first tag, and a play on the Tactics Board as you work on it; for each play we keep its last ten versions so you can go back to one.'),
      p('You can delete your coach account yourself, from Your account on your dashboard. It removes your account and everything under it: every player page you keep, with its sessions, notes, clips, links, gym records and the alert devices on them; your tagged and Tracker matches; your Tactics Board plays and voice-overs; your photo; your device keys and any email alerts waiting to be sent; and your request for coach access. Players who linked their own account to you are unlinked and told once that you have left. They keep their own account, matches, stats and clips; clips they sent you are on your pages, so they go with them. The notes you left on their matches are deleted; their own replies stay. What you posted in Community and the Marketplace goes as described under those headings. If you run a Box League club, your account can’t be deleted until the club is handed over or deleted: email us and we will help.'),
      p('Legal basis: providing the account and tools you asked for.'),

      h3('If a coach has made a page for you'),
      p('A coach can make a page for a player they coach. It can hold your name, session notes, homework, ratings, fitness test results, videos, photos, Tactics Board plays with voice-over, a racket report, questions you ask, clips you send the coach from your own account, and the coach’s replies. If your coach books your next session, your answer to it (coming or not) is stored on that page and deleted with it. The coach also has private notes you never see. You see your page through a private link that lasts a year, or through your own account if you link it. If you turn on alerts, your browser’s push subscription is stored so we can send them. We also note which new sessions, videos, bookings and replies on your page you have opened, so they stop showing as new.'),
      p('If your coach uses Gym plans for you, the page also holds your gym plans and their results, and what the coach records to plan them safely: your resting and maximum heart rate, a short note about impact, and whether to avoid impact work or treat you as over 45. Heart rates and the impact note are information about your health; they are seen only by you and your coach, and go with the page.'),
      p('The coach is responsible for telling you that the page exists and for having your agreement, or a parent’s or guardian’s agreement if you are under 16. If a coach has made a page about you that you do not want, email us and we will remove it. If your coach deletes their account, the page they kept for you is deleted with it; if you linked your own account, you are told once and keep your own account, matches, stats and clips.'),
      p('Legal basis: our legitimate interest in providing coaching tools, and the coach’s agreement with you. For the gym health details, your agreement with your coach to plan your training with them.'),

      h3('If you have a player account (thepadeldoc.com)'),
      p('We keep your name, your email if you give one, and a hash of your key. Your email is used to sign you in by link and, if you turn them on, for email alerts; a coach you link to never sees it. We keep the matches, stats and clips you save, which of the four players is you in a match you pick yourself in, and any coach link you make. A linked coach sees your saved matches and stats, not your clips, except the ones you send them (below). You can also give your year of birth, which your coach never sees; it is used only for age rules, such as the 18 and over features below. If you switch on Share my age with my coach (in Settings, Coach access; off unless you turn it on, and not offered under 18), your linked coach sees your age this year and your senior category (for example 41, +40), worked out from your year of birth, and whether you are over 45 for gym plans. They never see the year itself. Switch it off and they stop seeing it. You must be 16 or over to open an account. You can unlink or delete your account at any time from your page. Deleting removes everything, including the clips you sent your coach, with the exceptions explained under Community and the Marketplace. If you run a Box League club, your account can’t be deleted until the club is handed over or deleted.'),
      p('Legal basis: providing the account you asked for.'),

      // Version 19: the level (padel-share-api 0093).
      h3('Your level (thepadeldoc.com)'),
      p('When you sign up, and at any time in Settings, you can pick the level that sounds most like you, one of seven from Just starting to Top level, or Not sure, which stores nothing. We keep the level you picked and each time you change it, with the date and who set it (you: nobody else can set it). Your linked coach sees it on their page for you, with the date you set it and how it has changed over time; if your coach is part of an academy, its staff see it once you have said yes to them, as for the rest of your page. When you leave an academy, its staff stop seeing it. It is never shown on your public profile and never sent to an AI service. If you paste bookings into your calendar, your page may compare the Playtomic level in them with yours and ask if you want to update it; that check happens on your device, and your level only changes if you change it.'),
      p('How long we keep it: your level and its history are kept until you delete your account. Legal basis: providing the account you asked for.'),

      h3('Your public profile page (thepadeldoc.com)'),
      p('Every coach, player and club account has a public profile page at thepadeldoc.com/your-name, made the first time you use your account. A player’s name there starts from their first name, and a coach’s from their full name; you can change it. Anyone can see on it: your first name (coaches: full name; clubs: the club’s name), whether you are a player, coach or club, your avatar, the country, region and home club you give in your settings if you give them, your photo if you are a coach, or a player who switches on Show my photo on my profile (below), and, for coaches, the clubs you run, how many players your answers in Community have helped, and the offers and prices you switch on (below). Your social links show there only if you choose Everyone for them (below). Nothing else about you is on it.'),
      p('A player can ask a coach to coach them from the coach’s profile, with a short message (up to 280 characters). The coach sees the request and the message. A declined request is kept so the same player can only ask again after 14 days; requests are deleted with either account.'),
      p('Legal basis: providing the account you asked for, and our legitimate interest in letting players find coaches and clubs.'),

      // Version 20: coach offers and free intro calls (padel-share-api 0094). DRAFT FOR EXPERT REVIEW.
      h3('Coaching offers and free calls (thepadeldoc.com)'),
      p('If you coach, you can set what you offer and your prices: a one-off review (its price and how soon you send it back), a monthly plan (its price, reviews a month and extras), a free intro call (its length) and a paid call (its length and price), in euro or pounds. What you switch on shows on your public profile page, to anyone who can see it. No money is taken through thepadeldoc yet: until payments start, payment is between you and the player, and we will update this policy before they do. We also keep your call settings (the gap before and after a call, how much notice you need, how far ahead players can book and the most calls a day) and the video link you paste (Google Meet, Zoom, Teams or another). Your video link is shown only to a player with a call booked with you.'),
      p('If you book a free intro call with a coach, we keep the call: which coach, the start and end time, your time zone and the coach’s, whether it is booked, moved, cancelled or done, who cancelled it, and whether either of you marked it as missed. The coach sees your first name and the time; you see the coach’s name, the time and their video link. We find free times from the coach’s hours, blocked dates, lessons and other calls; you only ever see the free times, never why another time is busy. The call goes on your calendar and the coach’s, and in both private calendar links. We send each of you an alert and an email when it is booked, moved or cancelled, and a reminder a day before and an hour before. If either of you deletes your account, the call is cancelled and the other person is told it was cancelled, with no reason given.'),
      p('Each call has its own calendar file at a private link, in the emails and on the booking: anyone with that link can open the call’s title, time and video link, so keep it to yourself. If you choose Google Calendar, Outlook.com or Microsoft 365, the call’s title, time and video link go to that company in the link you open. The call itself happens on the coach’s own video service, under its terms; we don’t create the meeting and we see nothing of it.'),
      p('Calls are for people aged 18 and over. If you gave a year of birth, it must say you are; if not, you tick to say you are, and we don’t keep the tick.'),
      p('Legal basis: providing the service you asked for.'),

      h3('If you send a clip or a frame to your coach (thepadeldoc.com)'),
      p('If your player account is linked to a coach, you can send them a video, or a saved frame (a still picture from your video, with your drawings), from the Technique Analyser, with a note if you like. We store the video or frame, its title and your note (up to 500 characters) on the page your coach keeps for you, marked as sent by you, and it counts towards your coach’s clip storage. Your coach gets an alert that you sent it. Your coach sees it, with your note, on that page; anyone else only sees it if your coach adds it to your Videos, where it shows like any video or photo on your page, with your note as its note, which your coach can then edit.'),
      p('You or your coach can delete it at any time: you from My page, under Sent to coach, and your coach from your page. Your note is stored with it and deleted with it: deleting it removes the video or frame and its note for both of you. If you unlink, what you sent stays on your coach’s page, and you can still see and delete it from My page. If you delete your account, everything you sent is deleted with it, notes included. If your coach deletes the page they keep for you, or their account, what you sent goes with it.'),
      p('Legal basis: providing the service you asked for.'),

      h3('If you trim a long video (thepadeldoc.com)'),
      p('To cut clips from a long video, such as a whole match, the full video is uploaded to our storage with Cloudflare R2 and cut on a trimming machine we run ourselves. The full video is deleted from our storage within seven days. On the trimming machine, the full video and the clips are deleted as soon as the job ends, and anything left behind by a fault within a day. The clips it makes are kept like any other clip: on the player page you chose, or, for one you keep just for yourself, until you delete it or your account.'),
      p('Legal basis: providing the service you asked for.'),

      h3('Messages between you and your coach (thepadeldoc.com)'),
      p('A coach and each player they coach can send each other messages on the page the coach keeps for that player. We store what is sent: the text (up to 2,000 characters), links (and, for a YouTube or TikTok link, the title, author and thumbnail address we look up from YouTube or TikTok when it is sent), voice notes, and videos or pictures attached to a message, with who sent each one and when. Attached files and voice notes count towards your coach’s storage. We also note when each message has been read by the other side, so the unread counts work; you can choose not to show the other side when you have read their messages, but we still note it for the counts.'),
      p('Your coach sees the thread on their page for you. You see it on My page if your player account is linked to them, and on your private page link. Anyone who has your private page link can read the messages and send messages as you, so keep the link to yourself; your coach can switch it off and make a new one at any time.'),
      p('Each side can delete its own messages at any time, and a voice note or file sent with a message is deleted with it. Everything in the thread is deleted when your coach deletes the page they keep for you, or their account. If you delete your player account, the messages you sent from it are deleted; anything sent through your private page link stays with your coach’s page until it or your coach’s account is deleted. Unlinking keeps the thread on your coach’s page.'),
      p('Legal basis: providing the service you asked for.'),

      h3('If you add a photo of yourself (thepadeldoc.com)'),
      p('Coaches and players can each add a photo of themselves in place of an avatar. Nobody can upload a photo for someone else: a coach can’t add one for a player. Before it leaves your device, the photo is cropped to a square and resized to 256 pixels, which also removes its metadata, including any location. It is stored with Cloudflare R2. It is deleted when you choose Remove photo, when you pick an avatar or go back to your initials instead, or when you delete your account.'),
      p('Who sees it: a player’s photo is seen by the player, their linked coach, and anyone with a link to their player page. A player can also show it on their public profile page, where anyone can see it, with Show my photo on my profile in Settings, Profile. The switch is on for a photo you add from 8 November 2026, and you can turn it off at any time; a photo added before then stays off your public profile until you turn it on. A coach’s photo is seen by the coach and the players linked to them, and is shown on the coach’s public profile page. Once you post, reply, join a group or list something in Community or the Marketplace, your photo is also shown there to other signed-in members. It is never shown on padelpro.ie, and never used for Contribute, for training any model, for face recognition or for marketing.'),
      p('Legal basis: your consent, which you can withdraw at any time by removing the photo.'),

      h3('If you add links to your profiles elsewhere (thepadeldoc.com)'),
      p('In your settings you can add, if you want to, your handle on Instagram, TikTok, YouTube, X, Facebook, Strava or Playtomic. We keep the handle only, not the rest of the address, and show each as a link to that profile.'),
      p('Who sees them is your choice, on the same ladder as everything else you can show (see Partners and following): only you; you and your coach (or, for a coach, the players linked to you), which is the setting unless you change it; your partners; your followers; every signed-in member; or anyone with your page link, which also puts them on your public profile page and your private page link. The same choice covers your bio, credentials and club and role. We do not visit those profiles or take anything from them.'),
      p('In Settings, Profile you can also add a short bio (up to 300 characters), your credentials (short lines such as a coaching qualification) and your club and role (for example “Head coach, Naas LTC”). They are shown on your profile card and your public profile page to whoever your links choice above lets see your links, and you can empty them at any time.'),
      p('A coach can also add a WhatsApp number in Settings, Profile, if they want to. It is shown, with a WhatsApp button that opens a chat with the coach in WhatsApp, only to the players linked to that coach and, if the coach is part of an academy and turns on “Share my number with academy players too” (off unless they turn it on), to the academy’s players who have said yes to its coaches. It is never on a public profile page, never shown to anyone else and never used by us to contact anyone. A chat you start that way is between you and the coach in WhatsApp: we don’t see it. The coach can change or remove the number at any time.'),
      p('To remove one, empty its field. Deleting your account removes them all.'),
      p('Legal basis: your consent, which you can withdraw at any time by emptying the fields.'),

      // DRAFT FOR EXPERT REVIEW: health information (Kevin, 4 Nov 2026 health check; migrations 0063 and 0065).
      h3('Gym plans and the health check (health information, thepadeldoc.com)'),
      p('Before your first gym plan you do a short health check, and again once a year. If you are 18 or over and agree to it, we keep: which of the questions you answered yes to (only their names, never your No answers and never anything you write), your ticks for being 18 or over, for your doctor having cleared you to train (needed after any yes), for the disclaimer and for the consent, and the date. Because this is information about your health, we keep it only with that consent.'),
      p('Who sees it: you, and a coach you have linked to, who sees only whether the check is done, whether anything was answered yes and whether you ticked that your doctor cleared you, never which question. If you answer yes, your coach gets an alert saying so, by email too if they turned email alerts on. We send you a reminder two weeks before the check is due again.'),
      p('How long we keep it: until you choose Delete my health check, do the check again (the new one replaces the old, so no history is kept), or delete your account. An out-of-date check is not deleted on its own.'),
      p('Legal basis: your explicit consent, which you can withdraw by deleting the check.'),

      // DRAFT FOR EXPERT REVIEW (version 18): the AI gym draft (padel-share-api 0092).
      h3('Gym drafts by the assistant (thepadeldoc.com)'),
      p('A coach can ask the assistant to draft a gym block for a player, and a player can ask for one for themselves (with a coach, after the option to ask the coach first). It starts with up to eight short questions: the goal, how many weeks, gym days a week and how long, where and with what kit, how long you have trained in a gym with a plan, niggles, court sessions a week, and anything you dislike or can’t do. Your answer on how long you have trained in a gym is kept on your profile next to your year of birth, so you are not asked again; you can change or clear it in Settings.'),
      p('What we send to Anthropic, our AI provider, to draft the block: the answers (anything typed has names, email addresses and phone numbers taken out first), an age band such as 30 to 44 (never your year of birth; a coach’s draft only uses your age if you share it with them, otherwise only whether you are over 45, as your coach set it), how long you have trained, the weeks and days of your tournaments and calendar events in the plan’s weeks (their type only, never names, titles, places, partners or opponents), your coach’s ratings by area (never their notes), your training load for the last four weeks as numbers, and the exercises from our library. Only what the person asking can already see is used. We never send your name, your account, your messages or your notes.'),
      p('Niggles go to Anthropic only if you switch on Let the AI use my niggles (Settings, Wellness and health; off unless you switch it on, and only you can). Then a draft can plan around them using only where it is, how bad (out of 10) and what makes it worse, never any notes or dates. A niggle at 6 out of 10 or more is never sent: exercises that load that area are left out of the plan, and the plan tells you to see a physio about it. If you agreed to the niggles consent before it mentioned the assistant, we ask you to agree to the new wording before you can switch it on. You can switch it off at any time; withdrawing your niggles consent switches it off too.'),
      p('What we keep: the draft, as a gym plan for the person to check and change before anyone uses it. A player’s own draft is theirs; if they have a coach, that coach can see and change it and gets an alert. We also keep a record of each draft for the account that asked (when, its cost, and how many lines our checks left out), without your answers. Anthropic keeps what we send only for a limited period under its commercial terms and does not use it to train its models.'),
      p('Legal basis: providing the service you asked for; for niggles, your explicit consent through the switch.'),

      h3('Tournaments (thepadeldoc.com)'),
      p('If you are 18 or over you can plan the tournaments you play. We keep what you enter or confirm: the event (name, category, level, dates, venue), your partner’s and opponents’ names as text, your matches with their times and courts, up to three keys and three plans for each event (your goals), your checklist, warm-up and travel times, notes on opponents, a recovery plan, the lessons from your review and a highlight reel. Names you enter stay as text on your tournament and are never linked to anyone’s account.'),
      p('After a match you can check in with the result, score, how hard it felt and two short notes on what worked and what to fix. On a match morning you can check in on any pain. Pain is health information: it is kept only if you have given the niggles consent (below); otherwise you see the advice and nothing is stored.'),
      p('Who sees it: you, and your linked coach, who sees your tournaments and, unless you turn it off, your check-ins (never pain without the niggles consent), can add keys, plans, a review and a reel, and can get alerts with your results, one by one or as one summary on a match day.'),
      p('Reading a draw: if you upload screenshots of a draw (up to three), we send the pictures to Anthropic, our AI provider, to read the event, your matches and the names in them, so you only have to check them. Before they leave your device the pictures are redrawn and resized, which removes their location and camera details, and our server removes any that are left. We don’t send your name or account. We never store the pictures. What was read, including every name in the draw, is kept until you confirm or cancel it, and for 24 hours at most; after that we keep only a record of the reading for your account (when, how long it took, its cost, and how many of the details you had to correct, with no names or pictures). Anthropic keeps what we send only for a limited period under its commercial terms and does not use it to train its models. The other things the tools send to an AI service are a coach’s own description of their working hours, if they choose to use it (see Your calendar, below), the published results an opponent scouting report is worded from, and what a gym draft is planned from (see Gym drafts by the assistant, above).'),
      p('How long we keep it: until you delete a tournament, choose Delete my tournaments, or delete your account. The records of draw readings are kept until your account is deleted.'),
      p('Legal basis: providing the service you asked for, and your explicit consent for pain scores.'),

      // Niggles (Kevin, 6 Nov 2026): health information. DRAFT FOR EXPERT REVIEW, like the rest of this policy: the legal
      // basis (explicit consent for health data) and the wording of this section in particular.
      h3('Niggles (health information, thepadeldoc.com)'),
      p('If you are 18 or over and choose to, you can flag a niggle: an ache or pain you want to keep an eye on. Because this is information about your health, we keep it only after you tick a separate consent for it, and you can withdraw that consent at any time.'),
      p('What we store for each niggle: where it hurts (one of a fixed list of areas, picked on a body map or from the list, and the muscle area you tapped on the map), the side, how bad it is from 0 to 10, when it started if you say, what makes it worse (chosen from a fixed list, never free text), when you flagged and last changed it, and the quick updates you add (better, same or worse, with a new score). We also keep when you gave the consent, which wording you agreed to, and that you said you are 18 or over. If you add a pain score to a tournament check-in, it is stored under the same consent.'),
      p('Why: so you can track your niggles over time, and so a coach you have linked to can see them and plan your training and tournaments around them.'),
      p('Who sees it: you, and a coach you have linked your account to, who can read your niggles and their history but cannot change them. Nobody else. It is never used to train anything, and it is sent to an AI service only if you switch on Let the AI use my niggles, and then only the area, the score and what makes it worse, for a gym draft (see Gym drafts by the assistant, above). If you unlink from your coach, they stop seeing it at once.'),
      p('How long we keep it: a niggle you mark as gone, or one untouched for six months, is cleared; cleared niggles are deleted 12 months later. When you withdraw your consent, everything is deleted at once: every niggle, its history, the consent itself, and any pain score on your tournament check-ins.'),
      p('How to delete it: delete one niggle, or all of them, from the Niggles card on your page or in Settings, or withdraw your consent in Settings, which deletes everything. Deleting your account deletes it too.'),
      p('Legal basis: your explicit consent, which you can withdraw.'),

      // Wellness and training load (Kevin, 6 Nov 2026, padel-share-api 0075): health information. DRAFT FOR EXPERT REVIEW:
      // the legal basis, the sharing levels and the retention in particular.
      h3('Wellness check-in and training load (health information, thepadeldoc.com)'),
      p('If you are 18 or over and choose to, you can do a short daily check-in: how well you slept and for how long, and how fatigued, sore, stressed and in what mood you feel, each on a scale of 1 to 5. After seven check-ins we work out a readiness light (green, amber or red) by comparing you with your own recent days, never with anyone else. It is a guide, not a diagnosis. Because this is information about your health, we keep it only after you tick a separate consent, with the 18 and over tick, and you can withdraw that consent at any time.'),
      p('What we store: each check-in and its date, the light worked out for each day and the reasons for it, your choices (what you share with your coach, your reminders), and a record of each consent you gave or withdrew and when. If you have given the niggles consent, the light also reads your active niggles; pain stays in Niggles and is not copied here.'),
      p('Training load: you can log your sessions and matches with how long they lasted and how hard they felt (0 to 10). A tournament check-in can log the match too, if you add the minutes played. This needs only the 18 and over rule, not the check-in consent.'),
      p('Why: so you can see how you are and how much you are training, and spot a hard week or a run of poor sleep; and so a coach you have linked to can plan your training around it, if you choose to share.'),
      p('Who sees it: you. Your linked coach sees your check-ins only if you choose to share, and only at the level you choose: nothing (the default), the light only, or the detail (the light, its reasons and your answers). Your linked coach sees your logged training load unless you turn that off in your choices. We note each time a coach looks. Nobody else sees it, and it is never sent to an AI service or used to train anything. If you unlink from your coach, they stop seeing it at once.'),
      p('Reminders: if you turn them on, a push notification says only "Morning check-in" or "Log today\'s session?", never your answers or your light.'),
      p('How long we keep it: check-ins, lights and the load you logged are deleted after 24 months; the record of which coach looked, after 12 months; the record of your consents stays with your account.'),
      p('How to delete it: download everything or delete your check-ins from the Wellness tab on your page, or turn the check-in off and choose to delete what was kept. Deleting your account deletes it too.'),
      p('Legal basis: your explicit consent for the check-in and its sharing, which you can withdraw; providing the service you asked for, for the training load you log.'),

      h3('My rackets (thepadeldoc.com)'),
      p('You can keep a list of your rackets, with the weight, balance, grips and extras of each weighing, and choose who sees it. Your coach can add a racket to your list. Racket pages show summaries across everyone’s weighings: how many there are, and averages only once there are at least three rackets, never a single weighing or a name. Your rackets are deleted with your account.'),
      p('Legal basis: providing the service you asked for.'),

      h3('Community (thepadeldoc.com)'),
      p('Community is for signed-in members only. We keep what you post there: posts, replies, reactions, pictures and clips, groups you make or join, invites (an invite link lasts seven days), people you block, and reports you make about a post, with your reason and note, which only we see. Other members see your posts with your first name (a club: the club’s name), whether you are a player, coach or club, and your avatar or photo. Ask a coach uses the country, region and home club in your settings to show your question to the right coaches.'),
      p('Tagging: other members can find you and tag you with @ in a post, which sends you an alert. This is on unless you turn it off in your settings.'),
      p('Posting anonymously: players can post in a zone anonymously. Other members then see “A player” in place of your name, avatar and photo, on the post and your replies under it. We can still see who wrote it, so we can deal with reports.'),
      p('Sharing from a tool: when you share something from a tool to Community, such as a match, a Tracker match, a Tactics Board play, a Balance result or a clip, we keep a copy of what the tool showed, which can include the players’ names in it. Whoever can see the post can open the copy.'),
      p('Deleting: when you delete a post or reply, or we remove one, it disappears for everyone and is erased at once: its text, any @mentions in it, its link, its pictures and clips, and the copy from a tool shared with it. Only an empty placeholder marked as deleted stays, so the conversation around it holds together. When you delete your account, your posts and replies are deleted, except a post others have replied to, which stays with your name shown as “Former member”. Pictures and clips you upload but never post are deleted after a day.'),
      p('Legal basis: providing the service you asked for, and our legitimate interest in keeping Community safe.'),

      h3('Watching (thepadeldoc.com)'),
      p('You can watch posts, Marketplace listings, zones and groups, and save up to ten searches, to hear when something changes or something new matches. Your own posts, posts you reply to and listings you save are watched for you. We may also suggest zones, with the reason why. Alerts come in your bell, by push if you turned it on, and in the daily summary email, which is on unless you turn it off. We keep what you watch and your saved searches until you remove them or delete your account.'),
      p('Legal basis: providing the service you asked for.'),

      h3('The Marketplace (thepadeldoc.com)'),
      p('If you list something, we keep the title, description, price, condition, country, any racket details and weighing, and up to eight photos. Our pages redraw each photo before it leaves your device, which removes its metadata, including any location. Signed-in members see your listing with your first name, whether you are a player or coach, your avatar or photo, the country, region and home club in your settings, the month you joined and how many listings you have up. The photos, and a preview card with the title, price, condition, region and photos but not your name, can be seen by anyone with the link, so the listing can be shared.'),
      p('Buyers and sellers can message each other about a listing; we keep those messages, with when each was read, and which buyer a seller picked when it sold. Members can save listings and report them to us.'),
      p('Reviews of a sale: within 30 days of a sale, the buyer and seller can each give the other star scores and a comment (up to 300 characters). Reviews stay hidden until both have reviewed or 14 days have passed, and the other side can reply. You can also send us private feedback about a sale. We prompt you the day after a sale.'),
      p('Deleting: when you remove a listing its photos are deleted that night; the listing record and its messages stay until your account or the other person’s is deleted. When you delete your account your listings, messages and saves go, and the other side loses the conversations they had with you. Reviews you wrote keep their star scores, so sellers’ ratings stay fair, but your name and comment are removed.'),
      p('Legal basis: providing the service you asked for, and our legitimate interest in keeping the Marketplace fair and safe.'),

      h3('If you play in a Box League (thepadeldoc.com)'),
      p('Your club runs its league with our tool. The club adds your name, playing level, gender (used only to decide which league you can enter, never shown), mobile number, membership number, availability and, if it has it, your email. If you are under 18 the club marks you as a junior and adds a parent’s or guardian’s contact instead. If you join through the club’s public page you give your name, mobile, a self-assessed level, your answers to any questions the club asks about when you can play, and that you are 18 or over.'),
      p('Your email is used for box league alerts by email, which you can turn off from your page, and to send you your private link again if you lose it. You can add, change or remove it yourself on your page. Phone numbers, emails and guardian contacts are encrypted in our database. Who sees what: the club’s admins see everything they entered. Players in your box see your name, results, bookings and, for adults only while a round is live, your mobile number so matches can be arranged. Juniors’ numbers are never shown. The club’s public league page shows names (juniors as first name and initial), boxes, results, standings and booking times, so people can come and watch. Levels, phones, emails and availability are never public, and other players never see your email.'),
      p('If your club charges an entry fee, we keep whether you said you have paid and whether the club confirmed it; the payment itself happens on the club’s own payment link, never with us. From results, the tool suggests to the club’s admins when a player might move level; only the admins see these suggestions.'),
      p('Each club is responsible for its own members’ data and for telling you it uses this tool. We hold the data on the club’s behalf. If the club removes you, your contact details and level are wiped straight away; your name on past results becomes “Former member” unless the club keeps it.'),
      p('Legal basis: the club’s agreement with you as a member, and our legitimate interest in providing the tool to the club.'),

      h3('If you run a club account'),
      p('We keep the club name, your name, your email (used to sign you in by link and for email alerts if you turn them on), the town or area and phone number you gave at sign-up if you gave them (the phone number is encrypted, only we see it, and we use it only to contact you about the account), a hash of your key, your club logo and any sponsor logo you upload. Logos are public. A sign-up whose confirm link is never opened is deleted after seven days, with the club it set up. A request for club access made before sign-up was opened keeps the club name, contact name, email and note, as a record of who asked. If you agree to it, we may show your club’s name and logo on thepadeldoc.com as a club using the tools; you can withdraw that at any time.'),

      h3('If you leave a review of the site (thepadeldoc.com)'),
      p('After you have used your account on a few different days, or reached a milestone such as ten matches saved, we may ask for a review on your page. To know when to ask, we count how many different days your account is used and keep the last one, how many times we have asked, and when you said Not now. We never ask more than twice. A review is your star rating, anything you write, your first name, whether you are a coach, player or club organiser, and whether you ticked OK to show. We read every review. Only reviews we approve and that you ticked OK to show appear on the thepadeldoc.com homepage, with your first name and role; never your full name, email or anything else. Email us to have yours taken down at any time.'),
      p('The homepage also shows how many coaches, players and clubs use thepadeldoc.com. It is a count only: no names and nothing that points to anyone.'),
      p('Legal basis: our legitimate interest in hearing how the tools work for people, and your consent for showing your review.'),

      h3('If you contribute a match video (thepadeldoc.com)'),
      p('When you send a video to help train padel-vision, we store the video, your tags (which include the players’ names you typed), the four statements you ticked, the time you ticked them, and your email if you chose to give one, which is used only for updates on padel-vision. The original file name is not kept. The video is used to build a computer model that finds rallies and shots, which may be used in free and paid products. It is never published.'),
      p('You can withdraw at any time with the remove link shown when the upload finished, or by emailing us with your contribution ID. Withdrawing deletes the video and tags. A record that a contribution existed and was withdrawn is kept, with no video, email or names.'),
      p('Legal basis: your consent, which you can withdraw.'),

      // The player calendar (Kevin, 6 Nov 2026, padel-share-api 0076). DRAFT FOR EXPERT REVIEW.
      h3('Your calendar (thepadeldoc.com)'),
      p('Lessons: your coach schedules lessons with you, alone or in a group, with the date, time and place. You see the lessons you are on and how many are on a group lesson, never the other players’ names; your coach sees who is on each. A lesson your coach cancels is kept for 30 days so your calendar app can remove it. Your Today page shows what is next and what is waiting for you from these same records; it stores nothing new.'),
      p('Your calendar shows your coach’s lessons, your tournaments, your gym sessions and your box league matches, and the events you or your coach add: matches, training, social games and times you can’t play, with the date, time, place, your time zone and, if you add them, a partner’s and opponents’ first names and a note. We use it to show your calendar, to ask how hard a session was, and to let your coach plan your training around it.'),
      p('Places: when you type where you play, we save it to a shared list of venues so others can pick it later. A new venue shows only to you until it has been checked. If you choose “Not a venue”, the words stay on your event only.'),
      p('Times you can’t play: if the reason is an injury, we store only “Not available: injury” and the dates, with a note if you add one. If you mark an entry private, your coach sees only “Not available”, never the reason or the note, and it never goes out in your calendar link.'),
      p('Your coach: if you are linked to a coach, you choose what they can do with your calendar: nothing, view it, view and add (the default), or full edit. You are told when they add or change something, and you can delete what they add. Other people’s names on your events are seen only by you and, if you let them see your calendar, your coach.'),
      p('Your calendar link: if you open it in Settings, you get a private link to subscribe to in Google, Apple or Outlook. We build it from your calendar each time your calendar app asks. It holds titles, times and places only: never other people’s names, notes or anything about your health. Anyone with the link can see it, so keep it to yourself; Reset link makes a new one and the old one stops at once. A coach’s link shows their bookings as “Coaching”, with player first names only if they choose. Google, Apple and Microsoft receive what the link holds when you subscribe, under their own privacy terms.'),
      p('Box league matches: on your league page you can tap “This is me” to tie your league link to your account, so your matches show in your calendar. We never match people by name.'),
      p('After a session: if you use training load (above), your calendar can ask how long and how hard a match or session was, once, by an alert that says only “How was it?”. Your answer is saved in your training load. After a match, if you use the match diary (below), it asks how it went instead, by an alert that says only “How did it go?”.'),
      // Add a booking (Kevin, 6 Nov 2026, padel-share-api 0077). DRAFT FOR EXPERT REVIEW.
      p('Bookings from Playtomic or MatchPoint: if you paste a booking you shared from Playtomic or MatchPoint, or share it to us from your phone, we read the text on your device and keep what you save on your calendar: the venue, date, time, court, level, the link, and the other players’ names and levels as shared. Those names are seen by you and your linked coach, unless you turn that off for your bookings or for one booking; they never go to your calendar app, to anyone else or to an AI service, and they are deleted as soon as you delete the booking (the rest of it goes 30 days later). If you choose to, we suggest who a player might be, but only from your coach, your groups and the names in your own past matches, and only you can confirm it. We never contact Playtomic or MatchPoint; the link is kept only so you can open it. This paragraph is a draft for expert review.'),
      p('Add to calendar on a single booking makes a calendar file on your own device; we keep nothing. If you choose Google Calendar instead, the session’s title, time and place go to Google in the link you open.'),
      p('Legal basis: providing the service you asked for; for an injury entry, your explicit choice to add it, which you can undo by deleting it.'),
      // Coach availability (Kevin, 8 Nov 2026, padel-share-api 0085 and 0086). DRAFT FOR EXPERT REVIEW.
      p('If you coach, your working hours: you can describe when you coach in your own words, typed or spoken through your phone keyboard’s microphone (we never receive any audio). We send those words to Anthropic, our AI provider, to turn them into your weekly hours, regular days off and dates you are away, without your name or account. We don’t store your words. What was read is kept until you save or cancel it, and for 24 hours at most; after that we keep only a record of the reading for your account (when, its cost, and how many of the details you changed, without your words). Anthropic keeps what we send only for a limited period under its commercial terms and does not use it to train its models. You can also set your hours by hand, and then nothing is sent to anyone.'),
      p('What we keep is what you check and save: your weekly hours, any change to them from a later date, the dates and times you block with a reason if you give one, and your time zone. Only you see them. They shade your own calendar, warn you when a lesson lands outside your hours, on a blocked time or over another lesson, and help Find a time. Your players never see your hours or your reasons, and they never go in any calendar link. Blocked dates are deleted 30 days after they pass; everything goes when you delete your account.'),
      p('Find a time: when you look for a time for a lesson, we check your hours, blocked dates and lessons, and the calendars of the players on it, only as far as each player lets you see their calendar (not at all if they set it to Off or have no account, which the sheet tells you). We use only whether they are busy at a time, never what or why, and we keep nothing from it.'),
      p('Legal basis for your working hours and Find a time: providing the service you asked for.'),

      // The match diary (Kevin, 7 Nov 2026, padel-share-api 0083). DRAFT FOR EXPERT REVIEW: other people's names and notes
      // about them (the lawful basis), the 24 months, and the coach and academy sharing.
      h3('Match diary'),
      p('After a match you can note the score, whether you won, how you and your partner played (1 to 10), what went well and what didn’t, and a note. It comes from a match in your calendar, a tournament match, a box league fixture, or a match you tracked or tagged, kept as one diary for one match. A box league result stays the league’s: the diary shows it, and “Flag the result” sends your note to the league as the league page would. A tournament check-in’s score and result are kept in step with the diary.'),
      p('Notes on opponents: you can add the names of the people you played and what you noticed about them. These are other people’s names and your notes about them, kept only for your own use. They hold the names you type and nothing else: we never link them to anyone’s account, even if that person uses the site or was named on a booking, the people named are never shown them, and they are never searched across accounts. We keep an opponent and every note about them for 24 months after your last match against them, then delete them.'),
      p('Who sees it: only you, unless you switch on “Share my match diary with my coach” or “Share my notes on opponents with my coach” in Settings, Coach access. Both are off unless you turn them on. Your linked coach then sees them read only, and stops seeing them as soon as you switch either off or unlink. If you are with an academy, its staff see them on the same switches. Your diary never goes into your calendar link, Community, a share link, a report for anyone else, or an AI service.'),
      p('You can edit or delete any diary, delete an opponent with every note about them, and download everything (as a file of your diaries, opponents and notes, or a spreadsheet of your diaries) from Settings, Privacy and data at any time. Deleting your account deletes all of it. Legal basis: providing the service you asked for; for the names and notes about other people, our and your legitimate interest in keeping your own record of your matches. This section is a draft for expert review.'),
      p('If you have partners (below), you can link the partner name in a diary to one of them, only when you choose to. That partner never sees your diary or how you rated them.'),

      // Partners and following (Kevin, 7 Nov 2026, padel-share-api 0084). DRAFT FOR EXPERT REVIEW: partners' copies after
      // the other account is deleted, opponents' names in pair summaries, and following between adults only.
      h3('Partners and following'),
      p('These are for players aged 18 and over, and we are trying them with a small number of accounts first. You tick that you are 18 or over the first time; we keep when you ticked.'),
      p('Partners: you can invite another player to be your partner, or your coach can suggest it; it only happens when both of you accept. Partners share their matches together and their pair stats with each other and with each one’s linked coach: who won, the points by side, winners and errors for each of you, serve and return as a pair, and a list of the pairs you have played. Nothing else is shared: not your other matches, your own stats, your tournament check-ins, your niggles or your messages. Your playing side and hand, if you add them, are shown to your partners and on boards and match tools that use the pair. On a tournament you both enter, a partner can see the event and up to three pair keys, never your own keys, plans or check-ins.'),
      p('The names of opponents in your pair matches are other people’s names, kept inside your pair’s numbers, shown only to the two of you and your coaches, and never linked to anyone’s account.'),
      p('Either of you can end a partnership at any time. When a shared match would go (you end it, the one who saved it deletes it or their account, or one of you blocks the other), the other partner keeps a copy of that match in their own matches, with the names as they were typed. That copy stays theirs even after the other account is deleted.'),
      p('Following: another member can follow you. You approve each follower unless you choose to let anyone follow you; you can remove a follower at any time without them being told. Followers see only what you show them, and never anything above it.'),
      p('Who sees what: everything you can show others sits on one ladder, and you choose its place: only you; you and your coach; your partners; your followers (who also includes your partners); every signed-in member; or anyone with your page link. Matches, tournaments and milestones go no higher than signed-in members. New ones start at your followers unless you change the default in Settings; everything you had saved before this started at only you. Some things never go above your coach, whatever you choose: niggles and pain, your health check answers, tournament check-ins, morning check-ins, recovery and reviews, your coach’s ratings and notes, and your messages.'),
      p('Hide my club: you can hide your home club, and your club and role, from everyone else: your profile page, what followers see, Community, Ask a coach and the Marketplace.'),
      p('One block, everywhere: when you block someone, they can no longer invite you, follow you or message you, your partnership with them ends (with the copies above), follows between you go, and they see your profile as someone signed out does. Your blocked people are listed in Settings, Privacy and data, where you can unblock them.'),
      p('An unanswered invite is deleted after 30 days; a declined invite or follow request is kept 14 days so it can’t be sent again at once, then deleted. Deleting your account deletes your partnerships, follows and what you shared with followers, after your partners’ copies are made. Legal basis: providing the service you asked for; for partners’ copies and opponents’ names, our and your partner’s legitimate interest in keeping a record of matches played together. This section is a draft for expert review.'),

      // Opponent scouting (Kevin, 8 Nov 2026, padel-share-api 0087). DRAFT FOR EXPERT REVIEW.
      h3('Opponent scouting (thepadeldoc.com, coaches)'),
      p('A coach can ask for a short report on an opponent pair in one of their players’ tournaments. It uses only published competition results and rankings from Padel API, which covers Premier Padel and FIP events: each player’s recent matches and scores, who they played with, their ranking over the last year, and their matches at that event. The coach picks the right person from a list; we never match a name to a person for them. Nothing comes from web searches, social media or anyone’s account with us.'),
      p('To word the report, we send those published results to Anthropic, our AI provider, without the coach’s name or account, and check every line it writes against the results before it is shown. The coach’s own notes, their players’ notes on opponents and their tagged matches are added to the report by us when it is shown, only to that coach, and are never sent to Anthropic.'),
      p('Only the coach who asked sees the report. We keep it until the day after the tournament’s last day, and Padel API’s answers for 24 hours, then delete them. If you play in those events and don’t want to be scouted here, email us: we add you to a list, you no longer appear in the search, and any report on you is deleted at once.'),
      p('Legal basis: for the coach, providing the service they asked for; for the players scouted, our and the coach’s legitimate interest in preparing for a match from results that are already public, with your right to object as above. This section is a draft for expert review.'),

      // Academies (Kevin, 8 Nov 2026, padel-share-api 0082 and 0088; the PadelPro pilot). DRAFT FOR EXPERT REVIEW.
      h3('If your coach is part of an academy'),
      p('A coach can run their coaching as part of an academy, such as PadelPro, with other coaches and specialists. If your coach’s coaching becomes part of one, we tell you on your page, and your coach stays your lead coach: your page, your messages and your link to them stay as they were.'),
      p('Nobody else in the academy, its head coach included, sees anything of yours unless you say yes to them, on the card on your page or in Settings, Coach access. If you do, the academy’s head coach, other coaches and specialists can see your page and work with you: they see your sessions, progress, matches, tournaments, training load and your calendar as far as you let your coach see it, and can add notes, clips and gym plans; the head coach can also add to your sessions and plans as your coach can. Your diary and notes on opponents follow your own switches, as for your coach. They never see your messages with your coach. Saying no, or not answering, changes nothing for you or your coach. You can switch it off at any time in Settings, Coach access, and the academy’s access stops at once.'),
      p('Your wellness check-ins and niggles are a separate question, set in Settings, Wellness and health beside what you share with your own coach: the academy’s coaches see them only if you say yes to that too, only if you are 18 or over, and never more than your own coach sees. If you share only the light with your coach, that is all they see. If you set what you share with your coach to Nothing, or turn the check-in off, the academy’s access to your wellness and niggles stops at once and your yes to it is withdrawn; sharing with your coach again doesn’t give the academy access again until you say yes to it again. You can switch it off at any time, and the academy’s access stops at once.'),
      p('We keep a record of each yes and when you gave or withdrew it, and the wording you saw, so we can show what you agreed to.'),
      p('If you are under 18, the academy can bring you in only with a parent’s or guardian’s yes, which it records with us (their name, how they gave it and when). Your wellness check-ins and niggles are never shared with the academy while you are under 18.'),
      p('If you or your coach leave the academy, its staff stop seeing your own data (your matches, calendar, training load, wellness, niggles and tournaments) at once. What its staff wrote for you, such as session notes, clips and gym plans, stays with the academy, and you keep reading the messages and the clips and notes shared with you before you left.'),
      p('Legal basis: providing the coaching you have with your coach and their academy; your consent for the academy’s head coach, other coaches and specialists, and your explicit consent for your wellness check-ins and niggles. This section is a draft for expert review, including who controls the data an academy’s staff write (we expect the academy to, with us handling it for them).'),

      h3('If you sign up on padelpro.ie'),
      p('To play in the PadelPro circuit you give your name, email, password, date of birth, gender, home club and mobile number, and optionally your county. Your date of birth decides your age band and your gender decides your category; neither is published. Your name, club, ranking, results and event history are public on padelpro.ie, which you agree to when you sign up. We record when you agreed. If you tick the box for circuit updates and sponsor offers, we email you those until you untick it.'),
      p('When you enter an event with a partner, we hold your partner’s email to find or invite them. Host clubs give a contact name, email, phone and venue address; only the club name, town and county are public. Admin actions on the platform are written to a permanent log, so there is a record of who changed what.'),
      p('Legal basis: providing the circuit you entered, your consent for public rankings and for marketing emails, and our legitimate interest in running fair, auditable competitions.'),

      // Version 19: the home page's photos (padel-coach-src specs/player-journey-spec.md 1.2).
      h3('Photos on our home page'),
      p('The home page may show photos from Kevin’s own coaching sessions. We use a photo with a person in it only with that person’s written OK, and for a child, a parent’s or guardian’s; Kevin keeps those permissions. If you are in a photo and want it taken down, email ' + CONTACT + ' and it comes down within 7 days. We never use stock photos of people or AI images of people on the home page.'),
      p('Legal basis: your consent, which you can withdraw at any time.'),

      h3('Things we never ask for'),
      p('Apart from niggles, the wellness check-in, the gym health check and the gym details your coach records (above), the tools have no field for health or medical information. Please do not type injury or medical details into notes. We never see your password on padelpro.ie, and we never see your key on thepadeldoc.com; both are stored as one-way hashes.'),
    ],
  },
  {
    id: 'who-sees',
    title: '3. Who we share it with',
    blocks: [
      p('We do not sell data and we do not share it with advertisers. The services that handle data on our behalf are:'),
      list(
        'Cloudflare: runs our backend and stores the database, clips, videos, photos and logos. Cloudflare is a US company; transfers are covered by the EU-US Data Privacy Framework and standard contractual clauses in its data processing terms.',
        'Anthropic: reads the draw screenshots you upload in Tournaments (the pictures only), a coach’s description of their working hours (the words only), the published results an opponent scouting report is worded from, and what a gym draft is planned from (the interview’s answers and the training details listed under Gym drafts, your niggles only with your switch on), in each case without your name or account. US company, covered the same way.',
        'Padel API: when a coach scouts an opponent, our server asks Padel API for that player’s published results and rankings. Padel API doesn’t learn who asked.',
        'Netlify: hosts the websites. US company, covered the same way.',
        'Resend: sends our emails (sign-in links, confirm links, alerts and the daily summary). It receives the address, the subject and the text of each email. US company, covered the same way.',
        'Plausible: cookie-free analytics for thepadeldoc.com, hosted in the EU.',
        'Supabase: the database and login system for padelpro.ie, including the emails it sends to confirm your address or reset your password.',
        'Apple, Google, Mozilla and Microsoft push services: deliver alerts to your device if you turn them on. They see where to deliver, not what; the message is encrypted so only your device can read it.',
      ),
      p('Some things you choose to open load from other companies, which then see your IP address:'),
      list(
        'YouTube: when you load a YouTube video in the Match Tagger or the Technique Analyser, YouTube’s script loads from youtube.com and the player from youtube-nocookie.com, and YouTube may store information on your device. Thumbnails for YouTube links in messages and Community load from YouTube when they are shown, and a video plays only after you tap it. See the cookie policy.',
        'TikTok and Instagram: thumbnails for TikTok links load from TikTok when they are shown; TikTok and Instagram posts play only after you tap them.',
        'YouTube and TikTok link details: when a link is sent in a message or posted in Community, our server asks YouTube or TikTok for its title, author and thumbnail. They see the link, not you.',
        'jsDelivr and Google: when you switch on Pose in the Technique Analyser, the pose model downloads from cdn.jsdelivr.net and storage.googleapis.com. Your video stays on your device.',
      ),
      p('If your coach is part of an academy, its head coach, other coaches and specialists, once you say yes, see what is described in section 2, “If your coach is part of an academy”.'),
      p('If you subscribe to your calendar link in Google Calendar, Apple Calendar or Outlook, that company receives the titles, times and places the link holds, each time it checks the link.'),
      p('If you book a call with a coach, the coach sees your first name and the time, and the call happens on the coach’s own video service (Google Meet, Zoom, Teams or another), under its terms. If you add the call with Google Calendar, Outlook.com or Microsoft 365, that company receives its title, time and video link.'),
      p('Beyond those, data is shared only as described above: with the coach, club or players you are connected to, with other members where you post in Community or the Marketplace, and publicly where this policy says something is public.'),
    ],
  },
  {
    id: 'keep',
    title: '4. How long we keep it',
    blocks: [
      list(
        'Live scoreboards and Americanos: deleted 30 days after the last change.',
        'Match view links: expire after 30 days. Player page links: after a year. Expired or revoked links are removed 30 days later.',
        'Visit counts: the daily hash is kept 35 days. Tool use counts: the daily hash is kept three days. Rate-limit hashes: two days.',
        'Sign-in and confirm links: deleted a day after they expire. Device keys from an email sign-in: last 90 days, then removed 30 days later. Copies of alert emails: seven days.',
        'Alerts waiting to be sent, such as telling linked players that their coach has left: deleted once sent, a few every ten minutes. Records of the result summaries sent to a coach: 30 days.',
        'Opponent scouting: a report until the day after its tournament’s last day; Padel API’s answers 24 hours.',
        'Your photo: kept until you remove it, pick an avatar instead, or delete your account. Whether it shows on your public profile (players) is kept with it.',
        'A coach’s WhatsApp number: kept until the coach removes it or deletes their account.',
        'Clips and frames you send your coach, with your note: kept until you or your coach deletes one, or until your account, your coach’s page for you or your coach’s account is deleted. An unlink does not delete them.',
        'Messages between you and your coach, with their voice notes and attached files: kept until the side that sent one deletes it, or until your coach’s page for you or either account is deleted, as above.',
        'Full videos uploaded for trimming: deleted from our storage within seven days, and from the trimming machine when the job ends (within a day if something goes wrong).',
        'Tactics Board plays: the last ten versions of each play are kept; older versions are deleted as new ones are saved.',
        'Contributions that never finished uploading: removed after 48 hours.',
        'Coach and club sign-ups never confirmed: deleted after seven days. Requests for coach access: declined ones overnight, ones still waiting after 90 days.',
        'Site reviews: kept until the account is deleted or you ask us to remove one.',
        'Gym health check: kept until you delete it, do it again, or delete your account.',
        'Your level and each change to it: kept until you delete your account.',
        'A coach’s offers, prices, call settings and video link: kept until the coach changes them or deletes their account.',
        'Calls with a coach: kept 12 months after the date of the call, or until either account is deleted. The reminders are sent once and not kept.',
        'Photos on the home page: until the person in them asks us to take one down (within 7 days) or we stop using it.',
        'Gym drafts: the drafted plan as long as you keep it; the record of each draft, without your answers, until the account that asked is deleted. How long you have trained in a gym: until you change or clear it, or delete your account.',
        'Tournaments: kept until you delete them or your account. Draw readings: until you confirm or cancel them, 24 hours at most; the record of each reading, without names or pictures, until your account is deleted.',
        'Niggles: a niggle you mark as gone, or one untouched for six months, is cleared, and cleared niggles are deleted 12 months later. Withdrawing your consent deletes every niggle, its history and any tournament pain score at once.',
        'Wellness check-ins, readiness lights and the training load you log: deleted after 24 months. The record of coaches looking: 12 months. The record of your consents: as long as your account.',
        'Calendar events: kept until you delete them or your account, and past events for 24 months. A deleted event is kept 30 days so your calendar app can remove it too. Your calendar link: until you reset it or delete your account. Venues you added stay on the shared list without your name.',
        'Match diary: your diaries as long as your account, or until you delete them; a diary stays when the calendar event it came from is deleted, as the match still happened. An opponent and every note about them: 24 months after your last match against them, or until you delete them.',
        'Partners and following: partnerships and follows until either of you ends them or deletes your account; an unanswered invite 30 days; a declined invite or follow request 14 days. A partner’s copy of a match you played together stays theirs.',
        'Community: pictures and clips never posted are deleted after a day; invite links last seven days. Deleted posts and replies are erased at once, leaving only an empty placeholder.',
        'Marketplace: a removed listing’s photos are deleted that night; the listing and its messages stay until either account is deleted. Reviews you wrote keep their scores, without your name or comment, after your account is deleted.',
        'Everything else (accounts, tagged and Tracker matches, Tactics Board plays, player pages, clips, notes, gym records, rackets, what you watch, box league records, approved requests for access, padelpro.ie player and club records): kept until you or the person who created it deletes it, or until you ask us to. We do not delete active coaching data on a timer, because coaches rely on a player’s history staying put.',
        'On padelpro.ie a closed player account is anonymised rather than deleted, so past results and rankings stay consistent. Your PadelPro number remains; your name and contact details do not.',
      ),
      p('Player accounts can delete themselves from their own page, and coaches from Your account on their dashboard. An account that runs a Box League club can’t be deleted until the club is handed over or deleted. Clubs: email us and we will delete your account and everything under it.'),
    ],
  },
  {
    id: 'rights',
    title: '5. Your rights',
    blocks: [
      p('Under the GDPR you can ask us to:'),
      list(
        'tell you what we hold about you and give you a copy,',
        'correct anything wrong,',
        'delete it,',
        'stop using it, or limit what we use it for,',
        'give it to you in a form you can take elsewhere,',
        'and you can withdraw any consent you gave, and object to processing based on our legitimate interests.',
      ),
      p('Email ' + CONTACT + '. We answer within a month. We may ask you to prove it is you, for example by replying from the email on the account. If you are unhappy with how we handle your data you can complain to the Data Protection Commission, Ireland’s regulator, at dataprotection.ie.'),
    ],
  },
  {
    id: 'children',
    title: '6. Children',
    blocks: [
      list(
        'You must be 16 or over to open a player account.',
        'You must be 18 or over to join a Box League yourself. Under 18s are added by the club, with a parent or guardian contact, and their phone numbers are never shown.',
        'Everyone in a contributed video must be 18 or over.',
        'You must be 18 or over to flag niggles, do the wellness check-in or log training load, do the gym health check or use Tournaments, and you confirm it when you start; if you gave a year of birth, it must agree.',
        'You must be 18 or over to book a call with a coach. If you gave a year of birth, it must agree.',
        'A coach who makes a page for a player under 16 is responsible for having a parent’s or guardian’s agreement first.',
        'An academy can bring in a player under 18 only with a parent’s or guardian’s yes, which it records with us, and their wellness check-ins and niggles are never shared with the academy while they are under 18.',
      ),
      p('If you think we hold data about a child without the right agreement, email us and we will remove it.'),
    ],
  },
  {
    id: 'security',
    title: '7. How we protect it',
    blocks: [
      p('Keys and passwords are stored as one-way hashes, and so are sign-in links. Phone numbers, emails and guardian contacts in the Box League, and phone numbers given at sign-up, are encrypted in the database. We never store raw IP addresses. Private links are long random codes, and we keep no logs of our own that record them. Admin actions on padelpro.ie need a second factor. Anything we send through a push service is encrypted so only your device can read it.'),
      p('No system is perfect. If we ever have a breach that puts you at risk, we will tell you and the Data Protection Commission as the law requires.'),
    ],
  },
  {
    id: 'changes',
    title: '8. Changes to this policy',
    blocks: [
      p('When we change how the sites handle data, we change this page and the version line below. If a change matters to you, for example a new way we contact you, we will say so on the site or by email before it starts.'),
      p('Version 2 (18 October 2026) added signing in by email, email alerts, Resend, emails on Box League members, and Tactics Board plays saved to your account.'),
      p('Version 3 (18 October 2026) added open sign-up for coaches and clubs with an optional phone number, reviews, and the homepage count of coaches, players and clubs.'),
      p('Version 4 (24 October 2026) added your own photo for coaches and players, coaches deleting their own account, what happens to linked players when they do, the Box League rule for deleting an account that runs a club, and queued alerts.'),
      p('Version 5 (24 October 2026) added sending a clip, or a saved frame, with an optional note, to your linked coach from the Technique Analyser: where it and the note are stored, who can delete them, and what happens to them when you unlink or delete your account.'),
      p('Version 6 (25 October 2026) added your answer to your next session (coming or not).'),
      p('Version 7 (25 October 2026) added messages between you and your coach: what is stored, who sees it, what anyone with your private page link can do, who can delete messages, and when they are deleted; and that we note which new things on your page you have opened.'),
      p('Version 8 (26 October 2026) added optional links to your profiles elsewhere: what is kept, who sees them, and how to remove them.'),
      p('Version 9 (6 November 2026) added niggles, which are health information: what is stored, why, who sees it, the 18 and over and consent rules, how long it is kept and how to delete it. This section is a draft for expert review.'),
      p('Version 10 (6 November 2026) comes from a fresh check of everything the tools store. It adds public profile pages, the gym health check and the gym details a coach records, Tournaments and reading draws with Anthropic, My rackets, Community (including anonymous posts and sharing from the tools), Watching and the daily summary email, the Marketplace and its reviews, trimming long videos, adding a session to your calendar, Box League entry fees and level suggestions, the count of tool use on both sites, and the services that load when you open YouTube, TikTok, Instagram or the pose model. It corrects who can see your photo and your social links, how long requests for coach access are kept, what padelpro.ie counts, and what deleting an account leaves behind. The whole policy is a draft for expert review.'),
      p('Version 10.1 (6 November 2026): deleted Community posts and replies are now erased at once, not kept until the account is deleted; the hash used for rate limits is now keyed with a secret and changes every day; and videos on the trimming machine are deleted when the job ends. This version is a draft for expert review.'),
      p('Version 10.4 (6 November 2026) adds bookings pasted or shared from Playtomic or MatchPoint: the other players’ names and levels on your own booking, who sees them, and that we never contact the booking sites. This section is a draft for expert review.'),
      p('Version 10.3 (6 November 2026) adds the player calendar: the events you or your coach add, venues, your coach’s access, the private calendar link for Google, Apple and Outlook, “This is me” for box league matches, and the after-session prompt. This section is a draft for expert review.'),
      p('Version 10.2 (6 November 2026) adds the wellness check-in and training load, which are health information: what is stored, why, who sees it and at what level, reminders, the 18 and over and consent rules, how long it is kept and how to delete it. This section is a draft for expert review.'),
      p('Version 11 (7 November 2026) adds Share my age with my coach: what your coach sees while it is on (your age this year, your senior category and whether you are over 45 for gym plans), that they never see your year of birth, and that it is off unless you switch it on. It also adds your coach’s lessons to the calendar section, the Today page, and the bio, credentials and club and role you can add to your profile. This version is a draft for expert review.'),
      p('Version 12 (7 November 2026) adds the match diary: what you can note after a match, notes on opponents (other people’s names and what you write about them, never linked to an account, never shown to them, kept 24 months after your last match against them), the two switches that share them with your coach (both off unless you turn them on), and that none of it goes to an AI service. Partners and following will be added to this section when they come. This version is a draft for expert review.'),
      p('Version 12.1 (7 November 2026) adds partners and following: partner links and what partners share, playing side and hand, pair keys on tournaments, partners’ copies of shared matches, followers, the one ladder for who sees what with its ceilings, hide my club, and one block everywhere. It also moves the diary’s downloads to Settings and lets a diary link a partner’s name to a partner when you choose. This version is a draft for expert review.'),
      p('Version 13 (8 November 2026) adds a coach’s working hours: the description a coach can give in their own words, which is sent to Anthropic to be read and is not stored by us; what we keep (their hours, changes from a later date, blocked dates and their time zone), that only the coach sees it, and how Find a time uses players’ calendars. The line saying no other part of the tools uses an AI service is replaced. This version is a draft for expert review.'),
      p('Version 14 (8 November 2026) adds academies: what happens when your coach’s coaching becomes part of an academy such as PadelPro, that its head coach, other coaches and specialists see nothing of yours without your yes (and never your messages), that your wellness check-ins and niggles need a separate yes and are never shared under 18, that a player under 18 needs a parent’s or guardian’s yes, and what happens when you leave. This version is a draft for expert review.'),
      p('Version 15 (8 November 2026) adds a coach’s WhatsApp number, shown only to their own players and to academy players who have said yes to its coaches, never publicly; and Show my photo on my profile, which lets a player put their photo on their public profile page: on for a photo added from now on, off for a photo added before until the player turns it on. This version is a draft for expert review.'),
      p('Version 16 (8 November 2026): the academy’s coaches never see more of your wellness check-ins and niggles than your own coach does, and both are set in one place, Settings, Wellness and health; setting what you share with your coach to Nothing withdraws your yes to the academy, and sharing again doesn’t restore it by itself. A coach’s WhatsApp number reaches academy players only if the coach turns that on. This version is a draft for expert review.'),
      p('Version 17 (8 November 2026) adds opponent scouting for coaches: reports from Padel API’s published results and rankings, worded by Anthropic from those results only, shown only to the coach who asked, kept until the day after the tournament, and how to ask not to be scouted. This version is a draft for expert review.'),
      p('Version 18 (9 November 2026) adds gym drafts by the assistant: the short interview, what is sent to Anthropic (the answers and a fixed list of training details, never names or messages), how long you have trained in a gym kept on your profile, and Let the AI use my niggles, off unless you switch it on, which sends only where it is, how bad and what makes it worse, never a niggle at 6 out of 10 or more, and asks you again to agree to the niggles consent’s new wording if you agreed before it mentioned the assistant. This version is a draft for expert review.'),
      p('Version 19 (9 November 2026) adds your level: the one you pick at sign-up or in Settings, each change kept with its date, seen by your linked coach (and an academy’s staff after your yes), never public and never sent to an AI service. It also adds photos on the home page, used only with the written OK of everyone in them and taken down within 7 days on request. This version is a draft for expert review.'),
      p('Version 20 (9 November 2026) adds coaches’ offers and prices on their public page, with no money taken yet, and free intro calls booked from a coach’s hours: what we keep about a call, who sees it, the call’s calendar file and calendar links, the reminders, 18 and over, and calls kept 12 months after the date. This version is a draft for expert review.'),
    ],
  },
]
