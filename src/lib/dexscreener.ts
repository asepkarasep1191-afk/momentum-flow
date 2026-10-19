import { CHAINS, normalizeChain } from "./chains";
import { fetchRobinhoodAddresses, fetchRobinhoodRows } from "./robinhood";
import { deriveSignal, volumeRatio } from "./signals";
import type { ChainId, TokenRow } from "./types";
import { UNIVERSE } from "./universe";

const DEX = "https://api.dexscreener.com";

type DexPair = {
  chainId?: string;
  dexId?: string;
  pairAddress?: string;
  url?: string;
  baseToken?: { address?: string; name?: string; symbol?: string };
  quoteToken?: { address?: string; name?: string; symbol?: string };
  priceUsd?: string | number;
  fdv?: number;
  marketCap?: number;
  pairCreatedAt?: number;
  liquidity?: { usd?: number };
  volume?: { m5?: number; h1?: number; h6?: number; h24?: number };
  priceChange?: { m5?: number; h1?: number; h6?: number; h24?: number };
  txns?: {
    h24?: { buys?: number; sells?: number };
  };
  info?: { imageUrl?: string };
};

type BoostItem = {
  chainId?: string;
  tokenAddress?: string;
};

async function getJson<T>(url: string, timeoutMs = 4500): Promise<T | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function num(value: unknown): number {
  if (value == null) return 0;
  const n = typeof value === "number" ? value : parseFloat(String(value));
  return Number.isFinite(n) ? n : 0;
}

export function pairToToken(pair: DexPair): TokenRow | null {
  const chain = normalizeChain(pair.chainId);
  const address = pair.baseToken?.address;
  const price = num(pair.priceUsd);
  if (!chain || !address || price <= 0) return null;

  const priceChange5m = num(pair.priceChange?.m5);
  const priceChange1h = num(pair.priceChange?.h1);
  const priceChange6h = num(pair.priceChange?.h6);
  const priceChange24h = num(pair.priceChange?.h24);
  const vr = volumeRatio(pair.volume);
  const { signal, strength } = deriveSignal({
    priceChange5m,
    priceChange1h,
    priceChange6h,
    priceChange24h,
    volumeRatio: vr,
  });

  return {
    id: `${chain}-${address}`,
    symbol: pair.baseToken?.symbol || "???",
    name: pair.baseToken?.name || pair.baseToken?.symbol || "Unknown",
    chain,
    ca: address,
    pairAddress: pair.pairAddress,
    dexId: pair.dexId,
    imageUrl: pair.info?.imageUrl,
    price,
    priceChange5m,
    priceChange1h,
    priceChange6h,
    priceChange24h,
    volume5m: num(pair.volume?.m5),
    volume1h: num(pair.volume?.h1),
    volume24h: num(pair.volume?.h24),
    volumeRatio: vr,
    marketCap: num(pair.marketCap) || num(pair.fdv),
    liquidity: num(pair.liquidity?.usd),
    buys24h: num(pair.txns?.h24?.buys),
    sells24h: num(pair.txns?.h24?.sells),
    pairCreatedAt: pair.pairCreatedAt,
    smcSignal: signal,
    signalStrength: strength,
    source: "dex",
    secure: false,
  };
}

function pickBestPairs(pairs: DexPair[]): DexPair[] {
  const best = new Map<string, DexPair>();
  for (const pair of pairs) {
    const key = `${pair.chainId}-${pair.baseToken?.address}`.toLowerCase();
    if (!pair.baseToken?.address) continue;
    const current = best.get(key);
    const liq = num(pair.liquidity?.usd);
    const prev = num(current?.liquidity?.usd);
    if (!current || liq > prev) best.set(key, pair);
  }
  return [...best.values()];
}

async function fetchTokenPairs(chain: ChainId, addresses: string[]): Promise<DexPair[]> {
  if (addresses.length === 0) return [];
  const dexId = CHAINS.find((c) => c.id === chain)?.dexId ?? chain;
  const chunks: string[][] = [];
  for (let i = 0; i < addresses.length; i += 30) {
    chunks.push(addresses.slice(i, i + 30));
  }
  const pages = await Promise.all(
    chunks.map((chunk) =>
      getJson<DexPair[]>(`${DEX}/tokens/v1/${dexId}/${chunk.join(",")}`),
    ),
  );
  return pages.flatMap((p) => (Array.isArray(p) ? p : []));
}

