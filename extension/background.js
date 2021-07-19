const HEADERS_TO_STRIP_LOWERCASE = ["content-security-policy", "x-frame-options"];

chrome.webRequest.onHeadersReceived.addListener(
    (details) => ({
        responseHeaders: details.responseHeaders.filter(
            (header) => !HEADERS_TO_STRIP_LOWERCASE.includes(header.name.toLowerCase())
        ),
    }),
    {
        urls: ["<all_urls>"],
    },
    ["blocking", "responseHeaders"]
);

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install" || details.reason === "update") {
        refreshBrowser("gmail-inbox", true);
    }
});

// This is taken from https://www.gmass.co/blog/redirect-user-to-website-after-installing-chrome-extension/
function refreshBrowser(target, bringToForeground) {
    if (target !== "gmail-inbox") return;
    chrome.windows.getAll({ populate: true }, (windows) => {
        let foundExisting = false;
        windows.forEach((win) => {
            win.tabs.forEach((tab) => {
                // Ignore tabs not matching the target.
                if (target === "gmail-inbox") {
                    if (!/https:\/\/side-by-side-search\.vercel\.app/.test(tab.url)) return;
                } else {
                    return; // Unknown target.
                }
                // Reload the matching tab.
                chrome.tabs.reload(tab.id); // If this is the first one found, activate it.
                if (bringToForeground && !foundExisting) {
                    chrome.tabs.update(tab.id, { active: true });
                }
                foundExisting = true;
            });
        });
        if (bringToForeground && !foundExisting) {
            chrome.tabs.create({
                url: "https://side-by-side-search.vercel.app/",
                active: true,
            });
        }
    });
}
