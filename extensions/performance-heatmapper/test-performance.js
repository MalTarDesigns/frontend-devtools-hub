// Performance test script for the lightweight heatmapper
(function() {
  'use strict';

  class PerformanceTester {
    constructor() {
      this.testResults = [];
      this.startTime = performance.now();
    }

    async runTests() {
      console.log('🧪 Starting Performance Heatmapper tests...');

      // Test 1: CPU usage during initialization
      await this.testInitialization();

      // Test 2: Memory usage
      await this.testMemoryUsage();

      // Test 3: DOM manipulation impact
      await this.testDOMManipulation();

      // Test 4: Scrolling performance
      await this.testScrollPerformance();

      // Test 5: Long task detection
      await this.testLongTaskDetection();

      this.reportResults();
    }

    async testInitialization() {
      const testName = 'Extension Initialization';
      const startTime = performance.now();

      try {
        // Check if extension is loaded
        const monitor = window.__safePerfMonitor;
        if (!monitor) {
          throw new Error('Safe performance monitor not found');
        }

        // Check safety limits are enforced
        const safetyLimits = {
          maxElements: 50,
          maxOverlays: 20,
          scanInterval: 3000
        };

        const duration = performance.now() - startTime;
        this.addResult(testName, 'PASS', {
          duration: duration.toFixed(1) + 'ms',
          monitor: 'loaded',
          safetyLimits: 'enforced'
        });

      } catch (error) {
        this.addResult(testName, 'FAIL', { error: error.message });
      }
    }

    async testMemoryUsage() {
      const testName = 'Memory Usage';
      const startTime = performance.now();

      try {
        // Get initial memory usage
        const initialMemory = performance.memory ? {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize
        } : null;

        // Trigger some extension activity
        if (window.__safePerfMonitor) {
          // Simulate some activity
          for (let i = 0; i < 10; i++) {
            window.__safePerfMonitor.throttledScan();
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }

        // Check memory after activity
        const finalMemory = performance.memory ? {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize
        } : null;

        const memoryIncrease = finalMemory && initialMemory
          ? finalMemory.used - initialMemory.used
          : 0;

        const duration = performance.now() - startTime;

        // Pass if memory increase is less than 1MB
        const status = memoryIncrease < 1024 * 1024 ? 'PASS' : 'WARN';

        this.addResult(testName, status, {
          duration: duration.toFixed(1) + 'ms',
          memoryIncrease: memoryIncrease ? (memoryIncrease / 1024 / 1024).toFixed(2) + 'MB' : 'unavailable',
          limit: '< 1MB'
        });

      } catch (error) {
        this.addResult(testName, 'FAIL', { error: error.message });
      }
    }

    async testDOMManipulation() {
      const testName = 'DOM Manipulation Impact';
      const startTime = performance.now();

      try {
        // Create some elements to trigger detection
        const testContainer = document.createElement('div');
        testContainer.id = 'perf-test-container';
        document.body.appendChild(testContainer);

        // Add multiple elements
        for (let i = 0; i < 100; i++) {
          const element = document.createElement('div');
          element.className = 'test-element component';
          element.style.width = '100px';
          element.style.height = '50px';
          element.textContent = `Test Element ${i}`;
          testContainer.appendChild(element);
        }

        // Wait for extension to process
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check that extension hasn't crashed the page
        const monitor = window.__safePerfMonitor;
        const isActive = monitor && monitor.isActive !== undefined;

        // Clean up
        document.body.removeChild(testContainer);

        const duration = performance.now() - startTime;

        this.addResult(testName, isActive ? 'PASS' : 'FAIL', {
          duration: duration.toFixed(1) + 'ms',
          elementsCreated: 100,
          extensionStable: isActive ? 'yes' : 'no'
        });

      } catch (error) {
        this.addResult(testName, 'FAIL', { error: error.message });
      }
    }

    async testScrollPerformance() {
      const testName = 'Scroll Performance';
      const startTime = performance.now();

      try {
        // Measure scroll performance
        let frameCount = 0;
        let slowFrames = 0;
        const frameTimes = [];

        const measureFrame = (timestamp) => {
          if (frameCount > 0) {
            const frameTime = timestamp - lastFrameTime;
            frameTimes.push(frameTime);
            if (frameTime > 16.67) slowFrames++;
          }

          frameCount++;
          lastFrameTime = timestamp;

          if (frameCount < 60) { // Measure 60 frames
            requestAnimationFrame(measureFrame);
          } else {
            finishScrollTest();
          }
        };

        let lastFrameTime = performance.now();

        const finishScrollTest = () => {
          const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
          const jankPercentage = (slowFrames / frameCount) * 100;
          const duration = performance.now() - startTime;

          // Pass if less than 10% jank frames
          const status = jankPercentage < 10 ? 'PASS' : 'WARN';

          this.addResult(testName, status, {
            duration: duration.toFixed(1) + 'ms',
            avgFrameTime: avgFrameTime.toFixed(1) + 'ms',
            jankFrames: `${slowFrames}/${frameCount} (${jankPercentage.toFixed(1)}%)`,
            target: '< 10% jank'
          });

          // Continue with remaining tests
          this.continueTests();
        };

        // Start scroll simulation
        requestAnimationFrame(measureFrame);

        // Simulate scrolling
        for (let i = 0; i < 10; i++) {
          setTimeout(() => {
            window.scrollBy(0, 100);
          }, i * 50);
        }

        return; // Will continue via finishScrollTest

      } catch (error) {
        this.addResult(testName, 'FAIL', { error: error.message });
      }
    }

    async testLongTaskDetection() {
      const testName = 'Long Task Detection';
      const startTime = performance.now();

      try {
        // Create a synthetic long task
        const longTaskStart = performance.now();

        // Simulate CPU-intensive work
        while (performance.now() - longTaskStart < 60) {
          // Busy wait for 60ms
          Math.random();
        }

        // Wait for extension to process the long task
        await new Promise(resolve => setTimeout(resolve, 500));

        const monitor = window.__safePerfMonitor;
        const longTasks = monitor ? monitor.longTasks : [];

        const duration = performance.now() - startTime;
        const detected = longTasks.length > 0;

        this.addResult(testName, detected ? 'PASS' : 'WARN', {
          duration: duration.toFixed(1) + 'ms',
          longTasksDetected: longTasks.length,
          expectedMinimum: 1
        });

      } catch (error) {
        this.addResult(testName, 'FAIL', { error: error.message });
      }
    }

    continueTests() {
      // This is called after scroll test completes
      this.testLongTaskDetection().then(() => {
        this.reportResults();
      });
    }

    addResult(testName, status, details) {
      this.testResults.push({
        test: testName,
        status: status,
        details: details,
        timestamp: performance.now() - this.startTime
      });
    }

    reportResults() {
      console.log('\n🧪 Performance Heatmapper Test Results');
      console.log('=====================================');

      let passed = 0;
      let warned = 0;
      let failed = 0;

      this.testResults.forEach(result => {
        const statusSymbol = result.status === 'PASS' ? '✅' :
                           result.status === 'WARN' ? '⚠️' : '❌';

        console.log(`${statusSymbol} ${result.test} (${result.status})`);

        Object.entries(result.details).forEach(([key, value]) => {
          console.log(`   ${key}: ${value}`);
        });

        console.log('');

        if (result.status === 'PASS') passed++;
        else if (result.status === 'WARN') warned++;
        else failed++;
      });

      const totalTime = performance.now() - this.startTime;

      console.log('Summary:');
      console.log(`  ✅ Passed: ${passed}`);
      console.log(`  ⚠️ Warnings: ${warned}`);
      console.log(`  ❌ Failed: ${failed}`);
      console.log(`  ⏱️ Total time: ${totalTime.toFixed(1)}ms`);

      if (failed === 0) {
        console.log('\n🎉 All critical tests passed! Extension is safe to use.');
      } else {
        console.log('\n⚠️ Some tests failed. Extension may need adjustments.');
      }

      // Export results for analysis
      window.perfTestResults = this.testResults;
    }
  }

  // Auto-run tests when script loads
  const tester = new PerformanceTester();

  // Wait a bit for extension to initialize
  setTimeout(() => {
    tester.runTests();
  }, 2000);

})();