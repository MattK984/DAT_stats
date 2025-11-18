import { DatConfig } from './types';

const DEFILLAMA_PRICE_BASE = 'https://coins.llama.fi/prices/current';
const POLYGON_STOCK_BASE = 'https://api.polygon.io/v2/last/trade';

interface PriceResponse {
  coins?: Record<string, { price: number }>;
}

export async function fetchEquityPrice(ticker: string): Promise<number | undefined> {
  const defillamaKey = `stocks:${ticker}`;
  try {
    const res = await fetch(`${DEFILLAMA_PRICE_BASE}/${defillamaKey}`);
    if (!res.ok) throw new Error('DefiLlama equity fetch failed');
    const data = (await res.json()) as PriceResponse;
    const price = data.coins?.[defillamaKey]?.price;
    if (price) return price;
  } catch (err) {
    console.warn('DefiLlama equity price failed, trying Polygon', err);
  }

  try {
    const polygonKey = process.env.POLYGON_API_KEY;
    const res = await fetch(`${POLYGON_STOCK_BASE}/${ticker}?apiKey=${polygonKey ?? ''}`);
    if (!res.ok) throw new Error('Polygon equity fetch failed');
    const data = (await res.json()) as { results?: { p?: number } };
    return data.results?.p;
  } catch (err) {
    console.error('Polygon equity price fallback failed', err);
    return undefined;
  }
}

export async function fetchTokenPrice(contract: string, chain = 'ethereum'): Promise<number | undefined> {
  const defillamaKey = `${chain}:${contract}`;
  try {
    const res = await fetch(`${DEFILLAMA_PRICE_BASE}/${defillamaKey}`);
    if (!res.ok) throw new Error('DefiLlama token price failed');
    const data = (await res.json()) as PriceResponse;
    return data.coins?.[defillamaKey]?.price;
  } catch (err) {
    console.error('Token price fetch failed', err);
    return undefined;
  }
}

export async function fetchPrices(dat: DatConfig) {
  const [sharePriceUsd, tokenPriceUsd] = await Promise.all([
    fetchEquityPrice(dat.tickerEquity),
    dat.tokenContract ? fetchTokenPrice(dat.tokenContract, dat.chain) : Promise.resolve(undefined)
  ]);
  return { sharePriceUsd, tokenPriceUsd };
}
