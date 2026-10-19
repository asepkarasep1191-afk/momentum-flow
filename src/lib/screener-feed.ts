import { createServerFn } from "@tanstack/react-start";
import { fetchDexScreenerTokens, searchDexScreener } from "./dexscreener";
import { loadMarketRows } from "./market-fallback";
import { attachSecurity } from "./security";
import { fetchWidePairs } from "./wide-tape";
import type { ChainId, ScreenerPayload, TokenRow } from "./types";

let lastGood: ScreenerPayload | null = null;

function mergeTokens(groups: TokenRow[][]): TokenRow[] {
  const map = new Map<string, TokenRow>();
  for (const token of groups.flat()) {
    const key = token.id.toLowerCase();
    const prev = map.get(key);
    if (!prev || token.liquidity > prev.liquidity) map.set(key, token);
  }
  return [...map.values()];
}

export const loadScreenerFeed = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const data = input as { chains?: string[] };
    return { chains: (Array.isArray(data?.chains) ? data.chains : []) as ChainId[] };
  })
  .handler(async ({ data }): Promise<ScreenerPayload> => {
    const active = new Set(data.chains);
    try {
      const [dex, wide] = await Promise.all([
        fetchDexScreenerTokens(active).catch(() => [] as TokenRow[]),
        fetchWidePairs(active).catch(() => [] as TokenRow[]),
      ]);
      const merged = mergeTokens([dex, wide]).filter(
        (t) => active.size === 0 || active.has(t.chain),
      );
      if (merged.length > 0) {
        const tokens = await attachSecurity(merged);
        const payload: ScreenerPayload = { tokens, source: "dex", fetchedAt: Date.now() };
        lastGood = payload;
        return payload;
      }
    } catch {
      /* DexScreener is frequently rate-limited from datacenter IPs. */
    }

    const market = await loadMarketRows();
    const tokens = market.filter((t) => active.size === 0 || active.has(t.chain));
    if (tokens.length > 0) {
      const payload: ScreenerPayload = { tokens, source: "market", fetchedAt: Date.now() };
      lastGood = payload;
      return payload;
    }
    if (lastGood) return lastGood;
    throw new Error("Market data unavailable");
  });

export const searchScreener = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const data = input as { query?: string };
    return { query: String(data?.query ?? "") };
  })
  .handler(async ({ data }): Promise<TokenRow[]> => {
    const q = data.query.trim();
    if (q.length < 3) return [];
    try {
      const dex = await searchDexScreener(q);
      if (dex.length > 0) return attachSecurity(dex);
    } catch {
      /* ignore */
    }
    const market = await loadMarketRows();
    const needle = q.toLowerCase();
    return market
      .filter(
        (t) =>
          t.symbol.toLowerCase().includes(needle) || t.name.toLowerCase().includes(needle),
      )
      .slice(0, 40);
  });
