import { create } from "zustand";
import { persist } from "zustand/middleware";
import { planToPrice, tradePlan } from "@/lib/signals";
import type { PaperTrade, TokenRow, TradeMode, WinStats } from "@/lib/types";

const MAX = 200;
const SCALP_TTL = 24 * 3600_000;
const SWING_TTL = 7 * 86400_000;

export function tallyPaper(items: PaperTrade[], mode: TradeMode): WinStats {
  const scoped = items.filter((i) => i.mode === mode);
  const wins = scoped.filter((i) => i.outcome === "win").length;
  const losses = scoped.filter((i) => i.outcome === "loss").length;
  const open = scoped.filter((i) => i.outcome === "open").length;
  const n = wins + losses;
  return { wins, losses, open, n, wr: n > 0 ? wins / n : null };
}

function resolvePx(p: PaperTrade, px: number, now: number): PaperTrade {
  if (px <= p.sl) return { ...p, lastPrice: px, outcome: "loss", exit: "sl", closedAt: now };
  if (px >= p.tp2) return { ...p, lastPrice: px, outcome: "win", exit: "tp2", closedAt: now };
  if (px >= p.tp1) return { ...p, lastPrice: px, outcome: "win", exit: "tp1", closedAt: now };
  return { ...p, lastPrice: px };
}

type PaperState = {
  items: PaperTrade[];
  tick: (tape: TokenRow[], live: TokenRow[], mode: TradeMode) => void;
  reset: () => void;
};

export const usePaper = create<PaperState>()(
  persist(
    (set, get) => ({
      items: [],
      reset: () => set({ items: [] }),
      tick: (tape, live, mode) => {
        const now = Date.now();
        const liveMap = new Map(live.map((t) => [t.id, t]));
        let items = get().items;
        let changed = false;
        const next: PaperTrade[] = [];

        for (const p of items) {
          if (p.outcome !== "open") {
            next.push(p);
            continue;
          }
          const ttl = p.mode === "scalping" ? SCALP_TTL : SWING_TTL;
          if (now - p.openedAt > ttl) {
            next.push({ ...p, outcome: "expired", closedAt: now });
            changed = true;
            continue;
          }
          const px = liveMap.get(p.tokenId)?.price;
          if (!(px && px > 0)) {
            next.push(p);
            continue;
          }
          const resolved = resolvePx(p, px, now);
          if (
            resolved.outcome !== p.outcome ||
            resolved.lastPrice !== p.lastPrice ||
            resolved.exit !== p.exit
          ) {
            changed = true;
          }
          next.push(resolved);
        }

        const openOrClosed = new Set(next.filter((i) => i.mode === mode).map((i) => i.key));
        for (const t of tape) {
          if (!(t.price > 0) || t.marketCap <= 0) continue;
          const key = `${t.id}:${mode}`;
          if (openOrClosed.has(key)) continue;
          const plan = tradePlan(t.marketCap, mode);
          next.unshift({
            key,
            tokenId: t.id,
            symbol: t.symbol,
            chain: t.chain,
            mode,
            openedAt: now,
            entry: t.price,
            tp1: planToPrice(plan.tp1, t.price, t.marketCap),
            tp2: planToPrice(plan.tp2, t.price, t.marketCap),
            sl: planToPrice(plan.sl, t.price, t.marketCap),
            lastPrice: t.price,
            outcome: "open",
          });
          openOrClosed.add(key);
          changed = true;
        }

        let trimmed = next;
        if (trimmed.length > MAX) {
          const open = trimmed.filter((i) => i.outcome === "open");
          const rest = trimmed.filter((i) => i.outcome !== "open").slice(0, MAX - open.length);
          trimmed = [...open, ...rest];
          changed = true;
        }
        if (changed) set({ items: trimmed });
      },
    }),
    { name: "momentumflow-paper" },
  ),
);
