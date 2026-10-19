import { CHAINS } from "./chains";
import { deriveSignal, volumeRatio } from "./signals";
import type { ChainId, TokenRow } from "./types";

const GECKO = "https://api.geckoterminal.com/api/v2/networks";

const NETWORK: Record<ChainId, string> = {
  solana: "solana",
  ethereum: "eth",
  base: "base",
  bnb: "bsc",
  arbitrum: "arbitrum",
  polygon: "polygon_pos",
  robinhood: "robinhood",
};

const SKIP = new Set([
  "weth",
  "eth",
  "wsol",
  "sol",
  "wbnb",
  "bnb",
  "wmatic",
  "matic",
  "usdg",
  "usdc",
  "usdt",
  "dai",
]);

type GeckoPool = {
  attributes?: {
    address?: string;
    name?: string;
    base_token_price_usd?: string;
    fdv_usd?: string | null;
    market_cap_usd?: string | null;
    pool_created_at?: string;
    reserve_in_usd?: string;
    price_change_percentage?: { m5?: string; h1?: string; h6?: string; h24?: string };
    volume_usd?: { m5?: string; h1?: string; h6?: string; h24?: string };
    transactions?: { h24?: { buys?: number; sells?: number } };
  };
  relationships?: {
    base_token?: { data?: { id?: string } };
    dex?: { data?: { id?: string } };
  };
};

type GeckoToken = {
  id?: string;
  attributes?: { address?: string; name?: string; symbol?: string; image_url?: string };
};

let mem: { at: number; rows: TokenRow[] } | null = null;
const CACHE_MS = 45_000;

function num(value: unknown): number {
  if (value == null) return 0;
  const n = typeof value === "number" ? value : parseFloat(String(value));
  return Number.isFinite(n) ? n : 0;
}

function extractAddress(id: string | undefined): string | null {
  if (!id) return null;
  const addr = id.includes("_") ? id.slice(id.indexOf("_") + 1) : id;
  if (addr.length < 8) return null;
  if (addr === "0x0000000000000000000000000000000000000000") return null;
  return addr;
}

async function getJson(url: string): Promise<{ data?: GeckoPool[]; included?: GeckoToken[] } | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as { data?: GeckoPool[]; included?: GeckoToken[] };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function mapPool(chain: ChainId, pool: GeckoPool, tokensById: Map<string, GeckoToken>): TokenRow | null {
  const attr = pool.attributes;
  const tokenId = pool.relationships?.base_token?.data?.id;
  const included = tokenId ? tokensById.get(tokenId) : undefined;
  const address = extractAddress(included?.attributes?.address || tokenId);
  const price = num(attr?.base_token_price_usd);
  if (!address || price <= 0) return null;
  const symbol = (included?.attributes?.symbol || attr?.name?.split("/")[0] || "").trim().toUpperCase();
  if (!symbol || SKIP.has(symbol.toLowerCase())) return null;

  const priceChange5m = num(attr?.price_change_percentage?.m5);
  const priceChange1h = num(attr?.price_change_percentage?.h1);
  const priceChange6h = num(attr?.price_change_percentage?.h6);
  const priceChange24h = num(attr?.price_change_percentage?.h24);
  const vr = volumeRatio({
    h24: num(attr?.volume_usd?.h24),
    h6: num(attr?.volume_usd?.h6),
    h1: num(attr?.volume_usd?.h1),
  });
  const { signal, strength } = deriveSignal({
    priceChange5m,
    priceChange1h,
    priceChange6h,
    priceChange24h,
    volumeRatio: vr,
  });
  const created = attr?.pool_created_at ? Date.parse(attr.pool_created_at) : undefined;

  return {
    id: `${chain}-${address}`,
    symbol,
    name: included?.attributes?.name || symbol,
    chain,
    ca: address,
    pairAddress: attr?.address,
    dexId: pool.relationships?.dex?.data?.id,
    imageUrl: included?.attributes?.image_url,
    price,
    priceChange5m,
    priceChange1h,
    priceChange6h,
    priceChange24h,
    volume5m: num(attr?.volume_usd?.m5),
    volume1h: num(attr?.volume_usd?.h1),
    volume24h: num(attr?.volume_usd?.h24),
    volumeRatio: vr,
    marketCap: num(attr?.market_cap_usd) || num(attr?.fdv_usd),
    liquidity: num(attr?.reserve_in_usd),
    buys24h: num(attr?.transactions?.h24?.buys),
    sells24h: num(attr?.transactions?.h24?.sells),
    pairCreatedAt: Number.isFinite(created) ? created : undefined,
    smcSignal: signal,
    signalStrength: strength,
    source: "dex",
    secure: false,
  };
}

function rowsFrom(chain: ChainId, json: { data?: GeckoPool[]; included?: GeckoToken[] } | null): TokenRow[] {
  if (!json) return [];
  const tokensById = new Map((json.included ?? []).map((t) => [t.id ?? "", t]));
  const best = new Map<string, TokenRow>();
  for (const pool of json.data ?? []) {
    const row = mapPool(chain, pool, tokensById);
    if (!row) continue;
    const prev = best.get(row.id);
    if (!prev || row.liquidity > prev.liquidity) best.set(row.id, row);
  }
  return [...best.values()];
}

/** Trending and newly created pools on every supported chain. */
export async function fetchWidePairs(active?: Set<ChainId>): Promise<TokenRow[]> {
  if (mem && Date.now() - mem.at < CACHE_MS) {
    return active && active.size > 0 ? mem.rows.filter((t) => active.has(t.chain)) : mem.rows;
  }
  const chains = CHAINS.filter((c) => !active || active.size === 0 || active.has(c.id));
  const pages = await Promise.all(
    chains.flatMap((c) => [
      getJson(`${GECKO}/${NETWORK[c.id]}/trending_pools?page=1&include=base_token`).then((json) =>
        rowsFrom(c.id, json),
      ),
      getJson(`${GECKO}/${NETWORK[c.id]}/new_pools?page=1&include=base_token`).then((json) =>
        rowsFrom(c.id, json),
      ),
    ]),
  );
  const map = new Map<string, TokenRow>();
  for (const row of pages.flat()) {
    const prev = map.get(row.id);
    if (!prev || row.liquidity > prev.liquidity) map.set(row.id, row);
  }
  const rows = [...map.values()];
  if (rows.length > 0) mem = { at: Date.now(), rows };
  return rows;
}
