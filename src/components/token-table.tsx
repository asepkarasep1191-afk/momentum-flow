import { ArrowDown, ArrowUp, Check, Copy, Inbox, Loader2, Star } from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";
import { ChangeCell } from "@/components/change-cell";
import { SignalBadge } from "@/components/signal-badge";
import { Sparkline } from "@/components/sparkline";
import { Skeleton } from "@/components/ui/skeleton";
import { useWatchlist } from "@/hooks/use-watchlist";
import { sparklinePrices } from "@/lib/candles";
import { CHAIN_BY_ID } from "@/lib/chains";
import { formatAge, formatClock, formatPrice, formatUsd, shortAddress, signalFreshness } from "@/lib/format";
import { scoreForMode } from "@/lib/signals";
import type { TokenRow, TradeMode } from "@/lib/types";
import { cn } from "@/lib/utils";

type SortKey = "score" | "symbol" | "price" | "vol" | "time" | "strength";

const GRID =
  "grid-cols-[minmax(0,1.4fr)_auto] lg:grid-cols-[minmax(0,1.35fr)_0.75fr_0.55fr_0.5fr_0.62fr_0.95fr_minmax(7.2rem,auto)]";

function PriceFlash({ price }: { price: number }) {
  const prev = useRef(price);
  const [dir, setDir] = useState<"up" | "down" | null>(null);
  useEffect(() => {
    if (price !== prev.current) {
      setDir(price > prev.current ? "up" : "down");
      prev.current = price;
      const t = setTimeout(() => setDir(null), 700);
      return () => clearTimeout(t);
    }
  }, [price]);
  return (
    <div
      className={cn(
        "font-mono text-sm font-semibold tabular-nums transition-colors duration-500",
        dir === "up" && "text-up",
        dir === "down" && "text-down",
        !dir && "text-fg",
      )}
    >
      ${formatPrice(price)}
    </div>
  );
}

function TokenIdentity({ token, now }: { token: TokenRow; now: number }) {
  const chain = CHAIN_BY_ID[token.chain];
  const age = formatAge(token.signalAt, now);
  const fresh = signalFreshness(token.signalAt, now);
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      {token.imageUrl ? (
        <img
          src={token.imageUrl}
          alt=""
          className="size-8 shrink-0 rounded-md bg-surface-2 object-cover ring-1 ring-border"
        />
      ) : (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-surface-2 text-2xs font-bold text-accent ring-1 ring-border">
          {chain.short.slice(0, 3)}
        </div>
      )}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-fg">{token.symbol}</span>
          <span className="hidden rounded bg-surface-2 px-1 py-px text-2xs text-muted sm:inline">
            {chain.short}
          </span>
          {fresh !== "unknown" ? (
            <span
              className={cn(
                "rounded px-1 py-px text-2xs font-semibold lg:hidden",
                fresh === "new" && "bg-warn/15 text-warn",
                fresh === "fresh" && "bg-accent/15 text-accent",
                fresh === "old" && "bg-surface-2 text-muted",
              )}
            >
              {age}
            </span>
          ) : null}
        </div>
        <span className="block truncate text-2xs text-muted">{token.name}</span>
      </div>
    </div>
  );
}

function TimeCell({ signalAt, now }: { signalAt?: number; now: number }) {
  const t = Math.max(now, signalAt ?? 0);
  const age = formatAge(signalAt, t);
  const fresh = signalFreshness(signalAt, t);
  return (
    <div className="text-right" title="When this print first appeared on the screener tape">
      <div
        className={cn(
          "font-mono text-sm font-semibold tabular-nums",
          fresh === "new" && "text-warn",
          fresh === "fresh" && "text-fg",
          fresh === "old" && "text-muted",
          fresh === "unknown" && "text-subtle",
        )}
      >
        {age}
      </div>
      <div className="text-2xs text-subtle">{signalAt ? formatClock(signalAt) : "—"}</div>
    </div>
  );
}

