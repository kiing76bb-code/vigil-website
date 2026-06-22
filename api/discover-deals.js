export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const secret = req.headers['x-internal-secret'];
  if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { deals } = req.body;
  if (!Array.isArray(deals) || deals.length === 0) {
    return res.status(400).json({ error: 'deals array required' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (const deal of deals) {
    try {
      const { name, url, current_price, original_price, category } = deal;

      if (!name || !url || !current_price || !original_price) { failed++; continue; }

      const price = parseFloat(current_price);
      const original = parseFloat(original_price);

      if (isNaN(price) || isNaN(original) || price <= 0 || original <= 0) { failed++; continue; }

      const discount_pct = ((original - price) / original) * 100;
      if (discount_pct < 15) { skipped++; continue; }
      if (price < 15 || price > 800) { skipped++; continue; }

      let score = discount_pct;
      const cat = (category || '').toLowerCase();
      if (cat.includes('electronic') || cat.includes('tech')) score += 10;
      if (cat.includes('gaming')) score += 8;
      if (cat.includes('home') || cat.includes('kitchen')) score += 5;
      if (cat.includes('health') || cat.includes('beauty')) score += 5;
      if (score < 60) { skipped++; continue; }

      // Ensure affiliate tag on Amazon URLs
      let affiliateUrl = url;
      if (url.includes('amazon.com')) {
        const u = new URL(url);
        u.searchParams.set('tag', 'vigildrop-20');
        affiliateUrl = u.toString();
      }

      // Check for existing URL
      const checkRes = await fetch(
        `${supabaseUrl}/rest/v1/products?url=eq.${encodeURIComponent(affiliateUrl)}&select=id`,
        { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
      );
      const existing = await checkRes.json();
      if (existing.length > 0) { skipped++; continue; }

      // Insert
      const insertRes = await fetch(`${supabaseUrl}/rest/v1/products`, {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          name: name.substring(0, 255),
          url: affiliateUrl,
          current_price: price,
          target_price: parseFloat((price * 0.85).toFixed(2)),
        }),
      });

      if (insertRes.ok) {
        inserted++;
        console.log('[discover-deals] Inserted:', name.substring(0, 60));
      } else {
        const err = await insertRes.text();
        console.error('[discover-deals] Insert failed:', err);
        failed++;
      }
    } catch (err) {
      console.error('[discover-deals] Exception:', err.message);
      failed++;
    }
  }

  console.log(`[discover-deals] Done — inserted:${inserted} skipped:${skipped} failed:${failed}`);
  return res.status(200).json({ inserted, skipped, failed });
}
