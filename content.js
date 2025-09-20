// Lightweight cosmetic ad hiding (kept conservative to avoid breaking sites)
(function () {
  const style = document.createElement("style");
  style.setAttribute("data-url-control-adcss", "true");
  style.textContent = `
    [id*="ad"], [class*="ad"], .sponsored, .advertisement, .adsbox,
    [aria-label*="ad"], [data-testid*="ad"], [data-ad],
    iframe[src*="ads"], iframe[id*="ad"], iframe[class*="ad"] {
      display: none !important;
      visibility: hidden !important;
    }
  `;
  document.documentElement.appendChild(style);
})();
