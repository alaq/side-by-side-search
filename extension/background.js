const HEADERS_TO_STRIP_LOWERCASE = ["content-security-policy", "x-frame-options"];

chrome.webRequest.onHeadersReceived.addListener(
    (details) => {
        if (
            (details?.documentUrl &&
                details.documentUrl.includes("https://side-by-side-search.vercel.app/search.html?q=")) ||
            details.initiator === "https://side-by-side-search.vercel.app"
        ) {
            return {
                responseHeaders: details.responseHeaders.filter(
                    (header) => !HEADERS_TO_STRIP_LOWERCASE.includes(header.name.toLowerCase())
                ),
            };
        }
    },
    {
        urls: ["<all_urls>"],
    },
    ["blocking", "responseHeaders", chrome.webRequest.OnSendHeadersOptions.EXTRA_HEADERS].filter(Boolean)
);

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install" || details.reason === "update") {
        showSearchPage();
    }
});

// This is taken from https://www.gmass.co/blog/redirect-user-to-website-after-installing-chrome-extension/
function showSearchPage() {
    chrome.windows.getAll({ populate: true }, (windows) => {
        let foundExisting = false;
        windows.forEach((win) => {
            win.tabs.forEach((tab) => {
                // Ignore tabs not matching the target.
                if (!/https:\/\/side-by-side-search\.vercel\.app/.test(tab.url)) return;
                // Reload the matching tab.
                chrome.tabs.reload(tab.id);
                if (!foundExisting) {
                    chrome.tabs.update(tab.id, { active: true });
                }
                foundExisting = true;
            });
        });
        if (!foundExisting) {
            chrome.tabs.create({
                url: "https://side-by-side-search.vercel.app/",
                active: true,
            });
        }
    });
}
