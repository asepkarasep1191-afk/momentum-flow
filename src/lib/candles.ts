import type { TokenRow, TradeMode } from "./types";

export type ChartPoint = {
  t: number;
  price: number;
  volume: number;
};

function backPrice(price: number, changePct: number): number {
  const denom = 1 + changePct / 100;
  if (!Number.isFinite(denom) || denom <= 0.02) return price * 0.5;
  return price / denom;
}

function hash32(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function rng(seed: number) {
  let a = seed || 1;
  return () => {
    a = Math.imul(a ^ (a >>> 16), 2246822507);
    a = Math.imul(a ^ (a >>> 13), 3266489917);
    return ((a ^= a >>> 16) >>> 0) / 4294967296;
  };
}

function smoothstep(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

export function sparklinePrices(token: TokenRow): number[] {
  return [
    backPrice(token.price, token.priceChange24h),
    backPrice(token.price, token.priceChange6h),
    backPrice(token.price, token.priceChange1h),
    backPrice(token.price, token.priceChange5m),
    token.price,
  ].map((n) => (Number.isFinite(n) && n > 0 ? n : token.price));
}

type Anchor = { minAgo: number; price: number; volume: number };

function anchors(token: TokenRow, mode: TradeMode): Anchor[] {
  const nowVol = Math.max(token.volume5m, token.volume1h / 12, token.volume24h / 288);
  const h1Vol = Math.max(token.volume1h / 12, nowVol * 0.6);
  const h6Vol = Math.max(token.volume24h / 96, h1Vol * 0.7);
  const dVol = Math.max(token.volume24h / 288, h6Vol * 0.5);
  const all: Anchor[] = [
    { minAgo: 1440, price: backPrice(token.price, token.priceChange24h), volume: dVol },
    { minAgo: 360, price: backPrice(token.price, token.priceChange6h), volume: h6Vol },
    { minAgo: 60, price: backPrice(token.price, token.priceChange1h), volume: h1Vol },
    { minAgo: 5, price: backPrice(token.price, token.priceChange5m), volume: nowVol },
    { minAgo: 0, price: token.price, volume: nowVol },
  ];
  const maxAgo = mode === "scalping" ? 120 : 1440;
  const clipped = all.filter((a) => a.minAgo <= maxAgo);
  if (clipped[0]?.minAgo !== maxAgo) {
    const hi = all.find((a) => a.minAgo >= maxAgo) ?? all[0];
    const lo = all.find((a) => a.minAgo < maxAgo) ?? all[all.length - 1];
    const span = hi.minAgo - lo.minAgo || 1;
    const t = (maxAgo - lo.minAgo) / span;
    clipped.unshift({
      minAgo: maxAgo,
      price: lo.price + (hi.price - lo.price) * t,
      volume: lo.volume + (hi.volume - lo.volume) * t,
    });
  }
  return clipped;
}

export function buildChartSeries(token: TokenRow, mode: TradeMode): ChartPoint[] {
  const pts = anchors(token, mode);
  const n = mode === "scalping" ? 48 : 56;
  const maxAgo = pts[0]?.minAgo ?? 60;
  const now = Date.now();
  const rand = rng(hash32(token.id + String(Math.round(token.price * 1e8))));
  const amp = token.price * 0.0035 * Math.min(2.4, Math.max(0.6, token.volumeRatio));
  const out: ChartPoint[] = [];

  for (let i = 0; i < n; i++) {
    const minAgo = maxAgo * (1 - i / (n - 1));
    let hi = pts[0];
    let lo = pts[pts.length - 1];
    for (let k = 0; k < pts.length - 1; k++) {
      if (minAgo <= pts[k].minAgo && minAgo >= pts[k + 1].minAgo) {
        hi = pts[k];
        lo = pts[k + 1];
        break;
      }
    }
    const span = hi.minAgo - lo.minAgo || 1;
    const u = smoothstep((hi.minAgo - minAgo) / span);
    let price = hi.price + (lo.price - hi.price) * u;
    const edge = Math.min(minAgo, maxAgo - minAgo) / (maxAgo * 0.12);
    const fade = Math.min(1, Math.max(0, edge));
    const wiggle = (rand() - 0.5) * 2 * amp * fade;
    price = Math.max(price * 0.4, price + wiggle);
    const volume = Math.max(0, hi.volume + (lo.volume - hi.volume) * u) * (0.65 + rand() * 0.7);
    out.push({
      t: now - minAgo * 60_000,
      price,
      volume,
    });
  }
  if (out.length) out[out.length - 1].price = token.price;
  return out;
}

