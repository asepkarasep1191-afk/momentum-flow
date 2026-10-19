import { Activity, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DataSource, PresetId } from "@/lib/types";
import { cn } from "@/lib/utils";

const PRESETS: { id: PresetId; label: string }[] = [
  { id: "momentum", label: "Momentum" },
  { id: "spike", label: "Vol spike" },
  { id: "heat", label: "Heat" },
  { id: "liquid", label: "Liquid" },
  { id: "active", label: "Active" },
  { id: "watch", label: "Watchlist" },
  { id: "all", label: "All" },
];

export function ScreenerToolbar({
  query,
  onQuery,
  preset,
  onPreset,
  source,
  fetchedAt,
  refreshing,
  onRefresh,
  watchCount,
  takenCount,
  breadth,
  secureOnly,
  onSecureOnly,
  securePassed,
  scanned,
}: {
  query: string;
  onQuery: (value: string) => void;
  preset: PresetId;
  onPreset: (id: PresetId) => void;
  source: DataSource | null;
  fetchedAt: number | null;
  refreshing: boolean;
  onRefresh: () => void;
  watchCount: number;
  takenCount: number;
  breadth: { up: number; down: number; median: number };
  secureOnly: boolean;
  onSecureOnly: (value: boolean) => void;
  securePassed: number;
  scanned: number;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <Input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search symbol, name, or contract…"
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 text-2xs text-muted">
          <span className="hidden items-center gap-1.5 sm:flex">
            <Activity className="size-3.5" />
            {source === "market" ? "Market data" : source === "dex" ? "Live DEX pairs" : "Connecting"}
          </span>
          {fetchedAt ? (
            <span className="hidden font-mono tabular-nums sm:inline">
              {new Date(fetchedAt).toLocaleTimeString()}
            </span>
          ) : null}
          <Button variant="ghost" size="sm" onClick={onRefresh} disabled={refreshing}>
            <RefreshCw className={cn("size-3", refreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onPreset(p.id)}
            className={cn(
              "min-h-10 rounded-md px-3 text-xs font-medium ring-1 transition-colors duration-[var(--motion-quick)]",
              preset === p.id
                ? "bg-accent/15 text-accent ring-accent/30"
                : "text-muted ring-border hover:text-fg",
            )}
          >
            {p.label}
            {p.id === "watch" && watchCount > 0 ? (
              <span className="ml-1.5 font-mono text-2xs tabular-nums opacity-70">{watchCount}</span>
            ) : null}
            {p.id === "active" && takenCount > 0 ? (
              <span className="ml-1.5 font-mono text-2xs tabular-nums opacity-70">{takenCount}</span>
            ) : null}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onSecureOnly(!secureOnly)}
          className={cn(
            "ml-0 flex min-h-10 items-center gap-1.5 rounded-md px-3 text-xs font-medium ring-1 transition-colors duration-[var(--motion-quick)] sm:ml-2",
            secureOnly
              ? "bg-accent/15 text-accent ring-accent/30"
              : "text-muted ring-border hover:text-fg",
          )}
        >
          <ShieldCheck className="size-3.5" />
          Pass all checks
          {scanned > 0 ? (
            <span className="font-mono text-2xs tabular-nums opacity-70">
              {securePassed}/{scanned}
            </span>
          ) : null}
        </button>
        {breadth.up + breadth.down > 0 ? (
          <span className="ml-auto hidden items-center gap-2 font-mono text-2xs tabular-nums text-muted xl:flex">
            <span className="text-up">{breadth.up} up</span>
            <span className="text-subtle">/</span>
            <span className="text-down">{breadth.down} down</span>
            <span className="text-subtle">· med</span>
            <span className={breadth.median >= 0 ? "text-up" : "text-down"}>
              {breadth.median >= 0 ? "+" : ""}
              {breadth.median.toFixed(1)}%
            </span>
          </span>
        ) : null}
      </div>
    </div>
  );
}
