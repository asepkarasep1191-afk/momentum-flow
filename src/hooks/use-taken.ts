import { create } from "zustand";
import { persist } from "zustand/middleware";
import { planToPrice, tradePlan } from "@/lib/signals";
import type { TakenSignal, TakenStatus, TokenRow, TradeMode } from "@/lib/types";

const MAX = 40;

export function takenKey(tokenId: string, mode: TradeMode) {
  return `${tokenId}:${mode}`;
}

export function takenStatus(price: number, item: TakenSignal): TakenStatus {
  if (!(price > 0)) return "open";
  if (price <= item.sl) return "sl";
  if (price >= item.tp2) return "tp2";
  if (price >= item.tp1) return "tp1";
  return "open";
}

type TakenState = {
  items: TakenSignal[];
  take: (token: TokenRow, mode: TradeMode) => void;
  drop: (key: string) => void;
  has: (tokenId: string, mode: TradeMode) => boolean;
};

export const useTaken = create<TakenState>()(
  persist(
    (set, get) => ({
      items: [],
      take: (token, mode) => {
        const plan = tradePlan(token.marketCap, mode);
        const next: TakenSignal = {
          key: takenKey(token.id, mode),
          takenAt: Date.now(),
          mode,
          token: {
            ...token,
            security: undefined,
          },
          entry: token.price,
          tp1: planToPrice(plan.tp1, token.price, token.marketCap),
          tp2: planToPrice(plan.tp2, token.price, token.marketCap),
          sl: planToPrice(plan.sl, token.price, token.marketCap),
        };
        set((state) => ({
          items: [next, ...state.items.filter((x) => x.key !== next.key)].slice(0, MAX),
        }));
      },
      drop: (key) => set((state) => ({ items: state.items.filter((x) => x.key !== key) })),
      has: (tokenId, mode) => get().items.some((x) => x.key === takenKey(tokenId, mode)),
    }),
    { name: "momentumflow-taken" },
  ),
);
