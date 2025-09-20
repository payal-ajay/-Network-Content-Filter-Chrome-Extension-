// Popup script for URL Control Extension

// DOM elements
const toggleExtension = document.getElementById("toggleExtension");
const blockMode = document.getElementById("blockMode");
const currentSiteEl = document.getElementById("currentSite");
const whitelistBtn = document.getElementById("whitelistBtn");
const resetBtn = document.getElementById("resetBtn");
const blockedCountEl = document.getElementById("blockedCount");
const whitelistedCountEl = document.getElementById("whitelistedCount");
const whitelistEl = document.getElementById("whitelist");
const aggressiveToggle = document.getElementById("toggleAggressiveAdblock");
const whitelistAdblockBtn = document.getElementById("whitelistAdblockBtn");

let currentDomain = "";

// Load settings from storage
chrome.storage.sync.get(["enabled", "blockMode", "blockedCount", "whitelistedCount", "whitelist", "aggressiveAdblock", "adblockWhitelist"], (data) => {
  toggleExtension.checked = data.enabled ?? true;
  blockMode.value = data.blockMode || "redirect";
  blockedCountEl.textContent = data.blockedCount || 0;
  whitelistedCountEl.textContent = data.whitelistedCount || 0;

  // Whitelist display
  (data.whitelist || []).forEach(site => addWhitelistEntry(site));

  // Aggressive adblock toggle
  aggressiveToggle.checked = !!data.aggressiveAdblock;
});

// Get current tab domain
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs.length > 0) {
    try {
      const url = new URL(tabs[0].url);
      currentDomain = url.hostname;
      currentSiteEl.textContent = currentDomain;
    } catch {
      currentSiteEl.textContent = "Unknown";
    }
  }
});

// Update settings on toggle
toggleExtension.addEventListener("change", (e) => {
  chrome.storage.sync.set({ enabled: e.target.checked });
});

blockMode.addEventListener("change", (e) => {
  chrome.storage.sync.set({ blockMode: e.target.value });
});

resetBtn.addEventListener("click", () => {
  chrome.storage.sync.set({ blockedCount: 0, whitelistedCount: 0 }, () => {
    blockedCountEl.textContent = 0;
    whitelistedCountEl.textContent = 0;
  });
});

// Whitelist current site
whitelistBtn.addEventListener("click", () => {
  if (!currentDomain) return;
  chrome.storage.sync.get("whitelist", (data) => {
    const list = data.whitelist || [];
    if (!list.includes(currentDomain)) {
      list.push(currentDomain);
      chrome.storage.sync.set({ whitelist: list, whitelistedCount: (data.whitelistedCount || 0) + 1 }, () => {
        addWhitelistEntry(currentDomain);
        whitelistedCountEl.textContent = (parseInt(whitelistedCountEl.textContent) || 0) + 1;
      });
    }
  });
});

// Aggressive adblock toggle
aggressiveToggle.addEventListener("change", (e) => {
  chrome.storage.sync.set({ aggressiveAdblock: e.target.checked });
});

// Adblock site whitelist
whitelistAdblockBtn.addEventListener("click", () => {
  if (!currentDomain) return;
  chrome.storage.sync.get("adblockWhitelist", (data) => {
    const list = data.adblockWhitelist || [];
    if (!list.includes(currentDomain)) {
      list.push(currentDomain);
      chrome.storage.sync.set({ adblockWhitelist: list }, () => {
        alert(`${currentDomain} will be skipped for AdBlock`);
      });
    }
  });
});

// Add entry to whitelist UI
function addWhitelistEntry(site) {
  const li = document.createElement("li");
  li.textContent = site;

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.className = "remove-btn";
  removeBtn.addEventListener("click", () => {
    chrome.storage.sync.get("whitelist", (data) => {
      const list = data.whitelist || [];
      const newList = list.filter(s => s !== site);
      chrome.storage.sync.set({ whitelist: newList }, () => {
        li.remove();
      });
    });
  });

  li.appendChild(removeBtn);
  whitelistEl.appendChild(li);
}