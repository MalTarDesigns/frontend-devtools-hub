export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-6">
            <span className="inline-block text-4xl mb-4">🔥</span>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Performance Tools <span className="text-blue-600">Beyond Chatbots</span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            Visual performance insights that no AI assistant can provide.
            <br />
            <span className="text-lg text-gray-500 dark:text-gray-400">
              Real-time heatmaps, automated monitoring, browser integration.
            </span>
          </p>

          {/* Performance Heatmapper Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-12 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center mb-6">
              <div className="text-3xl mr-3">🔥</div>
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
                Performance Heatmapper
              </h2>
              <div className="ml-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                MVP Ready
              </div>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              See performance bottlenecks visually overlaid on your UI in real-time.
              Watch slow components glow red as you interact with your application.
            </p>

            {/* Feature Comparison */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
                <h3 className="font-semibold text-red-900 dark:text-red-300 mb-4 flex items-center">
                  <span className="mr-2">❌</span> Chatbot Limitations
                </h3>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-2">
                  <li>• Can't monitor live performance metrics</li>
                  <li>• No visual overlay on your actual UI</li>
                  <li>• Can't provide real-time analysis</li>
                  <li>• No browser integration or automation</li>
                  <li>• Generic advice, not specific insights</li>
                </ul>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-900 dark:text-green-300 mb-4 flex items-center">
                  <span className="mr-2">✅</span> Our Visual Solution
                </h3>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-2">
                  <li>• Real-time performance heatmaps</li>
                  <li>• Visual bottleneck identification</li>
                  <li>• Works on React, Angular, Vue apps</li>
                  <li>• Instant browser extension install</li>
                  <li>• Framework component detection</li>
                </ul>
              </div>
            </div>

            {/* Technical Features */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-center">
                Advanced Performance Monitoring
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="font-medium text-gray-900 dark:text-white">Long Task API</div>
                  <div className="text-gray-600 dark:text-gray-300">Detects operations &gt; 50ms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-medium text-gray-900 dark:text-white">Frame Monitoring</div>
                  <div className="text-gray-600 dark:text-gray-300">Real-time FPS tracking</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="font-medium text-gray-900 dark:text-white">Element Attribution</div>
                  <div className="text-gray-600 dark:text-gray-300">Pinpoint slow components</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 items-center justify-center flex-col sm:flex-row">
              <a
                href="/download"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Download Extension (Free)
              </a>
              <a
                href="/demo"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                See Live Demo →
              </a>
            </div>
          </div>

          {/* Framework Support */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-3 text-center">⚛️</div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-center mb-2">React</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                Detects React components and render performance
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-3 text-center">🅰️</div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-center mb-2">Angular</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                Monitors Angular change detection cycles
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-3 text-center">🅥</div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-center mb-2">Vue.js</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                Tracks Vue component lifecycle performance
              </p>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              More Revolutionary Tools Coming Soon
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <span className="mr-2">🚀</span>
                <span className="text-gray-600 dark:text-gray-300">Bundle Size Analyzer with Visual Tree Maps</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">🎨</span>
                <span className="text-gray-600 dark:text-gray-300">Accessibility Checker with Live Highlighting</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📱</span>
                <span className="text-gray-600 dark:text-gray-300">Responsive Design Tester</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">🔍</span>
                <span className="text-gray-600 dark:text-gray-300">SEO Optimizer with Visual Feedback</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
