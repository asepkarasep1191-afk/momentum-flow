import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Input } from "@/components/ui/input";
import { formatPrice, formatUsd } from "@/lib/format";
import { planToPrice, tradePlan } from "@/lib/signals";
import type { TokenRow, TradeMode } from "@/lib/types";

type RiskState = {
  account: number;
  riskPct: number;
  setAccount: (n: number) => void;
  setRiskPct: (n: number) => void;
};

export const useRisk = create<RiskState>()(
  persist(
    (set) => ({
      account: 1000,
      riskPct: 1,
      setAccount: (account) => set({ account }),
      setRiskPct: (riskPct) => set({ riskPct }),
    }),
    { name: "momentumflow-risk" },
  ),
);

export function RiskPanel({ token, mode }: { token: TokenRow; mode: TradeMode }) {
  const account = useRisk((s) => s.account);
  const riskPct = useRisk((s) => s.riskPct);
  const setAccount = useRisk((s) => s.setAccount);
  const setRiskPct = useRisk((s) => s.setRiskPct);

  const math = useMemo(() => {
    const plan = tradePlan(token.marketCap, mode);
    const slPx = planToPrice(plan.sl, token.price, token.marketCap);
    const slPct = token.price > 0 ? Math.abs(token.price - slPx) / token.price : 0;
    const riskUsd = account * (Math.max(0, riskPct) / 100);
    const positionUsd = slPct > 0 ? riskUsd / slPct : 0;
    const units = token.price > 0 ? positionUsd / token.price : 0;
    return { slPx, slPct, riskUsd, positionUsd, units };
  }, [account, riskPct, token.price, token.marketCap, mode]);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="mb-1 block text-2xs uppercase tracking-wider text-subtle">
            Account (USD)
          </span>
          <Input
            type="number"
            min={0}
            step={50}
            value={Number.isFinite(account) ? account : 0}
            onChange={(e) => setAccount(Number(e.target.value) || 0)}
            className="h-9 font-mono text-xs"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-2xs uppercase tracking-wider text-subtle">
            Risk / trade
          </span>
          <div className="relative">
            <Input
              type="number"
              min={0.1}
              max={10}
              step={0.25}
              value={Number.isFinite(riskPct) ? riskPct : 1}
              onChange={(e) => setRiskPct(Number(e.target.value) || 0)}
              className="h-9 pr-7 font-mono text-xs"
            />
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-2xs text-subtle">
              %
            </span>
          </div>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md bg-border ring-1 ring-border">
        <Stat label="At risk" value={formatUsd(math.riskUsd)} />
        <Stat label="Stop distance" value={`${(math.slPct * 100).toFixed(2)}%`} />
        <Stat label="Position" value={formatUsd(math.positionUsd)} />
        <Stat
          label="Size"
          value={`${math.units >= 1 ? math.units.toFixed(2) : formatPrice(math.units)} ${token.symbol}`}
        />
      </div>
      <p className="text-2xs leading-relaxed text-subtle">
        Size sized so a hit of SL at ${formatPrice(math.slPx)} loses {riskPct}% of the account.
        Not an order — check liquidity first.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg px-3 py-2">
      <div className="text-2xs uppercase tracking-wider text-subtle">{label}</div>
      <div className="truncate font-mono text-xs font-semibold tabular-nums text-fg">{value}</div>
    </div>
  );
}
