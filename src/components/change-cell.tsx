import { formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ChangeCell({
  value,
  emphasize,
}: {
  value: number;
  emphasize?: boolean;
}) {
  const up = value > 0;
  const down = value < 0;
  return (
    <span
      className={cn(
        "font-mono text-xs tabular-nums",
        up && "text-up",
        down && "text-down",
        !up && !down && "text-muted",
        emphasize && "font-semibold",
      )}
    >
      {formatPct(value)}
    </span>
  );
}

export function HeatBars({
  m5,
  h1,
  h6,
  h24,
}: {
  m5: number;
  h1: number;
  h6: number;
  h24: number;
}) {
  const bars = [
    { k: "5m", v: m5 },
    { k: "1h", v: h1 },
    { k: "6h", v: h6 },
    { k: "24h", v: h24 },
  ];
  const max = Math.max(4, ...bars.map((b) => Math.abs(b.v)));
  return (
    <div className="flex h-7 items-end gap-0.5" aria-hidden>
      {bars.map((b) => (
        <div
          key={b.k}
          className={cn(
            "w-1.5 rounded-sm",
            b.v >= 0 ? "bg-up/80" : "bg-down/80",
          )}
          style={{ height: `${Math.max(12, (Math.abs(b.v) / max) * 100)}%` }}
          title={`${b.k} ${b.v.toFixed(1)}%`}
        />
      ))}
    </div>
  );
}
