// Background service worker for Performance Heatmapper
console.log('🔥 Performance Heatmapper: Background script loaded');

// Install handler
chrome.runtime.onInstalled.addListener((details) => {
  console.log('🔥 Performance Heatmapper: Extension installed');

  // Set default settings
  chrome.storage.local.set({
    heatmapEnabled: true,
    heatmapConfig: {
      thresholdGood: 16,
      thresholdWarning: 50,
      thresholdBad: 100,
      showTooltips: true,
      showMetrics: true
    }
  });

  // Show welcome notification if available
  if (details.reason === 'install' && chrome.notifications) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon.svg',
      title: 'Performance Heatmapper Installed!',
      message: 'Click the extension icon to start monitoring performance on any website.'
    });
  }
});

// Handle extension icon click (fallback if popup fails to load)
chrome.action.onClicked.addListener(async (tab) => {
  console.log('🔥 Performance Heatmapper: Extension icon clicked');

  try {
    // Check if we can inject into this tab
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
      return;
    }

    // Try to inject content script
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content-script.js']
    });

    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ['heatmap.css']
    });

    // Send toggle message
    setTimeout(() => {
      chrome.tabs.sendMessage(tab.id, { action: 'toggle' });
    }, 100);
  } catch (error) {
    console.error('Failed to inject content script:', error);
  }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('🔥 Background received message:', request);

  switch (request.action) {
    case 'log':
      console.log('[Content Script]:', request.message);
      sendResponse({ success: true });
      break;
    case 'getPerformanceData':
      // Could implement centralized performance data collection here
      sendResponse({ status: 'success' });
      break;
    default:
      sendResponse({ error: 'Unknown action' });
  }

  return true; // Keep message channel open for async response
});

// Monitor tab changes to auto-inject into compatible pages
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    console.log('🔥 Performance Heatmapper: Page loaded, ready for monitoring');

    // Check if extension is enabled
    const result = await chrome.storage.local.get(['heatmapEnabled']);
    if (result.heatmapEnabled) {
      try {
        // Auto-inject content script into compatible pages
        await chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content-script.js']
        });

        await chrome.scripting.insertCSS({
          target: { tabId: tabId },
          files: ['heatmap.css']
        });

        console.log('🔥 Performance Heatmapper: Auto-injected into new page');
      } catch (error) {
        // Silent fail for pages where we can't inject
        console.warn('Could not inject into page:', error.message);
      }
    }
  }
});