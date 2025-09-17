# 🔒 Secure Mailchimp Integration Setup

## ⚠️ Security Issue with Previous Approach

The previous setup exposed your Mailchimp API key in client-side code, which is a **major security risk**. Anyone could view your source code and steal your API key.

## ✅ Secure Solutions

### **Option 1: Vercel Serverless Proxy (Recommended)**

This keeps your API key secure on the server side.

#### Step 1: Deploy to Vercel

1. **Connect your GitHub repo to Vercel**
2. **Set environment variables in Vercel dashboard:**
   - `MAILCHIMP_API_KEY` = your actual API key
   - `MAILCHIMP_SERVER_PREFIX` = your server prefix (e.g., us1)

#### Step 2: Update Your Website

Replace the insecure JavaScript with the secure version:

```html
<!-- Remove these lines from your layout -->
<script src="{{ '/assets/mailchimp-config.js' | relative_url }}"></script>
<script src="{{ '/assets/mailchimp-feed.js' | relative_url }}" defer></script>

<!-- Add this secure version instead -->
<script src="{{ '/assets/mailchimp-feed-secure.js' | relative_url }}" defer></script>
```

#### Step 3: Update Proxy URL

In `mailchimp-feed-secure.js`, update the proxy URL:

```javascript
const SECURE_CONFIG = {
  // Use your Vercel domain
  proxyUrl: 'https://your-site.vercel.app/api/mailchimp-proxy',
  campaignCount: 6
};
```

---

### **Option 2: GitHub Pages + Netlify Functions**

If you prefer to stay with GitHub Pages:

1. **Create a Netlify site** connected to your GitHub repo
2. **Add environment variables** in Netlify dashboard
3. **Use Netlify Functions** instead of Vercel

---

### **Option 3: Static Generation (Safest for GitHub Pages)**

Generate newsletter data at build time:

```yaml
# .github/workflows/update-newsletters.yml
name: Update Newsletters
on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:

jobs:
  update-newsletters:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Fetch newsletters
        run: |
          # Script to fetch from Mailchimp API and update _data/newsletters.yml
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add _data/newsletters.yml
          git commit -m "Update newsletters" || exit 0
          git push
```

---

## 🛡️ Security Benefits

### **Server-Side Proxy (Options 1 & 2)**
- ✅ API key never exposed to clients
- ✅ Rate limiting possible
- ✅ Request validation
- ✅ CORS protection
- ✅ Real-time data

### **Static Generation (Option 3)**
- ✅ API key only used during build
- ✅ No server required
- ✅ Fastest loading
- ⚠️ Data updates only on schedule

---

## 🚀 Quick Start (Vercel)

1. **Deploy to Vercel:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Set environment variables:**
   ```bash
   vercel env add MAILCHIMP_API_KEY
   vercel env add MAILCHIMP_SERVER_PREFIX
   ```

3. **Update your website** to use the secure JavaScript

4. **Test the integration**

---

## 🔧 Alternative: Environment-Based Config

If you want to keep using GitHub Pages, you can use a build-time approach:

```javascript
// In your build process, replace placeholders
const config = {
  apiKey: process.env.MAILCHIMP_API_KEY || 'PLACEHOLDER',
  serverPrefix: process.env.MAILCHIMP_SERVER_PREFIX || 'us1'
};
```

Then set up GitHub Actions to build with your secrets.

---

## ⚡ Performance Considerations

- **Server-Side Proxy**: ~200-500ms additional latency
- **Static Generation**: Instant loading, but data can be stale
- **Client-Side (Insecure)**: Fastest, but security risk

---

## 🎯 Recommendation

**Use Option 1 (Vercel Serverless Proxy)** because:
- ✅ Secure (API key protected)
- ✅ Real-time data
- ✅ Easy to set up
- ✅ Scales automatically
- ✅ Works with your existing GitHub Pages setup

Would you like me to help you set up the Vercel deployment or implement one of the other secure options?