// Odds Whisper — Even Realities G2 app (Track 02: Polymarket)
// One flow, end to end:
//   Tap temple (CLICK_EVENT) -> lens shows the next live claim:
//   the market question, the crowd's odds (Yes %), and one check line
//   (24h volume, 24h move, end date). Double-tap exits (OS default).
//
// Claims are LIVE Polymarket markets, fetched from the public Gamma API
// (no key, no account, read-only): https://gamma-api.polymarket.com
// outcomePrices is a JSON-encoded string like '["0.62", "0.38"]' —
// the first value is the Yes price, which IS the implied probability.
// Resolved/closed markets are skipped: a price of 0 or 1 is a result,
// not odds. If the fetch fails, three baked-in DEMO claims are shown
// and clearly labelled DEMO — never presented as live odds.
//
// Lens is 576x288. Keep every screen to 4 short lines.
import {
  waitForEvenAppBridge,
  TextContainerProperty,
  TextContainerUpgrade,
  CreateStartUpPageContainer,
  OsEventTypeList,
  EventSourceType,
} from '@evenrealities/even_hub_sdk'

const GAMMA_URL =
  'https://gamma-api.polymarket.com/events?active=true&closed=false&order=volume24hr&ascending=false&limit=30'

type Claim = {
  question: string
  yesPct: number // 0-100
  check: string // one line: volume, 24h move, end date
  live: boolean
}

// Baked-in fallback, used ONLY when the live fetch fails. Labelled DEMO
// on the lens so nobody mistakes these for real odds.
const DEMO_CLAIMS: Claim[] = [
  {
    question: 'Bitcoin above $100k by Dec 31?',
    yesPct: 62,
    check: 'DEMO odds - no live data',
    live: false,
  },
  {
    question: 'Fed cuts rates in December?',
    yesPct: 71,
    check: 'DEMO odds - no live data',
    live: false,
  },
  {
    question: 'Ethereum above $4k by Dec 31?',
    yesPct: 48,
    check: 'DEMO odds - no live data',
    live: false,
  },
]

type GammaMarket = {
  question?: string
  outcomes?: string
  outcomePrices?: string
  volume24hr?: number
  oneDayPriceChange?: number
  endDateIso?: string
  closed?: boolean
  sportsMarketType?: string
}
type GammaEvent = { markets?: GammaMarket[] }

function parsePrices(m: GammaMarket): number | null {
  try {
    const prices = JSON.parse(m.outcomePrices ?? '[]') as unknown[]
    const yes = Number(prices[0])
    // 0 and 1 are resolved results, not odds. Skip them.
    if (!Number.isFinite(yes) || yes <= 0 || yes >= 1) return null
    return yes
  } catch {
    return null
  }
}

function fmtUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`
  return `$${n.toFixed(0)}`
}

function toClaims(data: GammaEvent[]): Claim[] {
  const out: Claim[] = []
  for (const ev of data) {
    for (const m of ev.markets ?? []) {
      if (m.closed || m.sportsMarketType) continue
      const yes = parsePrices(m)
      if (yes === null || !m.question) continue
      const move = m.oneDayPriceChange ?? 0
      const moveTxt = `${move >= 0 ? '+' : ''}${(move * 100).toFixed(1)}% 24h`
      const end = m.endDateIso ? `ends ${m.endDateIso}` : 'no end date'
      out.push({
        question: m.question,
        yesPct: Math.round(yes * 100),
        check: `Vol ${fmtUsd(m.volume24hr ?? 0)} 24h - ${moveTxt} - ${end}`,
        live: true,
      })
      break // one market per event keeps the lens list varied
    }
    if (out.length >= 5) break
  }
  return out
}

// Status readout: the lens is driven by the bridge, so the web page
// itself is blank. Writing each stage into #app (and console.log)
// makes the simulator's Browser window and /api/console show exactly
// where the app is stuck, instead of a black lens with no clue.
function status(line: string) {
  console.log('[OddsWhisper] ' + line)
  const el = document.getElementById('app')
  if (el) {
    const div = document.createElement('div')
    div.textContent = line
    el.appendChild(div)
  }
}

async function loadClaims(): Promise<Claim[]> {
  try {
    // A fetch with no timeout can hang forever in the simulator's
    // webview if the network stalls. 8 seconds, then DEMO.
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 8000)
    try {
      const res = await fetch(GAMMA_URL, { signal: ctrl.signal })
      if (!res.ok) return DEMO_CLAIMS
      const data = (await res.json()) as GammaEvent[]
      const claims = toClaims(data)
      return claims.length > 0 ? claims : DEMO_CLAIMS
    } finally {
      clearTimeout(timer)
    }
  } catch {
    return DEMO_CLAIMS
  }
}

function render(c: Claim, index: number, total: number): string {
  const verdict =
    c.yesPct >= 65 ? 'Likely YES' : c.yesPct <= 35 ? 'Likely NO' : 'A coin flip'
  const tag = c.live ? 'LIVE' : 'DEMO'
  return [
    `ODDS WHISPER  ${index + 1}/${total}  [${tag}]`,
    c.question,
    `Yes ${c.yesPct}%  -  ${verdict}`,
    c.check,
  ].join('\n')
}

async function main() {
  status('bridge: waiting...')
  const bridge = await waitForEvenAppBridge()
  status('bridge: ready')

  status('claims: loading...')
  const claims = await loadClaims()
  status(`claims: ${claims.length} (${claims[0]?.live ? 'LIVE' : 'DEMO'})`)
  let index = 0

  // The SDK marks geometry optional, but the simulator rejected a
  // container without it (result 1 = invalid). The SDK's own example
  // sets every field, so we do the same: full lens, 576x288.
  const text = new TextContainerProperty({
    xPosition: 0,
    yPosition: 0,
    width: 576,
    height: 288,
    containerID: 1,
    containerName: 'main',
    zOrderIndex: 1,
    content: render(claims[0], 0, claims.length),
    textColor: 4,
    isEventCapture: 1, // receive temple-tap events on this container
  })
  status('container: creating...')
  // createStartUpPageContainer answers 0=success, 1=invalid,
  // 2=oversize, 3=outOfMemory. The old code ignored the answer.
  const result = await bridge.createStartUpPageContainer(
    new CreateStartUpPageContainer({
      containerTotalNum: 1,
      textObject: [text],
    }),
  )
  status(`container: result ${result} (0=ok, 1=invalid, 2=oversize, 3=no memory)`)
  status('lens should show: ' + render(claims[0], 0, claims.length).split('\n')[0])

  // Temple tap = CLICK_EVENT on the text container. Each tap moves to
  // the next live claim and refreshes the lens in place (no flicker).
  //
  // The tap did NOT move the lens on the first simulator test
  // (2026-11-25: six Click presses reached the simulator but the lens
  // stayed on 1/5), so log EVERY event that arrives and the upgrade
  // result — the Browser window then shows exactly where the tap dies.
  bridge.onEvenHubEvent((event) => {
    const parts: string[] = []
    if (event.textEvent)
      parts.push(`textEvent type=${event.textEvent.eventType} id=${event.textEvent.containerID}`)
    if (event.sysEvent)
      parts.push(`sysEvent type=${event.sysEvent.eventType} src=${event.sysEvent.eventSource}`)
    if (event.listEvent) parts.push(`listEvent type=${event.listEvent.eventType}`)
    if (event.menuItemClickEvent) parts.push('menuItemClickEvent')
    status(
      'event: ' +
        (parts.length ? parts.join(' | ') : JSON.stringify(event.jsonData ?? event)),
    )
    const type =
      event.textEvent?.eventType ??
      event.sysEvent?.eventType ??
      event.listEvent?.eventType
    // Fresh-trial finding (2026-11-25): the simulator's Click button
    // arrives as a sysEvent with NO eventType at all — only
    // eventSource = 1 (right temple). Real glasses send a proper
    // CLICK_EVENT textEvent; the simulator does not. So a tap is
    // either a real CLICK_EVENT, or a typeless touch event from a
    // temple/ring source. Double-click and long-press carry a type,
    // so they still do not advance.
    const sysSrc = event.sysEvent?.eventSource
    const isSimTap =
      type === undefined &&
      event.sysEvent !== undefined &&
      (sysSrc === EventSourceType.TOUCH_EVENT_FROM_GLASSES_R ||
        sysSrc === EventSourceType.TOUCH_EVENT_FROM_GLASSES_L ||
        sysSrc === EventSourceType.TOUCH_EVENT_FROM_RING)
    if (type === OsEventTypeList.CLICK_EVENT || isSimTap) {
      index = (index + 1) % claims.length
      status(`tap: showing claim ${index + 1}/${claims.length}`)
      void bridge
        .textContainerUpgrade(
          new TextContainerUpgrade({
            containerID: 1,
            containerName: 'main',
            content: render(claims[index], index, claims.length),
            textColor: 4,
          }),
        )
        .then((ok) => status(`upgrade: ${ok ? 'ok' : 'FAILED'}`))
        .catch((e) => status('upgrade: error ' + String(e)))
    }
  })
}

void main()
