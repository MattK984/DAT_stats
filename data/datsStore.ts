import fs from 'fs';
import path from 'path';
import { CachedSnapshot, DatStatusRow } from '../lib/types';

const STORE_PATH = path.join(process.cwd(), 'data', 'dats-status.json');

const bootstrapSnapshot: CachedSnapshot = {
  lastRefreshedAt: 0,
  statuses: []
};

function ensureStore() {
  if (!fs.existsSync(STORE_PATH)) {
    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
    fs.writeFileSync(STORE_PATH, JSON.stringify(bootstrapSnapshot, null, 2));
  }
}

export function loadSnapshot(): CachedSnapshot {
  ensureStore();
  const raw = fs.readFileSync(STORE_PATH, 'utf-8');
  return JSON.parse(raw) as CachedSnapshot;
}

export function saveSnapshot(statuses: DatStatusRow[]): CachedSnapshot {
  const snapshot: CachedSnapshot = {
    lastRefreshedAt: Date.now(),
    statuses
  };
  ensureStore();
  fs.writeFileSync(STORE_PATH, JSON.stringify(snapshot, null, 2));
  return snapshot;
}

export function persistPreviousIfEmpty(status: DatStatusRow): DatStatusRow {
  const snapshot = loadSnapshot();
  const previous = snapshot.statuses.find((row) => row.datId === status.datId);
  if (!status.sharePriceUsd && previous?.sharePriceUsd) {
    status.sharePriceUsd = previous.sharePriceUsd;
  }
  if (!status.tokenPriceUsd && previous?.tokenPriceUsd) {
    status.tokenPriceUsd = previous.tokenPriceUsd;
  }
  if (!status.treasuryValueUsd && previous?.treasuryValueUsd) {
    status.treasuryValueUsd = previous.treasuryValueUsd;
  }
  if (!status.marketCapUsd && previous?.marketCapUsd) {
    status.marketCapUsd = previous.marketCapUsd;
  }
  if (!status.navPerShare && previous?.navPerShare) {
    status.navPerShare = previous.navPerShare;
  }
  if (!status.premiumDiscount && previous?.premiumDiscount) {
    status.premiumDiscount = previous.premiumDiscount;
  }
  if (!status.latestNewsTitle && previous?.latestNewsTitle) {
    status.latestNewsTitle = previous.latestNewsTitle;
    status.latestNewsUrl = previous.latestNewsUrl;
  }
  if (!status.treasuryValueUsd || !status.marketCapUsd) {
    status.isStale = true;
  }
  return status;
}
