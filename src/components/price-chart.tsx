import { useMemo, useState, type PointerEvent } from "react";
import { buildChartSeries } from "@/lib/candles";
import { formatPct, formatPrice } from "@/lib/format";
import { planToPrice, tradePlan } from "@/lib/signals";
import type { TokenRow, TradeMode } from "@/lib/types";
import { cn } from "@/lib/utils";

type Level = { key: string; label: string; price: number; tone: "up" | "down" };

export function PriceChart({ token, mode }: { token: TokenRow; mode: TradeMode }) {
  const series = useMemo(() => buildChartSeries(token, mode), [token, mode]);
  const plan = useMemo(() => tradePlan(token.marketCap, mode), [token.marketCap, mode]);
  const [hover, setHover] = useState<number | null>(null);

  const toPx = (v: number) => planToPrice(v, token.price, token.marketCap);
  const entryLow = toPx(plan.entryLow);
  const entryHigh = toPx(plan.entryHigh);
  const levels: Level[] = [
    { key: "tp2", label: "TP2", price: toPx(plan.tp2), tone: "up" },
    { key: "tp1", label: "TP1", price: toPx(plan.tp1), tone: "up" },
    { key: "sl", label: "SL", price: toPx(plan.sl), tone: "down" },
  ];

  const W = 640;
  const H = 188;
  const pad = { l: 8, r: 78, t: 14, b: 28 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const prices = series.map((p) => p.price);
  const extra = [...levels.map((l) => l.price), entryLow, entryHigh, token.price];
  const min = Math.min(...prices, ...extra) * 0.997;
  const max = Math.max(...prices, ...extra) * 1.003;
  const span = max - min || 1;
  const xAt = (i: number) => pad.l + (i / Math.max(series.length - 1, 1)) * innerW;
  const yAt = (price: number) => pad.t + (1 - (price - min) / span) * innerH;

  const placed = [...levels]
    .map((lvl) => ({ ...lvl, y: yAt(lvl.price) }))
    .sort((a, b) => a.y - b.y);
  for (let i = 1; i < placed.length; i++) {
    if (placed[i].y - placed[i - 1].y < 13) placed[i].y = placed[i - 1].y + 13;
  }

  const line = series
    .map((p, i) => `${i === 0 ? "M" : "L"}${xAt(i).toFixed(1)} ${yAt(p.price).toFixed(1)}`)
    .join(" ");
  const area = `${line} L${xAt(series.length - 1).toFixed(1)} ${pad.t + innerH} L${xAt(0).toFixed(1)} ${pad.t + innerH} Z`;
  const up = (series.at(-1)?.price ?? 0) >= (series[0]?.price ?? 0);
  const hi = hover != null ? series[hover] : series.at(-1);
  const maxVol = Math.max(...series.map((p) => p.volume), 1);
  const yEntryTop = Math.min(yAt(entryHigh), yAt(entryLow));
  const yEntryH = Math.abs(yAt(entryHigh) - yAt(entryLow));

  const onMove = (ev: PointerEvent<SVGSVGElement>) => {
    const box = ev.currentTarget.getBoundingClientRect();
    const x = ((ev.clientX - box.left) / box.width) * W;
    const i = Math.round(((x - pad.l) / innerW) * (series.length - 1));
    setHover(Math.min(series.length - 1, Math.max(0, i)));
  };

  return (
    <div className="border-b border-border px-3 pb-3 pt-2">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <div className="text-2xs font-semibold uppercase tracking-wider text-subtle">
          {mode === "scalping" ? "Print path · last 2h" : "Print path · last 24h"}
        </div>
        {hi ? (
          <div className="font-mono text-xs font-semibold tabular-nums text-fg">
            ${formatPrice(hi.price)}
            <span className={cn("ml-1.5 text-2xs", up ? "text-up" : "text-down")}>
              {formatPct(
                ((hi.price - (series[0]?.price ?? hi.price)) / (series[0]?.price || 1)) * 100,
                2,
              )}
            </span>
          </div>
        ) : null}
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-44 w-full"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        role="img"
        aria-label="Price path with take-profit and stop levels"
      >
        <rect
          x={pad.l}
          y={yEntryTop}
          width={innerW}
          height={Math.max(2, yEntryH)}
          fill="color-mix(in oklab, var(--color-muted) 14%, transparent)"
        />
        <path
          d={area}
          fill={
            up
              ? "color-mix(in oklab, var(--color-up) 16%, transparent)"
              : "color-mix(in oklab, var(--color-down) 16%, transparent)"
          }
        />
        {series.map((p, i) => (
          <rect
            key={p.t}
            x={xAt(i) - innerW / series.length / 3}
            y={pad.t + innerH - Math.max(2, (p.volume / maxVol) * 22)}
            width={Math.max(1.5, innerW / series.length / 2.2)}
            height={Math.max(2, (p.volume / maxVol) * 22)}
            fill="color-mix(in oklab, var(--color-fg) 12%, transparent)"
          />
        ))}
        {placed.map((lvl) => (
          <g key={lvl.key}>
            <line
              x1={pad.l}
              x2={W - pad.r + 4}
              y1={yAt(lvl.price)}
              y2={yAt(lvl.price)}
              stroke={lvl.tone === "up" ? "var(--color-up)" : "var(--color-down)"}
              strokeWidth="1"
              strokeDasharray="4 3"
              opacity="0.75"
            />
            <text
              x={W - pad.r + 8}
              y={lvl.y + 3}
              fill={lvl.tone === "up" ? "var(--color-up)" : "var(--color-down)"}
              fontSize="10"
              fontFamily="var(--font-mono)"
            >
              {lvl.label} {formatPrice(lvl.price)}
            </text>
          </g>
        ))}
        <path
          d={line}
          fill="none"
          stroke={up ? "var(--color-up)" : "var(--color-down)"}
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {hover != null && hi ? (
          <>
            <line
              x1={xAt(hover)}
              x2={xAt(hover)}
              y1={pad.t}
              y2={pad.t + innerH}
              stroke="color-mix(in oklab, var(--color-fg) 28%, transparent)"
              strokeDasharray="3 3"
            />
            <circle
              cx={xAt(hover)}
              cy={yAt(hi.price)}
              r="3.5"
              fill={up ? "var(--color-up)" : "var(--color-down)"}
            />
          </>
        ) : null}
        <text x={pad.l} y={H - 8} fill="var(--color-subtle)" fontSize="10">
          {mode === "scalping" ? "2h ago" : "24h ago"}
        </text>
        <text x={W - pad.r - 22} y={H - 8} fill="var(--color-subtle)" fontSize="10">
          now
        </text>
      </svg>
      <p className="mt-1 text-2xs text-subtle">
        Gray band is the entry zone. Path from 5m / 1h / 6h / 24h prints — not tick candles.
      </p>
    </div>
  );
}
