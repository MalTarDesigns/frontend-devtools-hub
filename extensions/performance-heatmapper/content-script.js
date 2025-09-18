// Real Performance Heatmapper - Long Task API Implementation
console.log('🔥 REAL: Performance Heatmapper starting with Long Task monitoring...');

(function() {
  'use strict';

  // Safety constants maintained from demo version
  const SAFETY_LIMITS = {
    MAX_ELEMENTS: 5,           // Maximum overlays to prevent UI overwhelm
    SCAN_INTERVAL: 3000,       // Initial scan delay for safety
    UPDATE_THROTTLE: 1000,     // Overlay update throttling
    MIN_ELEMENT_SIZE: 20,      // Skip tiny elements
    LONG_TASK_THRESHOLD: 50,   // Minimum ms to consider significant
    CLEANUP_INTERVAL: 10000    // Regular cleanup cycle
  };

  // Utility functions
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  function safeExecute(fn, context = 'Unknown operation') {
    try {
      const startTime = performance.now();
      const result = fn();
      const duration = performance.now() - startTime;

      if (duration > 5) {
        console.warn(`Performance Heatmapper: Slow operation ${context}: ${duration.toFixed(1)}ms`);
      }

      return result;
    } catch (error) {
      console.warn(`Performance Heatmapper: Error in ${context}:`, error.message);
      return null;
    }
  }

  // Circuit breaker for safety
  class CircuitBreaker {
    constructor(threshold = 3) {
      this.failures = 0;
      this.threshold = threshold;
      this.isOpen = false;
      this.lastFailure = 0;
    }

    execute(fn) {
      if (this.isOpen) {
        if (Date.now() - this.lastFailure > 30000) {
          this.isOpen = false;
          this.failures = 0;
        } else {
          return null;
        }
      }

      try {
        const result = fn();
        this.failures = 0;
        return result;
      } catch (error) {
        this.failures++;
        this.lastFailure = Date.now();

        if (this.failures >= this.threshold) {
          this.isOpen = true;
          console.warn('Performance Heatmapper: Circuit breaker opened due to repeated failures');
        }

        throw error;
      }
    }
  }

  class RealPerformanceMonitor {
    constructor() {
      this.isActive = false;
      this.overlays = new Map();
      this.performanceData = new Map();

      // Real performance tracking
      this.longTasks = [];
      this.recentElements = new Set();

      // Observers
      this.longTaskObserver = null;
      this.intersectionObserver = null;

      // Intervals and timeouts
      this.cleanupInterval = null;
      this.initTimeout = null;

      // Circuit breakers
      this.monitoringBreaker = new CircuitBreaker(3);
      this.overlayBreaker = new CircuitBreaker(3);

      // Configuration
      this.config = {
        thresholdGood: 16,
        thresholdWarning: 50,
        thresholdBad: 100,
        showTooltips: true
      };

      // Throttled methods
      this.throttledUpdateOverlays = throttle(() => this.updateOverlays(), SAFETY_LIMITS.UPDATE_THROTTLE);

      console.log('🔥 REAL: RealPerformanceMonitor created');
      this.init();
    }

    async init() {
      console.log('🔥 REAL: Initializing real performance monitoring...');

      await this.loadSettings();
      this.setupMessageListeners();

      // Auto-start after safety delay
      this.initTimeout = setTimeout(() => {
        if (this.isActive) {
          this.start();
        }
      }, SAFETY_LIMITS.SCAN_INTERVAL);

      console.log('🔥 REAL: Initialization complete, will start monitoring in 3 seconds');
    }

    async loadSettings() {
      return safeExecute(async () => {
        if (!chrome.storage?.local) {
          this.isActive = true;
          return;
        }

        const result = await chrome.storage.local.get(['heatmapEnabled', 'heatmapConfig']);
        this.isActive = result.heatmapEnabled !== false;

        if (result.heatmapConfig) {
          this.config = { ...this.config, ...result.heatmapConfig };
        }
      }, 'loadSettings') || (() => {
        this.isActive = true;
      })();
    }

    setupMessageListeners() {
      if (!chrome.runtime?.onMessage) return;

      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        safeExecute(() => {
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
                metrics: this.getMetricsSummary()
              });
              break;
            case 'updateConfig':
              if (request.config) {
                this.updateConfig(request.config);
                sendResponse({ success: true });
              }
              break;
            case 'exportData':
              sendResponse({ data: this.exportData() });
              break;
            default:
              sendResponse({ error: 'Unknown action: ' + request.action });
          }
        }, 'message handling');
        return true;
      });
    }

    toggle() {
      this.isActive = !this.isActive;
      chrome.storage?.local?.set({ heatmapEnabled: this.isActive });

      if (this.isActive) {
        this.start();
      } else {
        this.stop();
      }
    }

    updateConfig(newConfig) {
      this.config = { ...this.config, ...newConfig };
      chrome.storage?.local?.set({ heatmapConfig: this.config });

      if (this.isActive) {
        this.throttledUpdateOverlays();
      }
    }

    start() {
      if (!this.isActive) return;

      console.log('🔥 REAL: Starting real performance monitoring...');

      // Setup Long Task Observer - this is the key new feature
      this.setupLongTaskObserver();

      // Setup supporting observers
      this.setupIntersectionObserver();

      // Start cleanup routine
      this.cleanupInterval = setInterval(() => {
        this.cleanup();
      }, SAFETY_LIMITS.CLEANUP_INTERVAL);

      // Initial element scan (delayed for safety)
      setTimeout(() => {
        this.initialElementScan();
      }, 1000);
    }

    stop() {
      console.log('🔥 REAL: Stopping performance monitoring...');
      this.isActive = false;

      // Disconnect observers
      this.longTaskObserver?.disconnect();
      this.intersectionObserver?.disconnect();

      // Clear intervals
      if (this.cleanupInterval) {
        clearInterval(this.cleanupInterval);
        this.cleanupInterval = null;
      }

      if (this.initTimeout) {
        clearTimeout(this.initTimeout);
        this.initTimeout = null;
      }

      // Clear all overlays and data
      this.clearAllOverlays();
      this.performanceData.clear();
      this.recentElements.clear();
    }

    setupLongTaskObserver() {
      if (!window.PerformanceObserver) {
        console.warn('Long Task API not supported in this browser');
        return;
      }

      return this.monitoringBreaker.execute(() => {
        this.longTaskObserver = new PerformanceObserver((list) => {
          safeExecute(() => {
            const entries = list.getEntries();
            for (const entry of entries) {
              this.handleRealLongTask(entry);
            }
          }, 'processing long tasks');
        });

        try {
          this.longTaskObserver.observe({ entryTypes: ['longtask'] });
          console.log('🔥 REAL: Long Task Observer active - monitoring for slow operations >50ms');
        } catch (error) {
          console.warn('Could not observe long tasks:', error.message);
        }
      });
    }

    handleRealLongTask(entry) {
      const duration = entry.duration;

      // Only process significant long tasks
      if (duration < SAFETY_LIMITS.LONG_TASK_THRESHOLD) {
        return;
      }

      console.log(`🔥 REAL: Long task detected: ${duration.toFixed(1)}ms`);

      // Store long task data
      this.longTasks.push({
        duration,
        startTime: entry.startTime,
        attribution: entry.attribution?.[0]?.name || 'unknown',
        timestamp: performance.now()
      });

      // Keep only recent long tasks (last 30 seconds)
      const cutoff = performance.now() - 30000;
      this.longTasks = this.longTasks.filter(task => task.timestamp > cutoff);

      // Find elements that might be affected by this long task
      const affectedElements = this.findAffectedElements();

      // Apply performance data to top elements (respecting safety limit)
      const elementsToMark = affectedElements.slice(0, SAFETY_LIMITS.MAX_ELEMENTS);

      elementsToMark.forEach(element => {
        this.recordRealPerformanceIssue(element, 'longtask', duration);
      });

      // Schedule overlay update
      this.throttledUpdateOverlays();
    }

    findAffectedElements() {
      // Strategy: Find elements that are likely affected by the long task
      // 1. Recently interacted elements
      // 2. Elements currently in viewport
      // 3. Elements with framework markers

      const candidates = [];

      // Get viewport elements
      const viewportElements = this.getViewportElements();
      candidates.push(...viewportElements);

      // Add recently tracked elements
      this.recentElements.forEach(element => {
        if (document.body.contains(element)) {
          candidates.push(element);
        }
      });

      // Deduplicate and filter by size
      const uniqueElements = [...new Set(candidates)];

      return uniqueElements.filter(element => {
        const rect = element.getBoundingClientRect();
        return rect.width >= SAFETY_LIMITS.MIN_ELEMENT_SIZE &&
               rect.height >= SAFETY_LIMITS.MIN_ELEMENT_SIZE;
      });
    }

    getViewportElements() {
      const elements = [];
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Sample elements for performance (not all)
      const allElements = document.querySelectorAll('main, section, article, div, button, [class*="component"], [data-component]');
      const step = Math.max(1, Math.floor(allElements.length / 20)); // Sample up to 20 elements

      for (let i = 0; i < allElements.length; i += step) {
        const element = allElements[i];
        const rect = element.getBoundingClientRect();

        // Check if element is in viewport
        if (rect.bottom >= 0 && rect.top <= viewportHeight &&
            rect.right >= 0 && rect.left <= viewportWidth &&
            rect.width > 0 && rect.height > 0) {
          elements.push(element);
        }
      }

      return elements;
    }

    setupIntersectionObserver() {
      this.intersectionObserver = new IntersectionObserver((entries) => {
        safeExecute(() => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.recentElements.add(entry.target);
            }
          });

          // Limit recent elements to prevent memory growth
          if (this.recentElements.size > 50) {
            const elementsArray = Array.from(this.recentElements);
            this.recentElements.clear();
            elementsArray.slice(-25).forEach(el => this.recentElements.add(el));
          }
        }, 'intersection observation');
      }, {
        threshold: 0.1,
        rootMargin: '50px'
      });
    }

    initialElementScan() {
      safeExecute(() => {
        console.log('🔥 REAL: Scanning initial elements for tracking...');

        const elements = this.getViewportElements();

        elements.forEach(element => {
          if (this.intersectionObserver) {
            this.intersectionObserver.observe(element);
          }
        });

        console.log(`🔥 REAL: Started tracking ${elements.length} elements`);
      }, 'initialElementScan');
    }

    recordRealPerformanceIssue(element, type, value, metadata = {}) {
      if (!element) return;

      let data = this.performanceData.get(element);
      if (!data) {
        data = {
          issues: [],
          score: 0,
          worstDuration: 0,
          lastUpdate: performance.now()
        };
        this.performanceData.set(element, data);
      }

      // Add real issue data
      data.issues.push({
        type,
        duration: value,
        timestamp: performance.now(),
        ...metadata
      });

      // Keep only recent issues (last 10 seconds)
      const cutoff = performance.now() - 10000;
      data.issues = data.issues.filter(issue => issue.timestamp > cutoff);

      // Update real performance metrics
      if (type === 'longtask') {
        data.worstDuration = Math.max(data.worstDuration, value);
        data.score = this.calculateRealScore(data.issues);
      }

      data.lastUpdate = performance.now();
    }

    calculateRealScore(issues) {
      let score = 0;

      issues.forEach(issue => {
        if (issue.type === 'longtask') {
          // Score based on actual duration
          if (issue.duration > 100) {
            score += 10; // Very slow
          } else if (issue.duration > 50) {
            score += 5;  // Slow
          } else {
            score += 2;  // Moderate
          }
        }
      });

      return score;
    }

    updateOverlays() {
      return this.overlayBreaker.execute(() => {
        let overlayCount = 0;

        // Update overlays for elements with real performance issues
        this.performanceData.forEach((data, element) => {
          if (overlayCount >= SAFETY_LIMITS.MAX_ELEMENTS) return;

          // Only show overlays for elements with recent performance issues
          if (data.score < 2) {
            this.removeOverlay(element);
            return;
          }

          if (document.body.contains(element)) {
            this.updateOverlay(element, data);
            overlayCount++;
          }
        });

        // Clean up stale overlays
        this.overlays.forEach((overlay, element) => {
          if (!this.performanceData.has(element) || !document.body.contains(element)) {
            this.removeOverlay(element);
          }
        });

        if (overlayCount > 0) {
          console.log(`🔥 REAL: Updated ${overlayCount} performance overlays`);
        }
      });
    }

    updateOverlay(element, data) {
      const updateFn = () => {
        let overlay = this.overlays.get(element);

        if (!overlay) {
          overlay = this.createOverlay();
          this.overlays.set(element, overlay);
        }

        // Update position
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          overlay.style.display = 'none';
          return;
        }

        overlay.style.display = 'block';
        overlay.style.left = (rect.left + window.scrollX) + 'px';
        overlay.style.top = (rect.top + window.scrollY) + 'px';
        overlay.style.width = rect.width + 'px';
        overlay.style.height = rect.height + 'px';

        // Apply color based on real performance data
        const color = this.getColorForScore(data.score);
        overlay.style.borderColor = color.replace('0.4', '0.8');
        overlay.style.backgroundColor = color;

        // Show real duration in badge
        const badge = overlay.querySelector('.perf-badge');
        if (badge && data.worstDuration > 0) {
          badge.textContent = `${Math.round(data.worstDuration)}ms`;
          badge.style.display = 'block';
        }
      };

      if (window.requestIdleCallback) {
        requestIdleCallback(updateFn, { timeout: 100 });
      } else {
        setTimeout(updateFn, 0);
      }
    }

    createOverlay() {
      const overlay = document.createElement('div');
      overlay.className = 'perf-heatmap-overlay';
      overlay.style.cssText = `
        position: absolute;
        pointer-events: none;
        z-index: 999998;
        border: 2px solid;
        border-radius: 4px;
        box-sizing: border-box;
        transition: opacity 0.3s ease;
      `;

      // Real performance badge
      const badge = document.createElement('div');
      badge.className = 'perf-badge';
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
        display: none;
      `;
      overlay.appendChild(badge);

      document.body.appendChild(overlay);
      return overlay;
    }

    getColorForScore(score) {
      if (score < 3) {
        return 'rgba(34, 197, 94, 0.4)'; // Green
      } else if (score < 7) {
        return 'rgba(250, 204, 21, 0.4)'; // Yellow
      } else if (score < 12) {
        return 'rgba(251, 146, 60, 0.4)'; // Orange
      } else {
        return 'rgba(239, 68, 68, 0.4)'; // Red
      }
    }

    removeOverlay(element) {
      const overlay = this.overlays.get(element);
      if (overlay?.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
      this.overlays.delete(element);
    }

    clearAllOverlays() {
      this.overlays.forEach(overlay => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      });
      this.overlays.clear();
    }

    cleanup() {
      safeExecute(() => {
        // Remove stale performance data
        const toRemove = [];
        this.performanceData.forEach((data, element) => {
          if (!document.body.contains(element) ||
              (performance.now() - data.lastUpdate) > 30000) {
            toRemove.push(element);
          }
        });

        toRemove.forEach(element => {
          this.performanceData.delete(element);
          this.removeOverlay(element);
        });

        // Clean up recent elements
        this.recentElements.forEach(element => {
          if (!document.body.contains(element)) {
            this.recentElements.delete(element);
          }
        });

        if (toRemove.length > 0) {
          console.log(`🔥 REAL: Cleaned up ${toRemove.length} stale elements`);
        }
      }, 'cleanup');
    }

    getMetricsSummary() {
      const summary = {
        elementsTracked: this.recentElements.size,
        overlaysActive: this.overlays.size,
        performanceIssues: 0,
        longTaskCount: this.longTasks.length,
        averageLongTaskDuration: 0,
        worstLongTaskDuration: 0,
        frameworkComponents: {
          React: 0,
          Angular: 0,
          Vue: 0
        },
        mode: 'REAL - Live Long Task monitoring'
      };

      // Calculate real performance statistics
      this.performanceData.forEach(data => {
        if (data.score >= 5) {
          summary.performanceIssues++;
        }
      });

      // Real long task statistics
      if (this.longTasks.length > 0) {
        const totalDuration = this.longTasks.reduce((sum, task) => sum + task.duration, 0);
        summary.averageLongTaskDuration = Math.round(totalDuration / this.longTasks.length);
        summary.worstLongTaskDuration = Math.round(Math.max(...this.longTasks.map(t => t.duration)));
      }

      return summary;
    }

    exportData() {
      return {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        summary: this.getMetricsSummary(),
        longTasks: this.longTasks.slice(-20), // Last 20 long tasks
        elements: Array.from(this.performanceData.entries()).map(([element, data]) => ({
          tag: element.tagName,
          id: element.id || null,
          classes: Array.from(element.classList || []),
          score: data.score,
          worstDuration: data.worstDuration,
          issueCount: data.issues.length,
          recentIssues: data.issues.slice(-5)
        }))
      };
    }
  }

  // Clean up any previous version
  if (window.__safePerfMonitor || window.__minimalHeatmapper) {
    try {
      window.__safePerfMonitor?.stop?.();
      window.__minimalHeatmapper?.stop?.();
    } catch (e) {
      console.warn('Error cleaning up previous version:', e);
    }
    delete window.__safePerfMonitor;
    delete window.__minimalHeatmapper;
  }

  // Initialize the real performance monitor
  window.__realPerfMonitor = new RealPerformanceMonitor();

  // Maintain compatibility with popup
  window.__safePerfMonitor = window.__realPerfMonitor;

  console.log('🔥 REAL: Real Performance Heatmapper ready - Long Task monitoring active!');
})();