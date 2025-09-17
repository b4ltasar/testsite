/**
 * Mailchimp Integration Debug Tool
 * This will help us identify what's going wrong
 */

class MailchimpDebugger {
  constructor() {
    this.debugInfo = {
      timestamp: new Date().toISOString(),
      errors: [],
      warnings: [],
      info: []
    };
  }

  log(message, type = 'info') {
    const logEntry = {
      timestamp: new Date().toISOString(),
      message,
      type
    };
    
    this.debugInfo[type + 's'].push(logEntry);
    console.log(`[Mailchimp Debug ${type.toUpperCase()}]`, message);
  }

  async testConnection() {
    this.log('Starting Mailchimp connection test...');
    
    // Test 1: Check if we can reach the proxy
    try {
      this.log('Testing proxy endpoint...');
      const response = await fetch('/api/mailchimp-proxy?count=1', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-cache'
      });
      
      this.log(`Proxy response status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        this.log(`Proxy returned data: ${JSON.stringify(data, null, 2)}`);
        return { success: true, data };
      } else {
        const errorText = await response.text();
        this.log(`Proxy error: ${errorText}`, 'error');
        return { success: false, error: errorText };
      }
    } catch (error) {
      this.log(`Network error: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  }

  async testDirectAPI(apiKey, serverPrefix) {
    this.log('Testing direct Mailchimp API...');
    
    try {
      const baseUrl = `https://${serverPrefix}.api.mailchimp.com/3.0`;
      const response = await fetch(`${baseUrl}/campaigns?count=1&status=sent`, {
        headers: {
          'Authorization': `apikey ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      this.log(`Direct API response status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        this.log(`Direct API returned: ${JSON.stringify(data, null, 2)}`);
        return { success: true, data };
      } else {
        const errorText = await response.text();
        this.log(`Direct API error: ${errorText}`, 'error');
        return { success: false, error: errorText };
      }
    } catch (error) {
      this.log(`Direct API network error: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  }

  renderDebugPanel() {
    const container = document.getElementById('newsletter-feed');
    if (!container) return;

    const debugHtml = `
      <div class="debug-panel" style="
        background: #f8f9fa;
        border: 2px solid #e9ecef;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
        font-family: monospace;
        font-size: 14px;
      ">
        <h3 style="margin-top: 0; color: #495057;">🔍 Mailchimp Debug Panel</h3>
        <div id="debug-content">
          <p>Running tests...</p>
        </div>
        <button onclick="runDebugTests()" style="
          background: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
        ">Run Tests Again</button>
      </div>
    `;

    container.innerHTML = debugHtml;
  }

  updateDebugContent(content) {
    const debugContent = document.getElementById('debug-content');
    if (debugContent) {
      debugContent.innerHTML = content;
    }
  }

  generateReport() {
    let report = '<h4>Debug Report:</h4><ul>';
    
    this.debugInfo.errors.forEach(error => {
      report += `<li style="color: #dc3545;">❌ ERROR: ${error.message}</li>`;
    });
    
    this.debugInfo.warnings.forEach(warning => {
      report += `<li style="color: #ffc107;">⚠️ WARNING: ${warning.message}</li>`;
    });
    
    this.debugInfo.info.forEach(info => {
      report += `<li style="color: #28a745;">ℹ️ INFO: ${info.message}</li>`;
    });
    
    report += '</ul>';
    return report;
  }
}

// Global debugger instance
window.mailchimpDebugger = new MailchimpDebugger();

// Test functions
window.runDebugTests = async function() {
  const debugger = window.mailchimpDebugger;
  debugger.updateDebugContent('<p>Running tests...</p>');
  
  // Test proxy first
  const proxyResult = await debugger.testConnection();
  
  if (proxyResult.success) {
    debugger.updateDebugContent(`
      <div style="color: #28a745;">
        <h4>✅ Proxy Test Passed!</h4>
        <p>Your Vercel proxy is working correctly.</p>
        <pre>${JSON.stringify(proxyResult.data, null, 2)}</pre>
      </div>
      ${debugger.generateReport()}
    `);
  } else {
    debugger.updateDebugContent(`
      <div style="color: #dc3545;">
        <h4>❌ Proxy Test Failed</h4>
        <p>Error: ${proxyResult.error}</p>
        <h5>Possible Issues:</h5>
        <ul>
          <li>Vercel function not deployed</li>
          <li>Environment variables not set</li>
          <li>Wrong proxy URL</li>
          <li>API key invalid</li>
        </ul>
      </div>
      ${debugger.generateReport()}
    `);
  }
};

// Auto-run tests when page loads
document.addEventListener('DOMContentLoaded', function() {
  const debugger = window.mailchimpDebugger;
  debugger.renderDebugPanel();
  setTimeout(() => runDebugTests(), 1000);
});