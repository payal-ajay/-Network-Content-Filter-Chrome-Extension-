# -Network-Content-Filter-Chrome-Extension-

This project is a browser extension designed to give users granular control over their browsing experience. It combines a URL filter that uses a regex pattern that restricts access to non-.com/.org domains with an in-page ad blocker that offers different levels of aggression. Built for Manifest V3, it provides a seamless and secure experience.

Features
URL Filtering: The extension's core functionality, managed by background.js, automatically blocks URLs that do not end in .com or .org. This behavior can be toggled on or off via the popup UI.

Flexible Blocking Modes: When a URL is blocked, the user can choose one of two modes:

Redirect: The browser automatically navigates the user to a custom blocked.html page, which provides options to go back or whitelist the site.

Notify: A desktop notification is displayed to alert the user that the domain has been blocked.

Dynamic Ad Blocking: The contentScript.js file handles the ad-blocking logic within web pages. It uses a MutationObserver to continuously hide or highlight ads that are loaded dynamically after the initial page load.

Safe Mode: Hides elements that are known to be ads, such as those with classes like .adsbygoogle or .advertisement.

Aggressive Mode: This optional mode targets more generic or risky selectors. In non-aggressive mode, these elements are simply highlighted with a red outline instead of being hidden.

User-Friendly UI: The popup.html and popup.js files create a simple interface that allows users to enable/disable the extension, manage the blocking mode, whitelist sites, and reset counters.

Whitelist Management: Both the URL control and the ad blocker have their own separate whitelists.

Why This Extension?
This extension provides a lightweight, browser-specific alternative to a VPN for certain tasks. A VPN encrypts and routes all your device's internet traffic, which can introduce latency and consume more system resources. This extension, however, works directly within the browser, making it much faster and more efficient for its specific tasks of content filtering and ad blocking.

The two tools are complementary. A VPN provides a foundational layer of privacy and security for your entire device, while this extension offers a convenient layer of content control specifically for your browsing. They can be used together to achieve both broad security and fine-tuned browser management.

File Structure
manifest.json: The central configuration file for the extension.

background.js: The service worker that runs in the background. It listens for navigation events and applies the URL blocking logic.

popup.html, popup.js, popup.css: These files manage the extension's user interface that appears when the icon is clicked.

contentScript.js: A script that is injected into every webpage to handle the ad-blocking logic.

blocked.html: The HTML page displayed when a URL is blocked in "redirect" mode.

Installation
This is a browser extension and must be loaded as an unpacked extension. The process involves enabling developer mode in your browser's extension settings and selecting the project's root folder.

