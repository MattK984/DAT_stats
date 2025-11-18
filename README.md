# Digital Asset Treasury Dashboard

A lightweight Next.js dashboard that tracks the top Digital Asset Treasuries (DATs). It fetches share and token prices, treasury values, NAV, and the latest news, persisting the results locally for fast reloads.

## Features
- Refresh endpoint aggregates DefiLlama pricing/treasury data with CryptoPanic news and a Polygon equity fallback.
- Rate-limited refresh (60s) with stale display handling when data is missing.
- Modular services for pricing, treasury, and news lookups with strict TypeScript models.
- Frontend table with premium/discount badges, news links, and manual refresh.

## Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create an `.env.local` with API keys (optional for Polygon fallback):
   ```bash
   cp .env.example .env.local
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:3000` to view the dashboard. Click **Refresh** to fetch the latest metrics.

## API routes
- `POST /api/refresh-dats` — pulls fresh metrics for each DAT (rate limited to 60s) and caches them.
- `GET /api/dats-status` — returns the cached snapshot sorted by market cap.
