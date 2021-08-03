const HEADERS_TO_STRIP_LOWERCASE = ["content-security-policy", "x-frame-options"];
const SEARCH_BASE_URLS = [
    "https://side-by-side-search.vercel.app/",
    "file:///Users/adrien/git/side-by-side-search/frontend/",
];
const BASE_URL = SEARCH_BASE_URLS[0];
const portsMap = {};
const engineMap = {
    Google: "google.com/search?igu=1&ei=&q=",
    Brave: "search.brave.com/search?q=",
    DuckDuckGo: "duckduckgo.com/?q=",
    Startpage: "startpage.com/do/dsearch?query=",
};
let scrollSyncEnabled = false;

const urlIsEngine = (url) => {
    return Object.values(engineMap).some((engineUrl) => url.includes(engineUrl));
};

chrome.webRequest.onHeadersReceived.addListener(
    (details) => {
        if (
            (details?.documentUrl &&
                SEARCH_BASE_URLS.some((baseUrl) => details.documentUrl.includes(baseUrl + "search.html?q="))) ||
            SEARCH_BASE_URLS.filter((baseUrl) => baseUrl === details.initiator).length
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
    if (details.parentFrameId === 0 && !urlIsEngine(details.url)) {
        chrome.tabs.get(details.tabId, (tab) => {
            if (tab.url.includes(BASE_URL + "search.html")) {
                chrome.tabs.update(details.tabId, { url: details.url });
            }
        });
        return true;
    }
});

const sendToSiblingFrame = (port, msg) => {
    chrome.webNavigation.getAllFrames(
        {
            tabId: port.sender.tab.id,
        },
        (frames) => {
            const sendRequest = () => {
                portsMap[
                    frames.filter((f) => {
                        return f.frameId !== port.sender.frameId && f.parentFrameId !== -1;
                    })[0].frameId
                ].postMessage(msg);
            };
            try {
                sendRequest();
            } catch (_) {
                setTimeout(sendRequest, 1000);
            }
        }
    );
};

chrome.runtime.onConnect.addListener(function (port) {
    console.assert(port.name === "scroll");
    portsMap[port.sender.frameId] = port;
    port.onMessage.addListener(function emit(msg) {
        if (msg.y || msg.urls || msg.ack) {
            sendToSiblingFrame(port, msg);
        }
    });
});
