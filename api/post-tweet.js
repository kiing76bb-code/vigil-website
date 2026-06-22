import { TwitterApi } from 'twitter-api-v2';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const secret = req.headers['x-internal-secret'];
  if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Tweet text is required' });
    }

    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });

    const tweet = await client.v2.tweet(text.substring(0, 280));
    console.log('[post-tweet] Success:', tweet.data.id);
    return res.status(200).json({ success: true, tweetId: tweet.data.id });
  } catch (error) {
    console.error('[post-tweet] Error:', error.message, error.data);
    return res.status(500).json({ error: error.message, details: error.data });
  }
}
