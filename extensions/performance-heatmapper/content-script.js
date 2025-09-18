// Safe Performance Heatmapper Content Script - Lightweight Version
console.log('🔥 LOADING: Performance Heatmapper content script starting...');
(function() {
  'use strict';

  // Safety constants and configuration
  const SAFETY_LIMITS = {
    MAX_ELEMENTS: 50,           // Maximum elements to track at once
    MAX_OVERLAYS: 20,           // Maximum overlays to display
    SCAN_INTERVAL: 3000,        // Scan every 3 seconds (was continuous)
    UPDATE_THROTTLE: 1000,      // Update overlays max once per second
    MEASUREMENT_THROTTLE: 500,  // Throttle performance measurements
    MIN_ELEMENT_SIZE: 20,       // Skip elements smaller than 20x20px
    MAX_CPU_TIME: 5,           // Maximum 5ms per operation
    CLEANUP_INTERVAL: 10000     // Clean up every 10 seconds
  };

  // Safe utility functions
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

      // Log if operation takes too long
      if (duration > SAFETY_LIMITS.MAX_CPU_TIME) {
        console.warn(`Performance Heatmapper: Slow operation ${context}: ${duration.toFixed(1)}ms`);
      }

      return result;
    } catch (error) {
      console.warn(`Performance Heatmapper: Error in ${context}:`, error.message);
      return null;
    }
  }

  // Circuit breaker for preventing cascading failures
  class CircuitBreaker {
    constructor(threshold = 5) {
      this.failures = 0;
      this.threshold = threshold;
      this.isOpen = false;
      this.lastFailure = 0;
    }

    execute(fn) {
      if (this.isOpen) {
        // Check if we should try again (after 30 seconds)
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

  class SafePerformanceMonitor {
    constructor() {
      this.isActive = false;
      this.trackedElements = new Set();
      this.overlays = new Map();
      this.performanceData = new Map();

      // Observers
      this.longTaskObserver = null;
      this.intersectionObserver = null;

      // Timers and intervals
      this.scanInterval = null;
      this.updateTimeout = null;
      this.cleanupInterval = null;

      // Circuit breakers for different operations
      this.scanBreaker = new CircuitBreaker(3);
      this.overlayBreaker = new CircuitBreaker(3);

      // Performance tracking
      this.frameMetrics = [];
      this.longTasks = [];

      // Configuration
      this.config = {
        thresholdGood: 16,
        thresholdWarning: 50,
        thresholdBad: 100,
        showTooltips: true,
        showMetrics: true
      };

      // Throttled methods
      this.throttledUpdateOverlays = throttle(() => this.updateOverlays(), SAFETY_LIMITS.UPDATE_THROTTLE);
      this.throttledScan = throttle(() => this.performLightScan(), SAFETY_LIMITS.MEASUREMENT_THROTTLE);

      this.init();
    }

    async init() {
      console.log('🔥 Safe Performance Heatmapper: Initializing...');

      await this.loadSettings();
      this.setupMessageListeners();

      console.log('🔥 Initialization complete, isActive:', this.isActive);

      if (this.isActive) {
        this.start();
      } else {
        console.log('⏸️ Extension disabled, call toggle() to enable');
      }
    }

    async loadSettings() {
      return safeExecute(async () => {
        if (!chrome.storage?.local) {
          this.isActive = true; // Default to enabled
          return;
        }

        const result = await chrome.storage.local.get(['heatmapEnabled', 'heatmapConfig']);
        this.isActive = result.heatmapEnabled !== false; // Default to true

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
      if (this.isActive) return; // Already started

      console.log('🔥 Safe Performance Heatmapper: Starting monitoring...');
      this.isActive = true;

      // Setup minimal observers
      this.setupLongTaskObserver();
      this.setupIntersectionObserver();

      // Start periodic scanning (much less frequent)
      this.scanInterval = setInterval(() => {
        this.throttledScan();
      }, SAFETY_LIMITS.SCAN_INTERVAL);

      // Start cleanup routine
      this.cleanupInterval = setInterval(() => {
        this.cleanup();
      }, SAFETY_LIMITS.CLEANUP_INTERVAL);

      // Initial scan
      setTimeout(() => this.throttledScan(), 1000);
    }

    stop() {
      console.log('🔥 Safe Performance Heatmapper: Stopping monitoring...');
      this.isActive = false;

      // Clear all intervals
      if (this.scanInterval) {
        clearInterval(this.scanInterval);
        this.scanInterval = null;
      }

      if (this.cleanupInterval) {
        clearInterval(this.cleanupInterval);
        this.cleanupInterval = null;
      }

      if (this.updateTimeout) {
        clearTimeout(this.updateTimeout);
        this.updateTimeout = null;
      }

      // Disconnect observers
      this.longTaskObserver?.disconnect();
      this.intersectionObserver?.disconnect();

      // Clear all data and overlays
      this.clearAllOverlays();
      this.trackedElements.clear();
      this.performanceData.clear();
    }

    setupLongTaskObserver() {
      if (!window.PerformanceObserver) return;

      this.longTaskObserver = new PerformanceObserver((list) => {
        safeExecute(() => {
          const entries = list.getEntries();
          for (const entry of entries) {
            if (entry.duration > 50) { // Only track significant long tasks
              this.handleLongTask(entry);
            }
          }
        }, 'processing long tasks');
      });

      try {
        this.longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (error) {
        console.warn('Could not observe long tasks:', error.message);
      }
    }

    setupIntersectionObserver() {
      this.intersectionObserver = new IntersectionObserver((entries) => {
        safeExecute(() => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.trackElement(entry.target);
            } else {
              this.untrackElement(entry.target);
            }
          });
        }, 'intersection observation');
      }, {
        threshold: 0.1, // Only when 10% visible
        rootMargin: '50px' // Add some margin
      });
    }

    handleLongTask(entry) {
      const duration = entry.duration;

      // Store long task data
      this.longTasks.push({
        duration,
        timestamp: entry.startTime,
        attribution: entry.attribution?.[0]?.name || 'unknown'
      });

      // Keep only recent long tasks (last 30 seconds)
      const cutoff = performance.now() - 30000;
      this.longTasks = this.longTasks.filter(task => task.timestamp > cutoff);

      // Apply to visible elements (limited set)
      const visibleElements = this.getVisibleElements();
      visibleElements.slice(0, 10).forEach(element => { // Only top 10
        this.recordPerformanceIssue(element, 'longtask', duration);
      });
    }

    performLightScan() {
      return this.scanBreaker.execute(() => {
        if (!document.body) return;

        // Very selective scanning - only important elements
        const candidates = document.querySelectorAll('main, section, article, .component, [data-component], [class*="component"]');
        const elements = Array.from(candidates);

        // Limit number of elements to scan
        const maxToScan = Math.min(elements.length, SAFETY_LIMITS.MAX_ELEMENTS);

        for (let i = 0; i < maxToScan; i++) {
          const element = elements[i];

          if (this.shouldTrackElement(element)) {
            this.trackElement(element);
          }

          // Break if we've hit our tracking limit
          if (this.trackedElements.size >= SAFETY_LIMITS.MAX_ELEMENTS) {
            break;
          }
        }

        // Schedule overlay update
        this.scheduleOverlayUpdate();
      });
    }

    shouldTrackElement(element) {
      // Skip our own overlays
      if (element.classList?.contains('perf-heatmap-overlay')) {
        return false;
      }

      // Skip tiny elements
      const rect = element.getBoundingClientRect();
      if (rect.width < SAFETY_LIMITS.MIN_ELEMENT_SIZE ||
          rect.height < SAFETY_LIMITS.MIN_ELEMENT_SIZE) {
        return false;
      }

      // Skip invisible elements
      if (rect.width === 0 || rect.height === 0) {
        return false;
      }

      // Already tracking
      if (this.trackedElements.has(element)) {
        return false;
      }

      return true;
    }

    trackElement(element) {
      if (this.trackedElements.size >= SAFETY_LIMITS.MAX_ELEMENTS) {
        return; // Hit limit
      }

      this.trackedElements.add(element);

      // Add to intersection observer for visibility tracking
      if (this.intersectionObserver) {
        this.intersectionObserver.observe(element);
      }

      // Detect framework component (minimal detection)
      this.detectFramework(element);
    }

    untrackElement(element) {
      this.trackedElements.delete(element);
      this.performanceData.delete(element);

      if (this.intersectionObserver) {
        this.intersectionObserver.unobserve(element);
      }

      this.removeOverlay(element);
    }

    detectFramework(element) {
      // Minimal framework detection - just check for common indicators
      if (element.__reactInternalFiber || element.__reactFiber || element._reactInternalFiber) {
        this.recordPerformanceIssue(element, 'framework', 0, { framework: 'React' });
      } else if (element.hasAttribute('_ngcontent') || element.hasAttribute('_nghost')) {
        this.recordPerformanceIssue(element, 'framework', 0, { framework: 'Angular' });
      } else if (element.__vue__ || element.__vueParentComponent) {
        this.recordPerformanceIssue(element, 'framework', 0, { framework: 'Vue' });
      }
    }

    recordPerformanceIssue(element, type, value, metadata = {}) {
      if (!element) return;

      let data = this.performanceData.get(element);
      if (!data) {
        data = {
          issues: [],
          score: 0,
          framework: null,
          lastUpdate: performance.now()
        };
        this.performanceData.set(element, data);
      }

      // Add new issue
      data.issues.push({
        type,
        value,
        timestamp: performance.now(),
        ...metadata
      });

      // Keep only recent issues (last 10 seconds)
      const cutoff = performance.now() - 10000;
      data.issues = data.issues.filter(issue => issue.timestamp > cutoff);

      // Update score based on issues
      this.updateElementScore(data);

      // Update framework info
      if (metadata.framework) {
        data.framework = metadata.framework;
      }

      data.lastUpdate = performance.now();
    }

    updateElementScore(data) {
      let score = 0;

      data.issues.forEach(issue => {
        switch (issue.type) {
          case 'longtask':
            score += issue.value / 10; // Convert ms to score
            break;
          case 'framework':
            score += 5; // Boost for framework components
            break;
          default:
            score += issue.value || 1;
        }
      });

      data.score = score;
    }

    getVisibleElements() {
      // Use intersection observer results instead of getBoundingClientRect
      const visible = [];
      this.trackedElements.forEach(element => {
        if (document.body.contains(element)) {
          visible.push(element);
        }
      });
      return visible;
    }

    scheduleOverlayUpdate() {
      // Use timeout instead of interval for better control
      if (this.updateTimeout) return; // Already scheduled

      this.updateTimeout = setTimeout(() => {
        this.updateTimeout = null;
        if (this.isActive) {
          this.throttledUpdateOverlays();
        }
      }, SAFETY_LIMITS.UPDATE_THROTTLE);
    }

    updateOverlays() {
      return this.overlayBreaker.execute(() => {
        const visibleElements = this.getVisibleElements();
        let overlayCount = 0;

        // Update overlays for elements with performance issues
        visibleElements.forEach(element => {
          if (overlayCount >= SAFETY_LIMITS.MAX_OVERLAYS) return;

          const data = this.performanceData.get(element);
          if (!data || data.score < 1) {
            this.removeOverlay(element);
            return;
          }

          this.updateOverlay(element, data);
          overlayCount++;
        });

        // Clean up any remaining overlays
        this.overlays.forEach((overlay, element) => {
          if (!visibleElements.includes(element) || !this.performanceData.has(element)) {
            this.removeOverlay(element);
          }
        });
      });
    }

    updateOverlay(element, data) {
      // Use requestIdleCallback if available for non-critical overlay updates
      const updateFn = () => {
        let overlay = this.overlays.get(element);

        if (!overlay) {
          overlay = this.createSimpleOverlay();
          this.overlays.set(element, overlay);
        }

        // Update position and style
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

        // Apply color based on score
        const color = this.getColorForScore(data.score);
        overlay.style.borderColor = color;

        // Simple score display
        const scoreDisplay = overlay.querySelector('.score');
        if (scoreDisplay && data.score >= 5) {
          scoreDisplay.textContent = Math.round(data.score);
          scoreDisplay.style.display = 'block';
        } else if (scoreDisplay) {
          scoreDisplay.style.display = 'none';
        }
      };

      if (window.requestIdleCallback) {
        requestIdleCallback(updateFn, { timeout: 100 });
      } else {
        setTimeout(updateFn, 0);
      }
    }

    createSimpleOverlay() {
      const overlay = document.createElement('div');
      overlay.className = 'perf-heatmap-overlay';
      overlay.style.cssText = `
        position: absolute;
        pointer-events: none;
        z-index: 999998;
        border: 2px solid;
        border-radius: 3px;
        box-sizing: border-box;
      `;

      // Simple score display
      const scoreDisplay = document.createElement('div');
      scoreDisplay.className = 'score';
      scoreDisplay.style.cssText = `
        position: absolute;
        top: 2px;
        right: 2px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 1px 4px;
        border-radius: 2px;
        font-family: monospace;
        font-size: 10px;
        font-weight: bold;
        display: none;
      `;
      overlay.appendChild(scoreDisplay);

      document.body.appendChild(overlay);
      return overlay;
    }

    getColorForScore(score) {
      if (score < this.config.thresholdGood) {
        return 'rgba(34, 197, 94, 0.6)'; // Green
      } else if (score < this.config.thresholdWarning) {
        return 'rgba(250, 204, 21, 0.6)'; // Yellow
      } else if (score < this.config.thresholdBad) {
        return 'rgba(251, 146, 60, 0.6)'; // Orange
      } else {
        return 'rgba(239, 68, 68, 0.6)'; // Red
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
        // Remove stale elements
        const toRemove = [];
        this.trackedElements.forEach(element => {
          if (!document.body.contains(element)) {
            toRemove.push(element);
          }
        });

        toRemove.forEach(element => {
          this.untrackElement(element);
        });

        // Clean old performance data
        this.performanceData.forEach((data, element) => {
          const age = performance.now() - data.lastUpdate;
          if (age > 30000) { // 30 seconds old
            this.performanceData.delete(element);
          }
        });

        if (toRemove.length > 0) {
          console.log(`Cleaned up ${toRemove.length} stale elements`);
        }
      }, 'cleanup');
    }

    getMetricsSummary() {
      const summary = {
        elementsTracked: this.trackedElements.size,
        overlaysActive: this.overlays.size,
        performanceIssues: 0,
        frameworkComponents: {
          React: 0,
          Angular: 0,
          Vue: 0
        },
        averageFrameTime: 0,
        longTaskCount: this.longTasks.length
      };

      // Count performance issues and frameworks
      this.performanceData.forEach(data => {
        if (data.score > this.config.thresholdWarning) {
          summary.performanceIssues++;
        }

        if (data.framework) {
          summary.frameworkComponents[data.framework]++;
        }
      });

      // Simple frame time estimation from long tasks
      if (this.longTasks.length > 0) {
        const recent = this.longTasks.slice(-10);
        const totalTime = recent.reduce((sum, task) => sum + task.duration, 0);
        summary.averageFrameTime = totalTime / recent.length;
      }

      return summary;
    }

    exportData() {
      const data = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        summary: this.getMetricsSummary(),
        longTasks: this.longTasks.slice(-20), // Last 20 long tasks
        elements: []
      };

      this.performanceData.forEach((elementData, element) => {
        data.elements.push({
          tag: element.tagName,
          id: element.id || null,
          classes: Array.from(element.classList || []),
          score: elementData.score,
          framework: elementData.framework,
          issueCount: elementData.issues.length,
          recentIssues: elementData.issues.slice(-5)
        });
      });

      return data;
    }
  }

  // Clean up any previous version and initialize the safe performance monitor
  if (window.__performanceHeatmapper) {
    try {
      window.__performanceHeatmapper.stopMonitoring?.();
    } catch (e) {
      console.warn('Error cleaning up previous version:', e);
    }
    delete window.__performanceHeatmapper;
  }

  // Initialize the safe version
  if (!window.__safePerfMonitor) {
    console.log('🔥 Creating SafePerformanceMonitor instance...');
    window.__safePerfMonitor = new SafePerformanceMonitor();

    // Add manual trigger function for debugging
    window.startPerfMonitor = function() {
      console.log('🔥 Manual start triggered');
      if (window.__safePerfMonitor) {
        window.__safePerfMonitor.toggle();
        return window.__safePerfMonitor.isActive;
      }
      return false;
    };

    console.log('🔥 SafePerformanceMonitor ready. Use window.startPerfMonitor() to manually start.');
  }
})();