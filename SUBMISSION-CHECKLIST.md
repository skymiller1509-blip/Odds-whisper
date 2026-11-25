# Odds Whisper — submission checklist

Event: Even Realities Heads Up, Track 02: Polymarket
Deadline: **Sun 29 Nov 2026, 20:59 WAT** (23:59 Dubai time). Demo Day 3 Dec in Dubai.
Platform: DoraHacks (BUIDL page). Submit at least 30 minutes before the deadline; do not touch the repo, live page or video after submitting until winners are announced.

## Requirements

- [x] DONE — App built and packs: `npm run build` clean (tsc + Vite, 79 kB JS); `evenhub pack app.json dist` works, `out.ehpk` re-packed 2026-11-25 after the tap fix: 38,382 bytes, md5 5222b173ab7deb419d8dfe10520ba987 (the 23 Nov pack was 37,835 bytes — do not use it).
- [x] DONE — Market-filter logic tested: resolved sports markets skipped, open market kept at 62%.
- [x] DONE 2026-11-25 — Simulator run on the borrowed laptop: lens showed LIVE odds (1/5, NVIDIA CEO, Yes 100%); one Click tap advanced it to 2/5, filmed taps to 3/5, 4/5, 5/5. Simulator tap quirk fixed in the app (accepts typeless temple-tap event, commit `dd90a31`).
- [x] DONE 2026-11-24 — Public GitHub repo: https://github.com/skymiller1509-blip/odds-whisper
- [ ] TODO (Eddie's step) — Create an Even Realities account and run `evenhub create` to upload to Even Hub (needs his sign-in). The pack to upload is the re-packed `out.ehpk` (38,382 bytes, 2026-11-25, includes the tap fix) — not the 23 Nov one.
- [x] DONE 2026-11-25 — Demo video filmed (Win+G, simulator) and built: `demo-video-final.mp4`, 1m 57s, Paloma narration. Eddie approved the upload and it is LIVE on YouTube (Unlisted) since ~17:37 WAT: https://www.youtube.com/watch?v=S-ig6wpO6As — verified live 2026-11-25 ~18:14 WAT. Script: `VIDEO-SCRIPT.md`.
- [ ] IN PROGRESS 2026-11-25 evening (Eddie's step) — Create the DoraHacks BUIDL page: short description, public repo link, demo video link, optional `.ehpk` upload (`out.ehpk` is ready in this folder — use the 2026-11-25 re-pack). Keep the BUIDL page maintained — judges vote from the page.
- [ ] TODO (Mabel's step) — After the repo exists, check the README video link and repo link resolve, and that the BUIDL page carries the problem, the working flow, and the honest limits (live vs DEMO).

## Prize / payout

- $10,000 USDT for 10 winners: Grand $2,000 + 2 G2 glasses, track 1st $1,250, 2nd $500, Best Telegram $1,000. Cash in USDT within 7 days of Demo Day.
- KYC / payout details: not verified from the rules page in this task — check the DoraHacks page / form before submitting and note what it asks for.

## Honest limits (state these in the submission, do not hide them)

- Run in the Even Hub simulator only, never on real G2 glasses. Live Gamma fetch works in the simulator (lens showed LIVE, 1/5 → 2/5 on tap). Real-glasses tap behaviour is unproven; the simulator sends a typeless temple-tap event, which the app now accepts.
- Nothing is stored, nothing is traded, no wallet, no money moves. The app only reads public odds.

## Links

- Live data source: https://gamma-api.polymarket.com/events?active=true&closed=false&order=volume24hr&ascending=false&limit=30
- Demo video: https://www.youtube.com/watch?v=S-ig6wpO6As (Unlisted, 1m 57s, live since 2026-11-25 ~17:37 WAT).
- Public repo: https://github.com/skymiller1509-blip/odds-whisper (public since 2026-11-24; README + checklist + out.ehpk updates of 2026-11-25 still to publish — see Mabel's step below).
- DoraHacks BUIDL: IN PROGRESS — Eddie filling the form 2026-11-25 evening; link not on file yet.
- Even Hub upload: TODO — needs Eddie's Even Realities account sign-in.
