// Ultra-Minimal Performance Heatmapper - Proof of Concept
// This version is 100% safe and cannot crash websites
console.log('🔥 MINIMAL: Performance Heatmapper starting (ultra-safe mode)');

(function() {
  'use strict';

  class MinimalHeatmapper {
    constructor() {
      this.isActive = false;
      this.overlays = [];
      this.demoMode = true; // Always in demo mode for safety

      console.log('🔥 MINIMAL: MinimalHeatmapper created');
      this.init();
    }

    init() {
      this.setupMessageListener();

      // Auto-start after 2 seconds for demo
      setTimeout(() => {
        this.start();
      }, 2000);
    }

    setupMessageListener() {
      if (chrome.runtime?.onMessage) {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
          console.log('🔥 MINIMAL: Message received:', request.action);

          switch (request.action) {
            case 'ping':
              sendResponse({ success: true });
              break;
            case 'toggle':
              this.toggle();
              sendResponse({ active: this.isActive });
              break;
            case 'getStatus':
              sendResponse({
                active: this.isActive,
                metrics: this.getMetrics()
              });
              break;
            default:
              sendResponse({ error: 'Unknown action' });
          }
          return true;
        });
      }
    }

    toggle() {
      this.isActive = !this.isActive;
      console.log('🔥 MINIMAL: Toggled to:', this.isActive);

      if (this.isActive) {
        this.start();
      } else {
        this.stop();
      }
    }

    start() {
      if (this.isActive) return;

      console.log('🔥 MINIMAL: Starting demo heatmaps...');
      this.isActive = true;

      // Create demo overlays after a delay
      setTimeout(() => {
        if (this.isActive) { // Check if still active
          this.createDemoOverlays();
        }
      }, 1000);
    }

    stop() {
      console.log('🔥 MINIMAL: Stopping heatmaps...');
      this.isActive = false;
      this.clearAllOverlays();
    }

    createDemoOverlays() {
      if (!this.isActive) return;

      console.log('🔥 MINIMAL: Creating demo overlays...');

      // Find some common elements to demo on
      const selectors = [
        'h1', 'h2', 'h3',           // Headers
        'button',                    // Buttons
        '.component', '[class*="component"]', // Components
        'nav', 'main', 'section',   // Semantic elements
        'div'                       // Divs (limit to first few)
      ];

      let overlayCount = 0;
      const maxOverlays = 5; // Very conservative limit

      for (const selector of selectors) {
        if (overlayCount >= maxOverlays) break;

        const elements = document.querySelectorAll(selector);

        for (let i = 0; i < Math.min(elements.length, 2); i++) {
          if (overlayCount >= maxOverlays) break;

          const element = elements[i];

          // Skip tiny elements
          const rect = element.getBoundingClientRect();
          if (rect.width < 50 || rect.height < 20) continue;

          this.createStaticOverlay(element, overlayCount);
          overlayCount++;
        }
      }

      console.log(`🔥 MINIMAL: Created ${overlayCount} demo overlays`);
    }

    createStaticOverlay(element, index) {
      const rect = element.getBoundingClientRect();

      const overlay = document.createElement('div');
      overlay.className = 'minimal-perf-overlay';

      // Rotate through colors for demo
      const colors = [
        'rgba(34, 197, 94, 0.4)',   // Green
        'rgba(250, 204, 21, 0.4)',  // Yellow
        'rgba(251, 146, 60, 0.4)',  // Orange
        'rgba(239, 68, 68, 0.4)',   // Red
        'rgba(147, 51, 234, 0.4)'   // Purple
      ];

      const color = colors[index % colors.length];
      const performance_score = [16, 35, 75, 120, 200][index % 5];

      overlay.style.cssText = `
        position: absolute;
        left: ${rect.left + window.scrollX}px;
        top: ${rect.top + window.scrollY}px;
        width: ${rect.width}px;
        height: ${rect.height}px;
        border: 2px solid ${color.replace('0.4', '0.8')};
        background: ${color};
        pointer-events: none;
        z-index: 999999;
        border-radius: 4px;
        box-sizing: border-box;
        transition: opacity 0.3s ease;
      `;

      // Add score badge
      const badge = document.createElement('div');
      badge.style.cssText = `
        position: absolute;
        top: 2px;
        right: 2px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 2px 6px;
        border-radius: 3px;
        font-family: monospace;
        font-size: 11px;
        font-weight: bold;
      `;
      badge.textContent = `${performance_score}ms`;
      overlay.appendChild(badge);

      document.body.appendChild(overlay);
      this.overlays.push(overlay);

      // Animate in
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.opacity = '1';
      }, index * 100);
    }

    clearAllOverlays() {
      console.log('🔥 MINIMAL: Clearing overlays...');

      this.overlays.forEach(overlay => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      });

      this.overlays = [];
    }

    getMetrics() {
      return {
        elementsTracked: this.overlays.length,
        overlaysActive: this.overlays.length,
        performanceIssues: this.overlays.length,
        frameworkComponents: {
          React: 1,
          Angular: 0,
          Vue: 0
        },
        averageFrameTime: 0,
        longTaskCount: this.overlays.length,
        mode: 'DEMO - Static overlays for safety'
      };
    }
  }

  // Clean up any previous version
  if (window.__minimalHeatmapper) {
    window.__minimalHeatmapper.stop?.();
    delete window.__minimalHeatmapper;
  }

  // Create the minimal version
  window.__minimalHeatmapper = new MinimalHeatmapper();

  // Also set as safe monitor for popup compatibility
  window.__safePerfMonitor = window.__minimalHeatmapper;

  console.log('🔥 MINIMAL: Ultra-safe heatmapper ready!');
})();