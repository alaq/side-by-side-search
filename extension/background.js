const HEADERS_TO_STRIP_LOWERCASE = ["content-security-policy", "x-frame-options"];

const BASE_URL = "https://side-by-side-search.vercel.app/";

const DEV_URL = null; // "file:///Users/adrien/git/side-by-side-search/frontend/search.html";

const engineMap = {
    Google: "https://google.com/search?igu=1&ei=&q=",
    Brave: "https://search.brave.com/search?q=",
    DuckDuckGo: "https://duckduckgo.com/?q=",
    Startpage: "https://www.startpage.com/do/dsearch?query=",
};

chrome.webRequest.onHeadersReceived.addListener(
    (details) => {
        if (
            (details?.documentUrl && details.documentUrl.includes(BASE_URL + "search.html?q=")) ||
            details.initiator === BASE_URL
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
                url: BASE_URL,
                active: true,
            });
        }
    });
}

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    if (details.parentFrameId === 0 && !Object.values(engineMap).some((engineUrl) => details.url.includes(engineUrl))) {
        chrome.tabs.get(details.tabId, (tab) => {
            if (tab.url.includes(DEV_URL || BASE_URL + "search.html")) {
                chrome.tabs.update(details.tabId, { url: details.url });
            }
        });
        return true;
    }
});
