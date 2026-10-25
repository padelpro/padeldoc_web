// The privacy policy, as plain data, so the page is just markup around it (session GD1, Kevin 18 Oct 2026).
// The same text is published on padelpro.ie: keep the two copies identical, and bump VERSION on any change.
// Written from an audit of what the code actually stores, not from a template. Version 1 is a first draft
// for an expert to review, so every claim here should be true of the code on the day it is published.

export const VERSION = 'Version 5, 24 October 2026'
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
  p('This policy covers thepadeldoc.com and padelpro.ie, and the coaching tools that run on both: the Match Tracker, Americano Organiser, Scoreboard, Technique Analyser, Tactics Board, Balance Calculator, Match Tagger, coach and player pages, and the Box League. The two sites share one backend, so one policy covers both.'),
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
      p('We do not store your IP address. Pages on thepadeldoc.com use Plausible, an analytics service that counts visits without cookies and without identifying anyone. padelpro.ie has no analytics. When you open a live scoreboard, Americano or shared match, we count the open using a one-way hash of your IP address and browser that changes every day and is kept for 35 days; it cannot be turned back into you. To stop abuse, some actions are rate limited using a hash of the IP address, and sign-in emails also by a hash of the email address; both are kept for two days.'),
      p('Legal basis: our legitimate interest in running the sites securely and knowing roughly how many people use them.'),

      h3('If you sign in by email or get email alerts'),
      p('If your account has an email address you can sign in with it: we email you a link that works once and for 15 minutes, and opening it gives that device its own key for 90 days. We keep a one-way hash of each device key, a short label such as “Chrome on Windows” (worked out from your browser, never stored in full), and when it was last used. Signing out on a device cancels its key. An address you add or change is confirmed by a link before it is used.'),
      p('If you turn on email alerts, the same things you would get as a phone alert also come by email: one email at most every ten minutes, listing everything since the last. Each email has a link that turns them off. We keep a copy of what we sent for seven days, in case it needs to be sent again.'),
      p('Legal basis: providing the sign-in and the alerts you asked for.'),

      h3('If you run a live scoreboard or Americano'),
      p('The names you type and the scores are sent to our server so the live link works. Anyone with the link can see them. The share is deleted 30 days after the last change. Names on a share come from the person running it, who should only add people who are happy to be shown.'),
      p('Legal basis: providing the live link you asked for.'),

      h3('If you are a coach'),
      p('We hold your name, your email if you gave one, and a hashed copy of your key (we cannot see the key itself). When you sign up on thepadeldoc.com you give your name, email, club or area and, if you choose, a phone number. Only we see the phone number, we use it only to contact you about your account, and it is encrypted in our database. Your email is used to sign you in by link and, if you turn them on, for email alerts. A sign-up whose confirm link is never opened is deleted after seven days. A request for coach access made before sign-up was opened keeps your name, email, club and note until your account is deleted. Everything you save, such as tagged matches, Tracker matches, player pages, clips, notes and Tactics Board plays with their voice-overs, is stored under your account until you delete it. A match you tag is saved to your account as soon as you add the first tag, and a play on the Tactics Board as you work on it; for each play we keep its last ten versions so you can go back to one.'),
      p('You can delete your coach account yourself, from Your account on your dashboard. It removes your account and everything under it: every player page you keep, with its sessions, notes, clips, links and the alert devices on them; your tagged and Tracker matches; your Tactics Board plays and voice-overs; your photo; your device keys and any email alerts waiting to be sent; and your request for coach access. Players who linked their own account to you are unlinked and told once that you have left. They keep their own account, matches, stats and clips; clips they sent you are on your pages, so they go with them. The notes you left on their matches are deleted; their own replies stay. If you run a Box League club, your account can’t be deleted until the club is handed over or deleted: email us and we will help.'),
      p('Legal basis: providing the account and tools you asked for.'),

      h3('If a coach has made a page for you'),
      p('A coach can make a page for a player they coach. It can hold your name, session notes, homework, ratings, fitness test results, videos, photos, Tactics Board plays with voice-over, a racket report, questions you ask, clips you send the coach from your own account, and the coach’s replies. The coach also has private notes you never see. You see your page through a private link that lasts a year, or through your own account if you link it. If you turn on alerts, your browser’s push subscription is stored so we can send them.'),
      p('The coach is responsible for telling you that the page exists and for having your agreement, or a parent’s or guardian’s agreement if you are under 16. If a coach has made a page about you that you do not want, email us and we will remove it. If your coach deletes their account, the page they kept for you is deleted with it; if you linked your own account, you are told once and keep your own account, matches, stats and clips.'),
      p('Legal basis: our legitimate interest in providing coaching tools, and the coach’s agreement with you.'),

      h3('If you have a player account (thepadeldoc.com)'),
      p('We keep your name, your email if you give one, and a hash of your key. Your email is used to sign you in by link and, if you turn them on, for email alerts; a coach you link to never sees it. We keep the matches, stats and clips you save, which of the four players is you in a match you pick yourself in, and any coach link you make. A linked coach sees your saved matches and stats, not your clips, except the ones you send them (below). You must be 16 or over to open an account. You can unlink or delete your account at any time from your page; deleting removes everything, including the clips you sent your coach. If you run a Box League club, your account can’t be deleted until the club is handed over or deleted.'),
      p('Legal basis: providing the account you asked for.'),

      h3('If you send a clip or a frame to your coach (thepadeldoc.com)'),
      p('If your player account is linked to a coach, you can send them a video, or a saved frame (a still picture from your video, with your drawings), from the Technique Analyser, with a note if you like. We store the video or frame, its title and your note (up to 500 characters) on the page your coach keeps for you, marked as sent by you, and it counts towards your coach’s clip storage. Your coach gets an alert that you sent it. Your coach sees it, with your note, on that page; anyone else only sees it if your coach adds it to your Videos, where it shows like any video or photo on your page, with your note as its note, which your coach can then edit.'),
      p('You or your coach can delete it at any time: you from My page, under Sent to coach, and your coach from your page. Your note is stored with it and deleted with it: deleting it removes the video or frame and its note for both of you. If you unlink, what you sent stays on your coach’s page, and you can still see and delete it from My page. If you delete your account, everything you sent is deleted with it, notes included. If your coach deletes the page they keep for you, or their account, what you sent goes with it.'),
      p('Legal basis: providing the service you asked for.'),

      h3('If you add a photo of yourself (thepadeldoc.com)'),
      p('Coaches and players can each add a photo of themselves in place of an avatar. Nobody can upload a photo for someone else: a coach can’t add one for a player. Before it leaves your device, the photo is cropped to a square and resized to 256 pixels, which also removes its metadata, including any location. It is stored with Cloudflare R2. It is deleted when you choose Remove photo, when you pick an avatar or go back to your initials instead, or when you delete your account.'),
      p('Who sees it: a player’s photo is seen by the player, their linked coach, and anyone with a link to their player page. A coach’s photo is seen by the coach and the players linked to them. It is never public, never shown on padelpro.ie, and never used for Contribute, for training any model, for face recognition or for marketing.'),
      p('Legal basis: your consent, which you can withdraw at any time by removing the photo.'),

      h3('If you play in a Box League (thepadeldoc.com)'),
      p('Your club runs its league with our tool. The club adds your name, playing level, gender (used only to decide which league you can enter, never shown), mobile number, membership number, availability and, if it has it, your email. If you are under 18 the club marks you as a junior and adds a parent’s or guardian’s contact instead. If you join through the club’s public page you give your name, mobile, a self-assessed level and that you are 18 or over.'),
      p('Your email is used for box league alerts by email, which you can turn off from your page, and to send you your private link again if you lose it. You can add, change or remove it yourself on your page. Phone numbers, emails and guardian contacts are encrypted in our database. Who sees what: the club’s admins see everything they entered. Players in your box see your name, results, bookings and, for adults only while a round is live, your mobile number so matches can be arranged. Juniors’ numbers are never shown. The club’s public league page shows names (juniors as first name and initial), boxes, results, standings and booking times, so people can come and watch. Levels, phones, emails and availability are never public, and other players never see your email.'),
      p('Each club is responsible for its own members’ data and for telling you it uses this tool. We hold the data on the club’s behalf. If the club removes you, your contact details and level are wiped straight away; your name on past results becomes “Former member” unless the club keeps it.'),
      p('Legal basis: the club’s agreement with you as a member, and our legitimate interest in providing the tool to the club.'),

      h3('If you run a club account'),
      p('We keep the club name, your name, your email (used to sign you in by link and for email alerts if you turn them on), the town or area and phone number you gave at sign-up if you gave them (the phone number is encrypted, only we see it, and we use it only to contact you about the account), a hash of your key, your club logo and any sponsor logo you upload. Logos are public. A sign-up whose confirm link is never opened is deleted after seven days, with the club it set up. A request for club access made before sign-up was opened keeps the club name, contact name, email and note, as a record of who asked. If you agree to it, we may show your club’s name and logo on thepadeldoc.com as a club using the tools; you can withdraw that at any time.'),

      h3('If you leave a review (thepadeldoc.com)'),
      p('After you have used your account on a few different days, or reached a milestone such as ten matches saved, we may ask for a review on your page. To know when to ask, we count how many different days your account is used and keep the last one, how many times we have asked, and when you said Not now. We never ask more than twice. A review is your star rating, anything you write, your first name, whether you are a coach, player or club organiser, and whether you ticked OK to show. We read every review. Only reviews we approve and that you ticked OK to show appear on the thepadeldoc.com homepage, with your first name and role; never your full name, email or anything else. Email us to have yours taken down at any time.'),
      p('The homepage also shows how many coaches, players and clubs use thepadeldoc.com. It is a count only: no names and nothing that points to anyone.'),
      p('Legal basis: our legitimate interest in hearing how the tools work for people, and your consent for showing your review.'),

      h3('If you contribute a match video (thepadeldoc.com)'),
      p('When you send a video to help train padel-vision, we store the video, your tags (which include the players’ names you typed), the four statements you ticked, the time you ticked them, and your email if you chose to give one, which is used only for updates on padel-vision. The original file name is not kept. The video is used to build a computer model that finds rallies and shots, which may be used in free and paid products. It is never published.'),
      p('You can withdraw at any time with the remove link shown when the upload finished, or by emailing us with your contribution ID. Withdrawing deletes the video and tags. A record that a contribution existed and was withdrawn is kept, with no video, email or names.'),
      p('Legal basis: your consent, which you can withdraw.'),

      h3('If you sign up on padelpro.ie'),
      p('To play in the PadelPro circuit you give your name, email, password, date of birth, gender, home club and mobile number, and optionally your county. Your date of birth decides your age band and your gender decides your category; neither is published. Your name, club, ranking, results and event history are public on padelpro.ie, which you agree to when you sign up. We record when you agreed. If you tick the box for circuit updates and sponsor offers, we email you those until you untick it.'),
      p('When you enter an event with a partner, we hold your partner’s email to find or invite them. Host clubs give a contact name, email, phone and venue address; only the club name, town and county are public. Admin actions on the platform are written to a permanent log, so there is a record of who changed what.'),
      p('Legal basis: providing the circuit you entered, your consent for public rankings and for marketing emails, and our legitimate interest in running fair, auditable competitions.'),

      h3('Things we never ask for'),
      p('We do not collect health or medical information, and the tools have no field for it. Please do not type injury or medical details into notes. We never see your password on padelpro.ie, and we never see your key on thepadeldoc.com; both are stored as one-way hashes.'),
    ],
  },
  {
    id: 'who-sees',
    title: '3. Who we share it with',
    blocks: [
      p('We do not sell data and we do not share it with advertisers. The services that handle data on our behalf are:'),
      list(
        'Cloudflare: runs our backend and stores the database, clips, videos, photos and logos. Cloudflare is a US company; transfers are covered by the EU-US Data Privacy Framework and standard contractual clauses in its data processing terms.',
        'Netlify: hosts the websites. US company, covered the same way.',
        'Resend: sends our emails (sign-in links, confirm links and alerts). It receives the address, the subject and the text of each email. US company, covered the same way.',
        'Plausible: cookie-free analytics for thepadeldoc.com, hosted in the EU.',
        'Supabase: the database and login system for padelpro.ie, including the emails it sends to confirm your address or reset your password.',
        'Apple, Google, Mozilla and Microsoft push services: deliver alerts to your device if you turn them on. They see where to deliver, not what; the message is encrypted so only your device can read it.',
        'YouTube: when you press Load video on a YouTube link in the Match Tagger, the player loads from youtube-nocookie.com. From that moment YouTube receives your IP address and may store information on your device. See the cookie policy.',
      ),
      p('Beyond those, data is shared only as described above: with the coach, club or players you are connected to, and publicly where this policy says something is public.'),
    ],
  },
  {
    id: 'keep',
    title: '4. How long we keep it',
    blocks: [
      list(
        'Live scoreboards and Americanos: deleted 30 days after the last change.',
        'Match view links: expire after 30 days. Player page links: after a year. Expired or revoked links are removed 30 days later.',
        'Visit counts: the daily hash is kept 35 days. Rate-limit hashes: two days.',
        'Sign-in and confirm links: deleted a day after they expire. Device keys from an email sign-in: last 90 days, then removed 30 days later. Copies of alert emails: seven days.',
        'Alerts waiting to be sent, such as telling linked players that their coach has left: deleted once sent, a few every ten minutes.',
        'Your photo: kept until you remove it, pick an avatar instead, or delete your account.',
        'Clips and frames you send your coach, with your note: kept until you or your coach deletes one, or until your account, your coach’s page for you or your coach’s account is deleted. An unlink does not delete them.',
        'Tactics Board plays: the last ten versions of each play are kept; older versions are deleted as new ones are saved.',
        'Contributions that never finished uploading: removed after 48 hours.',
        'Coach and club sign-ups never confirmed: deleted after seven days.',
        'Reviews: kept until the account is deleted or you ask us to remove one.',
        'Everything else (accounts, tagged and Tracker matches, Tactics Board plays, player pages, clips, notes, box league records, requests for access, padelpro.ie player and club records): kept until you or the person who created it deletes it, or until you ask us to. We do not delete active coaching data on a timer, because coaches rely on a player’s history staying put.',
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
        'A coach who makes a page for a player under 16 is responsible for having a parent’s or guardian’s agreement first.',
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
    ],
  },
]
