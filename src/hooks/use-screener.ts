import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { loadScreenerFeed, searchScreener } from "@/lib/screener-feed";
import { matchesPreset, scoreForMode } from "@/lib/signals";
import type { ChainId, DataSource, PresetId, TokenRow, TradeMode } from "@/lib/types";
import { useWatchlist } from "./use-watchlist";

export function useScreener(opts: {
  activeChains: Set<ChainId>;
  preset: PresetId;
  mode: TradeMode;
  query: string;
  secureOnly: boolean;
}) {
  const { activeChains, preset, mode, query, secureOnly } = opts;
  const chainKey = [...activeChains].sort().join(",");
  const watchIds = useWatchlist((s) => s.ids);

  const screener = useQuery({
    queryKey: ["screener", chainKey],
    queryFn: () => loadScreenerFeed({ data: { chains: [...activeChains] } }),
    refetchInterval: 30_000,
    staleTime: 15_000,
  });

  const remoteSearch = useQuery({
    queryKey: ["dex-search", query],
    queryFn: () => searchScreener({ data: { query } }),
    enabled: query.trim().length >= 3,
    staleTime: 20_000,
  });

  const { tokens, matched, securePassed, scanned, live } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = screener.data?.tokens ?? [];
    const extra = remoteSearch.data ?? [];
    const map = new Map<string, TokenRow>();
    for (const t of [...base, ...extra]) {
      if (activeChains.size > 0 && !activeChains.has(t.chain)) continue;
      const prev = map.get(t.id);
      if (!prev || t.liquidity > prev.liquidity) map.set(t.id, t);
    }
    let rows = [...map.values()];
    const live = rows;
    if (preset === "watch") {
      const set = new Set(watchIds);
      rows = rows.filter((t) => set.has(t.id));
    } else {
      rows = rows.filter((t) => matchesPreset(t, preset));
    }
    if (q) {
      rows = rows.filter(
        (t) =>
          t.symbol.toLowerCase().includes(q) ||
          t.name.toLowerCase().includes(q) ||
          t.ca.toLowerCase().includes(q),
      );
    }
    rows.sort((a, b) => scoreForMode(b, mode) - scoreForMode(a, mode));
    const passed = rows.filter((t) => t.secure);
    const scannedCount = rows.filter((t) => t.security?.source === "goplus").length;
    return {
      matched: rows.length,
      securePassed: passed.length,
      scanned: scannedCount,
      tokens: secureOnly && preset !== "active" && preset !== "watch" ? passed : rows,
      live,
    };
  }, [screener.data, remoteSearch.data, activeChains, preset, watchIds, query, mode, secureOnly]);

  return {
    tokens,
    live,
    matched,
    securePassed,
    scanned,
    source: (screener.data?.source ?? null) as DataSource | null,
    loading: screener.isLoading,
    refreshing: screener.isFetching,
    error: screener.error instanceof Error ? screener.error.message : null,
    fetchedAt: screener.dataUpdatedAt || null,
    refresh: () => screener.refetch(),
  };
}
