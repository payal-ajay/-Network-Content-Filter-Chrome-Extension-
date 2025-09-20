const allowedDomainRegex = /^https?:\/\/([a-zA-Z0-9-]+\.)*([a-zA-Z0-9-]+)\.(com|org)(\/.*)?$/i
;

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return;

  const url = details.url;
  if (!url.startsWith("http")) return;

  chrome.storage.sync.get(["whitelist", "enabled", "blockMode", "blockedCount"], (data) => {
    const enabled = data.enabled !== false;   // default true
    const blockMode = data.blockMode || "redirect";
    const whitelist = data.whitelist || [];

    if (!enabled) return;

    let hostname = '';
    try { hostname = new URL(url).hostname; } catch {}

    const isWhitelisted = whitelist.includes(hostname);

    if (!isWhitelisted && !allowedDomainRegex.test(url)) {
      if (blockMode === "redirect") {
        chrome.tabs.update(details.tabId, {
          url: chrome.runtime.getURL("blocked.html") + "?url=" + encodeURIComponent(url)
        }).catch(() => {});
      } else {
        console.log("Blocked access to:", url);
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon.png",
          title: "Blocked Domain",
          message: `Access blocked to: ${url}`,
        });
      }
      chrome.storage.sync.set({ blockedCount: (data.blockedCount || 0) + 1 });
    }
  });
});
