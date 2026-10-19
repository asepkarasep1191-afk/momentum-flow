import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CHAINS } from "@/lib/chains";
import { formatPct, formatPrice, formatUsd } from "@/lib/format";
import { loadScreenerFeed } from "@/lib/screener-feed";
import { structureRead } from "@/lib/signals";
import type { TradeMode } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pairs")({
  component: AllPairsPage,
});

function AllPairsPage() {
  const [mode, setMode] = useState<TradeMode>("scalping");
  const [onlyEntry, setOnlyEntry] = useState(false);
  const feed = useQuery({
    queryKey: ["all-pairs"],
    queryFn: () => loadScreenerFeed({ data: { chains: CHAINS.map((c) => c.id) } }),
    refetchInterval: 60_000,
    staleTime: 20_000,
  });

  const all = useMemo(() => {
    return (feed.data?.tokens ?? [])
      .map((token) => ({ token, read: structureRead(token, mode) }))
      .sort(
        (a, b) =>
          Number(b.read.actionable) - Number(a.read.actionable) || b.token.volume24h - a.token.volume24h,
      );
  }, [feed.data, mode]);
  const rows = onlyEntry ? all.filter((row) => row.read.actionable) : all;
  const entries = all.filter((row) => row.read.actionable).length;

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-sm font-semibold tracking-tight text-fg">
                All pairs
              </h1>
              <Link to="/" className="text-2xs text-muted hover:text-fg">
                Back to screener
              </Link>
            </div>
            <p className="text-2xs text-muted">
              Trending and new pools on every chain, plus the latest profiles.{" "}
              {feed.data ? `${rows.length} pairs · ${entries} with an entry` : "Loading pairs"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyEntry((v) => !v)}
              className={cn(
                "min-h-10 rounded-md px-3 text-xs font-medium ring-1",
                onlyEntry ? "bg-accent/15 text-accent ring-accent/30" : "text-muted ring-border",
              )}
            >
              Entries only
            </button>
            <div className="flex rounded-lg bg-surface p-1 ring-1 ring-border">
              {(["scalping", "swing"] as const).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMode(id)}
                  className={cn(
                    "min-h-10 rounded-md px-3 text-xs font-semibold",
                    mode === id ? "bg-accent/15 text-accent" : "text-muted",
                  )}
                >
                  {id === "scalping" ? "Scalp" : "Swing"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-screen-2xl px-4 py-4 lg:px-6">
        <p className="mb-3 text-2xs text-subtle">
          Mode {mode === "scalping" ? "scalp" : "swing"} sets the stop and targets on rows that have an entry. Not financial advice.
        </p>
        {feed.isLoading ? (
          <p className="text-sm text-muted">Pulling pools…</p>
        ) : feed.isError ? (
          <p className="text-sm text-down">Couldn’t load pairs. Refresh in a moment.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg ring-1 ring-border">
            <table className="w-full min-w-[920px] border-collapse text-left">
              <thead className="bg-surface text-2xs uppercase tracking-wider text-subtle">
                <tr>
                  {["Token", "Price", "5m / 1h / 6h", "Vol", "Bias", "Setup", "Entry", "Stop", "TP1", "Security"].map((h) => (
                    <th key={h} className="px-3 py-2 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(({ token, read }) => {
                  const chain = CHAINS.find((c) => c.id === token.chain)?.short ?? token.chain;
                  return (
                    <tr key={token.id} className="border-t border-border align-top">
                      <td className="px-3 py-2">
                        <div className="text-sm font-semibold text-fg">{token.symbol}</div>
                        <div className="text-2xs text-muted">
                          {chain} · {token.name}
                        </div>
                      </td>
                      <td className="px-3 py-2 font-mono text-xs tabular-nums">
                        ${formatPrice(token.price)}
                        <div className="text-2xs text-muted">{formatUsd(token.marketCap)}</div>
                      </td>
                      <td className="px-3 py-2 font-mono text-2xs tabular-nums text-muted">
                        {formatPct(token.priceChange5m)} / {formatPct(token.priceChange1h)} / {formatPct(token.priceChange6h)}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs tabular-nums">
                        {token.volumeRatio.toFixed(1)}x
                        <div className="text-2xs text-muted">{formatUsd(token.volume24h)}</div>
                      </td>
                      <td className={cn("px-3 py-2 text-xs font-semibold", read.bias === "Pullback long" ? "text-up" : read.bias === "Skip" ? "text-down" : "text-warn")}>
                        {read.bias}
                      </td>
                      <td className="max-w-56 px-3 py-2 text-xs text-fg">
                        {read.label}
                        <div className="text-2xs leading-relaxed text-muted">{read.why}</div>
                      </td>
                      <td className="px-3 py-2 font-mono text-2xs tabular-nums">
                        {read.actionable ? `$${formatPrice(read.entryLow)} – $${formatPrice(read.entryHigh)}` : "—"}
                      </td>
                      <td className="px-3 py-2 font-mono text-2xs tabular-nums text-down">
                        {read.actionable ? `$${formatPrice(read.sl)}` : "—"}
                      </td>
                      <td className="px-3 py-2 font-mono text-2xs tabular-nums text-up">
                        {read.actionable ? `$${formatPrice(read.tp1)}` : "—"}
                      </td>
                      <td className="px-3 py-2 text-2xs">
                        {token.security?.source === "goplus" ? (token.secure ? "Pass" : "Fail") : "Not scanned"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
