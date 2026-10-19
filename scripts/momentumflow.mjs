#!/usr/bin/env node
/**
 * MomentumFlow — full tape script.
 *
 * Same rules as the app: live DEX pairs, Pass-all-checks, then a structure
 * read (bias, setup, entry, stop, TP). Not order-book SMC. Not financial advice.
 *
 *   node scripts/momentumflow.mjs --all-pairs
 *   node scripts/momentumflow.mjs --mode swing
 *   node scripts/momentumflow.mjs --preset all
 *   node scripts/momentumflow.mjs --json
 */
import { readFileSync } from "node:fs";

const DEX = "https://api.dexscreener.com";
const args = new Set(process.argv.slice(2));
const mode = process.argv.includes("--mode")
  ? process.argv[process.argv.indexOf("--mode") + 1]
  : "scalping";
const preset = process.argv.includes("--preset")
  ? process.argv[process.argv.indexOf("--preset") + 1]
  : "momentum";
const asJson = args.has("--json");
const skipSecurity = args.has("--raw");
const allPairs = args.has("--all-pairs");

const CHAINS = [
  { id: "solana", name: "Solana", short: "SOL", dexId: "solana", goplus: "solana" },
  { id: "ethereum", name: "Ethereum", short: "ETH", dexId: "ethereum", goplus: "1" },
  { id: "base", name: "Base", short: "BASE", dexId: "base", goplus: "8453" },
  { id: "bnb", name: "BNB Chain", short: "BNB", dexId: "bsc", goplus: "56" },
  { id: "arbitrum", name: "Arbitrum", short: "ARB", dexId: "arbitrum", goplus: "42161" },
  { id: "polygon", name: "Polygon", short: "POL", dexId: "polygon", goplus: "137" },
  { id: "robinhood", name: "Robinhood Chain", short: "HOOD", dexId: "robinhood", goplus: "4663" },
];
const CHAIN_BY_ID = Object.fromEntries(CHAINS.map((c) => [c.id, c]));
const DEX_TO_CHAIN = {
  solana: "solana",
  ethereum: "ethereum",
  base: "base",
  bsc: "bnb",
  bnb: "bnb",
  arbitrum: "arbitrum",
  polygon: "polygon",
  robinhood: "robinhood",
  hood: "robinhood",
};

function normalizeChain(id) {
  if (!id) return null;
  return DEX_TO_CHAIN[String(id).toLowerCase()] ?? null;
}

function num(value) {
  if (value == null) return 0;
  const n = typeof value === "number" ? value : parseFloat(String(value));
  return Number.isFinite(n) ? n : 0;
}

function loadUniverse() {
  const src = readFileSync(new URL("../src/lib/universe.ts", import.meta.url), "utf8");
  return [...src.matchAll(/chain:\s*"(\w+)",\s*address:\s*"([^"]+)"/g)].map((m) => ({
    chain: m[1],
    address: m[2],
  }));
}

