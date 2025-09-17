/**
 * Mailchimp Configuration
 * 
 * To set up your Mailchimp integration:
 * 1. Get your API key from Mailchimp Account > Extras > API Keys
 * 2. Find your server prefix (e.g., us1, us2, us3, etc.) in your API key
 * 3. Replace the values below with your actual credentials
 * 
 * IMPORTANT: For production, consider using environment variables or
 * a server-side proxy to keep your API key secure.
 */

window.MAILCHIMP_CONFIG = {
  // Replace with your actual Mailchimp API key
  apiKey: 'YOUR_MAILCHIMP_API_KEY_HERE',
  
  // Replace with your server prefix (found in your API key)
  // Common prefixes: us1, us2, us3, us4, us5, us6, us7, us8, us9, us10, us11, us12, us13, us14, us15, us16, us17, us18, us19, us20
  serverPrefix: 'us1',
  
  // Optional: Specify a specific list ID if you want to use a particular list
  // Leave null to automatically use the first available list
  listId: null,
  
  // Number of recent campaigns to display (default: 6)
  campaignCount: 6
};