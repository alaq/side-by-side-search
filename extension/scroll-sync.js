let scrollLock = false;
let scrollSyncEnabled = false;
let localUrls;
let sendUrlsAcknowledged = false;

const domainsToFilter = [
    "google.com",
    "googleusercontent.com",
    "duckduckgo.com",
    "brave.com",
    "startpage.com",
    "javascript:void(0)",
    "javascript:;",
];

function getFrameDepth(w) {
    if (w === window.top) {
        return 0;
    } else if (w.parent === window.top) {
        return 1;
    }
    return 1 + getFrameDepth(w.parent);
}

if (getFrameDepth(window.self) === 1) {
    const scrollPort = chrome.runtime.connect({ name: "scroll" });

    scrollPort.postMessage({
        urls: (localUrls = getUrlsFromPage()),
    });

    document.addEventListener("scroll", function () {
        if (!scrollLock && scrollSyncEnabled) {
            const x = window.scrollX;
            const y = window.scrollY;
            scrollPort.postMessage({ x, y });
            scrollLock = false;
        }
    });

    scrollPort.onMessage.addListener((message) => {
        if (message.ack) {
            sendUrlsAcknowledged = true;
        } else if (message.y || message.x) {
            scrollLock = true;
            window.scroll(message.x, message.y);
        } else if (message.urls.length) {
            scrollPort.postMessage({ ack: true });
            if (!sendUrlsAcknowledged) {
                scrollPort.postMessage({
                    urls: getUrlsFromPage(),
                });
            }
            remoteUrls = message.urls;

            let uniqueUrls = getUniqueUrls(localUrls, remoteUrls);
            console.log("unique urls on", window.location.host, uniqueUrls);

            // Decorate links
            let links = document.getElementsByTagName("a");
            for (let i = 0; i < links.length; i++) {
                if (uniqueUrls.includes(links[i].href)) links[i].style["background-color"] = "aqua";
            }
        }
    });
}

window.addEventListener("message", (event) => {
    scrollSyncEnabled = JSON.parse(event.data.scrollSync) ?? true;
});

function getUrlsFromPage() {
    return Array.from(document.getElementsByTagName("a"))
        .map((a) => a.href)
        .filter((url) => !domainsToFilter.some((domain) => url.includes(domain)) && url !== "");
}

function getUniqueUrls(localUrls, remoteUrls) {
    return localUrls.filter((a) => {
        return !remoteUrls.includes(a);
    });
}
