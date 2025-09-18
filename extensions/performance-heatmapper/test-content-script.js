// Minimal test content script to verify injection works
console.log('🧪 TEST: Content script injected successfully!');
console.log('🧪 TEST: URL:', window.location.href);
console.log('🧪 TEST: Document ready state:', document.readyState);

// Test basic DOM interaction
document.addEventListener('DOMContentLoaded', () => {
  console.log('🧪 TEST: DOMContentLoaded fired');
});

// Test that we can access the page
if (document.body) {
  console.log('🧪 TEST: Document body accessible');
  document.body.style.border = '2px solid red';
  setTimeout(() => {
    document.body.style.border = '';
  }, 2000);
} else {
  console.log('🧪 TEST: Document body NOT accessible');
}

// Test Chrome APIs
if (typeof chrome !== 'undefined' && chrome.runtime) {
  console.log('🧪 TEST: Chrome APIs available');
} else {
  console.log('🧪 TEST: Chrome APIs NOT available');
}

// Create a global marker
window.__testContentScriptLoaded = true;
console.log('🧪 TEST: Global marker set');