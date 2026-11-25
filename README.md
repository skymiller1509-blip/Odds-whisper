# Odds Whisper — Even Realities Heads Up (Track 02: Polymarket)

**Tap your temple, and the lens whispers the crowd's odds on the next live market.**

> **Demo video:** LIVE on YouTube since 2026-11-25 ~17:37 WAT (Unlisted), 1m 57s, Paloma narration: https://www.youtube.com/watch?v=S-ig6wpO6As (video file itself is gitignored, not in this repo). Verified live 2026-11-25 ~18:14 WAT.
>
> **Submission:** DoraHacks BUIDL page — IN PROGRESS, Eddie filling the form on 2026-11-25 evening. Deadline Sun 29 Nov 2026, 20:59 WAT.
>
> **Repo:** https://github.com/skymiller1509-blip/odds-whisper (public, created 2026-11-24).

Tap temple, lens shows the next live claim: the market question, the
crowd's odds (Yes %), and one check line (24h volume, 24h move, end date).

- Pick: Odds Whisper, chosen 2026-11-20 (Eddie's idea, Mabel's pick).
  Stake to Interrupt and Cooldown were rejected the same evening.
- Build week: 23–29 Nov 2026. Submissions close 29 Nov 23:59 Dubai
  time = 20:59 WAT. Demo Day 3 Dec in Dubai.
- Prize: $10,000 USDT for 10 winners (Grand $2,000 + 2 G2 glasses,
  track 1st $1,250, 2nd $500, Best Telegram $1,000), cash in USDT
  within 7 days of Demo Day. No glasses needed — free Even Hub
  simulator is explicitly supported.

## Tech stack

- Vite + TypeScript, Even Hub SDK `@evenrealities/even_hub_sdk` 0.0.16
- Live data: public Polymarket Gamma API (read-only, no key, no account)
- Packs to `out.ehpk` with `@evenrealities/evenhub-cli` 0.2.0

## How it works

Vite + TypeScript app on the Even Hub SDK (`@evenrealities/even_hub_sdk`
0.0.16). One text container on the 576x288 lens, `isEventCapture: 1`.
A temple tap is a `CLICK_EVENT` on that container; each tap cycles to
the next claim and refreshes the lens with `textContainerUpgrade`
(no full rebuild, no flicker).

Claims are live Polymarket markets from the public Gamma API — no key,
no account, read-only:

```
https://gamma-api.polymarket.com/events?active=true&closed=false&order=volume24hr&ascending=false&limit=30
```

`outcomePrices` is a JSON string like `["0.62", "0.38"]`; the first
value is the Yes price = the implied probability. Closed markets and
sports markets are skipped, and a price of 0 or 1 is a resolved
result, not odds, so it is skipped too. (Verified live 2026-11-23:
the top-volume events were already-resolved NFL games — the filter
matters.) If the fetch fails, three baked-in claims show, clearly
labelled DEMO on the lens, never as live odds.

## Verified 2026-11-23 (this machine)

- `npm run build`: `tsc` clean, Vite bundles (79 kB JS).
- Market-filter logic test passes: resolved sports markets skipped,
  open market kept at 62% (`/tmp/odds-test.mjs` — test script, not kept).
- `evenhub pack app.json dist` works: `out.ehpk` stamped, 37,835 bytes.
  Manifest is `com.emeraldpop15035.oddswhisper`, network whitelist is
  only `https://gamma-api.polymarket.com`. (First pack failed on a
  hyphen in the package id — fixed.)
- SDK + CLI versions: `@evenrealities/even_hub_sdk` 0.0.16,
  `@evenrealities/evenhub-cli` 0.2.0, simulator 0.9.5.

## Verified 2026-11-25 (Even Hub simulator, borrowed laptop)

- Lens showed live odds for the first time: `ODDS WHISPER 1/5 [LIVE]`,
  NVIDIA CEO question, Yes 100%.
- Tap-to-advance works: one Click moved the lens 1/5 → 2/5
  ("tap: showing claim 2/5", "upgrade: ok"). The simulator sends a
  tap as a typeless system event (source 1, right temple), not a real
  `CLICK_EVENT` — the app now accepts that too (commit `dd90a31`).
  Filmed taps then advanced 2/5 → 3/5 → 4/5 → 5/5.
- Demo video filmed and built the same evening: `demo-video-final.mp4`,
  1m 57s, Paloma narration, from 35.5s of Win+G simulator footage.
  Eddie approved the upload ("Whatever upload it", 2026-11-25 ~17:35 WAT);
  it is live on YouTube (Unlisted): https://www.youtube.com/watch?v=S-ig6wpO6As
- `out.ehpk` re-packed 2026-11-25 after the tap fix: 38,382 bytes,
  built JS contains the simulator-tap acceptance. This is the pack to
  submit, not the 23 Nov one.
- Repo is public: https://github.com/skymiller1509-blip/odds-whisper

## NOT done yet — honest limits

- Never run on real G2 glasses, only in the Even Hub simulator.
  Real glasses send a proper tap event; the simulator's typeless one
  is now accepted as well, but hardware behaviour is unproven.
- Not uploaded to Even Hub: `evenhub create` needs an Even Realities
  account sign-in (Eddie's step).
- DoraHacks BUIDL page being created by Eddie on 2026-11-25 evening (his step).
- Nothing is stored, nothing is traded, no wallet, no money moves.
  The app only reads public odds.

## Try it yourself

Built for the Even Realities G2 glasses and the free Even Hub simulator
(no glasses needed). The `.ehpk` package is `out.ehpk` in this folder.

```
npm install
npm run dev          # then point the simulator at http://localhost:5173
npm run build        # tsc + vite build -> dist/
npx @evenrealities/evenhub-cli pack app.json dist   # -> out.ehpk
```

Tap the temple in the simulator (or on G2) to cycle to the next claim.
If the live fetch fails, the lens shows three baked-in claims clearly
labelled DEMO — never as live odds.
