// One-time seed endpoint. Call once after deploy, then this is safe to leave (idempotent via URL unique constraint).
const PRODUCTS = [
  // Electronics (10)
  { name: "Apple AirPods Pro (2nd Gen) with MagSafe Case", url: "https://www.amazon.com/dp/B0BDHWDR12?tag=vigildrop-20", current_price: 189.00, category: "electronics" },
  { name: "Anker 737 Power Bank 24000mAh 140W", url: "https://www.amazon.com/dp/B09VPHVT2Z?tag=vigildrop-20", current_price: 85.99, category: "electronics" },
  { name: "Kindle Paperwhite (16 GB) 2023", url: "https://www.amazon.com/dp/B09TMF6742?tag=vigildrop-20", current_price: 99.99, category: "electronics" },
  { name: "Echo Dot (5th Gen) Smart Speaker with Alexa", url: "https://www.amazon.com/dp/B09B8V1LZ3?tag=vigildrop-20", current_price: 34.99, category: "electronics" },
  { name: "Bose QuietComfort 45 Wireless Headphones", url: "https://www.amazon.com/dp/B098FKXT8L?tag=vigildrop-20", current_price: 199.00, category: "electronics" },
  { name: "Samsung 65-Inch Class QLED 4K Q60D TV", url: "https://www.amazon.com/dp/B0CZGMGNM3?tag=vigildrop-20", current_price: 597.99, category: "electronics" },
  { name: "Ring Video Doorbell (2nd Gen)", url: "https://www.amazon.com/dp/B08N5NQ869?tag=vigildrop-20", current_price: 59.99, category: "electronics" },
  { name: "Tile Mate Bluetooth Tracker 4-Pack", url: "https://www.amazon.com/dp/B09B2XJGW6?tag=vigildrop-20", current_price: 59.99, category: "electronics" },
  { name: "Anker USB-C 6-in-1 Hub with 4K HDMI", url: "https://www.amazon.com/dp/B07ZVKTP53?tag=vigildrop-20", current_price: 35.99, category: "electronics" },
  { name: "Govee Smart LED Strip Lights 32.8ft", url: "https://www.amazon.com/dp/B07CL2RMR7?tag=vigildrop-20", current_price: 29.99, category: "electronics" },
  // Home & Kitchen (8)
  { name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker 6 Qt", url: "https://www.amazon.com/dp/B00FLYWNYQ?tag=vigildrop-20", current_price: 79.95, category: "home" },
  { name: "Ninja AF101 Air Fryer 4 Qt", url: "https://www.amazon.com/dp/B07FDJMC9Q?tag=vigildrop-20", current_price: 89.99, category: "home" },
  { name: "Keurig K-Classic Coffee Maker K-Cup Pod", url: "https://www.amazon.com/dp/B078NN3M54?tag=vigildrop-20", current_price: 74.99, category: "home" },
  { name: "iRobot Roomba 694 Robot Vacuum Wi-Fi", url: "https://www.amazon.com/dp/B08PMLF9LN?tag=vigildrop-20", current_price: 179.99, category: "home" },
  { name: "Cuisinart 12-Cup Programmable Coffeemaker", url: "https://www.amazon.com/dp/B00GF9TIJA?tag=vigildrop-20", current_price: 49.99, category: "home" },
  { name: "Waterpik Aquarius Water Flosser Professional", url: "https://www.amazon.com/dp/B008HVSOFK?tag=vigildrop-20", current_price: 54.99, category: "home" },
  { name: "COSORI 9-in-1 Electric Pressure Cooker 6 Qt", url: "https://www.amazon.com/dp/B07Y3QQLRS?tag=vigildrop-20", current_price: 69.99, category: "home" },
  { name: "Shark IZ362H Stratos Lightweight Cordless Vacuum", url: "https://www.amazon.com/dp/B09KWN9P8V?tag=vigildrop-20", current_price: 199.99, category: "home" },
  // Health & Beauty (6)
  { name: "Oral-B iO Series 9 Electric Toothbrush", url: "https://www.amazon.com/dp/B084Q59Q7T?tag=vigildrop-20", current_price: 149.99, category: "health" },
  { name: "Theragun Prime Percussive Therapy Massager", url: "https://www.amazon.com/dp/B08DHY9YMP?tag=vigildrop-20", current_price: 199.00, category: "health" },
  { name: "CeraVe Moisturizing Cream 19 oz Daily Face and Body", url: "https://www.amazon.com/dp/B00TTD9BRC?tag=vigildrop-20", current_price: 18.99, category: "health" },
  { name: "Fitbit Charge 6 Fitness Tracker with GPS", url: "https://www.amazon.com/dp/B0CDW91RFM?tag=vigildrop-20", current_price: 99.95, category: "health" },
  { name: "Philips Sonicare DiamondClean Smart Electric Toothbrush", url: "https://www.amazon.com/dp/B07VG5HKWX?tag=vigildrop-20", current_price: 119.95, category: "health" },
  { name: "Withings Body+ Smart WiFi Scale BMI Body Fat", url: "https://www.amazon.com/dp/B071XW4C5Q?tag=vigildrop-20", current_price: 79.95, category: "health" },
  // Gaming (6)
  { name: "Xbox Wireless Controller Carbon Black", url: "https://www.amazon.com/dp/B08DF248LD?tag=vigildrop-20", current_price: 49.99, category: "gaming" },
  { name: "PlayStation DualSense Wireless Controller", url: "https://www.amazon.com/dp/B08FC6C75Y?tag=vigildrop-20", current_price: 49.99, category: "gaming" },
  { name: "SteelSeries Arctis Nova 3 Gaming Headset", url: "https://www.amazon.com/dp/B0B3GD6R6G?tag=vigildrop-20", current_price: 59.99, category: "gaming" },
  { name: "Logitech G502 X PLUS Wireless Gaming Mouse", url: "https://www.amazon.com/dp/B0B3HLPQX4?tag=vigildrop-20", current_price: 99.99, category: "gaming" },
  { name: "HyperX Alloy Origins Core TKL Mechanical Gaming Keyboard", url: "https://www.amazon.com/dp/B08H7KRW4S?tag=vigildrop-20", current_price: 59.99, category: "gaming" },
  { name: "Corsair HS65 Wireless Gaming Headset Multi-Platform", url: "https://www.amazon.com/dp/B09ZS7MVXS?tag=vigildrop-20", current_price: 79.99, category: "gaming" },
];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const secret = req.headers['x-internal-secret'];
  if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let inserted = 0, skipped = 0, failed = 0;

  for (const p of PRODUCTS) {
    try {
      const checkRes = await fetch(
        `${supabaseUrl}/rest/v1/products?url=eq.${encodeURIComponent(p.url)}&select=id`,
        { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
      );
      const existing = await checkRes.json();
      if (existing.length > 0) { skipped++; continue; }

      const insertRes = await fetch(`${supabaseUrl}/rest/v1/products`, {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          name: p.name,
          url: p.url,
          current_price: p.current_price,
          target_price: parseFloat((p.current_price * 0.85).toFixed(2)),
        }),
      });

      if (insertRes.ok) {
        inserted++;
      } else {
        const err = await insertRes.text();
        console.error('[seed] Insert failed:', p.name, err);
        failed++;
      }
    } catch (err) {
      console.error('[seed] Exception:', err.message);
      failed++;
    }
  }

  console.log(`[seed-products] inserted:${inserted} skipped:${skipped} failed:${failed}`);
  return res.status(200).json({ inserted, skipped, failed, total: PRODUCTS.length });
}
