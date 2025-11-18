const DEFILLAMA_TREASURY_BASE = 'https://defillama.com/digital-asset-treasury';

interface TreasuryResponse {
  treasuryUsd?: number;
}

export async function fetchTreasuryValue(defillamaSlug: string): Promise<number | undefined> {
  try {
    const res = await fetch(`${DEFILLAMA_TREASURY_BASE}/${defillamaSlug}.json`);
    if (!res.ok) throw new Error('Treasury fetch failed');
    const data = (await res.json()) as TreasuryResponse;
    return data.treasuryUsd;
  } catch (err) {
    console.error('Treasury fetch failed', err);
    return undefined;
  }
}
