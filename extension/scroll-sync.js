let focused = true;

function getFrameDepth(w) {
    if (w === window.top) {
        return 0;
    } else if (w.parent === window.top) {
        return 1;
    }
    return 1 + getFrameDepth(w.parent);
}

if (getFrameDepth(window.self) === 1) {
    document.addEventListener("scroll", function () {
        if (!focused) {
            return;
        }
        var x = window.scrollX;
        var y = window.scrollY;
        console.log("tab sends scrollXY:" + x + "," + y);
        // sync_scroll.port.postMessage({
        //     window_scrollX: x,
        //     window_scrollY: y,
        // });
    });
}
