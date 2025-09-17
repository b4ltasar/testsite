/**
 * Mailchimp Newsletter Feed Integration
 * Fetches and displays recent newsletters from Mailchimp API
 */

class MailchimpFeed {
  constructor(apiKey, serverPrefix, listId = null, campaignCount = 6) {
    this.apiKey = apiKey;
    this.serverPrefix = serverPrefix; // e.g., 'us1', 'us2', etc.
    this.baseUrl = `https://${serverPrefix}.api.mailchimp.com/3.0`;
    this.listId = listId; // Will be fetched automatically if not provided
    this.campaignCount = campaignCount;
    this.campaigns = [];
  }

  /**
   * Initialize the feed by fetching list ID and campaigns
   */
  async init() {
    try {
      this.showLoading();
      if (!this.listId) {
        await this.fetchListId();
      }
      await this.fetchRecentCampaigns();
      this.hideLoading();
      this.renderFeed();
    } catch (error) {
      console.error('Error initializing Mailchimp feed:', error);
      this.hideLoading();
      this.renderError(this.getErrorMessage(error));
    }
  }

  /**
   * Show loading state
   */
  showLoading() {
    const loading = document.getElementById('newsletter-loading');
    const feed = document.getElementById('newsletter-feed');
    if (loading) loading.style.display = 'flex';
    if (feed) feed.style.display = 'none';
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    const loading = document.getElementById('newsletter-loading');
    const feed = document.getElementById('newsletter-feed');
    if (loading) loading.style.display = 'none';
    if (feed) feed.style.display = 'block';
  }

  /**
   * Get user-friendly error message
   */
  getErrorMessage(error) {
    if (error.message.includes('401') || error.message.includes('403')) {
      return 'Invalid API credentials. Please check your Mailchimp API key.';
    } else if (error.message.includes('404')) {
      return 'Mailchimp account not found. Please verify your server prefix.';
    } else if (error.message.includes('No lists found')) {
      return 'No newsletter lists found in your Mailchimp account.';
    } else if (error.message.includes('Failed to fetch')) {
      return 'Network error. Please check your internet connection and try again.';
    } else {
      return 'Failed to load newsletter content. Please try again later.';
    }
  }

  /**
   * Fetch the first available list ID from Mailchimp
   */
  async fetchListId() {
    const response = await fetch(`${this.baseUrl}/lists?count=1`, {
      headers: {
        'Authorization': `apikey ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.lists && data.lists.length > 0) {
      this.listId = data.lists[0].id;
    } else {
      throw new Error('No lists found in Mailchimp account');
    }
  }

  /**
   * Fetch recent campaigns from Mailchimp
   */
  async fetchRecentCampaigns() {
    const response = await fetch(`${this.baseUrl}/campaigns?count=${this.campaignCount}&status=sent&sort_field=send_time&sort_dir=DESC`, {
      headers: {
        'Authorization': `apikey ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    this.campaigns = data.campaigns || [];
  }

  /**
   * Format campaign data for display
   */
  formatCampaign(campaign) {
    const sendTime = new Date(campaign.send_time);
    const formattedDate = sendTime.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Extract preview text from campaign content
    const previewText = this.extractPreviewText(campaign);
    
    return {
      id: campaign.id,
      title: campaign.settings.subject_line || 'Newsletter',
      excerpt: previewText,
      date: formattedDate,
      link: campaign.archive_url || '#',
      image: this.extractImageUrl(campaign) || '/images/magazinepic.png' // fallback image
    };
  }

  /**
   * Extract preview text from campaign content
   */
  extractPreviewText(campaign) {
    if (campaign.settings.preview_text) {
      return campaign.settings.preview_text;
    }
    
    // Try to extract text from HTML content
    if (campaign.content && campaign.content.html) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = campaign.content.html;
      const text = tempDiv.textContent || tempDiv.innerText || '';
      return text.substring(0, 150) + (text.length > 150 ? '...' : '');
    }
    
    return 'Read our latest newsletter for updates and insights.';
  }

  /**
   * Extract image URL from campaign content
   */
  extractImageUrl(campaign) {
    if (campaign.content && campaign.content.html) {
      const imgMatch = campaign.content.html.match(/<img[^>]+src="([^"]+)"/i);
      if (imgMatch) {
        return imgMatch[1];
      }
    }
    return null;
  }

  /**
   * Render the newsletter feed
   */
  renderFeed() {
    const container = document.getElementById('newsletter-feed');
    if (!container) return;

    if (this.campaigns.length === 0) {
      container.innerHTML = `
        <div class="newsletter-feed-empty">
          <p>No newsletters available at the moment.</p>
        </div>
      `;
      return;
    }

    const campaignsHtml = this.campaigns
      .map(campaign => {
        const formatted = this.formatCampaign(campaign);
        return `
          <article class="newsletter-card" data-aos="fade-up">
            <div class="newsletter-card-image">
              <img src="${formatted.image}" alt="${formatted.title}" loading="lazy">
              <div class="newsletter-card-overlay">
                <a href="${formatted.link}" target="_blank" rel="noopener" class="newsletter-card-link">
                  Read Newsletter
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
            <div class="newsletter-card-content">
              <div class="newsletter-card-meta">
                <span class="newsletter-card-date">${formatted.date}</span>
                <span class="newsletter-card-source">Newsletter</span>
              </div>
              <h3 class="newsletter-card-title">${formatted.title}</h3>
              <p class="newsletter-card-excerpt">${formatted.excerpt}</p>
            </div>
          </article>
        `;
      })
      .join('');

    container.innerHTML = `
      <div class="newsletter-feed-grid">
        ${campaignsHtml}
      </div>
    `;
  }

  /**
   * Render error message
   */
  renderError(message) {
    const container = document.getElementById('newsletter-feed');
    if (!container) return;

    container.innerHTML = `
      <div class="newsletter-feed-error">
        <p>${message}</p>
        <button onclick="location.reload()" class="retry-button">Retry</button>
      </div>
    `;
  }
}

// Initialize the feed when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Check if configuration is available
  if (typeof window.MAILCHIMP_CONFIG === 'undefined') {
    console.error('Mailchimp configuration not found. Please include mailchimp-config.js');
    return;
  }

  const config = window.MAILCHIMP_CONFIG;
  
  // Validate configuration
  if (!config.apiKey || config.apiKey === 'YOUR_MAILCHIMP_API_KEY_HERE') {
    console.error('Please configure your Mailchimp API key in mailchimp-config.js');
    const container = document.getElementById('newsletter-feed');
    if (container) {
      container.innerHTML = `
        <div class="newsletter-feed-error">
          <p>Please configure your Mailchimp API key to display newsletters.</p>
        </div>
      `;
    }
    return;
  }

  const feed = new MailchimpFeed(config.apiKey, config.serverPrefix, config.listId, config.campaignCount);
  feed.init();
});