function TokenRowView({
  token,
  selected,
  mode,
  now,
  onSelect,
}: {
  token: TokenRow;
  selected: boolean;
  mode: TradeMode;
  now: number;
  onSelect: (token: TokenRow) => void;
}) {
  const [copied, setCopied] = useState(false);
  const watched = useWatchlist((s) => s.ids.includes(token.id));
  const toggle = useWatchlist((s) => s.toggle);
  const spark = sparklinePrices(token);
  const change = mode === "scalping" ? token.priceChange1h : token.priceChange24h;

  return (
    <div
      onClick={() => onSelect(token)}
      className={cn(
        "grid cursor-pointer items-center gap-3 px-3 py-2.5 transition-colors duration-[var(--motion-quick)]",
        GRID,
        selected
          ? "bg-accent/10 shadow-[inset_2px_0_0_0_var(--color-accent)]"
          : "hover:bg-surface-2/80",
      )}
    >
      <div className="flex min-w-0 items-center gap-1">
        <button
          type="button"
          aria-label={watched ? "Remove from watchlist" : "Add to watchlist"}
          onClick={(e) => {
            e.stopPropagation();
            toggle(token.id);
          }}
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-md text-subtle hover:text-warn",
            watched && "text-warn",
          )}
        >
          <Star className="size-3.5" fill={watched ? "currentColor" : "none"} />
        </button>
        <TokenIdentity token={token} now={now} />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Sparkline values={spark} className="lg:hidden" />
        <div className="text-right">
          <PriceFlash price={token.price} />
          <div className="lg:hidden">
            <ChangeCell value={change} emphasize />
          </div>
          <div className="hidden text-2xs text-muted lg:block">{formatUsd(token.marketCap)}</div>
        </div>
      </div>

      <div className="hidden text-right lg:block">
        <div className="font-mono text-sm font-semibold tabular-nums text-accent">
          {token.volumeRatio.toFixed(1)}x
        </div>
        <div className="text-2xs text-muted">{formatUsd(token.volume24h)} vol</div>
      </div>

      <div className="hidden lg:block">
        <TimeCell signalAt={token.signalAt} now={now} />
      </div>

      <div className="hidden lg:flex lg:justify-center">
        <Sparkline values={spark} />
      </div>

      <div className="hidden lg:block">
        <SignalBadge token={token} />
      </div>

      <div className="hidden items-center justify-end lg:flex">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            void navigator.clipboard.writeText(token.ca).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1400);
            });
          }}
          className={cn(
            "flex min-h-8 items-center gap-1 rounded-md px-2 text-2xs font-medium ring-1",
            copied
              ? "bg-accent/15 text-accent ring-accent/30"
              : "bg-surface text-muted ring-border hover:text-fg",
          )}
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          {copied ? "Copied" : shortAddress(token.ca)}
        </button>
      </div>
    </div>
  );
}

function SortHead({
  label,
  active,
  dir,
  align = "left",
  onClick,
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  align?: "left" | "right" | "center";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-0.5 text-2xs font-semibold uppercase tracking-wider",
        active ? "text-fg" : "text-subtle hover:text-muted",
        align === "right" && "w-full justify-end",
        align === "center" && "w-full justify-center",
      )}
    >
      {label}
      {active ? (
        dir === "desc" ? (
          <ArrowDown className="size-3" />
        ) : (
          <ArrowUp className="size-3" />
        )
      ) : null}
    </button>
  );
}

export function TokenTable({
  tokens,
  selectedId,
  mode,
  loading,
  emptyHint,
  onSelect,
}: {
  tokens: TokenRow[];
  selectedId: string | null;
  mode: TradeMode;
  loading: boolean;
  emptyHint?: string;
  onSelect: (token: TokenRow) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(t);
  }, [tokens]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const rows = useMemo(() => {
    const list = [...tokens];
    const dir = sortDir === "asc" ? 1 : -1;
    list.sort((a, b) => {
      let av = 0;
      let bv = 0;
      switch (sortKey) {
        case "symbol":
          return dir * a.symbol.localeCompare(b.symbol);
        case "price":
          av = a.price;
          bv = b.price;
          break;
        case "vol":
          av = a.volumeRatio;
          bv = b.volumeRatio;
          break;
        case "time":
          av = a.signalAt ?? 0;
          bv = b.signalAt ?? 0;
          break;
        case "strength":
          av = a.signalStrength;
          bv = b.signalStrength;
          break;
        default:
          av = scoreForMode(a, mode);
          bv = scoreForMode(b, mode);
      }
      return dir * (av - bv);
    });
    return list;
  }, [tokens, sortKey, sortDir, mode]);

  if (loading && tokens.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-border bg-surface">
        <Loader2 className="size-6 animate-spin text-accent" />
        <p className="text-sm text-muted">Scanning live pairs + security…</p>
        <div className="mt-2 w-full max-w-md space-y-2 px-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-border bg-surface text-muted">
        <Inbox className="size-8" />
        <p className="max-w-sm text-center text-sm">{emptyHint ?? "No tokens match the current filters"}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <div className="lg:min-w-[52rem]">
        <div
          className={cn(
            "hidden gap-3 border-b border-border bg-bg/40 px-3 py-2 lg:grid",
            GRID,
          )}
        >
          <span className="pl-8">
            <SortHead
              label="Token"
              active={sortKey === "symbol"}
              dir={sortDir}
              onClick={() => toggleSort("symbol")}
            />
          </span>
          <SortHead
            label="Price / MC"
            active={sortKey === "price"}
            dir={sortDir}
            align="right"
            onClick={() => toggleSort("price")}
          />
          <SortHead
            label="Vol ratio"
            active={sortKey === "vol"}
            dir={sortDir}
            align="right"
            onClick={() => toggleSort("vol")}
          />
          <span title="When this print first appeared on the screener tape">
            <SortHead
              label="Time"
              active={sortKey === "time"}
              dir={sortDir}
              align="right"
              onClick={() => toggleSort("time")}
            />
          </span>
          <span className="text-center text-2xs font-semibold uppercase tracking-wider text-subtle">
            Path
          </span>
          <SortHead
            label="SMC"
            active={sortKey === "strength"}
            dir={sortDir}
            onClick={() => toggleSort("strength")}
          />
          <span className="text-right text-2xs font-semibold uppercase tracking-wider text-subtle">
            Contract
          </span>
        </div>
        <div className="divide-y divide-border">
          {rows.map((token) => (
            <TokenRowView
              key={token.id}
              token={token}
              selected={token.id === selectedId}
              mode={mode}
              now={now}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
