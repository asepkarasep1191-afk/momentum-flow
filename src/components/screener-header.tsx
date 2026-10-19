import { TrendingUp, Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { CHAINS } from "@/lib/chains";
import type { ChainId, TradeMode } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ScreenerHeader({
  mode,
  onModeChange,
  activeChains,
  onToggleChain,
  onSelectAll,
  resultCount,
}: {
  mode: TradeMode;
  onModeChange: (mode: TradeMode) => void;
  activeChains: Set<ChainId>;
  onToggleChain: (id: ChainId) => void;
  onSelectAll: () => void;
  resultCount: number;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-3 px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-accent/15 ring-1 ring-accent/30">
              <svg
                viewBox="0 0 24 24"
                className="size-5 text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M3 17l6-6 4 4 7-7" />
                <path d="M14 8h5v5" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold tracking-tight text-fg">
                Momentum<span className="text-accent">Flow</span>
              </h1>
              <p className="text-2xs text-muted">
                DeFi momentum screener ·{" "}
                <Link to="/pairs" className="text-accent hover:underline">
                  All pairs
                </Link>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-surface p-1 ring-1 ring-border">
            <button
              type="button"
              onClick={() => onModeChange("scalping")}
              className={cn(
                "flex min-h-10 items-center gap-1.5 rounded-md px-3 text-xs font-semibold transition-colors duration-[var(--motion-quick)]",
                mode === "scalping"
                  ? "bg-scalp/15 text-scalp ring-1 ring-scalp/30"
                  : "text-muted hover:text-fg",
              )}
            >
              <Zap className="size-3.5" fill={mode === "scalping" ? "currentColor" : "none"} />
              Scalp
              <span className="hidden text-2xs opacity-60 sm:inline">5m/15m</span>
            </button>
            <button
              type="button"
              onClick={() => onModeChange("swing")}
              className={cn(
                "flex min-h-10 items-center gap-1.5 rounded-md px-3 text-xs font-semibold transition-colors duration-[var(--motion-quick)]",
                mode === "swing"
                  ? "bg-swing/15 text-swing ring-1 ring-swing/30"
                  : "text-muted hover:text-fg",
              )}
            >
              <TrendingUp className="size-3.5" />
              Swing
              <span className="hidden text-2xs opacity-60 sm:inline">1H/4H</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-2xs font-medium uppercase tracking-wider text-subtle">
            Chains
          </span>
          {CHAINS.map((chain) => {
            const on = activeChains.has(chain.id);
            return (
              <button
                key={chain.id}
                type="button"
                onClick={() => onToggleChain(chain.id)}
                className={cn(
                  "flex min-h-10 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium ring-1 transition-colors duration-[var(--motion-quick)]",
                  on
                    ? "bg-surface-2 text-fg ring-border-strong"
                    : "text-subtle ring-border hover:text-muted",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    on ? "bg-accent" : "bg-subtle",
                  )}
                />
                <span className="sm:hidden">{chain.short}</span>
                <span className="hidden sm:inline">{chain.name}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={onSelectAll}
            className="min-h-10 rounded-md px-2.5 text-2xs font-medium text-muted hover:text-fg"
          >
            {activeChains.size === CHAINS.length ? "Clear" : "All"}
          </button>
          <div className="ml-auto flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-2xs text-muted">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
              </span>
              Live
            </span>
            <span className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-2xs font-semibold tabular-nums text-muted">
              {resultCount} signals
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
