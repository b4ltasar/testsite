# Mailchimp Newsletter Feed Setup Guide

This guide will help you set up a live newsletter feed on your website using your Mailchimp API credentials.

## What's Been Added

✅ **Newsletter Feed Section** - A new section that displays your latest Mailchimp newsletters  
✅ **Live API Integration** - Fetches real-time data from your Mailchimp account  
✅ **Responsive Design** - Works on all devices with your existing theme  
✅ **Error Handling** - Graceful fallbacks and user-friendly error messages  
✅ **Loading States** - Professional loading indicators  

## Setup Instructions

### 1. Get Your Mailchimp API Key

1. Log in to your Mailchimp account
2. Go to **Account** → **Extras** → **API Keys**
3. Click **Create A Key**
4. Copy the generated API key (it looks like: `abc123def456-us1`)

### 2. Find Your Server Prefix

Your server prefix is the part after the dash in your API key:
- If your API key is `abc123def456-us1`, your server prefix is `us1`
- If your API key is `xyz789ghi012-us5`, your server prefix is `us5`

### 3. Configure Your Credentials

Edit the file `/assets/mailchimp-config.js` and replace the placeholder values:

```javascript
window.MAILCHIMP_CONFIG = {
  // Replace with your actual Mailchimp API key
  apiKey: 'your-actual-api-key-here',
  
  // Replace with your server prefix (e.g., us1, us2, us3, etc.)
  serverPrefix: 'us1',
  
  // Optional: Specify a specific list ID if you want to use a particular list
  // Leave null to automatically use the first available list
  listId: null,
  
  // Number of recent campaigns to display (default: 6)
  campaignCount: 6
};
```

### 4. Deploy Your Changes

1. Commit your changes to your GitHub repository
2. Push to your main branch
3. GitHub Pages will automatically rebuild your site

## Features

### 🎨 **Beautiful Design**
- Matches your existing website theme
- Responsive grid layout
- Hover effects and smooth animations
- Loading spinners and error states

### 📱 **Mobile Friendly**
- Responsive design that works on all screen sizes
- Touch-friendly interactions
- Optimized for mobile viewing

### 🔄 **Live Updates**
- Automatically fetches your latest newsletters
- No manual updates required
- Real-time content from your Mailchimp account

### 🛡️ **Error Handling**
- Graceful fallbacks if API calls fail
- User-friendly error messages
- Retry functionality for failed requests

## Customization Options

### Change Number of Newsletters
Edit the `campaignCount` in your config:
```javascript
campaignCount: 9  // Show 9 newsletters instead of 6
```

### Use a Specific List
If you have multiple lists and want to use a specific one:
```javascript
listId: 'your-specific-list-id-here'
```

### Styling
The newsletter feed uses CSS custom properties that match your theme:
- `--bg` - Background color
- `--text` - Text color
- `--accent` - Accent color
- `--border` - Border color
- `--card-bg` - Card background

## Troubleshooting

### "Please configure your Mailchimp API key"
- Make sure you've updated the `apiKey` in `mailchimp-config.js`
- Ensure the API key is correct and active

### "Invalid API credentials"
- Double-check your API key
- Verify your server prefix is correct
- Make sure your API key has the necessary permissions

### "No newsletters available"
- Check if you have sent any campaigns in Mailchimp
- Verify the campaigns have the status "sent"
- Try increasing the `campaignCount` in your config

### "Network error"
- Check your internet connection
- Verify Mailchimp's API is accessible
- Check browser console for detailed error messages

## Security Notes

⚠️ **Important**: Your API key will be visible in the browser's source code. For production sites, consider:

1. **Using a server-side proxy** to hide your API key
2. **Implementing rate limiting** to prevent abuse
3. **Using environment variables** for sensitive data

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your Mailchimp API key and server prefix
3. Ensure your Mailchimp account has active campaigns
4. Test with a simple API call to verify connectivity

## API Rate Limits

Mailchimp has API rate limits:
- **Free accounts**: 10 requests per minute
- **Paid accounts**: Higher limits based on plan

The feed makes minimal API calls (1-2 per page load), so you should be well within limits.

---

Your newsletter feed is now ready! Once you configure your API credentials, your latest Mailchimp newsletters will automatically appear on your website.