async function fetchBoostAddresses(active: Set<ChainId>): Promise<Record<ChainId, string[]>> {
  const [latest, top, profiles] = await Promise.all([
    getJson<BoostItem[]>(`${DEX}/token-boosts/latest/v1`),
    getJson<BoostItem[]>(`${DEX}/token-boosts/top/v1`),
    getJson<BoostItem[]>(`${DEX}/token-profiles/latest/v1`),
  ]);
  const grouped = Object.fromEntries(CHAINS.map((c) => [c.id, [] as string[]])) as Record<
    ChainId,
    string[]
  >;
  for (const item of [...(latest ?? []), ...(top ?? []), ...(profiles ?? [])]) {
    const chain = normalizeChain(item.chainId);
    const addr = item.tokenAddress;
    if (!chain || !addr || !active.has(chain)) continue;
    grouped[chain].push(addr);
  }
  return grouped;
}

function mergeAddresses(
  universe: Record<string, string[]>,
  boosts: Record<ChainId, string[]>,
  active: Set<ChainId>,
): Record<ChainId, string[]> {
  const out = {} as Record<ChainId, string[]>;
  for (const chain of CHAINS) {
    if (!active.has(chain.id)) continue;
    const set = new Set(
      [...(universe[chain.id] ?? []), ...(boosts[chain.id] ?? [])].map((a) => a),
    );
    out[chain.id] = [...set];
  }
  return out;
}

export async function fetchDexScreenerTokens(active: Set<ChainId>): Promise<TokenRow[]> {
  const boosts = await fetchBoostAddresses(active);
  const grouped = mergeAddresses(
    Object.fromEntries(UNIVERSE.filter((t) => active.has(t.chain)).map((t) => [t.chain, []])),
    boosts,
    active,
  );

  for (const t of UNIVERSE) {
    if (!active.has(t.chain)) continue;
    grouped[t.chain] ??= [];
    if (!grouped[t.chain].includes(t.address)) grouped[t.chain].push(t.address);
  }

  if (active.has("robinhood")) {
    const extra = await fetchRobinhoodAddresses();
    grouped.robinhood ??= [];
    for (const addr of extra) {
      if (!grouped.robinhood.some((a) => a.toLowerCase() === addr.toLowerCase())) {
        grouped.robinhood.push(addr);
      }
    }
  }

  const pairLists = await Promise.all(
    Object.entries(grouped).map(([chain, addresses]) =>
      fetchTokenPairs(chain as ChainId, addresses),
    ),
  );

  const map = new Map<string, TokenRow>();
  for (const token of pickBestPairs(pairLists.flat())
    .map(pairToToken)
    .filter((t): t is TokenRow => t !== null)) {
    map.set(token.id.toLowerCase(), token);
  }

  if (active.has("robinhood")) {
    const rh = await fetchRobinhoodRows();
    for (const token of rh) {
      const key = token.id.toLowerCase();
      if (!map.has(key)) map.set(key, token);
    }
  }

  return [...map.values()];
}

export async function searchDexScreener(query: string): Promise<TokenRow[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const data = await getJson<{ pairs?: DexPair[] }>(
    `${DEX}/latest/dex/search?q=${encodeURIComponent(q)}`,
  );
  const pairs = Array.isArray(data?.pairs) ? data.pairs : [];
  const fromDex = pickBestPairs(pairs)
    .map(pairToToken)
    .filter((t): t is TokenRow => t !== null);

  if (fromDex.length > 0) return fromDex.slice(0, 40);

  const needle = q.toLowerCase();
  const rh = await fetchRobinhoodRows();
  return rh
    .filter(
      (t) =>
        t.symbol.toLowerCase().includes(needle) ||
        t.name.toLowerCase().includes(needle) ||
        t.ca.toLowerCase().includes(needle),
    )
    .slice(0, 40);
}
