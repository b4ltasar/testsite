/**
 * Vercel Serverless Function - Mailchimp Proxy
 * This keeps your API key secure on the server side
 * 
 * Deploy this to Vercel as a serverless function
 * File: /api/mailchimp-proxy.js
 */

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Ensure fresh data - no caching
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get API key from environment variables (secure)
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX || 'us1';
    const campaignCount = parseInt(req.query.count) || 6;

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Mailchimp API key not configured' 
      });
    }

    const baseUrl = `https://${serverPrefix}.api.mailchimp.com/3.0`;
    
    // Fetch recent campaigns
    const response = await fetch(
      `${baseUrl}/campaigns?count=${campaignCount}&status=sent&sort_field=send_time&sort_dir=DESC`,
      {
        headers: {
          'Authorization': `apikey ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Mailchimp API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Return only the data we need (no sensitive info)
    const campaigns = data.campaigns.map(campaign => ({
      id: campaign.id,
      title: campaign.settings.subject_line || 'Newsletter',
      date: campaign.send_time,
      link: campaign.archive_url || '#',
      previewText: campaign.settings.preview_text || '',
      // Extract image from HTML content if available
      image: extractImageFromHtml(campaign.content?.html) || null
    }));

    res.status(200).json({ campaigns });
    
  } catch (error) {
    console.error('Mailchimp proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch newsletters',
      message: error.message 
    });
  }
}

function extractImageFromHtml(html) {
  if (!html) return null;
  
  const imgMatch = html.match(/<img[^>]+src="([^"]+)"/i);
  return imgMatch ? imgMatch[1] : null;
}