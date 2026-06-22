import crypto from 'crypto';

const TWITTER_API_URL = 'https://api.twitter.com/2/tweets';

function generateNonce() {
  return crypto.randomBytes(16).toString('hex');
}

function percentEncode(str) {
  return encodeURIComponent(String(str))
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A');
}

function buildOAuthHeader(method, url, body) {
  const consumerKey    = process.env.TWITTER_API_KEY;
  const consumerSecret = process.env.TWITTER_API_SECRET;
  const accessToken    = process.env.TWITTER_ACCESS_TOKEN;
  const tokenSecret    = process.env.TWITTER_ACCESS_TOKEN_SECRET;

  const oauthParams = {
    oauth_consumer_key:     consumerKey,
    oauth_nonce:            generateNonce(),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp:        Math.floor(Date.now() / 1000).toString(),
    oauth_token:            accessToken,
    oauth_version:          '1.0',
  };

  // Collect all params: oauth params + body params (for POST with JSON body, only oauth params are signed)
  const allParams = { ...oauthParams };

  // Sort and encode into the parameter string
  const paramString = Object.keys(allParams)
    .sort()
    .map(k => `${percentEncode(k)}=${percentEncode(allParams[k])}`)
    .join('&');

  // Build signature base string
  const signatureBase = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(paramString),
  ].join('&');

  // Signing key
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`;

  // Compute HMAC-SHA1
  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(signatureBase)
    .digest('base64');

  oauthParams['oauth_signature'] = signature;

  // Build Authorization header
  const headerValue =
    'OAuth ' +
    Object.keys(oauthParams)
      .sort()
      .map(k => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`)
      .join(', ');

  return headerValue;
}

export default async function handler(req, res) {
  console.log('[post-tweet debug] secret present:', typeof process.env.INTERNAL_API_SECRET, '| first 4 chars:', (process.env.INTERNAL_API_SECRET || '').slice(0, 4));
  console.log('[post-tweet debug] received header:', (req.headers['x-internal-secret'] || 'MISSING').slice(0, 4));

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate internal secret
  const secret = req.headers['x-internal-secret'];
  if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Validate body
  const { text } = req.body || {};
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "text" field' });
  }
  if (text.length > 280) {
    return res.status(400).json({ error: 'Tweet text exceeds 280 characters' });
  }

  // Build OAuth 1.0a Authorization header
  const authHeader = buildOAuthHeader('POST', TWITTER_API_URL, { text });

  // Post to Twitter
  let twitterRes;
  try {
    twitterRes = await fetch(TWITTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization':  authHeader,
        'Content-Type':   'application/json',
        'Accept':         'application/json',
      },
      body: JSON.stringify({ text }),
    });
  } catch (err) {
    return res.status(502).json({ error: 'Failed to reach Twitter API', detail: err.message });
  }

  const twitterBody = await twitterRes.json().catch(() => ({}));

  return res.status(twitterRes.status).json(twitterBody);
}
