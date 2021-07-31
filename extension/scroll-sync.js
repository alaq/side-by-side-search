let scrollLock = false;
let scrollSyncEnabled = false;

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

    document.addEventListener("scroll", function () {
        if (!scrollLock && scrollSyncEnabled) {
            const x = window.scrollX;
            const y = window.scrollY;
            scrollPort.postMessage({ x, y });
            scrollLock = false;
        }
    });

    scrollPort.onMessage.addListener((message) => {
        if (message.y || message.x) {
            scrollLock = true;
            window.scroll(message.x, message.y);
        }
    });
}

window.addEventListener("message", (event) => {
    scrollSyncEnabled = JSON.parse(event.data.scrollSync) ?? true;
});

window.onload = () => {
    console.log(
        Array.from(document.getElementsByTagName("a"))
            .map((a) => a.href)
            .filter((url) => !url.includes("google.com") && !url.includes("googleusercontent.com") && url !== "")
    );
};
