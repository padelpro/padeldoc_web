---
title: "Can You Trust Your Padel App's Stats?"
slug: "2026-11-17-padel-app-stats"
date: "2026-11-17"
summary: "An automated padel stats app showed 15% fewer shots than a careful video count of the same matches, and 45% fewer smashes. Here is how far to trust your match report."
image: "/og.png"
tags: ["padel", "match analysis", "technology"]
type: "deep-dive"
draft: false
---

An automated padel stats app showed 15% fewer shots than a careful video count of the same matches, and **45% fewer smashes.** That is the main finding of the first independent check of an AI padel app's match reports that I have seen ([Sánchez-Alcaraz et al., 2026](https://doi.org/10.3389/fspor.2026.1915133)).

More and more clubs now have cameras that send you a match report on your phone after you play. These reports are handy. But if you start changing your training because the app says you hit too few smashes or too many volley winners, you need to know how far you can trust those numbers. This study gives us a first answer and reaffirms our belief at The Padel Doc that AI can assist us, not replace the coaching. As the old proverb goes, 'the devil is in the detail'. And with these AI camera systems, the details can get missed.

## What the study did

Researchers at the University of Murcia filmed three amateur men's matches in spring 2026 with Padmi, a commercial camera system that films from behind both back walls and produces automatic match reports. All six players were aged 22 to 26, had played padel for more than 10 years and competed at regional level in Spain.

They followed one player across the three matches. The app's report for that player was compared with a manual count of every one of his shots, coded frame by frame from the same footage by two trained observers. The two coders agreed with each other very closely (kappa 0.92 to 0.94), so the manual count is a solid reference, though no human count is perfect.

They compared six shot types (forehand, backhand, forehand volley, backhand volley, bandeja and smash) and three outcomes (rally continues, error, winner).

## What they found

Over the three matches, the video count found 891 shots and the app showed 757: 134 fewer, or 15% short. The app came up short in every match, by 11% to 19%.

The gap was not the same for every shot.

| Shot | Video count | App | Difference |
| --- | --- | --- | --- |
| Smash | 96 | 53 | -45% |
| Forehand | 254 | 182 | -28% |
| Backhand | 250 | 200 | -20% |
| Bandeja | 86 | 83 | -3% |
| Backhand volley | 102 | 108 | +6% |
| Forehand volley | 103 | 131 | +27% |

So the app showed far fewer smashes and groundstrokes, and more volleys than were really hit.

### The overall picture looked fine but the details were missed.

Across whole matches, the share of shots that kept the rally going, ended in an error or won the point was within 3.3 percentage points of the video count. If you only looked at the summary screen, you would think the app was spot on.

Shot by shot, it was a different story:

- **Smash:** the app showed 28 points more smashes as "successful" (rally continues) and 24 points fewer smash winners. Your smash would look safer and less deadly than it really is.
- **Bandeja:** the count was close (86 vs 83), but the app showed 21 points fewer bandejas keeping the rally going and 13 points more bandeja winners.
- **Forehand volley:** 12 points fewer kept in play and 9 points more winners.

The bandeja shows why this matters. The number of shots matched almost perfectly, yet the outcomes were well off. A matching total does not mean a matching story.

## Why the numbers drift

The researchers could only see the app's summary screens, not its shot-by-shot data, because the app does not let you export it. So they could not say which shots were missed, which were counted twice and which were put in the wrong box. They give three likely causes:

1. **Missed shots.** The camera or software does not register a stroke at all.
2. **Wrong label.** The shot is seen but filed as the wrong type. A bandeja and a smash can look alike from a camera high behind the glass, and a forehand hit near the net could be logged as a volley. That would fit fewer forehands and more forehand volleys.
3. **Different definitions.** The app may define "successful", "winner" or "smash" differently from a coach. The researchers or end users are not told how it decides.

Padel makes this hard for any camera system: glass rebounds, four players blocking each other's view, fast changes of position and overheads that differ only in small details.

It is not all bad news for the technology. A similar check of a tennis app, SwingVision, found it matched human analysts well for most measures when filmed from a good angle (Choe et al., cited in the paper). Padel apps can get there too. They just need to be tested this way, openly.

## How I would use your app stats

I am not saying bin the app. A free report after every match is a great prompt to think about how you played. Just use it the right way.

1. **Trust the trend, not the decimal.** Use the summary to spot big patterns over several matches, such as more errors than usual or fewer points won at the net.
2. **Check overheads and volleys on video.** These were the least reliable numbers. If the app says your smash rarely wins the point, watch your smashes before you change anything.
3. **Never change training on one number from one match.** Look for the same pattern across three or four matches, then confirm it on video.
4. **Compare like with like.** Use the same app, court and camera set-up when you track progress. Changing systems changes the numbers.
5. **Ask for the raw data.** If your club or app provider can export shot-by-shot data with timestamps, you can check it yourself. If they cannot, treat shot-type numbers as rough.
6. **For decisions that matter, tag it yourself.** Ten minutes tagging the key points of a match with a coach will tell you more than a page of automated percentages.

## What this study can and cannot tell us

It is one player, three matches, one app version and one court. The authors are clear that it is not a formal validation, or a takedown, of Padmi. Other players, levels, courts and camera angles could give different results. What it does show is that a summary screen can look right while the shot-level detail is off. That is reason enough to check before you act.

I would love to see the same test run on more systems, with women's and real amateur matches, and with apps sharing their shot-by-shot data so we can see exactly where they go wrong.

Do you have any matches you would like to share with us?

*Kevin O'Brien, PhD, S&C coach and head padel coach. This post is for education and is not medical advice.*

## Source

Sánchez-Alcaraz Martínez BJ, Sánchez-Frutos S, Maguillo-Gómez E, Conde-Ripoll R. Comparison of automated and manual performance analysis tools in amateur padel: a descriptive case study. Frontiers in Sports and Active Living, 2026, 8. Open access. [doi.org/10.3389/fspor.2026.1915133](https://doi.org/10.3389/fspor.2026.1915133)
