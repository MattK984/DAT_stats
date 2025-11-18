export type Chain = 'ethereum' | 'base' | 'arbitrum' | 'polygon' | 'solana' | string;

export interface DatConfig {
  datId: string;
  name: string;
  tickerEquity: string;
  tokenContract?: string;
  chain?: Chain;
  sharesOutstanding: number;
  defillamaSlug: string;
  newsQuery?: string;
}

export interface DatStatusRow {
  datId: string;
  name: string;
  sharePriceUsd?: number;
  tokenPriceUsd?: number;
  marketCapUsd?: number;
  treasuryValueUsd?: number;
  navPerShare?: number;
  premiumDiscount?: number;
  latestNewsTitle?: string;
  latestNewsUrl?: string;
  isStale?: boolean;
  lastUpdatedAt: string;
}

export interface CachedSnapshot {
  lastRefreshedAt: number;
  statuses: DatStatusRow[];
}
