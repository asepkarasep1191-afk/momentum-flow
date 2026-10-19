import type { ChainId } from "./types";

export type ChainMeta = {
  id: ChainId;
  name: string;
  short: string;
  dexId: string;
  goplus: string;
};

export const CHAINS: ChainMeta[] = [
  { id: "solana", name: "Solana", short: "SOL", dexId: "solana", goplus: "solana" },
  { id: "ethereum", name: "Ethereum", short: "ETH", dexId: "ethereum", goplus: "1" },
  { id: "base", name: "Base", short: "BASE", dexId: "base", goplus: "8453" },
  { id: "bnb", name: "BNB Chain", short: "BNB", dexId: "bsc", goplus: "56" },
  { id: "arbitrum", name: "Arbitrum", short: "ARB", dexId: "arbitrum", goplus: "42161" },
  { id: "polygon", name: "Polygon", short: "POL", dexId: "polygon", goplus: "137" },
  { id: "robinhood", name: "Robinhood Chain", short: "HOOD", dexId: "robinhood", goplus: "4663" },
];

export const CHAIN_BY_ID: Record<ChainId, ChainMeta> = Object.fromEntries(
  CHAINS.map((c) => [c.id, c]),
) as Record<ChainId, ChainMeta>;

const DEX_TO_CHAIN: Record<string, ChainId> = {
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

export function normalizeChain(id: string | undefined): ChainId | null {
  if (!id) return null;
  return DEX_TO_CHAIN[id.toLowerCase()] ?? null;
}

export function dexScreenerPath(chain: ChainId, address: string) {
  const dex = CHAIN_BY_ID[chain].dexId;
  return `https://dexscreener.com/${dex}/${address}`;
}
