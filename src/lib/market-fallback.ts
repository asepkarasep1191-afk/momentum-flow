import { createServerFn } from "@tanstack/react-start";
import { deriveSignal } from "./signals";
import type { ChainId, ScreenerPayload, TokenRow } from "./types";

const STABLES = new Set([
  "usdt",
  "usdc",
  "dai",
  "busd",
  "tusd",
  "fdusd",
  "usde",
  "usds",
  "pyusd",
  "usd1",
  "rlusd",
  "frax",
  "crvusd",
  "gho",
  "usdd",
  "dola",
  "usdg",
  "usdp",
  "lusd",
  "susd",
  "gusd",
  "husd",
  "usd0",
  "usdy",
  "ust",
  "ustc",
]);

const SYMBOL_CHAIN: Record<string, ChainId> = {
  bonk: "solana",
  wif: "solana",
  jup: "solana",
  ray: "solana",
  pyth: "solana",
  popcat: "solana",
  mew: "solana",
  pump: "solana",
  jto: "solana",
  trump: "solana",
  pengu: "solana",
  render: "solana",
  hnt: "solana",
  wen: "solana",
  fartcoin: "solana",
  pnut: "solana",
  w: "solana",
  jito: "solana",
  msol: "solana",
  orca: "solana",
  pepe: "ethereum",
  shib: "ethereum",
  uni: "ethereum",
  link: "ethereum",
  aave: "ethereum",
  ldo: "ethereum",
  ena: "ethereum",
  pendle: "ethereum",
  ondo: "ethereum",
  mog: "ethereum",
  ethfi: "ethereum",
  ens: "ethereum",
  crv: "ethereum",
  mkr: "ethereum",
  mnt: "ethereum",
  brett: "base",
  degen: "base",
  aero: "base",
  toshi: "base",
  virtual: "base",
  cake: "bnb",
  floki: "bnb",
  babydoge: "bnb",
  gmx: "arbitrum",
  arb: "arbitrum",
  magic: "arbitrum",
  pol: "polygon",
  matic: "polygon",
};

let mem: { at: number; payload: ScreenerPayload } | null = null;
let lastGood: ScreenerPayload | null = null;
const CACHE_MS = 60_000;

function guessChain(symbol: string, name = ""): ChainId {
  const sym = symbol.toLowerCase();
  if (SYMBOL_CHAIN[sym]) return SYMBOL_CHAIN[sym];
  const blob = `${sym} ${name}`.toLowerCase();
  if (blob.includes("solana")) return "solana";
  if (blob.includes("base ")) return "base";
  if (blob.includes("bnb") || blob.includes("binance")) return "bnb";
  if (blob.includes("arbitrum")) return "arbitrum";
  if (blob.includes("polygon")) return "polygon";
  if (blob.includes("robinhood") || blob.includes("hood")) return "robinhood";
  return "ethereum";
}

function toRow(input: {
  id: string;
  symbol: string;
  name: string;
  price: number;
  h1: number;
  h24: number;
  d7: number;
  volume: number;
  mcap: number;
  image?: string;
}): TokenRow | null {
  const symbol = input.symbol.toUpperCase();
  if (!symbol || input.price <= 0) return null;
  if (STABLES.has(symbol.toLowerCase())) return null;

  const h1 = input.h1;
  const h24 = input.h24;
  const h6 = h24 * 0.45 + h1 * 0.2;
  const m5 = h1 / 8;
  const vr =
    input.mcap > 0 ? Math.max(0.4, Math.min(6, input.volume / (input.mcap * 0.08))) : 1;
  const { signal, strength } = deriveSignal({
    priceChange5m: m5,
    priceChange1h: h1,
    priceChange6h: h6,
    priceChange24h: h24,
    volumeRatio: vr,
  });

  return {
    id: `market-${input.id}`,
    symbol,
    name: input.name,
    chain: guessChain(symbol, input.name),
    ca: input.id,
    imageUrl: input.image,
    price: input.price,
    priceChange5m: m5,
    priceChange1h: h1,
    priceChange6h: h6,
    priceChange24h: h24,
    volume5m: input.volume / 288,
    volume1h: input.volume / 24,
    volume24h: input.volume,
    volumeRatio: vr,
    marketCap: input.mcap,
    liquidity: Math.max(input.volume * 0.04, input.mcap * 0.01),
    buys24h: 0,
    sells24h: 0,
    smcSignal: signal,
    signalStrength: strength,
    source: "market",
  };
}

