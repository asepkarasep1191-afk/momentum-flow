export function formatPrice(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "—";
  if (value >= 1000) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (value >= 1) return value.toFixed(3);
  if (value >= 0.01) return value.toFixed(5);
  if (value >= 1e-4) return value.toFixed(7);
  return value.toPrecision(4);
}

export function formatUsd(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "—";
  const abs = Math.abs(value);
  if (abs >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
}

export function formatPct(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return "—";
  if (value >= 1000) return ">+999%";
  if (value <= -1000) return "<-999%";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

export function shortAddress(value: string): string {
  if (value.length <= 12) return value;
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
}

export function formatAge(createdAt?: number, now = Date.now()): string {
  if (!createdAt) return "—";
  const ms = now - createdAt;
  if (ms < 0) return "<1m";
  const min = Math.floor(ms / 60000);
  if (min < 1) return "<1m";
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 48) return `${hr}h`;
  const day = Math.floor(hr / 24);
  if (day < 60) return `${day}d`;
  const mo = Math.floor(day / 30);
  return `${mo}mo`;
}

export function formatClock(at?: number): string {
  if (!at) return "—";
  return new Date(at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ageBucket(createdAt?: number, now = Date.now()): "new" | "recent" | "aged" | "unknown" {
  if (!createdAt) return "unknown";
  const ms = now - createdAt;
  if (ms < 24 * 3600_000) return "new";
  if (ms < 30 * 86400_000) return "recent";
  return "aged";
}

export function signalFreshness(
  signalAt?: number,
  now = Date.now(),
): "new" | "fresh" | "old" | "unknown" {
  if (!signalAt) return "unknown";
  const ms = now - signalAt;
  if (ms < 5 * 60_000) return "new";
  if (ms < 30 * 60_000) return "fresh";
  return "old";
}

export function riskReward(entry: number, target: number, stop: number): string {
  const risk = Math.abs(entry - stop);
  if (risk <= 0) return "—";
  return `1:${((target - entry) / risk).toFixed(1)}`;
}
