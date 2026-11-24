# Odds Whisper — submission checklist

Event: Even Realities Heads Up, Track 02: Polymarket
Deadline: **Sun 29 Nov 2026, 20:59 WAT** (23:59 Dubai time). Demo Day 3 Dec in Dubai.
Platform: DoraHacks (BUIDL page). Submit at least 30 minutes before the deadline; do not touch the repo, live page or video after submitting until winners are announced.

## Requirements

- [x] DONE — App built and packs: `npm run build` clean (tsc + Vite, 79 kB JS); `evenhub pack app.json dist` works, `out.ehpk` 37,835 bytes (verified 2026-11-23).
- [x] DONE — Market-filter logic tested: resolved sports markets skipped, open market kept at 62%.
- [ ] TODO (Eddie's step) — Run in the simulator on the borrowed desktop: `npm run dev`, then `evenhub-simulator http://localhost:5173`, tap in the simulator. First run shows LIVE or DEMO on the lens — if DEMO, the live Gamma fetch is blocked and needs fixing.
- [ ] TODO (Eddie's step) — Create the public GitHub repo and publish the code (Mabel cannot create repos).
- [ ] TODO (Eddie's step) — Create an Even Realities account and run `evenhub create` to upload to Even Hub (needs his sign-in).
- [ ] TODO (Eddie's step) — Film the demo video (up to 3 minutes, simulator or G2). Script: `VIDEO-SCRIPT.md`.
- [ ] TODO (Eddie's step) — Create the DoraHacks BUIDL page: short description, public repo link, demo video link, optional `.ehpk` upload (`out.ehpk` is ready in this folder). Keep the BUIDL page maintained — judges vote from the page.
- [ ] TODO (Mabel's step) — After the repo exists, check the README video link and repo link resolve, and that the BUIDL page carries the problem, the working flow, and the honest limits (live vs DEMO).

## Prize / payout

- $10,000 USDT for 10 winners: Grand $2,000 + 2 G2 glasses, track 1st $1,250, 2nd $500, Best Telegram $1,000. Cash in USDT within 7 days of Demo Day.
- KYC / payout details: not verified from the rules page in this task — check the DoraHacks page / form before submitting and note what it asks for.

## Honest limits (state these in the submission, do not hide them)

- Never run in the simulator or on real glasses yet.
- Live Gamma fetch inside the app is untested (only the endpoint shape was checked live). If the lens says DEMO, the fetch is blocked.
- Nothing is stored, nothing is traded, no wallet, no money moves. The app only reads public odds.

## Links

- Live data source: https://gamma-api.polymarket.com/events?active=true&closed=false&order=volume24hr&ascending=false&limit=30
- Demo video: TODO — not filmed yet.
- Public repo: TODO — not created yet.
- DoraHacks BUIDL: TODO — link not on file yet.
- Even Hub upload: TODO — needs Eddie's Even Realities account sign-in.
