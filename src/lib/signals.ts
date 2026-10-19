import type { PresetId, SmcSignal, TokenRow, TradeMode, TradePlan } from "./types";

export function volumeRatio(volume: {
  h24?: number;
  h6?: number;
  h1?: number;
} | null | undefined): number {
  if (!volume) return 1;
  const h24 = volume.h24 ?? 0;
  const h6 = volume.h6 ?? 0;
  if (h24 === 0 || h6 === 0) return 1;
  const olderHourly = Math.max((h24 - h6) / 18, 0.01);
  const recentHourly = h6 / 6;
  if (olderHourly === 0) return 1;
  return Math.min(25, recentHourly / olderHourly);
}

export function deriveSignal(input: {
  priceChange5m: number;
  priceChange1h: number;
  priceChange6h: number;
  priceChange24h: number;
  volumeRatio: number;
}): { signal: SmcSignal; strength: number } {
  const { priceChange5m: m5, priceChange1h: h1, priceChange6h: h6, priceChange24h: h24, volumeRatio: vr } =
    input;

  let strength = 38;
  if (m5 > 0) strength += 8;
  if (h1 > 0) strength += 12;
  if (h1 > 3) strength += 6;
  if (h6 > 0) strength += 10;
  if (h6 > 5) strength += 5;
  if (h24 > 0) strength += 8;
  if (vr > 1.2) strength += 8;
  if (vr > 1.8) strength += 6;
  if (vr > 3) strength += 5;
  if (h1 < -4) strength -= 10;
  strength = Math.max(20, Math.min(99, Math.round(strength)));

  const orderBlock = h1 > 0 && m5 >= -0.5;
  const fairValueGap = vr > 1.5 && h6 >= 0;
  const distribution = h1 < 0 && vr > 1.6;

  let signal: SmcSignal;
  if (orderBlock && fairValueGap) signal = "Bullish OB + FVG";
  else if (orderBlock) signal = "Bullish OB";
  else if (distribution) signal = "Distribution";
  else if (fairValueGap) signal = "Unfilled FVG";
  else signal = h6 >= 0 ? "Bullish OB" : "Unfilled FVG";

  return { signal, strength: Math.max(strength, 32) };
}

export function tradePlan(marketCap: number, mode: TradeMode): TradePlan {
  if (marketCap <= 0) {
    return { entryLow: 0, entryHigh: 0, tp1: 0, tp2: 0, sl: 0 };
  }
  if (mode === "scalping") {
    return {
      entryLow: marketCap * 0.985,
      entryHigh: marketCap * 1.015,
      tp1: marketCap * 1.025,
      tp2: marketCap * 1.05,
      sl: marketCap * 0.975,
    };
  }
  return {
    entryLow: marketCap * 0.985,
    entryHigh: marketCap * 1.015,
    tp1: marketCap * 1.15,
    tp2: marketCap * 1.35,
    sl: marketCap * 0.9,
  };
}

export function planToPrice(planValue: number, price: number, marketCap: number): number {
  if (marketCap <= 0) return 0;
  return price * (planValue / marketCap);
}

export function matchesPreset(token: TokenRow, preset: PresetId): boolean {
  switch (preset) {
    case "momentum":
      return (
        (token.priceChange1h > 0 || token.priceChange6h > 0 || token.priceChange24h > 0) &&
        token.volume24h > 10_000
      );
    case "spike":
      return token.volumeRatio >= 1.8 && token.volume24h > 8_000;
    case "heat":
      return Math.abs(token.priceChange5m) >= 1.5 || Math.abs(token.priceChange1h) >= 4;
    case "liquid":
      return token.liquidity >= 80_000 || (token.source === "market" && token.volume24h >= 5_000_000);
    case "all":
    case "watch":
    case "active":
      return true;
    default:
      return true;
  }
}

export function scoreForMode(token: TokenRow, mode: TradeMode): number {
  if (mode === "scalping") {
    return (
      token.signalStrength +
      Math.abs(token.priceChange5m) * 2 +
      Math.abs(token.priceChange1h) +
      token.volumeRatio * 4
    );
  }
  return (
    token.signalStrength +
    Math.max(token.priceChange6h, 0) * 1.4 +
    Math.max(token.priceChange24h, 0) +
    token.volumeRatio * 3
  );
}

export function smcNote(signal: SmcSignal): string {
  switch (signal) {
    case "Bullish OB + FVG":
      return "Impulse plus a volume pocket — continuation bias if the last up-leg holds.";
    case "Bullish OB":
      return "Last up-leg is still defending. Look for a reclaim of the 5m print.";
    case "Unfilled FVG":
      return "Displacement left a gap. Wait for a fill, then continuation.";
    case "Distribution":
      return "Volume is up while price fades — fade rallies or stand aside.";
    default:
      return "Momentum heuristic from prints and volume, not order-book SMC.";
  }
}

