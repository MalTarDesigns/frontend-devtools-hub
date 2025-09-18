'use client';

import { useState, useEffect } from 'react';

// Slow component that intentionally causes performance issues
function SlowComponent({ delay = 100, children }: { delay?: number; children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate slow rendering by blocking the main thread
    const start = performance.now();
    while (performance.now() - start < delay) {
      // Intentionally block the main thread
    }
    setIsLoading(false);
  }, [delay]);

  return (
    <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 rounded-lg">
      <div className="text-sm text-red-600 dark:text-red-400 mb-2">
        Slow Component ({delay}ms render)
      </div>
      {isLoading ? (
        <div className="animate-pulse">Loading...</div>
      ) : (
        children
      )}
    </div>
  );
}

// Component with expensive CSS
function ExpensiveComponent({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="p-4 border border-orange-300 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
      style={{
        filter: 'blur(0.5px) brightness(1.1)',
        transform: 'rotateX(1deg) rotateY(1deg)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1), 0 20px 50px rgba(0,0,0,0.05)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="text-sm text-orange-600 dark:text-orange-400 mb-2">
        Expensive CSS Component (filters, transforms, shadows)
      </div>
      {children}
    </div>
  );
}

// Large list component
function LargeListComponent() {
  const [items] = useState(() =>
    Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Item ${i + 1}`,
      description: `This is a description for item ${i + 1}`
    }))
  );

  return (
    <div className="p-4 border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg max-h-96 overflow-y-auto">
      <div className="text-sm text-yellow-600 dark:text-yellow-400 mb-2">
        Large List Component (1000 items, no virtualization)
      </div>
      <div className="space-y-1">
        {items.map(item => (
          <div key={item.id} className="p-2 bg-white dark:bg-gray-700 rounded text-xs">
            <div className="font-medium">{item.name}</div>
            <div className="text-gray-600 dark:text-gray-300">{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Animation component
function AnimationComponent() {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className="p-4 border border-purple-300 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
      <div className="text-sm text-purple-600 dark:text-purple-400 mb-2">
        Animation Component (60fps challenge)
      </div>
      <button
        onClick={() => setIsAnimating(!isAnimating)}
        className="mb-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
      >
        {isAnimating ? 'Stop' : 'Start'} Animation
      </button>

      <div className="grid grid-cols-6 gap-2">
        {Array.from({ length: 36 }, (_, i) => (
          <div
            key={i}
            className={`w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded ${
              isAnimating ? 'animate-spin' : ''
            }`}
            style={{
              animationDelay: `${i * 50}ms`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Memory leak component
function MemoryLeakComponent() {
  const [leakActive, setLeakActive] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const startLeak = () => {
    if (leakActive) return;

    setLeakActive(true);
    const id = setInterval(() => {
      // Create objects that won't be garbage collected
      const leakyArray: number[] = [];
      for (let i = 0; i < 10000; i++) {
        leakyArray.push(Math.random());
      }
      // Store reference globally (simulates memory leak)
      (window as any).__memoryLeak = (window as any).__memoryLeak || [];
      (window as any).__memoryLeak.push(leakyArray);
    }, 100);

    setIntervalId(id);
  };

  const stopLeak = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setLeakActive(false);
    // Clean up leaked memory
    delete (window as any).__memoryLeak;
  };

  return (
    <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 rounded-lg">
      <div className="text-sm text-red-600 dark:text-red-400 mb-2">
        Memory Leak Component (intentional)
      </div>
      <div className="flex gap-2">
        <button
          onClick={startLeak}
          disabled={leakActive}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm"
        >
          Start Memory Leak
        </button>
        <button
          onClick={stopLeak}
          disabled={!leakActive}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
        >
          Stop & Clean Up
        </button>
      </div>
      {leakActive && (
        <div className="mt-2 text-xs text-red-600 dark:text-red-400">
          Creating memory leaks... Watch your performance monitor!
        </div>
      )}
    </div>
  );
}

export default function Demo() {
  const [showExtensionHelp, setShowExtensionHelp] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-4xl mb-4">🔥</div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Performance Heatmapper Demo
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Interactive demo showing performance issues that the extension can detect
            </p>
          </div>

          {/* Extension Installation Notice */}
          {showExtensionHelp && (
            <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="text-2xl mr-3">📋</div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
                      Install the Extension First
                    </h3>
                    <p className="text-blue-800 dark:text-blue-300 mb-4">
                      To see the performance heatmaps on this demo page, you need to install the Performance Heatmapper extension.
                      The colored overlays and performance metrics will appear over the slow components below.
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      <a
                        href="/download"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <span className="mr-2">⬇️</span>
                        Download Extension
                      </a>
                      <button
                        onClick={() => setShowExtensionHelp(false)}
                        className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm"
                      >
                        I already have it installed
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowExtensionHelp(false)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Demo Instructions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              How to Use This Demo
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  🎯 What to Look For
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">🔴</span>
                    Red overlays indicate severe performance issues (&gt;100ms)
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">🟠</span>
                    Orange overlays show moderate issues (50-100ms)
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">🟡</span>
                    Yellow overlays highlight minor issues (16-50ms)
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">🟢</span>
                    Green overlays indicate good performance (&lt;16ms)
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  🔧 Extension Controls
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                  <li>• Click the extension icon to open the control panel</li>
                  <li>• Toggle the heatmap on/off with the switch</li>
                  <li>• Adjust thresholds to make it more/less sensitive</li>
                  <li>• Hover over overlays to see detailed metrics</li>
                  <li>• Export performance data for analysis</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Demo Components */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Performance Issue Examples
              </h2>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <SlowComponent delay={150}>
                    <p className="text-sm">
                      This component intentionally blocks the main thread for 150ms during rendering.
                      The extension should detect this as a performance issue.
                    </p>
                  </SlowComponent>

                  <ExpensiveComponent>
                    <p className="text-sm">
                      This component uses expensive CSS properties like filters, transforms, and backdrop-filter
                      that can impact rendering performance.
                    </p>
                  </ExpensiveComponent>

                  <AnimationComponent />
                </div>

                <div className="space-y-6">
                  <LargeListComponent />

                  <MemoryLeakComponent />

                  <SlowComponent delay={75}>
                    <p className="text-sm">
                      Another slow component with 75ms render time. Multiple slow components
                      can compound performance issues.
                    </p>
                  </SlowComponent>
                </div>
              </div>
            </div>

            {/* Framework Detection Demo */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Framework Detection
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-xl mr-2">⚛️</span>
                    <span className="font-semibold text-blue-900 dark:text-blue-300">React Component</span>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    This page is built with React (Next.js). The extension should detect React components
                    and show framework indicators.
                  </p>
                </div>

                <div className="p-4 border border-gray-200 bg-gray-50 dark:bg-gray-700 rounded-lg opacity-60">
                  <div className="flex items-center mb-2">
                    <span className="text-xl mr-2">🅰️</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Angular Component</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Not available on this page. Visit an Angular application to see Angular-specific detection.
                  </p>
                </div>

                <div className="p-4 border border-gray-200 bg-gray-50 dark:bg-gray-700 rounded-lg opacity-60">
                  <div className="flex items-center mb-2">
                    <span className="text-xl mr-2">🅥</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Vue Component</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Not available on this page. Visit a Vue.js application to see Vue-specific detection.
                  </p>
                </div>
              </div>
            </div>

            {/* Testing Instructions */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-8 border border-green-200 dark:border-green-800">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Test the Extension
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Actions to Try
                  </h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    <li>• Scroll up and down the page</li>
                    <li>• Start and stop animations</li>
                    <li>• Trigger the memory leak and observe changes</li>
                    <li>• Resize your browser window</li>
                    <li>• Switch between browser tabs</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Expected Results
                  </h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    <li>• Slow components should show red/orange overlays</li>
                    <li>• Metrics should update in real-time</li>
                    <li>• Framework detection should show React indicators</li>
                    <li>• Tooltips should provide detailed information</li>
                    <li>• Export should generate performance data</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="text-center">
              <div className="flex gap-4 justify-center flex-col sm:flex-row">
                <a
                  href="/download"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Download Extension
                </a>
                <a
                  href="/"
                  className="border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  ← Back to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}