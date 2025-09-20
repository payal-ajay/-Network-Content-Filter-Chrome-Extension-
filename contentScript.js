// Hybrid Ad-Blocker Script

// Safe selectors (low risk)
const safeSelectors = [
  '.adsbygoogle',
  '.advertisement',
  '.sponsored',
  'iframe[src*="ads"]',
  'iframe[src*="doubleclick"]',
  'div[id^="ad-"]',
  'div[class^="ad-"]',
  'section[class*="sponsored"]',
  'div[data-ad]'
];

// Aggressive selectors (risky - highlight instead of removing by default)
const aggressiveSelectors = [
  '[id*="ad"]',
  '[class*="ad"]'
];

// Hide elements
const hideElements = (selectors) => {
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.style.display = "none";
    });
  });
};

// Highlight suspicious ads instead of removing
const highlightElements = (selectors) => {
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.style.outline = "2px solid red"; // mark it
      el.style.backgroundColor = "rgba(255,0,0,0.05)";
    });
  });
};

// Run blocker
const runAdBlock = (settings) => {
  // Skip if whitelisted
  if (settings.adblockWhitelist && settings.adblockWhitelist.includes(location.hostname)) {
    return;
  }

  // Always hide safe ads
  hideElements(safeSelectors);

  // In aggressive mode -> hide aggressive too
  if (settings.aggressiveAdblock) {
    hideElements(aggressiveSelectors);
  } else {
    // Otherwise just highlight them
    highlightElements(aggressiveSelectors);
  }

  // Keep watching for dynamically loaded ads
  const observer = new MutationObserver(() => {
    hideElements(safeSelectors);
    if (settings.aggressiveAdblock) {
      hideElements(aggressiveSelectors);
    } else {
      highlightElements(aggressiveSelectors);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
};

// Load user settings
chrome.storage.sync.get(["aggressiveAdblock", "adblockWhitelist"], (settings) => {
  runAdBlock(settings);
});
