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
            console.log("we get in here");
            const x = window.scrollX;
            const y = window.scrollY;
            scrollPort.postMessage({ x, y });
            scrollLock = false;
        }
    });

    scrollPort.onMessage.addListener(function (msg) {
        if (msg.y || msg.x) {
            scrollLock = true;
            window.scroll(msg.x, msg.y);
        }
    });
}

window.addEventListener("message", (event) => {
    scrollSyncEnabled = JSON.parse(event.data.scrollSync) ?? true;
});
