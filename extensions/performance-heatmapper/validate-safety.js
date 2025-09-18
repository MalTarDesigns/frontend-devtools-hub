// Quick safety validation script
// Run this in browser console after loading the extension

(function validateSafety() {
  console.log('🛡️ Validating Performance Heatmapper Safety...');

  const results = {
    monitor: null,
    limits: {},
    stability: 'unknown',
    issues: []
  };

  // Check 1: Extension exists and is safe version
  const monitor = window.__safePerfMonitor;
  if (!monitor) {
    results.issues.push('❌ Safe performance monitor not found');
    console.error('Extension not loaded or wrong version');
    return results;
  }
  results.monitor = 'loaded';

  // Check 2: Safety limits are enforced
  try {
    // Check if limits exist in the class
    const limitChecks = {
      'MAX_ELEMENTS': 50,
      'MAX_OVERLAYS': 20,
      'SCAN_INTERVAL': 3000
    };

    // Verify tracking limits
    if (monitor.trackedElements) {
      results.limits.trackedElements = monitor.trackedElements.size;
      if (monitor.trackedElements.size > 50) {
        results.issues.push('⚠️ Tracking more than 50 elements');
      }
    }

    if (monitor.overlays) {
      results.limits.activeOverlays = monitor.overlays.size;
      if (monitor.overlays.size > 20) {
        results.issues.push('⚠️ More than 20 overlays active');
      }
    }

  } catch (error) {
    results.issues.push(`❌ Error checking limits: ${error.message}`);
  }

  // Check 3: Circuit breakers exist
  if (!monitor.scanBreaker || !monitor.overlayBreaker) {
    results.issues.push('⚠️ Circuit breakers not found');
  } else {
    results.stability = 'protected';
  }

  // Check 4: Throttling is active
  if (!monitor.throttledUpdateOverlays || !monitor.throttledScan) {
    results.issues.push('⚠️ Throttling not implemented');
  }

  // Check 5: Performance impact test
  const perfTest = () => {
    const start = performance.now();

    // Simulate heavy activity
    if (monitor.throttledScan) {
      monitor.throttledScan();
    }

    const duration = performance.now() - start;

    if (duration > 10) {
      results.issues.push(`⚠️ Slow operation detected: ${duration.toFixed(1)}ms`);
    }

    return duration;
  };

  const testDuration = perfTest();
  results.testDuration = testDuration.toFixed(1) + 'ms';

  // Report results
  console.log('\n📊 Safety Validation Results:');
  console.log('=============================');

  if (results.monitor) {
    console.log('✅ Safe monitor loaded');
  }

  if (results.limits.trackedElements !== undefined) {
    console.log(`📈 Elements tracked: ${results.limits.trackedElements}/50`);
  }

  if (results.limits.activeOverlays !== undefined) {
    console.log(`🔲 Overlays active: ${results.limits.activeOverlays}/20`);
  }

  console.log(`⏱️ Performance test: ${results.testDuration}`);
  console.log(`🛡️ Stability: ${results.stability}`);

  if (results.issues.length === 0) {
    console.log('\n🎉 All safety checks passed!');
    console.log('Extension is operating within safe parameters.');
  } else {
    console.log('\n⚠️ Issues found:');
    results.issues.forEach(issue => console.log(`  ${issue}`));
  }

  // Memory check if available
  if (performance.memory) {
    const memoryMB = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1);
    console.log(`💾 Current memory: ${memoryMB}MB`);
  }

  console.log('\n📋 Summary:');
  console.log(`- Monitor: ${results.monitor || 'not found'}`);
  console.log(`- Issues: ${results.issues.length}`);
  console.log(`- Status: ${results.issues.length === 0 ? 'SAFE' : 'NEEDS ATTENTION'}`);

  return results;
})();