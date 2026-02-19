export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GAMMA_API = 'https://gamma-api.polymarket.com';

  const { closed, tag, limit, offset, order, ascending } = req.query;

  const params = new URLSearchParams();
  if (tag) params.set('tag', tag);
  if (limit) params.set('limit', limit);
  if (offset) params.set('offset', offset);
  if (order) params.set('order', order);
  if (ascending) params.set('ascending', ascending);
  if (closed) params.set('closed', closed);

  try {
    const url = `${GAMMA_API}/events?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Polymarket API returned ${response.status}`
      });
    }

    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch from Polymarket API' });
  }
}
