import { createServerFn } from "@tanstack/react-start";
import { CHAIN_BY_ID } from "./chains";
import type { ChainId, SecurityReport, TokenRow } from "./types";

type GoPlusEvm = {
  is_honeypot?: string;
  cannot_sell_all?: string;
  cannot_buy?: string;
  buy_tax?: string;
  sell_tax?: string;
  is_mintable?: string;
  owner_address?: string;
  creator_address?: string;
  holder_count?: string;
  lp_holders?: Array<{
    address?: string;
    tag?: string;
    is_locked?: number | string;
    percent?: string;
  }>;
  holders?: Array<{ percent?: string }>;
  is_open_source?: string;
  hidden_owner?: string;
};

type GoPlusSol = {
  mintable?: { status?: string };
  freezable?: { status?: string };
  closable?: { status?: string };
  holder_count?: string;
  holders?: Array<{ percent?: string; is_locked?: number }>;
  dex?: Array<{ burn_percent?: number | null; tvl?: string }>;
  non_transferable?: string;
};

function pct(value: string | number | undefined): number {
  const n = typeof value === "number" ? value : parseFloat(String(value ?? "0"));
  if (!Number.isFinite(n)) return 0;
  return n <= 1 ? n * 100 : n;
}

function isBurnOrLockAddress(addr?: string, tag?: string): boolean {
  const a = (addr ?? "").toLowerCase();
  const t = (tag ?? "").toLowerCase();
  if (!a && !t) return false;
  return (
    a.includes("dead") ||
    a === "0x0000000000000000000000000000000000000000" ||
    t.includes("lock") ||
    t.includes("burn") ||
    t.includes("unicrypt") ||
    t.includes("pink") ||
    t.includes("team.finance") ||
    t.includes("dxsale")
  );
}

function isRenounced(owner?: string, mintable?: string): boolean {
  if (owner == null || owner === "") {
    return mintable === "0";
  }
  const o = owner.toLowerCase();
  return (
    o === "0x0000000000000000000000000000000000000000" ||
    o === "0x000000000000000000000000000000000000dead" ||
    o.includes("null")
  );
}

function lpLockFromHolders(
  holders: Array<{ address?: string; tag?: string; is_locked?: number | string; percent?: string }>,
): { locked: boolean; percent: number } {
  const lockedShare = holders.reduce((sum, h) => {
    const flagged =
      String(h.is_locked) === "1" || h.is_locked === 1 || isBurnOrLockAddress(h.address, h.tag);
    return sum + (flagged ? pct(h.percent) : 0);
  }, 0);
  const percent = Math.min(100, Math.round(lockedShare));
  return { locked: percent >= 50, percent };
}

function mapEvm(data: GoPlusEvm): SecurityReport {
  const taxBuy = pct(data.buy_tax);
  const taxSell = pct(data.sell_tax);
  const honeypot = data.is_honeypot === "1" || data.cannot_sell_all === "1";
  const lp = lpLockFromHolders(data.lp_holders ?? []);
  const topHoldersPercent = (data.holders ?? []).slice(0, 10).reduce((s, h) => s + pct(h.percent), 0);
  const notes: string[] = [];
  if (data.is_open_source === "0") notes.push("Contract source is not verified");
  if (data.cannot_buy === "1") notes.push("Buys may be blocked");
  if (data.hidden_owner === "1") notes.push("Hidden owner detected");
  return {
    source: "goplus",
    honeypot,
    cannotSell: data.cannot_sell_all === "1",
    lpLocked: lp.locked,
    lpLockedPercent: lp.percent,
    renouncedOwnership: isRenounced(data.owner_address, data.is_mintable) && data.hidden_owner !== "1",
    mintable: data.is_mintable === "1",
    freezeable: false,
    taxBuy,
    taxSell,
    topHoldersPercent,
    holderCount: parseInt(data.holder_count ?? "0", 10) || undefined,
    notes,
  };
}

function mapSol(data: GoPlusSol): SecurityReport {
  const burned = (data.dex ?? []).reduce((max, d) => {
    const raw = d.burn_percent;
    if (raw == null || !Number.isFinite(raw)) return max;
    const n = raw <= 1 ? raw * 100 : raw;
    return Math.max(max, n);
  }, 0);
  const topHoldersPercent = (data.holders ?? [])
    .slice(0, 10)
    .reduce((s, h) => s + pct(h.percent), 0);
  const notes: string[] = [];
  if (data.non_transferable === "1") notes.push("Token may be non-transferable");
  return {
    source: "goplus",
    honeypot: data.non_transferable === "1",
    cannotSell: data.non_transferable === "1",
    lpLocked: burned >= 50,
    lpLockedPercent: Math.min(100, Math.round(burned)),
    renouncedOwnership: data.mintable?.status === "0",
    mintable: data.mintable?.status === "1",
    freezeable: data.freezable?.status === "1",
    taxBuy: 0,
    taxSell: 0,
    topHoldersPercent,
    holderCount: parseInt(data.holder_count ?? "0", 10) || undefined,
    notes,
  };
}

const cache = new Map<string, { at: number; report: SecurityReport }>();
const CACHE_MS = 5 * 60_000;

export function securityKey(chain: ChainId, address: string) {
  return `${chain}:${address}`.toLowerCase();
}

