//#region node_modules/.nitro/vite/services/ssr/assets/chains-DJv5KIuX.js
var CHAINS = [
	{
		id: "solana",
		name: "Solana",
		short: "SOL",
		dexId: "solana",
		goplus: "solana"
	},
	{
		id: "ethereum",
		name: "Ethereum",
		short: "ETH",
		dexId: "ethereum",
		goplus: "1"
	},
	{
		id: "base",
		name: "Base",
		short: "BASE",
		dexId: "base",
		goplus: "8453"
	},
	{
		id: "bnb",
		name: "BNB Chain",
		short: "BNB",
		dexId: "bsc",
		goplus: "56"
	},
	{
		id: "arbitrum",
		name: "Arbitrum",
		short: "ARB",
		dexId: "arbitrum",
		goplus: "42161"
	},
	{
		id: "polygon",
		name: "Polygon",
		short: "POL",
		dexId: "polygon",
		goplus: "137"
	},
	{
		id: "robinhood",
		name: "Robinhood Chain",
		short: "HOOD",
		dexId: "robinhood",
		goplus: "4663"
	}
];
var CHAIN_BY_ID = Object.fromEntries(CHAINS.map((c) => [c.id, c]));
var DEX_TO_CHAIN = {
	solana: "solana",
	ethereum: "ethereum",
	base: "base",
	bsc: "bnb",
	bnb: "bnb",
	arbitrum: "arbitrum",
	polygon: "polygon",
	robinhood: "robinhood",
	hood: "robinhood"
};
function normalizeChain(id) {
	if (!id) return null;
	return DEX_TO_CHAIN[id.toLowerCase()] ?? null;
}
function dexScreenerPath(chain, address) {
	return `https://dexscreener.com/${CHAIN_BY_ID[chain].dexId}/${address}`;
}
//#endregion
export { normalizeChain as i, CHAIN_BY_ID as n, dexScreenerPath as r, CHAINS as t };
