import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, BarChart3 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ScreenerHeader } from "@/components/screener-header";
import { ScreenerToolbar } from "@/components/screener-toolbar";
import { TakenList } from "@/components/taken-list";
import { TokenDetail } from "@/components/token-detail";
import { TokenTable } from "@/components/token-table";
import { WinRateBar } from "@/components/win-rate-bar";
import { usePaper, tallyPaper } from "@/hooks/use-paper";
import { useScreener } from "@/hooks/use-screener";
import { useSignalTimes } from "@/hooks/use-signal-times";
import { takenStatus, useTaken } from "@/hooks/use-taken";
import { useWatchlist } from "@/hooks/use-watchlist";
import { CHAINS } from "@/lib/chains";
import type { ChainId, PresetId, TokenRow, TradeMode } from "@/lib/types";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [activeChains, setActiveChains] = useState<Set<ChainId>>(
    () => new Set(CHAINS.map((c) => c.id)),
  );
  const [mode, setMode] = useState<TradeMode>("scalping");
  const [preset, setPreset] = useState<PresetId>("momentum");
  const [query, setQuery] = useState("");
  const [secureOnly, setSecureOnly] = useState(true);
  const [selected, setSelected] = useState<TokenRow | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const userCleared = useRef(false);
  const watchCount = useWatchlist((s) => s.ids.length);
  const takenItems = useTaken((s) => s.items);
  const dropTaken = useTaken((s) => s.drop);
  const paperItems = usePaper((s) => s.items);
  const paperTick = usePaper((s) => s.tick);
  const paperReset = usePaper((s) => s.reset);
  const stamps = useSignalTimes((s) => s.stamps);
  const touchSignals = useSignalTimes((s) => s.touch);

  const {
    tokens,
    live,
    matched,
    securePassed,
    scanned,
    source,
    loading,
    refreshing,
    error,
    fetchedAt,
    refresh,
  } = useScreener({
    activeChains,
    preset,
    mode,
    query,
    secureOnly,
  });

  const liveById = useMemo(() => new Map(live.map((t) => [t.id, t])), [live]);

  useEffect(() => {
    if (preset === "active" || tokens.length === 0) return;
    touchSignals(tokens.map((t) => t.id));
  }, [tokens, preset, touchSignals]);

  useEffect(() => {
    const tape = preset === "active" || preset === "watch" ? [] : tokens;
    paperTick(tape, live, mode);
  }, [tokens, live, mode, preset, paperTick]);

  const stamp = (token: TokenRow): TokenRow => ({
    ...token,
    signalAt: stamps[token.id]?.first ?? token.signalAt,
  });

  const takenRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return takenItems.filter((item) => {
      if (activeChains.size > 0 && !activeChains.has(item.token.chain)) return false;
      if (!q) return true;
      return (
        item.token.symbol.toLowerCase().includes(q) ||
        item.token.name.toLowerCase().includes(q) ||
        item.token.ca.toLowerCase().includes(q)
      );
    });
  }, [takenItems, activeChains, query]);

  const displayTokens = useMemo(() => {
    if (preset !== "active") return tokens.map(stamp);
    return takenRows.map((item) => {
      const liveToken = liveById.get(item.token.id);
      const row = liveToken
        ? {
            ...item.token,
            ...liveToken,
            smcSignal: item.token.smcSignal,
            signalStrength: item.token.signalStrength,
          }
        : item.token;
      return stamp(row);
    });
  }, [preset, tokens, takenRows, liveById, stamps]);

  useEffect(() => {
    if (userCleared.current) return;
    setSelected((prev) => {
      if (displayTokens.length === 0) return prev;
      if (prev) {
        const found = displayTokens.find((t) => t.id === prev.id);
        if (found) return found;
      }
      return displayTokens[0];
    });
  }, [displayTokens]);

  const selectedLive = useMemo(() => {
    if (!selected) return null;
    const found = displayTokens.find((t) => t.id === selected.id);
    if (found) return found;
    if (loading && displayTokens.length === 0) return selected;
    return null;
  }, [selected, displayTokens, loading]);

  const breadth = useMemo(() => {
    const chg = (t: TokenRow) => (mode === "scalping" ? t.priceChange1h : t.priceChange24h);
    const up = displayTokens.filter((t) => chg(t) > 0).length;
    const down = displayTokens.filter((t) => chg(t) < 0).length;
    const sorted = displayTokens.map(chg).sort((a, b) => a - b);
    const mid = sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
    return { up, down, median: mid };
  }, [displayTokens, mode]);

  const paperStats = useMemo(() => tallyPaper(paperItems, mode), [paperItems, mode]);

  const takenStats = useMemo(() => {
    let wins = 0;
    let losses = 0;
    let open = 0;
    for (const item of takenItems) {
      if (item.mode !== mode) continue;
      const px = liveById.get(item.token.id)?.price ?? item.token.price;
      const status = takenStatus(px, item);
      if (status === "tp1" || status === "tp2") wins += 1;
      else if (status === "sl") losses += 1;
      else open += 1;
    }
    const n = wins + losses;
    return { wins, losses, open, n, wr: n > 0 ? wins / n : null };
  }, [takenItems, liveById, mode]);

  const toggleChain = useCallback((id: ChainId) => {
    setActiveChains((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setActiveChains((prev) =>
      prev.size === CHAINS.length ? new Set() : new Set(CHAINS.map((c) => c.id)),
    );
  }, []);

  const onSelect = useCallback((token: TokenRow) => {
    userCleared.current = false;
    setSelected(token);
    setSheetOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setSheetOpen(false);
    userCleared.current = true;
    setSelected(null);
  }, []);

  const onTaken = useCallback(() => {
    setPreset("active");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      if (displayTokens.length === 0) return;
      const idx = selectedLive ? displayTokens.findIndex((t) => t.id === selectedLive.id) : -1;
      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        const next = displayTokens[Math.min(displayTokens.length - 1, Math.max(0, idx) + 1)] ?? displayTokens[0];
        userCleared.current = false;
        setSelected(next);
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        const next = displayTokens[Math.max(0, (idx < 0 ? 0 : idx) - 1)] ?? displayTokens[0];
        userCleared.current = false;
        setSelected(next);
      } else if (e.key === "Escape") {
        setSheetOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [displayTokens, selectedLive]);

  const emptyHint =
    preset === "watch"
      ? "Star tokens in the list to build a watchlist"
      : preset === "active"
        ? "Take a signal from the plan panel to keep it while you wait for TP"
        : secureOnly
          ? scanned > 0
            ? `None of ${matched} matches passed every security check. Turn off Pass all checks to see the raw list.`
            : matched > 0
              ? "Security scan returned no GoPlus results. Turn off Pass all checks to see raw pairs."
              : "No tokens match the current filters"
          : "No tokens match the current filters";

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <ScreenerHeader
        mode={mode}
        onModeChange={setMode}
        activeChains={activeChains}
        onToggleChain={toggleChain}
        onSelectAll={selectAll}
        resultCount={displayTokens.length}
      />

      <main className="mx-auto max-w-screen-2xl px-4 py-4 lg:px-6">
        <ScreenerToolbar
          query={query}
          onQuery={setQuery}
          preset={preset}
          onPreset={setPreset}
          source={source}
          fetchedAt={fetchedAt}
          refreshing={refreshing}
          onRefresh={() => void refresh()}
          watchCount={watchCount}
          takenCount={takenItems.length}
          breadth={breadth}
          secureOnly={secureOnly}
          onSecureOnly={setSecureOnly}
          securePassed={securePassed}
          scanned={scanned}
        />

        <WinRateBar
          paper={paperStats}
          taken={takenStats}
          mode={mode}
          onReset={paperReset}
        />

        {error ? (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-down/20 bg-down/10 px-3 py-2 text-xs text-down">
            <AlertTriangle className="size-4 shrink-0" />
            Couldn’t load live pairs. Retry in a moment.
          </div>
        ) : null}

        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="min-w-0 lg:w-[63%]">
            {preset === "active" ? (
              <TakenList
                items={takenRows}
                liveById={liveById}
                selectedId={selectedLive?.id ?? null}
                onSelect={onSelect}
                onDrop={dropTaken}
              />
            ) : (
              <TokenTable
                tokens={displayTokens}
                selectedId={selectedLive?.id ?? null}
                mode={mode}
                loading={loading}
                emptyHint={emptyHint}
                onSelect={onSelect}
              />
            )}
          </div>
          <div className="hidden lg:block lg:w-[37%]">
            {selectedLive ? (
              <div className="lg:sticky lg:top-28">
                <TokenDetail
                  token={selectedLive}
                  mode={mode}
                  onClose={onClose}
                  onTaken={onTaken}
                />
              </div>
            ) : (
              <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface p-6 text-center">
                <BarChart3 className="size-8 text-subtle" />
                <div>
                  <p className="text-sm font-medium text-fg">Select a token to analyze</p>
                  <p className="mt-1 text-xs text-muted">
                    Chart, security scan, SMC signal, and auto entry / TP / SL
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedLive && sheetOpen ? (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-bg/70"
            aria-label="Close details"
            onClick={() => setSheetOpen(false)}
          />
          <div className="relative w-full">
            <TokenDetail
              token={selectedLive}
              mode={mode}
              onClose={() => setSheetOpen(false)}
              onTaken={onTaken}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
