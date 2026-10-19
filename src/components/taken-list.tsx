import { BookmarkX, Inbox, Pin } from "lucide-react";
import { ChangeCell } from "@/components/change-cell";
import { CHAIN_BY_ID } from "@/lib/chains";
import { takenStatus } from "@/hooks/use-taken";
import { formatAge, formatPrice } from "@/lib/format";
import type { TakenSignal, TokenRow } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS: Record<
  ReturnType<typeof takenStatus>,
  { label: string; className: string }
> = {
  open: { label: "In play", className: "bg-accent/15 text-accent" },
  tp1: { label: "TP1 hit", className: "bg-up/15 text-up" },
  tp2: { label: "TP2 hit", className: "bg-up/15 text-up" },
  sl: { label: "SL hit", className: "bg-down/15 text-down" },
};

export function TakenList({
  items,
  liveById,
  selectedId,
  onSelect,
  onDrop,
}: {
  items: TakenSignal[];
  liveById: Map<string, TokenRow>;
  selectedId: string | null;
  onSelect: (token: TokenRow) => void;
  onDrop: (key: string) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-border bg-surface text-muted">
        <Inbox className="size-8" />
        <p className="max-w-sm text-center text-sm">
          Take a signal from the plan panel. It stays here until you drop it — even if a new tape print replaces it.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="hidden grid-cols-[minmax(0,1.2fr)_0.7fr_0.7fr_0.7fr_auto] gap-3 border-b border-border bg-bg/40 px-3 py-2 lg:grid">
        <span className="pl-8 text-2xs font-semibold uppercase tracking-wider text-subtle">
          Taken signal
        </span>
        <span className="text-right text-2xs font-semibold uppercase tracking-wider text-subtle">
          Entry / now
        </span>
        <span className="text-right text-2xs font-semibold uppercase tracking-wider text-subtle">
          TP / SL
        </span>
        <span className="text-right text-2xs font-semibold uppercase tracking-wider text-subtle">
          Taken
        </span>
        <span className="text-right text-2xs font-semibold uppercase tracking-wider text-subtle">
          Status
        </span>
      </div>
      <div className="divide-y divide-border">
        {items.map((item) => {
          const live = liveById.get(item.token.id);
          const token = live
            ? { ...item.token, ...live, smcSignal: item.token.smcSignal, signalStrength: item.token.signalStrength }
            : item.token;
          const price = live?.price ?? item.token.price;
          const status = takenStatus(price, item);
          const meta = STATUS[status];
          const pnl = item.entry > 0 ? ((price - item.entry) / item.entry) * 100 : 0;
          const chain = CHAIN_BY_ID[item.token.chain];
          const selected = selectedId === item.token.id;

          return (
            <div
              key={item.key}
              onClick={() => onSelect(token)}
              className={cn(
                "grid cursor-pointer items-center gap-3 px-3 py-2.5 transition-colors duration-[var(--motion-quick)]",
                "grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1.2fr)_0.7fr_0.7fr_0.7fr_auto]",
                selected
                  ? "bg-accent/10 shadow-[inset_2px_0_0_0_var(--color-accent)]"
                  : "hover:bg-surface-2/80",
              )}
            >
              <div className="flex min-w-0 items-center gap-1">
                <span className="flex size-8 shrink-0 items-center justify-center text-accent">
                  <Pin className="size-3.5" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-semibold text-fg">{item.token.symbol}</span>
                    <span className="rounded bg-surface-2 px-1 py-px text-2xs text-muted">
                      {chain.short}
                    </span>
                    <span
                      className={cn(
                        "rounded px-1 py-px text-2xs font-semibold",
                        item.mode === "scalping" ? "bg-scalp/15 text-scalp" : "bg-swing/15 text-swing",
                      )}
                    >
                      {item.mode === "scalping" ? "Scalp" : "Swing"}
                    </span>
                  </div>
                  <span className="block truncate text-2xs text-muted">
                    {item.token.smcSignal}
                    {live ? "" : " · off tape"}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono text-sm font-semibold tabular-nums text-fg">
                  ${formatPrice(price)}
                </div>
                <div className="flex justify-end">
                  <ChangeCell value={pnl} emphasize />
                </div>
                <div className="hidden text-2xs text-subtle lg:block">
                  from ${formatPrice(item.entry)}
                </div>
              </div>

              <div className="hidden text-right lg:block">
                <div className="font-mono text-2xs tabular-nums text-up">
                  {formatPrice(item.tp1)} / {formatPrice(item.tp2)}
                </div>
                <div className="font-mono text-2xs tabular-nums text-down">{formatPrice(item.sl)}</div>
              </div>

              <div className="hidden text-right lg:block">
                <div className="font-mono text-sm tabular-nums text-fg">{formatAge(item.takenAt)}</div>
                <div className="text-2xs text-subtle">ago</div>
              </div>

              <div className="flex items-center justify-end gap-1.5">
                <span
                  className={cn(
                    "rounded-md px-2 py-1 text-2xs font-semibold",
                    meta.className,
                  )}
                >
                  {meta.label}
                </span>
                <button
                  type="button"
                  aria-label="Drop taken signal"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDrop(item.key);
                  }}
                  className="flex size-8 items-center justify-center rounded-md text-subtle hover:text-down"
                >
                  <BookmarkX className="size-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
