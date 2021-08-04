let scrollLock = false;
let scrollSyncEnabled = false;
let localUrls;
let sendUrlsAcknowledged = false;
let remoteUrls = [];

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
    setTimeout(() => {
        scrollPort.postMessage({
            urls: (localUrls = getUrlsFromPage()),
        });
    }, 1000);

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
            sendUrlsAcknowledged = message.ack;
        } else if (message.y || message.x) {
            scrollLock = true;
            window.scroll(message.x, message.y);
        } else if (message.urls.length) {
            scrollPort.postMessage({ ack: window.location.host });
            if (message.urls.length > remoteUrls.length) {
                scrollPort.postMessage({
                    urls: getUrlsFromPage(),
                });
            }
            remoteUrls = message.urls;

            let uniqueUrls = getUniqueUrls(localUrls, remoteUrls);

            // Decorate links
            let links = document.getElementsByTagName("a");
            for (let i = 0; i < links.length; i++) {
                if (uniqueUrls.includes(links[i].href)) {
                    links[i].style["background-color"] = "rgba(0,255,255,0.3)";
                    let children = Array.from(links[i].children);
                    while (children.length) {
                        const child = children.shift();
                        child.style["background-color"] = "rgba(0,255,255,0.3)";
                        children.push(...Array.from(child.children));
                    }
                }
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
