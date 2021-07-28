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
        const x = window.scrollX;
        const y = window.scrollY;
        console.log("scroll", x, y);
        scrollPort.postMessage({ x, y });
    });

    window.addEventListener("focus", function () {
        focused = true;
    });

    window.addEventListener("blur", function () {
        focused = false;
    });

    scrollPort.onMessage.addListener(function (msg) {
        if ((msg.y || msg.x) && !focused) {
            console.log("scroll received:" + msg.x + "," + msg.y);
            window.scroll(msg.x, msg.y);
        }
    });
}
