# 🔧 Mailchimp Integration Troubleshooting Guide

## 🚨 Common Issues & Solutions

### Issue 1: "Failed to fetch" Error
**Symptoms:** Console shows network error, newsletter section shows error message

**Possible Causes:**
- Vercel function not deployed
- Wrong proxy URL
- CORS issues
- Network connectivity

**Solutions:**
1. **Check Vercel deployment:**
   ```bash
   # Visit your Vercel dashboard
   https://vercel.com/dashboard
   
   # Check if your project is deployed
   # Look for the API function: /api/mailchimp-proxy
   ```

2. **Test proxy URL directly:**
   ```
   https://your-site.vercel.app/api/mailchimp-proxy
   ```
   Should return JSON data, not an error page.

3. **Check environment variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Ensure `MAILCHIMP_API_KEY` is set
   - Ensure `MAILCHIMP_SERVER_PREFIX` is set

### Issue 2: "Mailchimp API key not configured" Error
**Symptoms:** Error message about API key configuration

**Solutions:**
1. **Set environment variables in Vercel:**
   ```
   MAILCHIMP_API_KEY=your-actual-api-key-here
   MAILCHIMP_SERVER_PREFIX=us1
   ```

2. **Redeploy after setting variables:**
   - Go to Vercel Dashboard → Deployments
   - Click "Redeploy" on latest deployment

### Issue 3: "401 Unauthorized" Error
**Symptoms:** API returns 401 status code

**Solutions:**
1. **Check API key format:**
   - Should look like: `abc123def456-us1`
   - No extra spaces or characters

2. **Verify server prefix:**
   - Extract from your API key (part after the dash)
   - Common prefixes: us1, us2, us3, us4, us5

3. **Check API key permissions:**
   - Go to Mailchimp → Account → Extras → API Keys
   - Ensure key is active and has proper permissions

### Issue 4: "No newsletters available"
**Symptoms:** Empty newsletter section, no error messages

**Solutions:**
1. **Check if you have sent campaigns:**
   - Go to Mailchimp → Campaigns
   - Look for campaigns with status "Sent"
   - Only sent campaigns appear in the API

2. **Test with direct API call:**
   ```javascript
   // Test in browser console
   fetch('https://us1.api.mailchimp.com/3.0/campaigns?count=5&status=sent', {
     headers: {
       'Authorization': 'apikey YOUR_API_KEY',
       'Content-Type': 'application/json'
     }
   }).then(r => r.json()).then(console.log);
   ```

### Issue 5: CORS Errors
**Symptoms:** Console shows CORS-related errors

**Solutions:**
1. **Check proxy URL:**
   - Make sure you're using the correct Vercel domain
   - Update `proxyUrl` in `mailchimp-feed-secure.js`

2. **Verify CORS headers:**
   - Check that the proxy returns proper CORS headers
   - Test the proxy URL directly in browser

## 🔍 Debugging Steps

### Step 1: Use the Debug Tool
1. Visit: `https://your-site.vercel.app/debug-mailchimp.html`
2. Run the tests to identify the specific issue
3. Follow the suggested solutions

### Step 2: Check Browser Console
1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for error messages
4. Check Network tab for failed requests

### Step 3: Test Components Individually
1. **Test Vercel function:**
   ```
   https://your-site.vercel.app/api/mailchimp-proxy
   ```

2. **Test direct Mailchimp API:**
   - Use the debug tool with your credentials

3. **Test JavaScript:**
   - Check if scripts are loading
   - Look for JavaScript errors

## 🛠️ Quick Fixes

### Fix 1: Update JavaScript Files
Replace the old insecure JavaScript with the secure version:

```html
<!-- Remove these -->
<script src="{{ '/assets/mailchimp-config.js' | relative_url }}"></script>
<script src="{{ '/assets/mailchimp-feed.js' | relative_url }}" defer></script>

<!-- Add this -->
<script src="{{ '/assets/mailchimp-feed-secure.js' | relative_url }}" defer></script>
```

### Fix 2: Update Proxy URL
In `mailchimp-feed-secure.js`, update the proxy URL:

```javascript
const SECURE_CONFIG = {
  // Replace with your actual Vercel domain
  proxyUrl: 'https://your-site.vercel.app/api/mailchimp-proxy',
  campaignCount: 6
};
```

### Fix 3: Verify Environment Variables
In Vercel Dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Add/update:
   - `MAILCHIMP_API_KEY` = your API key
   - `MAILCHIMP_SERVER_PREFIX` = your server prefix (e.g., us1)

### Fix 4: Redeploy
After making changes:
1. Go to Vercel Dashboard
2. Deployments tab
3. Click "Redeploy" on latest deployment

## 📋 Checklist

- [ ] Vercel project deployed
- [ ] API function exists at `/api/mailchimp-proxy`
- [ ] Environment variables set in Vercel
- [ ] API key is valid and active
- [ ] Server prefix matches API key
- [ ] You have sent campaigns in Mailchimp
- [ ] JavaScript files updated to secure version
- [ ] Proxy URL matches your Vercel domain
- [ ] No CORS errors in console
- [ ] Network requests are successful

## 🆘 Still Not Working?

If you're still having issues:

1. **Share the error message** from browser console
2. **Check the debug tool** results
3. **Verify your Vercel deployment** is working
4. **Test the proxy URL** directly in browser
5. **Double-check environment variables** in Vercel

The most common issue is usually the environment variables not being set correctly in Vercel, or the proxy URL not matching your actual Vercel domain.