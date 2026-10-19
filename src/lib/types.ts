export const CHAIN_IDS = [
  "solana",
  "ethereum",
  "base",
  "bnb",
  "arbitrum",
  "polygon",
  "robinhood",
] as const;

export type ChainId = (typeof CHAIN_IDS)[number];

export type TradeMode = "scalping" | "swing";

export type PresetId = "momentum" | "spike" | "heat" | "liquid" | "all" | "watch" | "active";

export type SmcSignal =
  | "Bullish OB + FVG"
  | "Bullish OB"
  | "Unfilled FVG"
  | "Distribution";

export type DataSource = "dex" | "market";

export type SecurityReport = {
  source: "goplus" | "estimated";
  honeypot: boolean;
  cannotSell: boolean;
  lpLocked: boolean;
  lpLockedPercent: number;
  renouncedOwnership: boolean;
  mintable: boolean;
  freezeable: boolean;
  taxBuy: number;
  taxSell: number;
  topHoldersPercent: number;
  holderCount?: number;
  notes: string[];
};

export type TokenRow = {
  id: string;
  symbol: string;
  name: string;
  chain: ChainId;
  ca: string;
  pairAddress?: string;
  dexId?: string;
  imageUrl?: string;
  price: number;
  priceChange5m: number;
  priceChange1h: number;
  priceChange6h: number;
  priceChange24h: number;
  volume5m: number;
  volume1h: number;
  volume24h: number;
  volumeRatio: number;
  marketCap: number;
  liquidity: number;
  buys24h: number;
  sells24h: number;
  pairCreatedAt?: number;
  signalAt?: number;
  smcSignal: SmcSignal;
  signalStrength: number;
  source: DataSource;
  secure?: boolean;
  security?: SecurityReport;
};

export type TradePlan = {
  entryLow: number;
  entryHigh: number;
  tp1: number;
  tp2: number;
  sl: number;
};

export type ScreenerPayload = {
  tokens: TokenRow[];
  source: DataSource;
  fetchedAt: number;
};

export type TakenStatus = "open" | "tp1" | "tp2" | "sl";

export type TakenSignal = {
  key: string;
  takenAt: number;
  mode: TradeMode;
  token: TokenRow;
  entry: number;
  tp1: number;
  tp2: number;
  sl: number;
};

export type PaperOutcome = "open" | "win" | "loss" | "expired";

export type PaperTrade = {
  key: string;
  tokenId: string;
  symbol: string;
  chain: ChainId;
  mode: TradeMode;
  openedAt: number;
  closedAt?: number;
  entry: number;
  tp1: number;
  tp2: number;
  sl: number;
  lastPrice: number;
  outcome: PaperOutcome;
  exit?: "tp1" | "tp2" | "sl";
};

export type WinStats = {
  wins: number;
  losses: number;
  open: number;
  n: number;
  wr: number | null;
};