type LoreTicker = {
  id: string;
  symbol: string;
  name: string;
  nameid?: string;
  price_usd: string;
  percent_change_24h: string;
  percent_change_1h: string;
  percent_change_7d: string;
  market_cap_usd: string;
  volume24: number;
};

async function loadCoinlore(): Promise<TokenRow[]> {
  const pages = await Promise.all(
    [0, 100].map(async (start) => {
      const res = await fetch(
        `https://api.coinlore.net/api/tickers/?start=${start}&limit=100`,
        { headers: { accept: "application/json" } },
      );
      if (!res.ok) throw new Error(`Coinlore ${res.status}`);
      return (await res.json()) as { data?: LoreTicker[] };
    }),
  );
  const rows = pages.flatMap((p) => p.data ?? []);
  if (rows.length === 0) throw new Error("Coinlore empty");
  return rows
    .map((row) =>
      toRow({
        id: row.nameid || row.id,
        symbol: row.symbol,
        name: row.name,
        price: parseFloat(row.price_usd),
        h1: parseFloat(row.percent_change_1h),
        h24: parseFloat(row.percent_change_24h),
        d7: parseFloat(row.percent_change_7d),
        volume: Number(row.volume24) || 0,
        mcap: parseFloat(row.market_cap_usd) || 0,
      }),
    )
    .filter((t): t is TokenRow => t !== null);
}

type GeckoMarket = {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  current_price?: number;
  market_cap?: number;
  total_volume?: number;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
};

async function loadGecko(): Promise<TokenRow[]> {
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=80&page=1&sparkline=false&price_change_percentage=1h,24h,7d";
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
  const data = (await res.json()) as GeckoMarket[] | { status?: unknown };
  if (!Array.isArray(data)) throw new Error("CoinGecko rate limited");
  return data
    .map((row) =>
      toRow({
        id: row.id,
        symbol: row.symbol,
        name: row.name,
        price: row.current_price ?? 0,
        h1: row.price_change_percentage_1h_in_currency ?? 0,
        h24: row.price_change_percentage_24h_in_currency ?? 0,
        d7: row.price_change_percentage_7d_in_currency ?? 0,
        volume: row.total_volume ?? 0,
        mcap: row.market_cap ?? 0,
        image: row.image,
      }),
    )
    .filter((t): t is TokenRow => t !== null);
}

async function firstLive(): Promise<TokenRow[]> {
  const errors: string[] = [];
  for (const loader of [loadCoinlore, loadGecko]) {
    try {
      const rows = await loader();
      if (rows.length > 0) return rows;
    } catch (err) {
      errors.push(err instanceof Error ? err.message : "unknown");
    }
  }
  throw new Error(errors[0] || "Market data unavailable");
}

export async function loadMarketRows(): Promise<TokenRow[]> {
  if (mem && Date.now() - mem.at < CACHE_MS) return mem.payload.tokens;
  try {
    const tokens = await firstLive();
    const payload: ScreenerPayload = {
      tokens,
      source: "market",
      fetchedAt: Date.now(),
    };
    mem = { at: Date.now(), payload };
    lastGood = payload;
    return tokens;
  } catch (err) {
    if (lastGood) return lastGood.tokens;
    throw err;
  }
}

export const fetchMarketFallback = createServerFn({ method: "POST" }).handler(
  async (): Promise<ScreenerPayload> => {
    const tokens = await loadMarketRows();
    return { tokens, source: "market", fetchedAt: Date.now() };
  },
);