async function getJson(url, timeoutMs = 8000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { accept: "application/json" } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function volumeRatio(volume) {
  if (!volume) return 1;
  const h24 = volume.h24 ?? 0;
  const h6 = volume.h6 ?? 0;
  if (h24 === 0 || h6 === 0) return 1;
  const older = Math.max((h24 - h6) / 18, 0.01);
  const recent = h6 / 6;
  return Math.min(25, recent / older);
}

function deriveSignal(input) {
  const { m5, h1, h6, h24, vr } = input;
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
  strength = Math.max(32, Math.min(99, Math.round(strength)));
  const orderBlock = h1 > 0 && m5 >= -0.5;
  const fairValueGap = vr > 1.5 && h6 >= 0;
  const distribution = h1 < 0 && vr > 1.6;
  let signal = "Unfilled FVG";
  if (orderBlock && fairValueGap) signal = "Bullish OB + FVG";
  else if (orderBlock) signal = "Bullish OB";
  else if (distribution) signal = "Distribution";
  else if (fairValueGap) signal = "Unfilled FVG";
  else signal = h6 >= 0 ? "Bullish OB" : "Unfilled FVG";
  return { signal, strength };
}

function pairToToken(pair) {
  const chain = normalizeChain(pair.chainId);
  const address = pair.baseToken?.address;
  const price = num(pair.priceUsd);
  if (!chain || !address || price <= 0) return null;
  const m5 = num(pair.priceChange?.m5);
  const h1 = num(pair.priceChange?.h1);
  const h6 = num(pair.priceChange?.h6);
  const h24 = num(pair.priceChange?.h24);
  const vr = volumeRatio(pair.volume);
  const { signal, strength } = deriveSignal({ m5, h1, h6, h24, vr });
  return {
    chain,
    ca: address,
    symbol: pair.baseToken?.symbol || "???",
    name: pair.baseToken?.name || pair.baseToken?.symbol || "Unknown",
    price,
    marketCap: num(pair.marketCap) || num(pair.fdv),
    liquidity: num(pair.liquidity?.usd),
    volume24h: num(pair.volume?.h24),
    priceChange5m: m5,
    priceChange1h: h1,
    priceChange6h: h6,
    priceChange24h: h24,
    volumeRatio: vr,
    pairCreatedAt: pair.pairCreatedAt,
    buys24h: num(pair.txns?.h24?.buys),
    sells24h: num(pair.txns?.h24?.sells),
    smcSignal: signal,
    signalStrength: strength,
    source: "dex",
  };
}

async function fetchPairs(chain, addresses) {
  const dexId = CHAIN_BY_ID[chain]?.dexId ?? chain;
  const out = [];
  for (let i = 0; i < addresses.length; i += 30) {
    const chunk = addresses.slice(i, i + 30);
    const page = await getJson(`${DEX}/tokens/v1/${dexId}/${chunk.join(",")}`);
    if (Array.isArray(page)) out.push(...page);
  }
  return out;
}

async function fetchRobinhood() {
  const json = await getJson(
    "https://api.geckoterminal.com/api/v2/networks/robinhood/trending_pools?page=1&include=base_token",
  );
  const included = new Map((json?.included ?? []).map((t) => [t.id ?? "", t]));
  const best = new Map();
  for (const pool of json?.data ?? []) {
    const attr = pool.attributes ?? {};
    const tokenId = pool.relationships?.base_token?.data?.id;
    const meta = tokenId ? included.get(tokenId) : undefined;
    const raw = meta?.attributes?.address || tokenId || "";
    const address = raw.includes("_") ? raw.slice(raw.indexOf("_") + 1) : raw;
    const price = num(attr.base_token_price_usd);
    if (!address.startsWith("0x") || price <= 0) continue;
    const symbol = (meta?.attributes?.symbol || attr.name || "").split("/")[0].trim().toUpperCase();
    if (!symbol || ["WETH", "ETH", "USDG", "USDC", "USDT"].includes(symbol)) continue;
    const m5 = num(attr.price_change_percentage?.m5);
    const h1 = num(attr.price_change_percentage?.h1);
    const h6 = num(attr.price_change_percentage?.h6);
    const h24 = num(attr.price_change_percentage?.h24);
    const vr = volumeRatio({
      h24: num(attr.volume_usd?.h24),
      h6: num(attr.volume_usd?.h6),
      h1: num(attr.volume_usd?.h1),
    });
    const { signal, strength } = deriveSignal({ m5, h1, h6, h24, vr });
    const row = {
      chain: "robinhood",
      ca: address,
      symbol,
      name: meta?.attributes?.name || symbol,
      price,
      marketCap: num(attr.market_cap_usd) || num(attr.fdv_usd),
      liquidity: num(attr.reserve_in_usd),
      volume24h: num(attr.volume_usd?.h24),
      priceChange5m: m5,
      priceChange1h: h1,
      priceChange6h: h6,
      priceChange24h: h24,
      volumeRatio: vr,
      pairCreatedAt: attr.pool_created_at ? Date.parse(attr.pool_created_at) : undefined,
      buys24h: num(attr.transactions?.h24?.buys),
      sells24h: num(attr.transactions?.h24?.sells),
      smcSignal: signal,
      signalStrength: strength,
      source: "dex",
    };
    const prev = best.get(address.toLowerCase());
    if (!prev || row.liquidity > prev.liquidity) best.set(address.toLowerCase(), row);
  }
  return [...best.values()];
}

async function fetchGeckoWide() {
  const networks = [
    ["solana", "solana"],
    ["ethereum", "eth"],
    ["base", "base"],
    ["bnb", "bsc"],
    ["arbitrum", "arbitrum"],
    ["polygon", "polygon_pos"],
    ["robinhood", "robinhood"],
  ];
  const pages = await Promise.all(
    networks.flatMap(([chain, net]) =>
      ["trending_pools", "new_pools"].map(async (kind) => {
        const json = await getJson(
          `https://api.geckoterminal.com/api/v2/networks/${net}/${kind}?page=1&include=base_token`,
          6000,
        );
        return poolsToRows(chain, json);
      }),
    ),
  );
  return pages.flat();
}

function poolsToRows(chain, json) {
  const included = new Map((json?.included ?? []).map((t) => [t.id ?? "", t]));
  const best = new Map();
  for (const pool of json?.data ?? []) {
    const attr = pool.attributes ?? {};
    const tokenId = pool.relationships?.base_token?.data?.id;
    const meta = tokenId ? included.get(tokenId) : undefined;
    const raw = meta?.attributes?.address || tokenId || "";
    const address = raw.includes("_") ? raw.slice(raw.indexOf("_") + 1) : raw;
    const price = num(attr.base_token_price_usd);
    if (!address || address.length < 8 || price <= 0) continue;
    const symbol = (meta?.attributes?.symbol || attr.name || "").split("/")[0].trim().toUpperCase();
    if (!symbol || ["WETH", "ETH", "WSOL", "SOL", "WBNB", "BNB", "USDG", "USDC", "USDT", "DAI"].includes(symbol)) continue;
    const m5 = num(attr.price_change_percentage?.m5);
    const h1 = num(attr.price_change_percentage?.h1);
    const h6 = num(attr.price_change_percentage?.h6);
    const h24 = num(attr.price_change_percentage?.h24);
    const vr = volumeRatio({
      h24: num(attr.volume_usd?.h24),
      h6: num(attr.volume_usd?.h6),
      h1: num(attr.volume_usd?.h1),
    });
    const { signal, strength } = deriveSignal({ m5, h1, h6, h24, vr });
    const row = {
      chain,
      ca: address,
      symbol,
      name: meta?.attributes?.name || symbol,
      price,
      marketCap: num(attr.market_cap_usd) || num(attr.fdv_usd),
      liquidity: num(attr.reserve_in_usd),
      volume24h: num(attr.volume_usd?.h24),
      priceChange5m: m5,
      priceChange1h: h1,
      priceChange6h: h6,
      priceChange24h: h24,
      volumeRatio: vr,
      pairCreatedAt: attr.pool_created_at ? Date.parse(attr.pool_created_at) : undefined,
      buys24h: num(attr.transactions?.h24?.buys),
      sells24h: num(attr.transactions?.h24?.sells),
      smcSignal: signal,
      signalStrength: strength,
      source: "dex",
    };
    const key = `${chain}:${address}`.toLowerCase();
    const prev = best.get(key);
    if (!prev || row.liquidity > prev.liquidity) best.set(key, row);
  }
  return [...best.values()];
}

async function loadTape() {
  const universe = loadUniverse();
  const [latest, top, profiles, robinhood, wide] = await Promise.all([
    getJson(`${DEX}/token-boosts/latest/v1`),
    getJson(`${DEX}/token-boosts/top/v1`),
    getJson(`${DEX}/token-profiles/latest/v1`),
    fetchRobinhood(),
    fetchGeckoWide(),
  ]);
  const grouped = Object.fromEntries(CHAINS.map((c) => [c.id, []]));
  for (const item of [...(latest ?? []), ...(top ?? []), ...(profiles ?? [])]) {
    const chain = normalizeChain(item.chainId);
    if (!chain || !item.tokenAddress) continue;
    grouped[chain].push(item.tokenAddress);
  }
  for (const token of universe) {
    if (!grouped[token.chain].some((a) => a.toLowerCase() === token.address.toLowerCase())) {
      grouped[token.chain].push(token.address);
    }
  }
  for (const row of robinhood) {
    if (!grouped.robinhood.some((a) => a.toLowerCase() === row.ca.toLowerCase())) {
      grouped.robinhood.push(row.ca);
    }
  }
  const lists = await Promise.all(CHAINS.map((c) => fetchPairs(c.id, grouped[c.id])));
  const map = new Map();
  for (const pair of lists.flat()) {
    const token = pairToToken(pair);
    if (!token) continue;
    const key = `${token.chain}:${token.ca}`.toLowerCase();
    const prev = map.get(key);
    if (!prev || token.liquidity > prev.liquidity) map.set(key, token);
  }
  for (const row of [...robinhood, ...wide]) {
    const key = `${row.chain}:${row.ca}`.toLowerCase();
    if (!map.has(key)) map.set(key, row);
  }
  return [...map.values()];
}

function pct(value) {
  const n = num(value);
  return n <= 1 ? n * 100 : n;
}

function isLpSafe(token, report) {
  if (report.lpLocked) return true;
  const ageMs = token.pairCreatedAt ? Date.now() - token.pairCreatedAt : 0;
  const aged = token.pairCreatedAt ? ageMs >= 7 * 86400_000 : token.marketCap >= 10_000_000;
  const liquid = token.liquidity >= 80_000 || token.marketCap >= 5_000_000;
  const holdersOk =
    (report.holderCount ?? 0) >= 30 ||
    report.topHoldersPercent <= 0 ||
    report.topHoldersPercent <= 45;
  return aged && liquid && holdersOk;
}

function mapSecurity(chain, entry) {
  if (chain === "solana") {
    const holders = entry.holders ?? [];
    const top = holders.slice(0, 10).reduce((s, h) => s + pct(h.percent), 0);
    const burned = (entry.dex ?? []).some((d) => num(d.burn_percent) >= 50);
    return {
      source: "goplus",
      honeypot: entry.non_transferable === "1",
      cannotSell: entry.non_transferable === "1",
      lpLocked: burned,
      renouncedOwnership: entry.mintable?.status !== "1",
      mintable: entry.mintable?.status === "1",
      freezeable: entry.freezable?.status === "1",
      taxBuy: 0,
      taxSell: 0,
      topHoldersPercent: top,
      holderCount: num(entry.holder_count),
    };
  }
  const owner = String(entry.owner_address ?? "").toLowerCase();
  const renounced =
    !owner ||
    owner === "0x0000000000000000000000000000000000000000" ||
    owner.endsWith("dead") ||
    owner.includes("null");
  const lp = entry.lp_holders ?? [];
  const lockedShare = lp.reduce((sum, h) => {
    const tag = `${h.address ?? ""} ${h.tag ?? ""}`.toLowerCase();
    const locked =
      String(h.is_locked) === "1" ||
      tag.includes("lock") ||
      tag.includes("burn") ||
      tag.includes("dead") ||
      tag.includes("unicrypt") ||
      tag.includes("pink");
    return sum + (locked ? pct(h.percent) : 0);
  }, 0);
  const top = (entry.holders ?? []).slice(0, 10).reduce((s, h) => s + pct(h.percent), 0);
  return {
    source: "goplus",
    honeypot: entry.is_honeypot === "1" || entry.cannot_buy === "1",
    cannotSell: entry.cannot_sell_all === "1",
    lpLocked: lockedShare >= 50,
    renouncedOwnership: renounced && entry.is_mintable !== "1",
    mintable: entry.is_mintable === "1",
    freezeable: false,
    taxBuy: pct(entry.buy_tax),
    taxSell: pct(entry.sell_tax),
    topHoldersPercent: top,
    holderCount: num(entry.holder_count),
  };
}

async function fetchSecurity(token) {
  const meta = CHAIN_BY_ID[token.chain];
  const url =
    token.chain === "solana"
      ? `https://api.gopluslabs.io/api/v1/solana/token_security?contract_addresses=${encodeURIComponent(token.ca)}`
      : `https://api.gopluslabs.io/api/v1/token_security/${meta.goplus}?contract_addresses=${encodeURIComponent(token.ca)}`;
  const json = await getJson(url, 8000);
  const result = json?.result ?? {};
  const entry =
    result[token.ca] ||
    result[token.ca.toLowerCase()] ||
    Object.entries(result).find(([k]) => k.toLowerCase() === token.ca.toLowerCase())?.[1] ||
    Object.values(result)[0];
  if (!entry) return null;
  return mapSecurity(token.chain, entry);
}

async function attachSecurity(tokens) {
  const ranked = [...tokens].sort(
    (a, b) => b.volume24h * (1 + Math.max(b.priceChange1h, 0) / 15) - a.volume24h * (1 + Math.max(a.priceChange1h, 0) / 15),
  );
  const targets = ranked.slice(0, 24);
  const reports = new Map();
  let cursor = 0;
  async function worker() {
    while (cursor < targets.length) {
      const token = targets[cursor++];
      try {
        const report = await fetchSecurity(token);
        if (report) reports.set(`${token.chain}:${token.ca}`.toLowerCase(), report);
      } catch {
        /* leave unscanned */
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(4, targets.length) }, worker));
  return tokens.map((token) => {
    const report = reports.get(`${token.chain}:${token.ca}`.toLowerCase());
    if (!report) return { ...token, secure: false, security: null };
    const taxOk = report.taxBuy <= 3 && report.taxSell <= 3;
    const ownerOk = report.renouncedOwnership && !report.mintable && !report.freezeable;
    const secure =
      !report.honeypot &&
      !report.cannotSell &&
      ownerOk &&
      taxOk &&
      isLpSafe(token, report);
    return { ...token, security: report, secure };
  });
}

function matchesPreset(token) {
  if (preset === "all") return true;
  if (preset === "spike") return token.volumeRatio >= 1.8 && token.volume24h > 8000;
  if (preset === "heat") return Math.abs(token.priceChange5m) >= 1.5 || Math.abs(token.priceChange1h) >= 4;
  if (preset === "liquid") return token.liquidity >= 80_000;
  return (
    (token.priceChange1h > 0 || token.priceChange6h > 0 || token.priceChange24h > 0) &&
    token.volume24h > 10_000
  );
}

function structureRead(token) {
  const p = token.price;
  const m5 = token.priceChange5m;
  const h1 = token.priceChange1h;
  const h6 = token.priceChange6h;
  const h24 = token.priceChange24h;
  const vr = token.volumeRatio;
  const thin = token.liquidity > 0 && token.marketCap > 0 && token.liquidity < token.marketCap * 0.008;
  const young = token.pairCreatedAt ? Date.now() - token.pairCreatedAt < 48 * 3600_000 : false;
  const extra = [thin ? "Liquidity is thin versus market cap." : "", young ? "Pair is under 48h old." : ""]
    .filter(Boolean)
    .join(" ");
  const skip = (label, why, bias = "Skip") => ({
    bias,
    label,
    why: extra ? `${why} ${extra}` : why,
    entryLow: null,
    entryHigh: null,
    sl: null,
    tp1: null,
    tp2: null,
    actionable: false,
  });
  if (!(p > 0)) return skip("No price", "No live print.", "Stand aside");
  if (h24 >= 100 && h6 < 0) {
    return skip("Post-blowoff", `24h is +${h24.toFixed(0)}% and 6h is ${h6.toFixed(1)}%. The gap being filled is the dump.`);
  }
  if (h1 < 0 && vr >= 1.6) {
    return skip("Distribution", `Volume is ${vr.toFixed(1)}x while 1h is ${h1.toFixed(1)}%. Do not buy the fade.`, "Stand aside");
  }
  if (h6 <= -8 && h24 < 0 && h1 < 4) {
    return skip("Downtrend bounce", `6h ${h6.toFixed(1)}% and 24h ${h24.toFixed(1)}%. The 1h print is a bounce, not an order block.`);
  }
  if (h1 <= -4 && m5 >= -0.5) {
    return skip("Broken 1h", `5m ${m5.toFixed(1)}% sits inside a 1h drop of ${h1.toFixed(1)}%. Wait for the 1h print to turn up.`);
  }
  if (h1 > 3 && (m5 < 0 || vr < 0.9)) {
    const leg = p / (1 + h1 / 100);
    const entryLow = Math.max(leg * 1.01, p * 0.96);
    const entryHigh = Math.min(p * 0.995, Math.max(entryLow, p * 0.985));
    return {
      bias: "Pullback long",
      label: vr < 0.9 ? "Impulse cooling" : "1h impulse",
      why: `1h is still +${h1.toFixed(1)}%, but ${m5 < 0 ? `5m rolled ${m5.toFixed(1)}%` : "price is extended"}${vr < 0.9 ? ` and volume is ${vr.toFixed(1)}x` : ""}. Buy the dip, not this print.${extra ? ` ${extra}` : ""}`,
      entryLow,
      entryHigh,
      sl: leg * 0.995,
      tp1: p * (mode === "swing" ? 1.15 : 1.08),
      tp2: p * (mode === "swing" ? 1.35 : 1.18),
      actionable: true,
    };
  }
  if (h1 > 0 && m5 >= -0.5 && h6 >= -1) {
    return {
      bias: "Pullback long",
      label: vr >= 1.5 ? "OB + volume pocket" : "Defended up-leg",
      why: `5m ${m5.toFixed(1)}%, 1h +${h1.toFixed(1)}%, 6h ${h6.toFixed(1)}%. Up-leg still intact.${extra ? ` ${extra}` : ""}`,
      entryLow: p * 0.985,
      entryHigh: p * 1.005,
      sl: p * (mode === "swing" ? 0.9 : 0.97),
      tp1: p * (mode === "swing" ? 1.15 : 1.03),
      tp2: p * (mode === "swing" ? 1.35 : 1.06),
      actionable: true,
    };
  }
  return skip("No clean structure", "5m, 1h, and 6h do not agree.", "Stand aside");
}

function money(n) {
  if (!(n > 0)) return "—";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

function px(n) {
  if (!(n > 0)) return "—";
  if (n >= 1) return `$${n.toFixed(4)}`;
  if (n >= 0.01) return `$${n.toFixed(5)}`;
  return `$${n.toPrecision(4)}`;
}

function pctText(n) {
  if (n >= 1000) return ">+999%";
  if (n <= -1000) return "<-999%";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

function printToken(token, index) {
  const read = structureRead(token);
  const chain = CHAIN_BY_ID[token.chain]?.short ?? token.chain;
  const sec = token.security;
  console.log(`\n${index}. ${token.symbol} · ${chain} · ${token.name}`);
  console.log(`   Price ${px(token.price)}   MC ${money(token.marketCap)}   Liq ${money(token.liquidity)}   Vol ${money(token.volume24h)} (${token.volumeRatio.toFixed(1)}x)`);
  console.log(
    `   5m ${pctText(token.priceChange5m)}   1h ${pctText(token.priceChange1h)}   6h ${pctText(token.priceChange6h)}   24h ${pctText(token.priceChange24h)}`,
  );
  console.log(`   SMC ${token.smcSignal} ${token.signalStrength}/100`);
  console.log(`   Bias     ${read.bias}`);
  console.log(`   Setup    ${read.label}`);
  console.log(`   Why      ${read.why}`);
  if (read.actionable) {
    console.log(`   Entry    ${px(read.entryLow)} – ${px(read.entryHigh)}`);
    console.log(`   Stop     ${px(read.sl)}`);
    console.log(`   TP1      ${px(read.tp1)}`);
    console.log(`   TP2      ${px(read.tp2)}`);
  } else {
    console.log("   Entry    —");
    console.log("   Stop     —");
    console.log("   TP       —   no trade until the structure changes");
  }
  if (sec) {
    console.log(
      `   Security honeypot=${sec.honeypot} lpLocked=${sec.lpLocked} mint=${sec.mintable} tax=${sec.taxBuy.toFixed(1)}/${sec.taxSell.toFixed(1)} ${token.secure ? "PASS" : "FAIL"}`,
    );
  } else {
    console.log("   Security not scanned");
  }
  console.log(`   CA       ${token.ca}`);
}

async function main() {
  const started = Date.now();
  const tape = await loadTape();
  const filtered = allPairs ? tape : tape.filter(matchesPreset);
  const scanned = skipSecurity
    ? filtered.map((t) => ({ ...t, secure: true, security: null }))
    : await attachSecurity(filtered);
  const rows = (allPairs || skipSecurity ? scanned : scanned.filter((t) => t.secure)).sort(
    (a, b) => Number(structureRead(b).actionable) - Number(structureRead(a).actionable) || b.volume24h - a.volume24h,
  );
  const report = rows.map((token) => ({ ...token, read: structureRead(token) }));

  if (asJson) {
    console.log(JSON.stringify({ mode, preset, fetchedAt: Date.now(), count: report.length, tokens: report }, null, 2));
    return;
  }

  const actionable = report.filter((t) => t.read.actionable).length;
  console.log("MomentumFlow");
  console.log(`Mode ${mode} · ${allPairs ? "all pairs" : `Preset ${preset}`} · ${skipSecurity ? "raw" : allPairs ? "security tagged" : "pass all checks"}`);
  console.log(`Scanned ${filtered.length} matches · ${rows.length} listed · ${actionable} with an entry · ${(Date.now() - started) / 1000}s`);
  console.log("Labels are print heuristics, not order-book SMC. Not financial advice.");
  if (rows.length === 0) {
    console.log("\nNo tokens passed. Re-run with --raw or --preset all.");
    return;
  }
  report.forEach((token, i) => printToken(token, i + 1));
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
