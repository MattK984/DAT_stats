'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { DatStatusRow } from '../lib/types';

interface StatusResponse {
  statuses: DatStatusRow[];
  lastRefreshedAt: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function formatCurrency(value?: number) {
  if (value === undefined) return '—';
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function formatPremium(value?: number) {
  if (value === undefined) return '—';
  const pct = (value - 1) * 100;
  const className = pct >= 0 ? 'badge badge-danger' : 'badge badge-success';
  const label = `${pct.toFixed(2)}% ${pct >= 0 ? 'premium' : 'discount'}`;
  return <span className={className}>{label}</span>;
}

function formatDate(timestamp: number) {
  if (!timestamp) return 'Never';
  return new Date(timestamp).toLocaleString();
}

export default function Dashboard() {
  const { data, mutate, isLoading } = useSWR<StatusResponse>('/api/dats-status', fetcher);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const res = await fetch('/api/refresh-dats', { method: 'POST' });
      if (!res.ok) {
        const body = await res.json();
        setError(body.message ?? 'Failed to refresh');
      }
      await mutate();
    } catch (err) {
      console.error(err);
      setError('Unexpected error while refreshing');
    } finally {
      setRefreshing(false);
    }
  }, [mutate]);

  const rows = useMemo(() => data?.statuses ?? [], [data]);

  useEffect(() => {
    const interval = setInterval(() => mutate(), 60_000);
    return () => clearInterval(interval);
  }, [mutate]);

  return (
    <main className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
        {error && <span className="text-red-600 text-sm">{error}</span>}
        <span className="text-sm text-slate-600">
          Last refresh: {formatDate(data?.lastRefreshedAt ?? 0)}
        </span>
        {isLoading && <span className="text-sm text-slate-500">Loading…</span>}
      </div>

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>DAT</th>
              <th>Share Price</th>
              <th>Token Price</th>
              <th>Market Cap</th>
              <th>Treasury Value</th>
              <th>NAV / Share</th>
              <th>Premium / Discount</th>
              <th>Latest News</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.datId} className={row.isStale ? 'bg-amber-50' : undefined}>
                <td>{idx + 1}</td>
                <td className="font-semibold">{row.name}</td>
                <td>{formatCurrency(row.sharePriceUsd)}</td>
                <td>{formatCurrency(row.tokenPriceUsd)}</td>
                <td>{formatCurrency(row.marketCapUsd)}</td>
                <td>{formatCurrency(row.treasuryValueUsd)}</td>
                <td>{formatCurrency(row.navPerShare)}</td>
                <td>{formatPremium(row.premiumDiscount)}</td>
                <td>
                  {row.latestNewsTitle ? (
                    <a href={row.latestNewsUrl} target="_blank" rel="noreferrer" className="text-blue-600">
                      {row.latestNewsTitle}
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td>{new Date(row.lastUpdatedAt).toLocaleString()}</td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={10} className="text-center text-slate-500">
                  No data yet. Click refresh to load DAT metrics.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
