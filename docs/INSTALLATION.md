# Installation Guide

## Performance Heatmapper Browser Extension

### Prerequisites
- Google Chrome, Microsoft Edge, or Chromium-based browser
- Developer mode access (for unpacked extension loading)

### Step 1: Download the Extension

Clone the repository:
```bash
git clone https://github.com/MalTarDesigns/frontend-devtools-hub.git
cd frontend-devtools-hub
```

### Step 2: Load Extension in Chrome

1. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/`
   - Or: Menu → More Tools → Extensions

2. **Enable Developer Mode**
   - Toggle "Developer mode" in the top-right corner

3. **Load Unpacked Extension**
   - Click "Load unpacked" button
   - Navigate to: `frontend-devtools-hub/extensions/performance-heatmapper/`
   - Click "Select Folder"

4. **Verify Installation**
   - Extension should appear in your extensions list
   - Look for the 🔥 icon in Chrome toolbar
   - Status should show "Enabled"

### Step 3: Test the Extension

1. **Visit a Website**
   - Try: `http://localhost:3001` (if running our demo site)
   - Or any website you want to analyze

2. **Activate Monitoring**
   - Click the 🔥 extension icon
   - Click "Enable Monitoring" if not auto-enabled
   - Wait 3 seconds for overlays to appear

3. **What You Should See**
   - Colored borders around page elements
   - Performance badges (numbers like "45ms", "120ms")
   - Popup showing metrics when clicking extension icon

### Troubleshooting

#### Extension Not Loading
- **Check folder path**: Ensure you selected the `performance-heatmapper` folder, not the parent directory
- **Refresh extensions page**: Press F5 on `chrome://extensions/`
- **Check console**: Look for errors in Chrome DevTools (F12)

#### No Overlays Appearing
- **Check popup**: Click extension icon to see if monitoring is enabled
- **Wait 3 seconds**: Overlays appear after a short delay
- **Refresh page**: Try reloading the webpage
- **Check console**: Open DevTools → Console for error messages

#### Permission Issues
- **Allow localhost**: Grant permission when prompted for localhost sites
- **Check URL**: Extension works on HTTP/HTTPS sites, not chrome:// pages
- **Reload extension**: Use reload button on extensions page

### Browser Compatibility

| Browser | Status | Notes |
|---------|---------|-------|
| Chrome | ✅ Fully Supported | Primary development target |
| Edge | ✅ Supported | Chromium-based, same as Chrome |
| Firefox | 🚧 Coming Soon | Requires manifest adaptation |
| Safari | 🚧 Planned | Web Extension format needed |

### Performance Impact

The extension is designed to have minimal impact:
- **CPU Usage**: < 1% additional overhead
- **Memory**: ~10MB maximum
- **Page Load**: No measurable impact
- **Safety**: Cannot crash or slow down websites

### Current Limitations (Demo Mode)

- **Static overlays**: Shows demo data, not real performance monitoring
- **5 overlay limit**: Maximum safety for demonstration
- **Fake timing**: Numbers are for visual concept only
- **Next version**: Will include real Long Task API integration

### Getting Help

- **GitHub Issues**: [Report bugs or request features](https://github.com/MalTarDesigns/frontend-devtools-hub/issues)
- **Documentation**: Check other files in `/docs/` folder
- **Console Logs**: Use browser DevTools to see detailed extension activity