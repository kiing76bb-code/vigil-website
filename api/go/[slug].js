const FALLBACK = 'https://www.vigildrop.com/deals';

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.redirect(302, FALLBACK);
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('go/[slug]: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    return res.redirect(302, FALLBACK);
  }

  let affiliateUrl;
  try {
    const resp = await fetch(
      `${supabaseUrl}/rest/v1/deal_cards?product_slug=eq.${encodeURIComponent(slug)}&select=affiliate_url&limit=1`,
      {
        headers: {
          apikey:        serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          Accept:        'application/json',
        },
      }
    );

    if (!resp.ok) {
      console.error('go/[slug]: Supabase error', resp.status, await resp.text());
      return res.redirect(302, FALLBACK);
    }

    const rows = await resp.json();
    affiliateUrl = rows?.[0]?.affiliate_url;
  } catch (err) {
    console.error('go/[slug]: fetch error', err.message);
    return res.redirect(302, FALLBACK);
  }

  if (!affiliateUrl) {
    return res.redirect(302, FALLBACK);
  }

  return res.redirect(302, affiliateUrl);
}
