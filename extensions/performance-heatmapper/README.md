# Performance Heatmapper Browser Extension

A real-time performance monitoring tool that visualizes performance bottlenecks directly on your web pages.

## Features

- **Real-time performance monitoring** using the Performance Observer API
- **Visual heatmap overlays** showing slow components in red, fast in green
- **Framework agnostic** - works with Angular, React, Vue, or any website
- **Zero configuration** - just install and activate
- **Lightweight** - minimal performance impact

## Installation

### Chrome (Development Mode)

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `performance-heatmapper` folder
5. The extension should now appear in your toolbar

### Usage

1. Navigate to any website (localhost:4200 for Tardigrade)
2. Click the 🔥 extension icon in your toolbar
3. Toggle "Enable Heatmap" to start monitoring
4. Slow components will be highlighted in red/orange
5. Fast components will show green borders

## Color Legend

- 🟢 **Green**: Fast performance (< 1ms)
- 🟡 **Yellow**: Acceptable (1-3ms)
- 🟠 **Orange**: Slow (3-5ms)
- 🔴 **Red**: Critical (> 5ms)

## Technical Details

The extension monitors:
- Long tasks that block the main thread
- Frame rendering performance
- Component complexity heuristics
- DOM mutation performance

## Development

To modify the extension:

1. Edit the JavaScript files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Reload the page you're testing

## Files

- `manifest.json` - Extension configuration
- `content-script.js` - Main performance monitoring logic
- `popup.html/js` - Extension popup interface
- `background.js` - Service worker
- `heatmap.css` - Overlay styling

## Browser Support

- Chrome 88+ (Manifest V3)
- Firefox support coming soon

## License

MIT License - Free for personal and commercial use