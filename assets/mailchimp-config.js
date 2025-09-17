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
  // Using Vercel environment variables for security
  apiKey: null, // Will be handled by Vercel proxy
  
  // Using Vercel environment variables for security  
  serverPrefix: null, // Will be handled by Vercel proxy
  
  // Optional: Specify a specific list ID if you want to use a particular list
  // Leave null to automatically use the first available list
  listId: null,
  
  // Number of recent campaigns to display (default: 6)
  campaignCount: 6
};