// The cookie policy as plain data (session GD1, Kevin 18 Oct 2026). Same text on padelpro.ie; keep both copies
// identical. The storage table lists every key the tools write, from src/data.js STORAGE and the audit of
// 18 Oct 2026. Add a row when a tool gains a key.

import { VERSION, CONTACT } from './privacy-content'
export { VERSION, CONTACT }

export const intro = [
  'Cookies are small files a website stores on your device. Browser storage (local storage, session storage and IndexedDB) does the same job and the same rules apply, so this page covers all of it.',
  'Short version: our own pages set no cookies, and there is no banner because everything we store on your device is there to make a tool you opened work. The one outside service that can store things on your device is YouTube, in the Match Tagger, and only after you press Load video.',
]

export const sections: { title: string; text: string[] }[] = [
  {
    title: 'Why there is no cookie banner',
    text: [
      'Irish and EU law says a site needs your consent before storing anything on your device, unless the storage is strictly necessary for a service you asked for. Everything in the table below is of that kind: your saved match, your roster, your key, your preferences. Nothing here tracks you, nothing is used for advertising, and nothing is shared with anyone. So we do not ask, and we do not show a banner.',
      'If we ever add something that needs consent, such as advertising or tracking cookies, we will add a proper opt-in with Reject as easy as Accept. We have no plans to.',
    ],
  },
  {
    title: 'Analytics',
    text: [
      'thepadeldoc.com uses Plausible to count visits. It sets no cookies and stores nothing on your device. It does not identify you and does not follow you to other sites. padelpro.ie has no analytics.',
    ],
  },
  {
    title: 'YouTube in the Match Tagger',
    text: [
      'When you paste a YouTube link and press Load video, the Tagger loads YouTube’s player from youtube-nocookie.com, YouTube’s privacy-enhanced embed. From that point YouTube receives your IP address and may store information on your device; its privacy-enhanced mode holds back its cookies until you play the video. We load the player only because you asked for that video. If you would rather YouTube saw nothing, open a video file from your computer instead; files never leave your device.',
      'What YouTube stores is governed by Google’s privacy policy at policies.google.com/privacy.',
    ],
  },
  {
    title: 'Login cookies on padelpro.ie',
    text: [
      'When you log in to padelpro.ie, our login provider (Supabase) sets a cookie named sb-, followed by a project code, -auth-token, sometimes split into two or three parts. It keeps you logged in and is strictly necessary. It lasts until you log out or the session expires. During sign-up, email confirmation and password reset a short-lived cookie holding a one-time code is set and removed when the step completes.',
    ],
  },
]

// One row per storage item: tool, name, what it holds, how long it lasts.
export type Row = { tool: string; name: string; holds: string; lasts: string }

const until = 'Until you clear site data'
export const rows: Row[] = [
  { tool: 'All tools', name: 'pc_vtag_coachkey', holds: 'Your coach, player or club key, so you paste it once.', lasts: 'Until you press Forget key or clear site data' },
  { tool: 'All tools', name: 'pc_current_player', holds: 'The player you last picked in the coach bar.', lasts: until },
  { tool: 'All tools', name: 'pc_tooltips, pc_help_seen_*, pc_tour_seen_*', holds: 'Whether you have seen the help and tour; tooltip preference.', lasts: until },
  { tool: 'Match Tracker', name: 'pc_roster, pc_live, pc_index, pc_match_*', holds: 'Your player names, the match in progress and saved matches.', lasts: until },
  { tool: 'Match Tracker', name: 'pc_tracker_share', holds: 'The code and write key of a match you are sharing live.', lasts: until },
  { tool: 'Americano', name: 'po_setup, po_event, po_share', holds: 'Your event setup, players and schedule, and the live share code and key.', lasts: until },
  { tool: 'Scoreboard', name: 'pc_scoreboard, pc_scoreboard_share', holds: 'The match on the board, and its live share code and key.', lasts: until },
  { tool: 'Technique Analyser', name: 'pc_analyse_index, pc_analyse_*', holds: 'Your sessions: player, note, drawings and the name, size and length of the video file. Never the video itself.', lasts: until },
  { tool: 'Balance Calculator', name: 'pc_balance', holds: 'Racket weight, balance point and tape.', lasts: until },
  { tool: 'Tactics Board', name: 'pc_board_players, pc_board_styles, pc_board_draft, pc_board_index, pc_board_play_*', holds: 'Player names and hands, drawing style, the play you are working on and saved plays.', lasts: until },
  { tool: 'Tactics Board', name: 'pc_board_audio (IndexedDB)', holds: 'Voice-over recordings for your plays.', lasts: until },
  { tool: 'Tactics Board', name: 'pc_board_origin, pc_board_from_point', holds: 'A point handed over from the Match Tagger.', lasts: 'Until the next hand-over' },
  { tool: 'Match Tagger', name: 'pc_vtag_draft, pc_vtag_index, pc_vtag_*', holds: 'The match you are tagging and saved matches: player names, tags, and the YouTube id or file name.', lasts: until },
  { tool: 'Match Tagger', name: 'pc_vtag_cloud, pc_vtag_for', holds: 'The link to this match’s cloud copy, and the player it is for.', lasts: until },
  { tool: 'Match Tagger', name: 'pc_vtag_listorder, pc_vtag_clipmode, pc_vtag_quickhidden, pc_vtag_defaultpanel, pc_vtag_betanotice', holds: 'Display preferences.', lasts: until },
  { tool: 'Match Tagger', name: 'pc_vtag_contribute (session storage)', holds: 'Progress of a video contribution upload so it can resume, including its remove token.', lasts: 'Until you close the tab' },
  { tool: 'Coach and player pages', name: 'pd_alerts_notnow, pd_me_alerts_notnow', holds: 'That you said Not now to alerts.', lasts: until },
  { tool: 'Box League', name: 'pc_club_key, pc_club_pick', holds: 'Your club key and the club you last opened.', lasts: 'Until you sign out or clear site data' },
  { tool: 'Box League', name: 'pd_league_member', holds: 'Your private player link, so your page opens without the link.', lasts: until },
  { tool: 'Box League', name: 'pd_league_alerts_notnow, pd_import_map_*', holds: 'That you said Not now to alerts; which spreadsheet columns you matched when importing members (headings only).', lasts: until },
]

export const outro = [
  'Clearing your browser’s site data for thepadeldoc.com or padelpro.ie removes all of the above. Anything you had not saved to the cloud goes with it.',
  'Questions: ' + CONTACT + '.',
]
