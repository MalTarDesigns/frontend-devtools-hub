# Real Performance Monitoring Testing Guide

## Test Setup

### 1. Extension Installation
- Load extension in Chrome Developer Mode
- Extension files located at: `/Users/jamal.johnson/projects/frontend-devtools-hub/extensions/performance-heatmapper/`
- Manifest v3 with Long Task API monitoring

### 2. Test Pages
- **Next.js App**: http://localhost:3001 (marketing website)
- **Long Task Test Page**: `/Users/jamal.johnson/projects/frontend-devtools-hub/test-long-task.html`

## Testing Checklist

### ✅ Basic Functionality
- [ ] Extension popup opens and shows "Real monitoring" status
- [ ] Toggle switch works (enables/disables monitoring)
- [ ] Metrics display updates in real-time
- [ ] Long Task API detection is active (console shows 🔥 REAL messages)

### ✅ Long Task Detection
- [ ] Long tasks >50ms are detected and logged
- [ ] Performance overlays appear on affected elements
- [ ] Overlay colors reflect task severity (green/yellow/orange/red)
- [ ] Badge shows actual task duration in milliseconds

### ✅ Popup Metrics Display
- [ ] Elements monitored count updates
- [ ] Performance issues count reflects real data
- [ ] Long tasks detected count increases with tasks
- [ ] Worst task duration shows maximum detected duration
- [ ] Color coding works for all metrics

### ✅ Safety Measures
- [ ] Maximum 5 overlays enforced
- [ ] Circuit breakers prevent crashes on repeated failures
- [ ] Throttling limits overlay updates to 1000ms intervals
- [ ] Cleanup removes stale overlays every 10 seconds
- [ ] No performance impact on host websites

### ✅ Framework Detection
- [ ] React components detected (if present)
- [ ] Angular components detected (if present)
- [ ] Vue components detected (if present)
- [ ] Framework info shown in popup status

## Test Scenarios

### 1. Basic Long Task Testing
1. Open test page: `file:///Users/jamal.johnson/projects/frontend-devtools-hub/test-long-task.html`
2. Load extension and enable monitoring
3. Click "Moderate Long Task (75ms)" button
4. Verify:
   - Console shows Long Task detected message
   - Performance overlay appears on button or nearby elements
   - Popup metrics update
   - Badge shows ~75ms duration

### 2. Severity Testing
1. Test different severity levels:
   - Moderate (75ms) → Yellow overlay
   - Severe (150ms) → Orange overlay
   - Extreme (300ms) → Red overlay
2. Verify overlay color matches task severity
3. Check popup worst task duration updates

### 3. Repeated Tasks
1. Click "Repeated Tasks (5x)" button
2. Verify:
   - Long task count increases to 5
   - Multiple overlays appear (max 5)
   - Cleanup removes old overlays

### 4. Real Website Testing
1. Navigate to http://localhost:3001
2. Enable monitoring
3. Interact with website (scroll, click, navigation)
4. Verify:
   - No performance impact
   - Real tasks detected during interactions
   - Framework detection works (React)

### 5. Toggle Testing
1. Enable monitoring → Check overlays appear
2. Disable monitoring → Check overlays disappear
3. Re-enable → Check monitoring resumes
4. Verify popup status reflects state changes

## Expected Results

### Console Output
```
🔥 REAL: Performance Heatmapper starting with Long Task monitoring...
🔥 REAL: RealPerformanceMonitor created
🔥 REAL: Initializing real performance monitoring...
🔥 REAL: Initialization complete, will start monitoring in 3 seconds
🔥 REAL: Starting real performance monitoring...
🔥 REAL: Long Task Observer active - monitoring for slow operations >50ms
🔥 REAL: Scanning initial elements for tracking...
🔥 REAL: Started tracking N elements
🔥 REAL: Long task detected: XXXms
🔥 REAL: Updated N performance overlays
```

### Popup Metrics
- **Status**: "Real monitoring active" (green)
- **Elements monitored**: 1-50 (based on viewport)
- **Performance issues**: Count of elements with score ≥5
- **Long tasks detected**: Count of tasks >50ms in last 30s
- **Worst task duration**: Maximum duration detected

### Performance Overlays
- **Position**: Exact element boundaries
- **Colors**: Green (<50ms), Yellow (50-100ms), Orange (100-150ms), Red (>150ms)
- **Badge**: Shows task duration in milliseconds
- **Behavior**: Updates on new tasks, fades after 10 seconds

## Troubleshooting

### No Long Tasks Detected
- Check browser supports Performance Observer API
- Verify Long Task API is available (Chrome 58+)
- Console should show "Long Task Observer active" message
- Try test page buttons to generate artificial tasks

### Overlays Not Appearing
- Check element attribution logic in findAffectedElements()
- Verify elements are in viewport and >20px size
- Check overlay creation and positioning logic
- Ensure circuit breakers haven't opened

### Popup Not Updating
- Check message passing between content script and popup
- Verify metrics update interval is running
- Check for JavaScript errors in popup console
- Try refreshing the page and re-enabling

### Performance Issues
- Monitor CPU usage during testing
- Check cleanup interval is removing stale data
- Verify throttling is limiting update frequency
- Review circuit breaker activation in console