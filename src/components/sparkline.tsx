import { cn } from "@/lib/utils";

export function Sparkline({
  values,
  className,
}: {
  values: number[];
  className?: string;
}) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const w = 72;
  const h = 28;
  const pad = 1.5;
  const coords = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = pad + (1 - (v - min) / span) * (h - pad * 2);
    return [x, y] as const;
  });
  const d = coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");
  const area = `${d} L${coords[coords.length - 1][0].toFixed(2)} ${h} L${coords[0][0].toFixed(2)} ${h} Z`;
  const up = values[values.length - 1] >= values[0];
  const stroke = up ? "var(--color-up)" : "var(--color-down)";
  const fill = up ? "color-mix(in oklab, var(--color-up) 22%, transparent)" : "color-mix(in oklab, var(--color-down) 22%, transparent)";

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      className={cn("shrink-0 overflow-visible", className)}
      aria-hidden
    >
      <path d={area} fill={fill} />
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
