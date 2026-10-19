import { t as createServerFn } from "./ssr.mjs";
import { n as CHAIN_BY_ID } from "./chains-DJv5KIuX.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/security-BKnGZPnZ.js
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
var fetchTokenSecurity_createServerFn_handler = createServerRpc({
	id: "fee558e753da75f988a85657c00507f5f65327fcb4dc8e8c38f1de5523e35346",
	name: "fetchTokenSecurity",
	filename: "src/lib/security.ts"
}, (opts) => fetchTokenSecurity.__executeServer(opts));
var fetchTokenSecurity = createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	if (!data?.chain || !data?.address) throw new Error("chain and address required");
	return {
		chain: data.chain,
		address: data.address
	};
}).handler(fetchTokenSecurity_createServerFn_handler, async ({ data }) => {
	return fetchGoPlusReport(data.chain, data.address);
});
//#endregion
export { fetchTokenSecurity_createServerFn_handler };
