import { DAT_CONFIG } from '../data/datsConfig';
import { loadSnapshot, persistPreviousIfEmpty, saveSnapshot } from '../data/datsStore';
import { fetchLatestNews } from './newsService';
import { fetchPrices } from './pricingService';
import { fetchTreasuryValue } from './treasuryService';
import { DatStatusRow } from './types';

const REFRESH_COOLDOWN_MS = 60_000;

export function canRefresh(): { allowed: boolean; retryAfter?: number } {
  const snapshot = loadSnapshot();
  const elapsed = Date.now() - snapshot.lastRefreshedAt;
  if (elapsed < REFRESH_COOLDOWN_MS) {
    return { allowed: false, retryAfter: Math.ceil((REFRESH_COOLDOWN_MS - elapsed) / 1000) };
  }
  return { allowed: true };
}

async function buildDatRow(datId: string): Promise<DatStatusRow> {
  const config = DAT_CONFIG.find((d) => d.datId === datId);
  if (!config) throw new Error(`Unknown DAT id ${datId}`);

  const [{ sharePriceUsd, tokenPriceUsd }, treasuryValueUsd, news] = await Promise.all([
    fetchPrices(config),
    fetchTreasuryValue(config.defillamaSlug),
    fetchLatestNews(config.newsQuery ?? config.tickerEquity)
  ]);

  const marketCapUsd = sharePriceUsd && config.sharesOutstanding
    ? sharePriceUsd * config.sharesOutstanding
    : undefined;
  const navPerShare = treasuryValueUsd && config.sharesOutstanding
    ? treasuryValueUsd / config.sharesOutstanding
    : undefined;
  const premiumDiscount = marketCapUsd && treasuryValueUsd && treasuryValueUsd > 0
    ? marketCapUsd / treasuryValueUsd
    : undefined;

  let row: DatStatusRow = {
    datId: config.datId,
    name: config.name,
    sharePriceUsd,
    tokenPriceUsd,
    marketCapUsd,
    treasuryValueUsd,
    navPerShare,
    premiumDiscount,
    latestNewsTitle: news?.title,
    latestNewsUrl: news?.url,
    lastUpdatedAt: new Date().toISOString()
  };

  row = persistPreviousIfEmpty(row);
  return row;
}

export async function refreshAllDats(): Promise<DatStatusRow[]> {
  const rows = await Promise.all(DAT_CONFIG.map((dat) => buildDatRow(dat.datId)));
  const sorted = rows.sort((a, b) => (b.marketCapUsd ?? 0) - (a.marketCapUsd ?? 0));
  saveSnapshot(sorted);
  return sorted;
}

export function getCachedStatuses(): { lastRefreshedAt: number; statuses: DatStatusRow[] } {
  const snapshot = loadSnapshot();
  const statuses = [...snapshot.statuses].sort((a, b) => (b.marketCapUsd ?? 0) - (a.marketCapUsd ?? 0));
  return { lastRefreshedAt: snapshot.lastRefreshedAt, statuses };
}
