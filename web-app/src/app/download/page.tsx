export default function Download() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-4xl mb-4">🔥</div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Download Performance Heatmapper
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Install the browser extension and start visualizing performance bottlenecks instantly
            </p>
          </div>

          {/* Installation Steps */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
              Quick Installation Guide
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Chrome Installation */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">🌐</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Chrome & Edge
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      1
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Download Extension</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Download the <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">performance-heatmapper.zip</code> file
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      2
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Extract Files</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Unzip the downloaded file to a folder on your computer
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      3
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Open Extensions</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Go to <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">chrome://extensions/</code>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      4
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Enable Developer Mode</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Toggle "Developer mode" in the top right corner
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      5
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Load Extension</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Click "Load unpacked" and select the extracted folder
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Firefox Installation */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">🦊</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Firefox
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      1
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Download Extension</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Download the <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">performance-heatmapper.zip</code> file
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      2
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Open Debug Page</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Go to <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">about:debugging</code>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      3
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">This Firefox</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Click "This Firefox" on the left sidebar
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      4
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Load Temporary</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Click "Load Temporary Add-on" and select manifest.json
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mt-4">
                    <div className="text-sm text-yellow-800 dark:text-yellow-300">
                      <strong>Note:</strong> Firefox temporary extensions are removed on browser restart.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Download Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Download?</h2>
            <p className="text-lg mb-6 opacity-90">
              Get the latest version of Performance Heatmapper and start optimizing your web applications
            </p>

            <div className="flex gap-4 justify-center flex-col sm:flex-row">
              <a
                href="/extensions/performance-heatmapper.zip"
                download
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center justify-center"
              >
                <span className="mr-2">⬇️</span>
                Download Extension (.zip)
              </a>
              <a
                href="https://github.com/yourusername/performance-heatmapper"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center justify-center"
              >
                <span className="mr-2">📦</span>
                View on GitHub
              </a>
            </div>
          </div>

          {/* Getting Started */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Getting Started
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  🚀 Quick Start
                </h3>
                <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">1.</span>
                    Install the extension using the guide above
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">2.</span>
                    Navigate to any website or web application
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">3.</span>
                    Click the Performance Heatmapper icon in your toolbar
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">4.</span>
                    Toggle "Enable Heatmap" to start monitoring
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">5.</span>
                    Interact with the page to see performance overlays
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  🎯 Best Practices
                </h3>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    Test on your own applications first to understand the interface
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    Use the threshold controls to adjust sensitivity
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    Export performance data for deeper analysis
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    Hover over overlays to see detailed metrics
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    Look for red overlays indicating performance issues
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 mb-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Troubleshooting
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Extension not working?
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Make sure you're not on a chrome:// or about: page</li>
                  <li>• Refresh the page after installing the extension</li>
                  <li>• Check that the extension is enabled in your browser settings</li>
                  <li>• Try clicking the extension icon to manually toggle it</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No overlays showing?
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• The page might be performing well (no performance issues detected)</li>
                  <li>• Adjust the threshold settings in the popup to be more sensitive</li>
                  <li>• Try interacting with the page more (scrolling, clicking, etc.)</li>
                  <li>• Some pages block content scripts - this is normal</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Need help?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Visit our <a href="/demo" className="text-blue-600 hover:underline">demo page</a> to see the extension in action,
                  or check out the <a href="https://github.com/yourusername/performance-heatmapper/issues" className="text-blue-600 hover:underline">GitHub issues</a> page
                  for common problems and solutions.
                </p>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <a
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}