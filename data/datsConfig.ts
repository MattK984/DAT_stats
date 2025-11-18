import { DatConfig } from '../lib/types';

export const DAT_CONFIG: DatConfig[] = [
  {
    datId: 'sbet',
    name: 'Sportsbet',
    tickerEquity: 'SBET',
    chain: 'base',
    tokenContract: '0x0000000000000000000000000000000000000000',
    sharesOutstanding: 150_000_000,
    defillamaSlug: 'sbet',
    newsQuery: 'SBET'
  },
  {
    datId: 'gldn',
    name: 'GoldenDAO',
    tickerEquity: 'GLDN',
    chain: 'ethereum',
    tokenContract: '0x0000000000000000000000000000000000000001',
    sharesOutstanding: 95_000_000,
    defillamaSlug: 'gldn',
    newsQuery: 'GLDN'
  }
  // Add remaining DATs to reach top 20 as needed.
];
