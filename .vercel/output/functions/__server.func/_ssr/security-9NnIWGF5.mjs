import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as CHAIN_BY_ID } from "./chains-DJv5KIuX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/security-9NnIWGF5.js
function volumeRatio(volume) {
	if (!volume) return 1;
	const h24 = volume.h24 ?? 0;
	const h6 = volume.h6 ?? 0;
	if (h24 === 0 || h6 === 0) return 1;
	const olderHourly = Math.max((h24 - h6) / 18, .01);
	const recentHourly = h6 / 6;
	if (olderHourly === 0) return 1;
	return Math.min(25, recentHourly / olderHourly);
}
function deriveSignal(input) {
	const { priceChange5m: m5, priceChange1h: h1, priceChange6h: h6, priceChange24h: h24, volumeRatio: vr } = input;
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
	const orderBlock = h1 > 0 && m5 >= -.5;
	const fairValueGap = vr > 1.5 && h6 >= 0;
	const distribution = h1 < 0 && vr > 1.6;
	let signal;
	if (orderBlock && fairValueGap) signal = "Bullish OB + FVG";
	else if (orderBlock) signal = "Bullish OB";
	else if (distribution) signal = "Distribution";
	else if (fairValueGap) signal = "Unfilled FVG";
	else signal = h6 >= 0 ? "Bullish OB" : "Unfilled FVG";
	return {
		signal,
		strength: Math.max(strength, 32)
	};
}
function tradePlan(marketCap, mode) {
	if (marketCap <= 0) return {
		entryLow: 0,
		entryHigh: 0,
		tp1: 0,
		tp2: 0,
		sl: 0
	};
	if (mode === "scalping") return {
		entryLow: marketCap * .985,
		entryHigh: marketCap * 1.015,
		tp1: marketCap * 1.025,
		tp2: marketCap * 1.05,
		sl: marketCap * .975
	};
	return {
		entryLow: marketCap * .985,
		entryHigh: marketCap * 1.015,
		tp1: marketCap * 1.15,
		tp2: marketCap * 1.35,
		sl: marketCap * .9
	};
}
function planToPrice(planValue, price, marketCap) {
	if (marketCap <= 0) return 0;
	return price * (planValue / marketCap);
}
function matchesPreset(token, preset) {
	switch (preset) {
		case "momentum": return (token.priceChange1h > 0 || token.priceChange6h > 0 || token.priceChange24h > 0) && token.volume24h > 1e4;
		case "spike": return token.volumeRatio >= 1.8 && token.volume24h > 8e3;
		case "heat": return Math.abs(token.priceChange5m) >= 1.5 || Math.abs(token.priceChange1h) >= 4;
		case "liquid": return token.liquidity >= 8e4 || token.source === "market" && token.volume24h >= 5e6;
		case "all":
		case "watch":
		case "active": return true;
		default: return true;
	}
}
function scoreForMode(token, mode) {
	if (mode === "scalping") return token.signalStrength + Math.abs(token.priceChange5m) * 2 + Math.abs(token.priceChange1h) + token.volumeRatio * 4;
	return token.signalStrength + Math.max(token.priceChange6h, 0) * 1.4 + Math.max(token.priceChange24h, 0) + token.volumeRatio * 3;
}
function smcNote(signal) {
	switch (signal) {
		case "Bullish OB + FVG": return "Impulse plus a volume pocket — continuation bias if the last up-leg holds.";
		case "Bullish OB": return "Last up-leg is still defending. Look for a reclaim of the 5m print.";
		case "Unfilled FVG": return "Displacement left a gap. Wait for a fill, then continuation.";
		case "Distribution": return "Volume is up while price fades — fade rallies or stand aside.";
		default: return "Momentum heuristic from prints and volume, not order-book SMC.";
	}
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function pct(value) {
	const n = typeof value === "number" ? value : parseFloat(String(value ?? "0"));
	if (!Number.isFinite(n)) return 0;
	return n <= 1 ? n * 100 : n;
}
function isBurnOrLockAddress(addr, tag) {
	const a = (addr ?? "").toLowerCase();
	const t = (tag ?? "").toLowerCase();
	if (!a && !t) return false;
	return a.includes("dead") || a === "0x0000000000000000000000000000000000000000" || t.includes("lock") || t.includes("burn") || t.includes("unicrypt") || t.includes("pink") || t.includes("team.finance") || t.includes("dxsale");
}
function isRenounced(owner, mintable) {
	if (owner == null || owner === "") return mintable === "0";
	const o = owner.toLowerCase();
	return o === "0x0000000000000000000000000000000000000000" || o === "0x000000000000000000000000000000000000dead" || o.includes("null");
}
function lpLockFromHolders(holders) {
	const lockedShare = holders.reduce((sum, h) => {
		return sum + (String(h.is_locked) === "1" || h.is_locked === 1 || isBurnOrLockAddress(h.address, h.tag) ? pct(h.percent) : 0);
	}, 0);
	const percent = Math.min(100, Math.round(lockedShare));
	return {
		locked: percent >= 50,
		percent
	};
}
function mapEvm(data) {
	const taxBuy = pct(data.buy_tax);
	const taxSell = pct(data.sell_tax);
	const honeypot = data.is_honeypot === "1" || data.cannot_sell_all === "1";
	const lp = lpLockFromHolders(data.lp_holders ?? []);
	const topHoldersPercent = (data.holders ?? []).slice(0, 10).reduce((s, h) => s + pct(h.percent), 0);
	const notes = [];
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
		holderCount: parseInt(data.holder_count ?? "0", 10) || void 0,
		notes
	};
}
function mapSol(data) {
	const burned = (data.dex ?? []).reduce((max, d) => {
		const raw = d.burn_percent;
		if (raw == null || !Number.isFinite(raw)) return max;
		const n = raw <= 1 ? raw * 100 : raw;
		return Math.max(max, n);
	}, 0);
	const topHoldersPercent = (data.holders ?? []).slice(0, 10).reduce((s, h) => s + pct(h.percent), 0);
	const notes = [];
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
		holderCount: parseInt(data.holder_count ?? "0", 10) || void 0,
		notes
	};
}
var cache = /* @__PURE__ */ new Map();
var CACHE_MS = 3e5;
function securityKey(chain, address) {
	return `${chain}:${address}`.toLowerCase();
}
function passesAllChecks(token, report) {
	if (!report || report.source !== "goplus") return false;
	const taxOk = report.taxBuy <= 3 && report.taxSell <= 3;
	const ownerOk = report.renouncedOwnership && !report.mintable && !report.freezeable;
	return !report.honeypot && !report.cannotSell && ownerOk && taxOk && isLpSafe(token, report);
}
function isLpSafe(token, report) {
	if (report.lpLocked) return true;
	const ageMs = token.pairCreatedAt ? Date.now() - token.pairCreatedAt : 0;
	const aged = token.pairCreatedAt ? ageMs >= 6048e5 : token.marketCap >= 1e7;
	const liquid = token.liquidity >= 8e4 || token.marketCap >= 5e6;
	const holdersOk = (report.holderCount ?? 0) >= 30 || report.topHoldersPercent <= 0 || report.topHoldersPercent <= 45;
	return aged && liquid && holdersOk;
}
function pickResult(result, address) {
	if (!result) return void 0;
	if (result[address]) return result[address];
	const lower = address.toLowerCase();
	if (result[lower]) return result[lower];
	for (const [key, value] of Object.entries(result)) if (key.toLowerCase() === lower) return value;
	return Object.values(result)[0];
}
async function fetchGoPlusReport(chain, address) {
	const key = securityKey(chain, address);
	const hit = cache.get(key);
	if (hit && Date.now() - hit.at < CACHE_MS) return hit.report;
	const meta = CHAIN_BY_ID[chain];
	if (!meta) throw new Error("Unsupported chain");
	const url = chain === "solana" ? `https://api.gopluslabs.io/api/v1/solana/token_security?contract_addresses=${encodeURIComponent(address)}` : `https://api.gopluslabs.io/api/v1/token_security/${meta.goplus}?contract_addresses=${encodeURIComponent(address)}`;
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), 8e3);
	try {
		const res = await fetch(url, {
			signal: ctrl.signal,
			headers: { accept: "application/json" }
		});
		if (!res.ok) throw new Error(`GoPlus ${res.status}`);
		const entry = pickResult((await res.json()).result, address);
		if (!entry) throw new Error("No security result");
		const report = chain === "solana" ? mapSol(entry) : mapEvm(entry);
		cache.set(key, {
			at: Date.now(),
			report
		});
		return report;
	} finally {
		clearTimeout(timer);
	}
}
function scanScore(token) {
	const chg = Math.max(token.priceChange1h, token.priceChange6h, token.priceChange24h, 0);
	return token.volume24h * (1 + chg / 15) + (token.liquidity >= 8e4 ? 4e4 : 0) + (chg > 0 ? 25e3 : 0);
}
function hasContract(token) {
	if (!token.ca) return false;
	if (token.chain === "solana") return token.ca.length >= 32;
	return token.ca.startsWith("0x") && token.ca.length >= 40;
}
async function runPool(items, limit, fn) {
	let i = 0;
	const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
		while (i < items.length) {
			const item = items[i++];
			await fn(item);
		}
	});
	await Promise.all(workers);
}
async function attachSecurity(tokens) {
	const unique = [];
	const seen = /* @__PURE__ */ new Set();
	const ranked = [...tokens].filter((t) => t.source === "dex" && hasContract(t)).sort((a, b) => scanScore(b) - scanScore(a));
	for (const t of ranked) {
		const key = securityKey(t.chain, t.ca);
		if (seen.has(key)) continue;
		seen.add(key);
		unique.push(t);
		if (unique.length >= 40) break;
	}
	const reports = /* @__PURE__ */ new Map();
	const missing = [];
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
		} catch {}
	});
	return tokens.map((t) => {
		const report = reports.get(securityKey(t.chain, t.ca));
		if (!report) return {
			...t,
			secure: false
		};
		return {
			...t,
			security: report,
			secure: passesAllChecks(t, report)
		};
	});
}
var fetchTokenSecurity = createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	if (!data?.chain || !data?.address) throw new Error("chain and address required");
	return {
		chain: data.chain,
		address: data.address
	};
}).handler(createSsrRpc("fee558e753da75f988a85657c00507f5f65327fcb4dc8e8c38f1de5523e35346"));
function estimatedSecurity(liquidity, sellShare) {
	return {
		source: "estimated",
		honeypot: false,
		cannotSell: false,
		lpLocked: liquidity > 5e4,
		lpLockedPercent: liquidity > 5e5 ? 100 : liquidity > 1e5 ? 90 : liquidity > 5e4 ? 75 : 0,
		renouncedOwnership: liquidity > 1e5,
		mintable: liquidity < 5e4,
		freezeable: false,
		taxBuy: 0,
		taxSell: 0,
		topHoldersPercent: sellShare,
		notes: ["Heuristic from liquidity and flow — not a contract scan."]
	};
}
//#endregion
export { fetchTokenSecurity as a, passesAllChecks as c, smcNote as d, tradePlan as f, estimatedSecurity as i, planToPrice as l, createSsrRpc as n, isLpSafe as o, volumeRatio as p, deriveSignal as r, matchesPreset as s, attachSecurity as t, scoreForMode as u };
