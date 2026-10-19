import type { ChainId } from "./types";

export type UniverseToken = { chain: ChainId; address: string };

/** Liquid, actively traded names used as the baseline universe (plus live boosts). */
export const UNIVERSE: UniverseToken[] = [
  // Solana
  { chain: "solana", address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263" },
  { chain: "solana", address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm" },
  { chain: "solana", address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN" },
  { chain: "solana", address: "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump" },
  { chain: "solana", address: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump" },
  { chain: "solana", address: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R" },
  { chain: "solana", address: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3" },
  { chain: "solana", address: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr" },
  { chain: "solana", address: "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5" },
  { chain: "solana", address: "ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82" },
  { chain: "solana", address: "B5WTLaRwaUQpKk7ir1wniNB6m5o8GgMrimhKMYan2R6B" },
  { chain: "solana", address: "6HU4CmRb15C2nQDx8Ld2f2W2wTdmog6aZiiXdrT5Pzi8" },
  { chain: "solana", address: "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL" },
  { chain: "solana", address: "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN" },
  { chain: "solana", address: "rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof" },
  { chain: "solana", address: "hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux" },
  { chain: "solana", address: "WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk" },
  // Ethereum
  { chain: "ethereum", address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933" },
  { chain: "ethereum", address: "0xaaeE1A9723aaDB7afA2810263653A34bA2C21C7a" },
  { chain: "ethereum", address: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32" },
  { chain: "ethereum", address: "0x57e114B691Db790C35207b2e685D4A43181e6061" },
  { chain: "ethereum", address: "0xb131f4A55907B10d1F0A50d8ab8FA09EC342cd74" },
  { chain: "ethereum", address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE" },
  { chain: "ethereum", address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984" },
  { chain: "ethereum", address: "0x514910771AF9Ca656af840dff83E8264EcF986CA" },
  { chain: "ethereum", address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9" },
  { chain: "ethereum", address: "0x808507121B80c02388fAd14726482e061B8da827" },
  { chain: "ethereum", address: "0xfAbA6f8e4a5E8Ab82F62fe7C39859FA577269BE3" },
  { chain: "ethereum", address: "0xFe0c30065B384F05761f15d0CC899D4F9F9Cc0eB" },
  // Base
  { chain: "base", address: "0x532f27101965dd16442E59d40670FaF5eBB142E4" },
  { chain: "base", address: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed" },
  { chain: "base", address: "0x940181a94A35A4569E4529A3CDfB74e38FD98631" },
  { chain: "base", address: "0x311935Cd80B76769bF2ecC9D8Ab7635b2139cf82" },
  { chain: "base", address: "0x0b3e328455c4059EEb9e3f84b554cC5C5Bd1017C" },
  { chain: "base", address: "0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4" },
  // BNB
  { chain: "bnb", address: "0xfb5B838b6cfEEdC2873aB27866079AC55363D37E" },
  { chain: "bnb", address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82" },
  { chain: "bnb", address: "0xc748673057861a797275CD8A068AbB95A902e8de" },
  { chain: "bnb", address: "0x111111111117dC0aa78b770fA6A738034120C302" },
  // Arbitrum
  { chain: "arbitrum", address: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a" },
  { chain: "arbitrum", address: "0x912CE59144191C1204E64559FE8253a0e49E6548" },
  { chain: "arbitrum", address: "0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8" },
  { chain: "arbitrum", address: "0x539bdE0d7Dbd336b79148AA742883198BBF60342" },
  // Polygon
  { chain: "polygon", address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270" },
  { chain: "polygon", address: "0xD6DF932A45C0f255f9417787dDFA3A0dF8Bf8dF2" },
  // Robinhood Chain (tokenized stocks + live DEX names)
  { chain: "robinhood", address: "0xa241395adcdf456f6dc04d1bc02b18e6f4c4052c" },
  { chain: "robinhood", address: "0xf15aab29c3d22cf2b469d4a9b0c0a72f31ba0711" },
  { chain: "robinhood", address: "0x56fa3670e19396c4ee8f7775b49ceaede04a84ef" },
  { chain: "robinhood", address: "0xdee52f2ab639b6942b0d0f0565400b93b7a0fbe5" },
  { chain: "robinhood", address: "0xaa07a0e9209e16ac99708c3ec70159c6ef3128a3" },
  { chain: "robinhood", address: "0x9e9df3ffed68dc7b4ddcf12233f38d4f235c7725" },
  { chain: "robinhood", address: "0x238e40b75ae78a1388a14e517d855893e92e58db" },
  { chain: "robinhood", address: "0xedbf91223639800bcd5756815caf908df3b890be" },
  { chain: "robinhood", address: "0x2e8c31162b855a2ffa90f6f8634643ad6f111e18" },
  { chain: "robinhood", address: "0x18e674231a58c239dc7daedcffe15ec3a24cff5c" },
  { chain: "robinhood", address: "0x020bfc650a365f8bb26819deaabf3e21291018b4" },
  { chain: "robinhood", address: "0x0339f5459fc690ac85f1782e15782a151b4a9e1b" },
  { chain: "robinhood", address: "0x39dbed3a2bd333467115de45665cc57f813c4571" },
  { chain: "robinhood", address: "0x385f4f8ae47651ce5f58f5265395a669f8281e18" },
];

export function groupUniverse(
  tokens: UniverseToken[],
  active: Set<ChainId>,
): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};
  for (const t of tokens) {
    if (!active.has(t.chain)) continue;
    (grouped[t.chain] ??= []).push(t.address);
  }
  return grouped;
}
