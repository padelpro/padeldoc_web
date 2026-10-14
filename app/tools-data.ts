export type Tool = {
  slug: string
  name: string
  href: string
  line: string
  points: string[]
  shot: string
  who: ('play' | 'coach' | 'club')[]
  laptop?: boolean
  steps?: { title: string; body: string }[]
  notes?: string[]
}

export const tools: Tool[] = [
  {
    slug: 'tagger',
    name: 'Video Tagger',
    href: '/tagger',
    line: 'Tag each point of a match video and jump back to any shot.',
    points: [
      'YouTube or a video file on your laptop',
      'Score, shot types and rally lengths build as you tag',
      'Filter by player, shot, outcome or game',
      'Turn any filter into a playlist, like every unforced error on a 2nd serve',
      'Download the whole match as a spreadsheet',
    ],
    shot: '/shots/tagger.png',
    steps: [
      { title: 'Load the match', body: 'Paste a YouTube link, or open a video file from your laptop.' },
      { title: 'Set up the players', body: 'Add the four names and pick who serves first.' },
      { title: 'Tag as you watch', body: 'Pick a player, then the shot and how the point ended. The score keeps itself. Press 1st or 2nd serve at each serve to get rally lengths.' },
      { title: 'Review it', body: 'Filter by player, shot or outcome and play the result as a playlist: every winner, or every unforced error on a 2nd serve. Then read the report or download the match as a spreadsheet.' },
    ],
    notes: [
      'Works on a laptop or computer, not a phone.',
      'Your tags stay on this device unless you save them to the cloud.',
      'Coaches can save matches and send each player a view-only link.',
    ],
    who: ['play', 'coach'],
    laptop: true,
  },
  {
    slug: 'tracker',
    name: 'Match Tracker',
    href: '/tracker',
    line: 'Log winners and errors courtside and get a match report.',
    points: ['Player, shot and outcome in three taps', 'Mark where on court it was hit', 'Live score and momentum as you go'],
    shot: '/shots/tracker.png',
    steps: [
      { title: "Set up the match", body: "Add the four players and how you score." },
      { title: "Log each point", body: "Pick the player, how the point ended and the shot, then tap where on court it was hit." },
      { title: "Watch it build", body: "The score and momentum update as you log." },
      { title: "Read the report", body: "Open the report for winners and errors by player and by shot." },
    ],
    notes: [
      "Made for a phone, so you can log from courtside.",
      "You can share a live link so others follow the score.",
    ],
    who: ['play', 'coach'],
  },
  {
    slug: 'analyse',
    name: 'Video Analyser',
    href: '/analyse',
    line: 'Trim a clip, slow it down and draw on it.',
    points: ['Frame by frame and slow motion', 'Draw lines, angles and circles on the frame', 'The video never leaves your phone'],
    shot: '/shots/analyse.png',
    steps: [
      { title: "Choose a video", body: "Pick a clip from your camera roll or files." },
      { title: "Trim it", body: "Longer clips get a quick step to pick the 30 seconds you want." },
      { title: "Slow it down", body: "Play it slowly or step through it frame by frame." },
      { title: "Draw on it", body: "Add lines, angles and circles to show what is happening." },
    ],
    notes: [
      "The video never leaves your device. Nothing is uploaded.",
      "Clips are up to 30 seconds.",
      "Pose estimation is coming soon.",
    ],
    who: ['play', 'coach'],
  },
  {
    slug: 'tactics',
    name: 'Tactics Board',
    href: '/tactics',
    line: 'Draw plays and player positions on a court, step by step.',
    points: ['Move players and the ball, add arrows and zones', 'Build a play in steps, or start from a template', 'Save your top patterns of play and send them to players'],
    shot: '/shots/tactics.png',
    steps: [
      { title: "Place the players", body: "Drag the four players and the ball where you want them." },
      { title: "Draw the play", body: "Add lines, arrows, arcs, zones and targets." },
      { title: "Add steps", body: "Build the play one step at a time to show how it unfolds." },
      { title: "Save or send it", body: "Save your top patterns of play, or send one to a player." },
    ],
    notes: [
      "Start from a template if you want a head start.",
      "Mirror flips a play to the other side of the court.",
    ],
    who: ['coach', 'play'],
  },
  {
    slug: 'americano',
    name: 'Americano Organizer',
    href: '/americano',
    line: 'Set up an Americano or Mexicano, run the rounds and keep the scores.',
    points: ['Americano, Mexicano and team formats', 'Rounds sized to your court time', 'Live standings everyone can follow'],
    shot: '/shots/americano.png',
    steps: [
      { title: "Pick the format", body: "Americano, Mexicano, or the team version of either." },
      { title: "Add the players", body: "Type in the names. You need at least four." },
      { title: "Fit it to your court time", body: "Set the courts, start and finish time, warm-up and changeovers. Timed rounds are sized to fit." },
      { title: "Run the night", body: "Enter the scores each round and the standings update." },
    ],
    notes: [
      "In Mexicano, each new round is drawn from the standings after the last one is scored.",
      "Before you start, it shows how fair the draw is: repeat partners, repeat opponents and rests.",
      "Players can follow the draw and standings on their phones.",
    ],
    who: ['club'],
  },
  {
    slug: 'scoreboard',
    name: 'Scoreboard',
    href: '/scoreboard',
    line: 'Score a match courtside and share a live link.',
    points: ['Golden point, star point or advantage', 'Full third set or a match tie-break', 'Follow it live, or embed it on your site'],
    shot: '/shots/scoreboard.png',
    steps: [
      { title: "Enter the teams", body: "Team names, and player names if you want them." },
      { title: "Pick the format", body: "A full third set or a tie-break to ten, and golden point, star point or advantage." },
      { title: "Start scoring", body: "Pick who serves first and tap to score each point." },
      { title: "Share it", body: "Send the live link, or embed the score on your club site." },
    ],
    notes: [
      "Anyone with the link can follow the score live.",
    ],
    who: ['club', 'play'],
  },
  {
    slug: 'balance',
    name: 'Balance Calculator',
    href: '/balance',
    line: 'Work out where to add lead tape and what it does to the balance.',
    points: ['Find your racket, or enter its weight and balance', 'Place tape strips on the frame', 'New weight, balance, swingweight and twistweight'],
    shot: '/shots/balance.png',
    steps: [
      { title: "Find your racket", body: "Search by brand or model, or enter its weight and balance." },
      { title: "Pick the tape", body: "Weight tape or head protector, and how heavy each strip is." },
      { title: "Place the strips", body: "Tap the frame edge to add a strip. Drag it to move it." },
      { title: "Read the result", body: "New weight, balance, swingweight and twistweight." },
    ],
    notes: [
      "Try different spots before you stick anything on.",
    ],
    who: ['play'],
  },
  {
    slug: 'coach',
    name: 'Coach pages',
    href: '/coach/join',
    line: 'A private page for each player you coach.',
    points: ['Goals, session notes, homework and ratings', 'Match stats and clips from the tagger', 'Your dashboard shows who is due a session'],
    shot: '/shots/player.png',
    steps: [
      { title: "Get free coach access", body: "Ask for access and get your coach key." },
      { title: "Add your players", body: "Each player gets a private page." },
      { title: "Fill it in", body: "Goals, session notes, homework, ratings, and match stats and clips from the tagger." },
      { title: "Send the link", body: "Each player opens their own page. No account needed on their side." },
    ],
    notes: [
      "Players can tick off homework and ask you questions on their page.",
      "Players can turn on alerts for new sessions and your replies.",
    ],
    who: ['coach'],
  },
]

export const byWho = (w: 'play' | 'coach' | 'club') => tools.filter((t) => t.who.includes(w))
