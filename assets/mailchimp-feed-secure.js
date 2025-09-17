/**
 * Secure Mailchimp Newsletter Feed Integration
 * Uses server-side proxy to keep API keys secure
 */

class SecureMailchimpFeed {
  constructor(proxyUrl = '/api/mailchimp-proxy', campaignCount = 6) {
    this.proxyUrl = proxyUrl;
    this.campaignCount = campaignCount;
    this.campaigns = [];
  }

  /**
   * Initialize the feed by fetching campaigns through secure proxy
   */
  async init() {
    try {
      this.showLoading();
      await this.fetchCampaigns();
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
   * Fetch campaigns through secure proxy
   */
  async fetchCampaigns() {
    const url = `${this.proxyUrl}?count=${this.campaignCount}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    this.campaigns = data.campaigns || [];
  }

  /**
   * Format campaign data for display
   */
  formatCampaign(campaign) {
    const sendTime = new Date(campaign.date);
    const formattedDate = sendTime.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return {
      id: campaign.id,
      title: campaign.title,
      excerpt: campaign.previewText || 'Read our latest newsletter for updates and insights.',
      date: formattedDate,
      link: campaign.link,
      image: campaign.image || '/images/magazinepic.png' // fallback image
    };
  }

  /**
   * Get user-friendly error message
   */
  getErrorMessage(error) {
    if (error.message.includes('Failed to fetch')) {
      return 'Network error. Please check your internet connection and try again.';
    } else if (error.message.includes('Mailchimp API key not configured')) {
      return 'Newsletter service is temporarily unavailable. Please try again later.';
    } else if (error.message.includes('Mailchimp API error')) {
      return 'Unable to load newsletters at this time. Please try again later.';
    } else {
      return 'Failed to load newsletter content. Please try again later.';
    }
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

// Configuration for secure proxy
const SECURE_CONFIG = {
  // Update this to your Vercel domain when deployed
  proxyUrl: '/api/mailchimp-proxy', // or 'https://your-domain.vercel.app/api/mailchimp-proxy'
  campaignCount: 6
};

// Initialize the secure feed when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const feed = new SecureMailchimpFeed(SECURE_CONFIG.proxyUrl, SECURE_CONFIG.campaignCount);
  feed.init();
});