export function passesAllChecks(token: TokenRow, report: SecurityReport | undefined | null): boolean {
  if (!report || report.source !== "goplus") return false;
  const taxOk = report.taxBuy <= 3 && report.taxSell <= 3;
  const ownerOk = report.renouncedOwnership && !report.mintable && !report.freezeable;
  return (
    !report.honeypot &&
    !report.cannotSell &&
    ownerOk &&
    taxOk &&
    isLpSafe(token, report)
  );
}

export function isLpSafe(token: TokenRow, report: SecurityReport): boolean {
  if (report.lpLocked) return true;
  const ageMs = token.pairCreatedAt ? Date.now() - token.pairCreatedAt : 0;
  const aged = token.pairCreatedAt
    ? ageMs >= 7 * 86_400_000
    : token.marketCap >= 10_000_000;
  const liquid = token.liquidity >= 80_000 || token.marketCap >= 5_000_000;
  const holdersOk =
    (report.holderCount ?? 0) >= 30 ||
    report.topHoldersPercent <= 0 ||
    report.topHoldersPercent <= 45;
  return aged && liquid && holdersOk;
}

function pickResult(
  result: Record<string, GoPlusEvm & GoPlusSol> | undefined,
  address: string,
): (GoPlusEvm & GoPlusSol) | undefined {
  if (!result) return undefined;
  if (result[address]) return result[address];
  const lower = address.toLowerCase();
  if (result[lower]) return result[lower];
  for (const [key, value] of Object.entries(result)) {
    if (key.toLowerCase() === lower) return value;
  }
  return Object.values(result)[0];
}

async function fetchGoPlusReport(chain: ChainId, address: string): Promise<SecurityReport> {
  const key = securityKey(chain, address);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.report;

  const meta = CHAIN_BY_ID[chain];
  if (!meta) throw new Error("Unsupported chain");

  const url =
    chain === "solana"
      ? `https://api.gopluslabs.io/api/v1/solana/token_security?contract_addresses=${encodeURIComponent(address)}`
      : `https://api.gopluslabs.io/api/v1/token_security/${meta.goplus}?contract_addresses=${encodeURIComponent(address)}`;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { accept: "application/json" },
    });
    if (!res.ok) throw new Error(`GoPlus ${res.status}`);
    const json = (await res.json()) as { result?: Record<string, GoPlusEvm & GoPlusSol> };
    const entry = pickResult(json.result, address);
    if (!entry) throw new Error("No security result");

    const report = chain === "solana" ? mapSol(entry) : mapEvm(entry);
    cache.set(key, { at: Date.now(), report });
    return report;
  } finally {
    clearTimeout(timer);
  }
}

function scanScore(token: TokenRow): number {
  const chg = Math.max(token.priceChange1h, token.priceChange6h, token.priceChange24h, 0);
  return (
    token.volume24h * (1 + chg / 15) +
    (token.liquidity >= 80_000 ? 40_000 : 0) +
    (chg > 0 ? 25_000 : 0)
  );
}

function hasContract(token: TokenRow): boolean {
  if (!token.ca) return false;
  if (token.chain === "solana") return token.ca.length >= 32;
  return token.ca.startsWith("0x") && token.ca.length >= 40;
}

async function runPool<T>(items: T[], limit: number, fn: (item: T) => Promise<void>) {
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const item = items[i++];
      await fn(item);
    }
  });
  await Promise.all(workers);
}

export async function attachSecurity(tokens: TokenRow[]): Promise<TokenRow[]> {
  const unique: TokenRow[] = [];
  const seen = new Set<string>();
  const ranked = [...tokens]
    .filter((t) => t.source === "dex" && hasContract(t))
    .sort((a, b) => scanScore(b) - scanScore(a));
  for (const t of ranked) {
    const key = securityKey(t.chain, t.ca);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(t);
    if (unique.length >= 40) break;
  }

  const reports = new Map<string, SecurityReport>();
  const missing: TokenRow[] = [];
  for (const t of unique) {
    const key = securityKey(t.chain, t.ca);
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < CACHE_MS) reports.set(key, hit.report);
    else missing.push(t);
  }

  await runPool(missing, 5, async (t) => {
    try {
      const report = await fetchGoPlusReport(t.chain, t.ca);
      reports.set(securityKey(t.chain, t.ca), report);
    } catch {
      /* timeout / rate-limit — token stays not-secure */
    }
  });

  return tokens.map((t) => {
    const report = reports.get(securityKey(t.chain, t.ca));
    if (!report) return { ...t, secure: false };
    return { ...t, security: report, secure: passesAllChecks(t, report) };
  });
}

export const fetchTokenSecurity = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const data = input as { chain?: string; address?: string };
    if (!data?.chain || !data?.address) {
      throw new Error("chain and address required");
    }
    return { chain: data.chain as ChainId, address: data.address };
  })
  .handler(async ({ data }): Promise<SecurityReport> => {
    return fetchGoPlusReport(data.chain, data.address);
  });

export function estimatedSecurity(liquidity: number, sellShare: number): SecurityReport {
  return {
    source: "estimated",
    honeypot: false,
    cannotSell: false,
    lpLocked: liquidity > 50_000,
    lpLockedPercent: liquidity > 500_000 ? 100 : liquidity > 100_000 ? 90 : liquidity > 50_000 ? 75 : 0,
    renouncedOwnership: liquidity > 100_000,
    mintable: liquidity < 50_000,
    freezeable: false,
    taxBuy: 0,
    taxSell: 0,
    topHoldersPercent: sellShare,
    notes: ["Heuristic from liquidity and flow — not a contract scan."],
  };
}
