// Simple debug test for the Performance Heatmapper extension
console.log('🔥 Debug: Extension test script loaded');

// Test 1: Check if content script loaded
if (window.__safePerfMonitor) {
  console.log('✅ Safe Performance Monitor loaded');
  console.log('Status:', window.__safePerfMonitor.isActive ? 'ACTIVE' : 'INACTIVE');
  console.log('Tracked elements:', window.__safePerfMonitor.trackedElements.size);
  console.log('Overlays:', window.__safePerfMonitor.overlays.size);
} else {
  console.log('❌ Safe Performance Monitor NOT loaded');
}

// Test 2: Try to manually start monitoring
if (window.__safePerfMonitor && !window.__safePerfMonitor.isActive) {
  console.log('🔄 Attempting to start monitoring...');
  window.__safePerfMonitor.start();

  setTimeout(() => {
    console.log('After start attempt:');
    console.log('- Active:', window.__safePerfMonitor.isActive);
    console.log('- Tracked:', window.__safePerfMonitor.trackedElements.size);
    console.log('- Overlays:', window.__safePerfMonitor.overlays.size);
  }, 5000);
}

// Test 3: Add some artificial performance issues
setTimeout(() => {
  console.log('🧪 Creating artificial performance test...');

  // Create a slow operation
  const start = performance.now();
  while (performance.now() - start < 100) {
    // Busy wait for 100ms to trigger long task detection
  }

  console.log('Artificial 100ms task completed');
}, 2000);

// Test 4: Monitor for 30 seconds and report
let reportInterval = setInterval(() => {
  if (window.__safePerfMonitor) {
    const summary = window.__safePerfMonitor.getMetricsSummary();
    console.log('📊 Monitoring Report:', summary);
  }
}, 5000);

setTimeout(() => {
  clearInterval(reportInterval);
  console.log('🏁 Debug test completed');
}, 30000);