// Enhanced Popup script for Performance Heatmapper
document.addEventListener('DOMContentLoaded', async () => {
  const elements = {
    enableToggle: document.getElementById('enableToggle'),
    status: document.getElementById('status'),
    metrics: document.getElementById('metrics'),
    elementCount: document.getElementById('elementCount'),
    issueCount: document.getElementById('issueCount'),
    frameTime: document.getElementById('frameTime'),
    worstTask: document.getElementById('worstTask'),
    helpLink: document.getElementById('helpLink'),
    websiteLink: document.getElementById('websiteLink'),
    githubLink: document.getElementById('githubLink')
  };

  // State management
  let currentTab = null;
  let metricsUpdateInterval = null;
  let isEnabled = false;

  // Get current tab
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTab = tabs[0];
  } catch (error) {
    console.error('Failed to get current tab:', error);
    showError('Failed to get current tab');
    return;
  }

  // Check if we can inject scripts
  const canInject = currentTab?.url &&
                   !currentTab.url.startsWith('chrome://') &&
                   !currentTab.url.startsWith('chrome-extension://') &&
                   !currentTab.url.startsWith('edge://') &&
                   !currentTab.url.startsWith('about:');

  if (!canInject) {
    elements.status.textContent = 'Cannot monitor this page';
    elements.status.style.color = '#ef4444';
    elements.enableToggle.style.opacity = '0.5';
    elements.enableToggle.style.pointerEvents = 'none';
    return;
  }

  // Initialize extension state
  await initializeExtension();

  // Event Handlers
  elements.enableToggle.addEventListener('click', handleToggleClick);

  elements.helpLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://github.com/yourusername/performance-heatmapper/blob/main/README.md' });
  });

  elements.websiteLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://github.com/yourusername/performance-heatmapper' });
  });

  elements.githubLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://github.com/yourusername/performance-heatmapper' });
  });

  // Functions
  async function initializeExtension() {
    try {
      // Try to get current status from content script
      const response = await sendMessageToTab('getStatus');

      if (response && !response.error) {
        isEnabled = response.active;
        updateUI(response.active, response.metrics);

        if (response.active) {
          startMetricsUpdates();
        }
      } else {
        // Content script not loaded yet, check storage
        const result = await chrome.storage.local.get(['heatmapEnabled']);
        isEnabled = result.heatmapEnabled !== false;
        updateToggleState(isEnabled);

        if (isEnabled) {
          elements.status.textContent = 'Initializing...';
          // Inject content script if needed
          await injectContentScript();
          // Wait a bit and try again
          setTimeout(initializeExtension, 500);
        } else {
          elements.status.textContent = 'Real monitoring paused';
        }
      }
    } catch (error) {
      console.error('Failed to initialize:', error);
      // Default state
      isEnabled = true;
      updateToggleState(true);
      elements.status.textContent = 'Ready for real monitoring';
    }
  }

  async function handleToggleClick() {
    try {
      elements.enableToggle.style.pointerEvents = 'none';

      // Send toggle message to content script
      const response = await sendMessageToTab('toggle');

      if (response && !response.error) {
        isEnabled = response.active;
        updateUI(response.active, response.metrics);

        if (response.active) {
          startMetricsUpdates();
        } else {
          stopMetricsUpdates();
        }
      } else {
        // Content script not ready, inject it
        await injectContentScript();
        // Try toggle again
        setTimeout(handleToggleClick, 500);
      }
    } catch (error) {
      console.error('Error toggling extension:', error);
      showError('Failed to toggle monitoring');
    } finally {
      elements.enableToggle.style.pointerEvents = 'auto';
    }
  }

  async function sendMessageToTab(action, data = {}) {
    try {
      if (!currentTab?.id) {
        throw new Error('No active tab available');
      }

      return await chrome.tabs.sendMessage(currentTab.id, { action, ...data });
    } catch (error) {
      console.warn(`Message "${action}" failed:`, error.message);

      // Specific error handling for common cases
      if (error.message.includes('receiving end does not exist')) {
        console.log('Content script not loaded, may need injection');
      } else if (error.message.includes('Extension context invalidated')) {
        showError('Extension needs to be reloaded');
      }

      return { error: true, message: error.message };
    }
  }

  async function injectContentScript() {
    try {
      if (!currentTab?.id) {
        throw new Error('No active tab for injection');
      }

      // Check if content script is already injected
      const response = await sendMessageToTab('ping');
      if (response && !response.error) {
        console.log('Content script already loaded');
        return; // Already injected
      }

      // Validate we can inject into this tab
      if (!canInject) {
        throw new Error('Cannot inject content script into this type of page');
      }

      console.log('Injecting content script...');

      // Inject the content script
      await chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        files: ['content-script.js']
      });

      // Inject the CSS
      await chrome.scripting.insertCSS({
        target: { tabId: currentTab.id },
        files: ['heatmap.css']
      });

      console.log('Content script injected successfully');

      // Wait a moment for the script to initialize
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error('Failed to inject content script:', error);

      // Provide user-friendly error messages
      if (error.message.includes('Cannot access')) {
        throw new Error('Cannot access this page - try refreshing the page first');
      } else if (error.message.includes('Extension context')) {
        throw new Error('Extension context lost - please reload the extension');
      } else {
        throw new Error(`Injection failed: ${error.message}`);
      }
    }
  }

  function updateUI(active, metrics = null) {
    updateToggleState(active);

    if (active) {
      elements.status.textContent = 'Real monitoring active';
      elements.status.style.color = '#4ade80';
      elements.metrics.classList.add('show');

      if (metrics) {
        updateMetrics(metrics);
      }
    } else {
      elements.status.textContent = 'Monitoring paused';
      elements.status.style.color = '#94a3b8';
      elements.metrics.classList.remove('show');
    }
  }

  function updateToggleState(active) {
    if (active) {
      elements.enableToggle.classList.add('active');
    } else {
      elements.enableToggle.classList.remove('active');
    }
  }

  function updateMetrics(metrics) {
    if (!metrics) return;

    // Update element count
    elements.elementCount.textContent = metrics.elementsTracked || '0';

    // Update issue count with color coding
    const issueCount = metrics.performanceIssues || 0;
    elements.issueCount.textContent = issueCount;
    if (issueCount > 5) {
      elements.issueCount.style.color = '#ef4444'; // Red
    } else if (issueCount > 2) {
      elements.issueCount.style.color = '#f97316'; // Orange
    } else if (issueCount > 0) {
      elements.issueCount.style.color = '#facc15'; // Yellow
    } else {
      elements.issueCount.style.color = '#4ade80'; // Green
    }

    // Update frame time with color coding
    const frameTime = metrics.averageFrameTime || 0;
    const longTaskCount = metrics.longTaskCount || 0;

    // Show long task count instead of frame time for the new lightweight version
    elements.frameTime.textContent = longTaskCount > 0 ? `${longTaskCount} tasks` : '0 tasks';
    if (longTaskCount > 5) {
      elements.frameTime.style.color = '#ef4444'; // Red - many long tasks
    } else if (longTaskCount > 2) {
      elements.frameTime.style.color = '#facc15'; // Yellow - some long tasks
    } else {
      elements.frameTime.style.color = '#4ade80'; // Green - no/few long tasks
    }

    // Show worst long task duration with color coding
    const worstDuration = metrics.worstLongTaskDuration || 0;
    elements.worstTask.textContent = worstDuration > 0 ? `${worstDuration}ms` : '0ms';
    if (worstDuration > 150) {
      elements.worstTask.style.color = '#ef4444'; // Red - very slow
    } else if (worstDuration > 100) {
      elements.worstTask.style.color = '#f97316'; // Orange - slow
    } else if (worstDuration > 50) {
      elements.worstTask.style.color = '#facc15'; // Yellow - moderate
    } else {
      elements.worstTask.style.color = '#4ade80'; // Green - good
    }

    // Show framework components if detected
    if (metrics.frameworkComponents) {
      const frameworks = [];
      if (metrics.frameworkComponents.React > 0) {
        frameworks.push(`React: ${metrics.frameworkComponents.React}`);
      }
      if (metrics.frameworkComponents.Angular > 0) {
        frameworks.push(`Angular: ${metrics.frameworkComponents.Angular}`);
      }
      if (metrics.frameworkComponents.Vue > 0) {
        frameworks.push(`Vue: ${metrics.frameworkComponents.Vue}`);
      }

      if (frameworks.length > 0) {
        // Add framework info to status
        const frameworkInfo = frameworks.join(', ');
        elements.status.textContent = `Real monitoring (${frameworkInfo})`;
      } else {
        elements.status.textContent = 'Real monitoring active';
      }
    }
  }

  function startMetricsUpdates() {
    // Update metrics immediately
    updateMetricsAsync();

    // Then update every 1 second
    metricsUpdateInterval = setInterval(updateMetricsAsync, 1000);
  }

  function stopMetricsUpdates() {
    if (metricsUpdateInterval) {
      clearInterval(metricsUpdateInterval);
      metricsUpdateInterval = null;
    }
  }

  async function updateMetricsAsync() {
    try {
      const response = await sendMessageToTab('getStatus');
      if (response && !response.error && response.metrics) {
        updateMetrics(response.metrics);
      }
    } catch (error) {
      console.warn('Failed to update metrics:', error);
    }
  }

  function showError(message) {
    elements.status.textContent = message;
    elements.status.style.color = '#ef4444';
  }

  // Add export functionality
  const exportButton = document.createElement('button');
  exportButton.textContent = 'Export Data';
  exportButton.style.cssText = `
    width: 100%;
    padding: 8px;
    margin-top: 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.3s;
  `;

  exportButton.addEventListener('mouseenter', () => {
    exportButton.style.background = 'rgba(255, 255, 255, 0.2)';
  });

  exportButton.addEventListener('mouseleave', () => {
    exportButton.style.background = 'rgba(255, 255, 255, 0.1)';
  });

  exportButton.addEventListener('click', async () => {
    try {
      const response = await sendMessageToTab('exportData');
      if (response && response.data) {
        // Create and download JSON file
        const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `performance-data-${timestamp}.json`;

        chrome.downloads.download({
          url: url,
          filename: filename,
          saveAs: true
        });

        exportButton.textContent = 'Exported!';
        setTimeout(() => {
          exportButton.textContent = 'Export Data';
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to export data:', error);
      exportButton.textContent = 'Export Failed';
      setTimeout(() => {
        exportButton.textContent = 'Export Data';
      }, 2000);
    }
  });

  // Add export button to metrics section
  elements.metrics.appendChild(exportButton);

  // Add threshold controls
  const thresholdControls = document.createElement('div');
  thresholdControls.style.cssText = `
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  `;

  thresholdControls.innerHTML = `
    <div style="font-size: 12px; margin-bottom: 8px; opacity: 0.8;">Performance Thresholds (ms)</div>
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;">
      <div>
        <label style="font-size: 10px; opacity: 0.6;">Good</label>
        <input type="number" id="thresholdGood" value="16" min="1" max="100"
               style="width: 100%; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
                      color: white; padding: 4px; border-radius: 2px; font-size: 11px;">
      </div>
      <div>
        <label style="font-size: 10px; opacity: 0.6;">Warning</label>
        <input type="number" id="thresholdWarning" value="50" min="1" max="200"
               style="width: 100%; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
                      color: white; padding: 4px; border-radius: 2px; font-size: 11px;">
      </div>
      <div>
        <label style="font-size: 10px; opacity: 0.6;">Bad</label>
        <input type="number" id="thresholdBad" value="100" min="1" max="500"
               style="width: 100%; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
                      color: white; padding: 4px; border-radius: 2px; font-size: 11px;">
      </div>
    </div>
  `;

  elements.metrics.appendChild(thresholdControls);

  // Load saved thresholds
  const savedConfig = await chrome.storage.local.get(['heatmapConfig']);
  if (savedConfig.heatmapConfig) {
    document.getElementById('thresholdGood').value = savedConfig.heatmapConfig.thresholdGood || 16;
    document.getElementById('thresholdWarning').value = savedConfig.heatmapConfig.thresholdWarning || 50;
    document.getElementById('thresholdBad').value = savedConfig.heatmapConfig.thresholdBad || 100;
  }

  // Handle threshold changes
  ['thresholdGood', 'thresholdWarning', 'thresholdBad'].forEach(id => {
    document.getElementById(id).addEventListener('change', async (e) => {
      const config = {
        thresholdGood: parseInt(document.getElementById('thresholdGood').value),
        thresholdWarning: parseInt(document.getElementById('thresholdWarning').value),
        thresholdBad: parseInt(document.getElementById('thresholdBad').value)
      };

      // Send config update to content script
      await sendMessageToTab('updateConfig', { config });

      // Save to storage
      await chrome.storage.local.set({ heatmapConfig: config });
    });
  });
});