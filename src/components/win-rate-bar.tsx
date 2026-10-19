import { Percent } from "lucide-react";
import type { TradeMode, WinStats } from "@/lib/types";
import { cn } from "@/lib/utils";

function Rate({
  label,
  stats,
  mode,
}: {
  label: string;
  stats: WinStats;
  mode: TradeMode;
}) {
  const pct = stats.wr == null ? "—" : `${Math.round(stats.wr * 100)}%`;
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
      <span className="text-2xs font-semibold uppercase tracking-wider text-subtle">{label}</span>
      <span
        className={cn(
          "font-mono text-sm font-semibold tabular-nums",
          stats.wr == null && "text-muted",
          stats.wr != null && stats.wr >= 0.5 && "text-up",
          stats.wr != null && stats.wr < 0.5 && "text-down",
        )}
      >
        {pct}
      </span>
      <span className="font-mono text-2xs tabular-nums text-muted">
        {stats.n === 0
          ? "waiting for closes"
          : `${stats.wins}W / ${stats.losses}L · n=${stats.n}`}
      </span>
      <span className="text-2xs text-subtle">
        {stats.open} open · {mode === "scalping" ? "scalp TP1" : "swing TP1"}
      </span>
    </div>
  );
}

export function WinRateBar({
  paper,
  taken,
  mode,
  onReset,
}: {
  paper: WinStats;
  taken: WinStats;
  mode: TradeMode;
  onReset: () => void;
}) {
  return (
    <div className="mb-4 flex flex-col gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent">
          <Percent className="size-3.5" />
        </div>
        <div className="min-w-0 space-y-1">
          <Rate label="Screener paper" stats={paper} mode={mode} />
          <Rate label="Taken trades" stats={taken} mode={mode} />
          <p className="text-2xs leading-relaxed text-subtle">
            Marks TP1 vs SL from the 30s live print — not candle wicks. Leave the tape running so
            prints can close. Reset starts a new sample.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="h-10 shrink-0 self-start rounded-md px-3 text-xs font-medium text-muted ring-1 ring-border hover:text-fg sm:self-center"
      >
        Reset paper
      </button>
    </div>
  );
}
