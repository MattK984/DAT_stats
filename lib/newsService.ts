const CRYPTOPANIC_BASE = 'https://cryptopanic.com/api/v1/posts';

interface NewsItem {
  title: string;
  url: string;
}

interface CryptoPanicResponse {
  results?: { title?: string; url?: string }[];
}

export async function fetchLatestNews(query: string): Promise<NewsItem | undefined> {
  try {
    const url = `${CRYPTOPANIC_BASE}?currencies=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('News fetch failed');
    const data = (await res.json()) as CryptoPanicResponse;
    const first = data.results?.[0];
    if (first?.title && first.url) {
      return { title: first.title, url: first.url };
    }
  } catch (err) {
    console.error('News fetch failed', err);
  }
  return undefined;
}
