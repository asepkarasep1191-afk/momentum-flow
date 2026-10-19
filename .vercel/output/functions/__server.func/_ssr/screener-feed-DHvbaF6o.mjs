import { t as createServerFn } from "./ssr.mjs";
import { i as normalizeChain, t as CHAINS } from "./chains-DJv5KIuX.mjs";
import { n as createSsrRpc, p as volumeRatio, r as deriveSignal, t as attachSecurity } from "./security-9NnIWGF5.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/screener-feed-DHvbaF6o.js
var GECKO = "https://api.geckoterminal.com/api/v2/networks/robinhood/trending_pools";
var SKIP = /* @__PURE__ */ new Set([
	"weth",
	"eth",
	"usdg",
	"usdc",
	"usdt",
	"dai"
]);
function num$1(value) {
	if (value == null) return 0;
	const n = typeof value === "number" ? value : parseFloat(String(value));
	return Number.isFinite(n) ? n : 0;
}
function parseSymbol(name) {
	return (name.split("/")[0]?.trim() ?? name).replace(/\s+\d+(?:\.\d+)?%$/, "").trim();
}
function extractAddress(id) {
	if (!id) return null;
	const addr = id.includes("_") ? id.slice(id.indexOf("_") + 1) : id;
	if (!addr.startsWith("0x") || addr.length < 10) return null;
	if (addr === "0x0000000000000000000000000000000000000000") return null;
	return addr;
}
var mem$1 = null;
var CACHE_MS$1 = 45e3;
async function fetchRobinhoodRows() {
	if (mem$1 && Date.now() - mem$1.at < CACHE_MS$1) return mem$1.rows;
	try {
		const res = await fetch(`${GECKO}?page=1&include=base_token`, { headers: { accept: "application/json" } });
		if (!res.ok) return mem$1?.rows ?? [];
		const json = await res.json();
		const tokensById = new Map((json.included ?? []).map((t) => [t.id ?? "", t]));
		const best = /* @__PURE__ */ new Map();
		for (const pool of json.data ?? []) {
			const row = mapPool(pool, tokensById);
			if (!row) continue;
			const prev = best.get(row.id);
			if (!prev || row.liquidity > prev.liquidity) best.set(row.id, row);
		}
		const rows = [...best.values()];
		if (rows.length > 0) mem$1 = {
			at: Date.now(),
			rows
		};
		return rows;
	} catch {
		return mem$1?.rows ?? [];
	}
}
async function fetchRobinhoodAddresses() {
	return (await fetchRobinhoodRows()).map((t) => t.ca);
}
function mapPool(pool, tokensById) {
	const attr = pool.attributes;
	const tokenId = pool.relationships?.base_token?.data?.id;
	const included = tokenId ? tokensById.get(tokenId) : void 0;
	const address = extractAddress(included?.attributes?.address || tokenId);
	const price = num$1(attr?.base_token_price_usd);
	if (!address || price <= 0) return null;
	const symbol = (included?.attributes?.symbol || parseSymbol(attr?.name ?? "")).toUpperCase();
	if (!symbol || SKIP.has(symbol.toLowerCase())) return null;
	const priceChange5m = num$1(attr?.price_change_percentage?.m5);
	const priceChange1h = num$1(attr?.price_change_percentage?.h1);
	const priceChange6h = num$1(attr?.price_change_percentage?.h6);
	const priceChange24h = num$1(attr?.price_change_percentage?.h24);
	const vr = volumeRatio({
		h24: num$1(attr?.volume_usd?.h24),
		h6: num$1(attr?.volume_usd?.h6),
		h1: num$1(attr?.volume_usd?.h1)
	});
	const { signal, strength } = deriveSignal({
		priceChange5m,
		priceChange1h,
		priceChange6h,
		priceChange24h,
		volumeRatio: vr
	});
	const created = attr?.pool_created_at ? Date.parse(attr.pool_created_at) : void 0;
	return {
		id: `robinhood-${address}`,
		symbol,
		name: included?.attributes?.name || symbol,
		chain: "robinhood",
		ca: address,
		pairAddress: attr?.address,
		dexId: pool.relationships?.dex?.data?.id?.replace(/-robinhood$/, "") || "uniswap",
		imageUrl: included?.attributes?.image_url,
		price,
		priceChange5m,
		priceChange1h,
		priceChange6h,
		priceChange24h,
		volume5m: num$1(attr?.volume_usd?.m5),
		volume1h: num$1(attr?.volume_usd?.h1),
		volume24h: num$1(attr?.volume_usd?.h24),
		volumeRatio: vr,
		marketCap: num$1(attr?.market_cap_usd) || num$1(attr?.fdv_usd),
		liquidity: num$1(attr?.reserve_in_usd),
		buys24h: num$1(attr?.transactions?.h24?.buys),
		sells24h: num$1(attr?.transactions?.h24?.sells),
		pairCreatedAt: Number.isFinite(created) ? created : void 0,
		smcSignal: signal,
		signalStrength: strength,
		source: "dex",
		secure: false
	};
}
/** Liquid, actively traded names used as the baseline universe (plus live boosts). */
var UNIVERSE = [
	{
		chain: "solana",
		address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
	},
	{
		chain: "solana",
		address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"
	},
	{
		chain: "solana",
		address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN"
	},
	{
		chain: "solana",
		address: "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump"
	},
	{
		chain: "solana",
		address: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump"
	},
	{
		chain: "solana",
		address: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R"
	},
	{
		chain: "solana",
		address: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3"
	},
	{
		chain: "solana",
		address: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr"
	},
	{
		chain: "solana",
		address: "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5"
	},
	{
		chain: "solana",
		address: "ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82"
	},
	{
		chain: "solana",
		address: "B5WTLaRwaUQpKk7ir1wniNB6m5o8GgMrimhKMYan2R6B"
	},
	{
		chain: "solana",
		address: "6HU4CmRb15C2nQDx8Ld2f2W2wTdmog6aZiiXdrT5Pzi8"
	},
	{
		chain: "solana",
		address: "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL"
	},
	{
		chain: "solana",
		address: "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN"
	},
	{
		chain: "solana",
		address: "rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof"
	},
	{
		chain: "solana",
		address: "hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux"
	},
	{
		chain: "solana",
		address: "WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk"
	},
	{
		chain: "ethereum",
		address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933"
	},
	{
		chain: "ethereum",
		address: "0xaaeE1A9723aaDB7afA2810263653A34bA2C21C7a"
	},
	{
		chain: "ethereum",
		address: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32"
	},
	{
		chain: "ethereum",
		address: "0x57e114B691Db790C35207b2e685D4A43181e6061"
	},
	{
		chain: "ethereum",
		address: "0xb131f4A55907B10d1F0A50d8ab8FA09EC342cd74"
	},
	{
		chain: "ethereum",
		address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"
	},
	{
		chain: "ethereum",
		address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
	},
	{
		chain: "ethereum",
		address: "0x514910771AF9Ca656af840dff83E8264EcF986CA"
	},
	{
		chain: "ethereum",
		address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9"
	},
	{
		chain: "ethereum",
		address: "0x808507121B80c02388fAd14726482e061B8da827"
	},
	{
		chain: "ethereum",
		address: "0xfAbA6f8e4a5E8Ab82F62fe7C39859FA577269BE3"
	},
	{
		chain: "ethereum",
		address: "0xFe0c30065B384F05761f15d0CC899D4F9F9Cc0eB"
	},
	{
		chain: "base",
		address: "0x532f27101965dd16442E59d40670FaF5eBB142E4"
	},
	{
		chain: "base",
		address: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed"
	},
	{
		chain: "base",
		address: "0x940181a94A35A4569E4529A3CDfB74e38FD98631"
	},
	{
		chain: "base",
		address: "0x311935Cd80B76769bF2ecC9D8Ab7635b2139cf82"
	},
	{
		chain: "base",
		address: "0x0b3e328455c4059EEb9e3f84b554cC5C5Bd1017C"
	},
	{
		chain: "base",
		address: "0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4"
	},
	{
		chain: "bnb",
		address: "0xfb5B838b6cfEEdC2873aB27866079AC55363D37E"
	},
	{
		chain: "bnb",
		address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82"
	},
	{
		chain: "bnb",
		address: "0xc748673057861a797275CD8A068AbB95A902e8de"
	},
	{
		chain: "bnb",
		address: "0x111111111117dC0aa78b770fA6A738034120C302"
	},
	{
		chain: "arbitrum",
		address: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a"
	},
	{
		chain: "arbitrum",
		address: "0x912CE59144191C1204E64559FE8253a0e49E6548"
	},
	{
		chain: "arbitrum",
		address: "0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8"
	},
	{
		chain: "arbitrum",
		address: "0x539bdE0d7Dbd336b79148AA742883198BBF60342"
	},
	{
		chain: "polygon",
		address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
	},
	{
		chain: "polygon",
		address: "0xD6DF932A45C0f255f9417787dDFA3A0dF8Bf8dF2"
	},
	{
		chain: "robinhood",
		address: "0xa241395adcdf456f6dc04d1bc02b18e6f4c4052c"
	},
	{
		chain: "robinhood",
		address: "0xf15aab29c3d22cf2b469d4a9b0c0a72f31ba0711"
	},
	{
		chain: "robinhood",
		address: "0x56fa3670e19396c4ee8f7775b49ceaede04a84ef"
	},
	{
		chain: "robinhood",
		address: "0xdee52f2ab639b6942b0d0f0565400b93b7a0fbe5"
	},
	{
		chain: "robinhood",
		address: "0xaa07a0e9209e16ac99708c3ec70159c6ef3128a3"
	},
	{
		chain: "robinhood",
		address: "0x9e9df3ffed68dc7b4ddcf12233f38d4f235c7725"
	},
	{
		chain: "robinhood",
		address: "0x238e40b75ae78a1388a14e517d855893e92e58db"
	},
	{
		chain: "robinhood",
		address: "0xedbf91223639800bcd5756815caf908df3b890be"
	},
	{
		chain: "robinhood",
		address: "0x2e8c31162b855a2ffa90f6f8634643ad6f111e18"
	},
	{
		chain: "robinhood",
		address: "0x18e674231a58c239dc7daedcffe15ec3a24cff5c"
	},
	{
		chain: "robinhood",
		address: "0x020bfc650a365f8bb26819deaabf3e21291018b4"
	},
	{
		chain: "robinhood",
		address: "0x0339f5459fc690ac85f1782e15782a151b4a9e1b"
	},
	{
		chain: "robinhood",
		address: "0x39dbed3a2bd333467115de45665cc57f813c4571"
	},
	{
		chain: "robinhood",
		address: "0x385f4f8ae47651ce5f58f5265395a669f8281e18"
	}
];
var DEX = "https://api.dexscreener.com";
async function getJson(url, timeoutMs = 4500) {
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), timeoutMs);
	try {
		const res = await fetch(url, {
			signal: ctrl.signal,
			headers: { accept: "application/json" }
		});
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null;
	} finally {
		clearTimeout(timer);
	}
}
function num(value) {
	if (value == null) return 0;
	const n = typeof value === "number" ? value : parseFloat(String(value));
	return Number.isFinite(n) ? n : 0;
}
function pairToToken(pair) {
	const chain = normalizeChain(pair.chainId);
	const address = pair.baseToken?.address;
	const price = num(pair.priceUsd);
	if (!chain || !address || price <= 0) return null;
	const priceChange5m = num(pair.priceChange?.m5);
	const priceChange1h = num(pair.priceChange?.h1);
	const priceChange6h = num(pair.priceChange?.h6);
	const priceChange24h = num(pair.priceChange?.h24);
	const vr = volumeRatio(pair.volume);
	const { signal, strength } = deriveSignal({
		priceChange5m,
		priceChange1h,
		priceChange6h,
		priceChange24h,
		volumeRatio: vr
	});
	return {
		id: `${chain}-${address}`,
		symbol: pair.baseToken?.symbol || "???",
		name: pair.baseToken?.name || pair.baseToken?.symbol || "Unknown",
		chain,
		ca: address,
		pairAddress: pair.pairAddress,
		dexId: pair.dexId,
		imageUrl: pair.info?.imageUrl,
		price,
		priceChange5m,
		priceChange1h,
		priceChange6h,
		priceChange24h,
		volume5m: num(pair.volume?.m5),
		volume1h: num(pair.volume?.h1),
		volume24h: num(pair.volume?.h24),
		volumeRatio: vr,
		marketCap: num(pair.marketCap) || num(pair.fdv),
		liquidity: num(pair.liquidity?.usd),
		buys24h: num(pair.txns?.h24?.buys),
		sells24h: num(pair.txns?.h24?.sells),
		pairCreatedAt: pair.pairCreatedAt,
		smcSignal: signal,
		signalStrength: strength,
		source: "dex",
		secure: false
	};
}
function pickBestPairs(pairs) {
	const best = /* @__PURE__ */ new Map();
	for (const pair of pairs) {
		const key = `${pair.chainId}-${pair.baseToken?.address}`.toLowerCase();
		if (!pair.baseToken?.address) continue;
		const current = best.get(key);
		const liq = num(pair.liquidity?.usd);
		const prev = num(current?.liquidity?.usd);
		if (!current || liq > prev) best.set(key, pair);
	}
	return [...best.values()];
}
async function fetchTokenPairs(chain, addresses) {
	if (addresses.length === 0) return [];
	const dexId = CHAINS.find((c) => c.id === chain)?.dexId ?? chain;
	const chunks = [];
	for (let i = 0; i < addresses.length; i += 30) chunks.push(addresses.slice(i, i + 30));
	return (await Promise.all(chunks.map((chunk) => getJson(`${DEX}/tokens/v1/${dexId}/${chunk.join(",")}`)))).flatMap((p) => Array.isArray(p) ? p : []);
}
async function fetchBoostAddresses(active) {
	const [latest, top] = await Promise.all([getJson(`${DEX}/token-boosts/latest/v1`), getJson(`${DEX}/token-boosts/top/v1`)]);
	const grouped = Object.fromEntries(CHAINS.map((c) => [c.id, []]));
	for (const item of [...latest ?? [], ...top ?? []]) {
		const chain = normalizeChain(item.chainId);
		const addr = item.tokenAddress;
		if (!chain || !addr || !active.has(chain)) continue;
		grouped[chain].push(addr);
	}
	return grouped;
}
function mergeAddresses(universe, boosts, active) {
	const out = {};
	for (const chain of CHAINS) {
		if (!active.has(chain.id)) continue;
		const set = new Set([...universe[chain.id] ?? [], ...boosts[chain.id] ?? []].map((a) => a));
		out[chain.id] = [...set];
	}
	return out;
}
async function fetchDexScreenerTokens(active) {
	const boosts = await fetchBoostAddresses(active);
	const grouped = mergeAddresses(Object.fromEntries(UNIVERSE.filter((t) => active.has(t.chain)).map((t) => [t.chain, []])), boosts, active);
	for (const t of UNIVERSE) {
		if (!active.has(t.chain)) continue;
		grouped[t.chain] ??= [];
		if (!grouped[t.chain].includes(t.address)) grouped[t.chain].push(t.address);
	}
	if (active.has("robinhood")) {
		const extra = await fetchRobinhoodAddresses();
		grouped.robinhood ??= [];
		for (const addr of extra) if (!grouped.robinhood.some((a) => a.toLowerCase() === addr.toLowerCase())) grouped.robinhood.push(addr);
	}
	const pairLists = await Promise.all(Object.entries(grouped).map(([chain, addresses]) => fetchTokenPairs(chain, addresses)));
	const map = /* @__PURE__ */ new Map();
	for (const token of pickBestPairs(pairLists.flat()).map(pairToToken).filter((t) => t !== null)) map.set(token.id.toLowerCase(), token);
	if (active.has("robinhood")) {
		const rh = await fetchRobinhoodRows();
		for (const token of rh) {
			const key = token.id.toLowerCase();
			if (!map.has(key)) map.set(key, token);
		}
	}
	return [...map.values()];
}
async function searchDexScreener(query) {
	const q = query.trim();
	if (q.length < 2) return [];
	const data = await getJson(`${DEX}/latest/dex/search?q=${encodeURIComponent(q)}`);
	const fromDex = pickBestPairs(Array.isArray(data?.pairs) ? data.pairs : []).map(pairToToken).filter((t) => t !== null);
	if (fromDex.length > 0) return fromDex.slice(0, 40);
	const needle = q.toLowerCase();
	return (await fetchRobinhoodRows()).filter((t) => t.symbol.toLowerCase().includes(needle) || t.name.toLowerCase().includes(needle) || t.ca.toLowerCase().includes(needle)).slice(0, 40);
}
var STABLES = /* @__PURE__ */ new Set([
	"usdt",
	"usdc",
	"dai",
	"busd",
	"tusd",
	"fdusd",
	"usde",
	"usds",
	"pyusd",
	"usd1",
	"rlusd",
	"frax",
	"crvusd",
	"gho",
	"usdd",
	"dola",
	"usdg",
	"usdp",
	"lusd",
	"susd",
	"gusd",
	"husd",
	"usd0",
	"usdy",
	"ust",
	"ustc"
]);
var SYMBOL_CHAIN = {
	bonk: "solana",
	wif: "solana",
	jup: "solana",
	ray: "solana",
	pyth: "solana",
	popcat: "solana",
	mew: "solana",
	pump: "solana",
	jto: "solana",
	trump: "solana",
	pengu: "solana",
	render: "solana",
	hnt: "solana",
	wen: "solana",
	fartcoin: "solana",
	pnut: "solana",
	w: "solana",
	jito: "solana",
	msol: "solana",
	orca: "solana",
	pepe: "ethereum",
	shib: "ethereum",
	uni: "ethereum",
	link: "ethereum",
	aave: "ethereum",
	ldo: "ethereum",
	ena: "ethereum",
	pendle: "ethereum",
	ondo: "ethereum",
	mog: "ethereum",
	ethfi: "ethereum",
	ens: "ethereum",
	crv: "ethereum",
	mkr: "ethereum",
	mnt: "ethereum",
	brett: "base",
	degen: "base",
	aero: "base",
	toshi: "base",
	virtual: "base",
	cake: "bnb",
	floki: "bnb",
	babydoge: "bnb",
	gmx: "arbitrum",
	arb: "arbitrum",
	magic: "arbitrum",
	pol: "polygon",
	matic: "polygon"
};
var mem = null;
var lastGood$1 = null;
var CACHE_MS = 6e4;
function guessChain(symbol, name = "") {
	const sym = symbol.toLowerCase();
	if (SYMBOL_CHAIN[sym]) return SYMBOL_CHAIN[sym];
	const blob = `${sym} ${name}`.toLowerCase();
	if (blob.includes("solana")) return "solana";
	if (blob.includes("base ")) return "base";
	if (blob.includes("bnb") || blob.includes("binance")) return "bnb";
	if (blob.includes("arbitrum")) return "arbitrum";
	if (blob.includes("polygon")) return "polygon";
	if (blob.includes("robinhood") || blob.includes("hood")) return "robinhood";
	return "ethereum";
}
function toRow(input) {
	const symbol = input.symbol.toUpperCase();
	if (!symbol || input.price <= 0) return null;
	if (STABLES.has(symbol.toLowerCase())) return null;
	const h1 = input.h1;
	const h24 = input.h24;
	const h6 = h24 * .45 + h1 * .2;
	const m5 = h1 / 8;
	const vr = input.mcap > 0 ? Math.max(.4, Math.min(6, input.volume / (input.mcap * .08))) : 1;
	const { signal, strength } = deriveSignal({
		priceChange5m: m5,
		priceChange1h: h1,
		priceChange6h: h6,
		priceChange24h: h24,
		volumeRatio: vr
	});
	return {
		id: `market-${input.id}`,
		symbol,
		name: input.name,
		chain: guessChain(symbol, input.name),
		ca: input.id,
		imageUrl: input.image,
		price: input.price,
		priceChange5m: m5,
		priceChange1h: h1,
		priceChange6h: h6,
		priceChange24h: h24,
		volume5m: input.volume / 288,
		volume1h: input.volume / 24,
		volume24h: input.volume,
		volumeRatio: vr,
		marketCap: input.mcap,
		liquidity: Math.max(input.volume * .04, input.mcap * .01),
		buys24h: 0,
		sells24h: 0,
		smcSignal: signal,
		signalStrength: strength,
		source: "market"
	};
}
async function loadCoinlore() {
	const rows = (await Promise.all([0, 100].map(async (start) => {
		const res = await fetch(`https://api.coinlore.net/api/tickers/?start=${start}&limit=100`, { headers: { accept: "application/json" } });
		if (!res.ok) throw new Error(`Coinlore ${res.status}`);
		return await res.json();
	}))).flatMap((p) => p.data ?? []);
	if (rows.length === 0) throw new Error("Coinlore empty");
	return rows.map((row) => toRow({
		id: row.nameid || row.id,
		symbol: row.symbol,
		name: row.name,
		price: parseFloat(row.price_usd),
		h1: parseFloat(row.percent_change_1h),
		h24: parseFloat(row.percent_change_24h),
		d7: parseFloat(row.percent_change_7d),
		volume: Number(row.volume24) || 0,
		mcap: parseFloat(row.market_cap_usd) || 0
	})).filter((t) => t !== null);
}
async function loadGecko() {
	const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=80&page=1&sparkline=false&price_change_percentage=1h,24h,7d", { headers: { accept: "application/json" } });
	if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
	const data = await res.json();
	if (!Array.isArray(data)) throw new Error("CoinGecko rate limited");
	return data.map((row) => toRow({
		id: row.id,
		symbol: row.symbol,
		name: row.name,
		price: row.current_price ?? 0,
		h1: row.price_change_percentage_1h_in_currency ?? 0,
		h24: row.price_change_percentage_24h_in_currency ?? 0,
		d7: row.price_change_percentage_7d_in_currency ?? 0,
		volume: row.total_volume ?? 0,
		mcap: row.market_cap ?? 0,
		image: row.image
	})).filter((t) => t !== null);
}
async function firstLive() {
	const errors = [];
	for (const loader of [loadCoinlore, loadGecko]) try {
		const rows = await loader();
		if (rows.length > 0) return rows;
	} catch (err) {
		errors.push(err instanceof Error ? err.message : "unknown");
	}
	throw new Error(errors[0] || "Market data unavailable");
}
async function loadMarketRows() {
	if (mem && Date.now() - mem.at < CACHE_MS) return mem.payload.tokens;
	try {
		const tokens = await firstLive();
		const payload = {
			tokens,
			source: "market",
			fetchedAt: Date.now()
		};
		mem = {
			at: Date.now(),
			payload
		};
		lastGood$1 = payload;
		return tokens;
	} catch (err) {
		if (lastGood$1) return lastGood$1.tokens;
		throw err;
	}
}
createServerFn({ method: "POST" }).handler(createSsrRpc("6aba5cbc540264142ce1fcdf47cdec271296c09a37de2600a7198ea44e095aef"));
var lastGood = null;
var loadScreenerFeed_createServerFn_handler = createServerRpc({
	id: "f979675120384cba32bd930db749def153923a57eeebebe224e1de71faa6893b",
	name: "loadScreenerFeed",
	filename: "src/lib/screener-feed.ts"
}, (opts) => loadScreenerFeed.__executeServer(opts));
var loadScreenerFeed = createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	return { chains: Array.isArray(data?.chains) ? data.chains : [] };
}).handler(loadScreenerFeed_createServerFn_handler, async ({ data }) => {
	const active = new Set(data.chains);
	try {
		const dex = await fetchDexScreenerTokens(active);
		if (dex.length > 0) {
			const payload = {
				tokens: await attachSecurity(dex),
				source: "dex",
				fetchedAt: Date.now()
			};
			lastGood = payload;
			return payload;
		}
	} catch {}
	const tokens = (await loadMarketRows()).filter((t) => active.size === 0 || active.has(t.chain));
	if (tokens.length > 0) {
		const payload = {
			tokens,
			source: "market",
			fetchedAt: Date.now()
		};
		lastGood = payload;
		return payload;
	}
	if (lastGood) return lastGood;
	throw new Error("Market data unavailable");
});
var searchScreener_createServerFn_handler = createServerRpc({
	id: "e8dccd2340f972bd5daa0ecc8546d3d3e31175d8cd7d6d3ec512560ec0d7392f",
	name: "searchScreener",
	filename: "src/lib/screener-feed.ts"
}, (opts) => searchScreener.__executeServer(opts));
var searchScreener = createServerFn({ method: "POST" }).validator((input) => {
	return { query: String(input?.query ?? "") };
}).handler(searchScreener_createServerFn_handler, async ({ data }) => {
	const q = data.query.trim();
	if (q.length < 3) return [];
	try {
		const dex = await searchDexScreener(q);
		if (dex.length > 0) return attachSecurity(dex);
	} catch {}
	const market = await loadMarketRows();
	const needle = q.toLowerCase();
	return market.filter((t) => t.symbol.toLowerCase().includes(needle) || t.name.toLowerCase().includes(needle)).slice(0, 40);
});
//#endregion
export { loadScreenerFeed_createServerFn_handler, searchScreener_createServerFn_handler };