export type TradeBias = "Pullback long" | "Skip" | "Stand aside";

export type StructureRead = {
  bias: TradeBias;
  label: string;
  why: string;
  entryLow: number;
  entryHigh: number;
  sl: number;
  tp1: number;
  tp2: number;
  actionable: boolean;
};

export function structureRead(token: TokenRow, mode: TradeMode = "scalping"): StructureRead {
  const p = token.price;
  const m5 = token.priceChange5m;
  const h1 = token.priceChange1h;
  const h6 = token.priceChange6h;
  const h24 = token.priceChange24h;
  const vr = token.volumeRatio;
  const thin =
    token.liquidity > 0 && token.marketCap > 0 && token.liquidity < token.marketCap * 0.008;
  const young = token.pairCreatedAt ? Date.now() - token.pairCreatedAt < 48 * 3600_000 : false;
  const extra = [
    thin ? "Liquidity is thin versus market cap." : "",
    young ? "Pair is under 48h old." : "",
  ]
    .filter(Boolean)
    .join(" ");

  const skip = (label: string, why: string, bias: TradeBias = "Skip"): StructureRead => ({
    bias,
    label,
    why: extra ? `${why} ${extra}` : why,
    entryLow: 0,
    entryHigh: 0,
    sl: 0,
    tp1: 0,
    tp2: 0,
    actionable: false,
  });

  const swing = mode === "swing";
  if (!(p > 0)) {
    return skip("No price", "Cannot build a plan without a live print.", "Stand aside");
  }
  if (h24 >= 100 && h6 < 0) {
    return skip(
      "Post-blowoff",
      `24h is +${h24.toFixed(0)}% and the 6h leg is already ${h6.toFixed(1)}%. The gap being filled is the dump, not a long.`,
    );
  }
  if (h1 < 0 && vr >= 1.6) {
    return skip(
      "Distribution",
      `Volume is ${vr.toFixed(1)}x while the 1h print is ${h1.toFixed(1)}%. Do not buy the fade.`,
      "Stand aside",
    );
  }
  if (h6 <= -8 && h24 < 0 && h1 < 4) {
    return skip(
      "Downtrend bounce",
      `6h ${h6.toFixed(1)}% and 24h ${h24.toFixed(1)}%. A small 1h print is a bounce inside the drop, not an order block.`,
    );
  }
  if (h1 <= -4 && m5 >= -0.5) {
    return skip(
      "Broken 1h",
      `The 5m print (${m5 >= 0 ? "+" : ""}${m5.toFixed(1)}%) sits inside a 1h drop of ${h1.toFixed(1)}%. Wait until the 1h print turns positive.`,
    );
  }
  if (h1 > 3 && (m5 < 0 || vr < 0.9)) {
    const leg = p / (1 + h1 / 100);
    const entryLow = Math.max(leg * 1.01, p * 0.96);
    const entryHigh = Math.min(p * 0.995, Math.max(entryLow, p * 0.985));
    return {
      bias: "Pullback long",
      label: vr < 0.9 ? "Impulse cooling" : "1h impulse",
      why: `1h is still +${h1.toFixed(1)}%, but ${m5 < 0 ? `the 5m print rolled ${m5.toFixed(1)}%` : "price is extended"}${vr < 0.9 ? ` and volume is only ${vr.toFixed(1)}x` : ""}. Buy the dip, not this print.${extra ? ` ${extra}` : ""}`,
      entryLow,
      entryHigh,
      sl: leg * (swing ? 0.99 : 0.995),
      tp1: p * (swing ? 1.15 : 1.08),
      tp2: p * (swing ? 1.35 : 1.18),
      actionable: true,
    };
  }
  if (h1 > 0 && m5 >= -0.5 && h6 >= -1) {
    return {
      bias: "Pullback long",
      label: vr >= 1.5 ? "OB + volume pocket" : "Defended up-leg",
      why: `5m ${m5 >= 0 ? "+" : ""}${m5.toFixed(1)}%, 1h +${h1.toFixed(1)}%, 6h ${h6 >= 0 ? "+" : ""}${h6.toFixed(1)}%. The up-leg is still intact${vr >= 1.2 ? ` with ${vr.toFixed(1)}x volume` : ""}.${extra ? ` ${extra}` : ""}`,
      entryLow: p * 0.985,
      entryHigh: p * 1.005,
      sl: p * (swing ? 0.9 : 0.97),
      tp1: p * (swing ? 1.15 : 1.03),
      tp2: p * (swing ? 1.35 : 1.06),
      actionable: true,
    };
  }
  return skip(
    "No clean structure",
    "5m, 1h, and 6h do not agree. Stand aside until they line up.",
    "Stand aside",
  );
}

