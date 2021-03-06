const engineMap = {
    Google: "https://google.com/search?igu=1&ei=&q=",
    Brave: "https://search.brave.com/search?q=",
    DuckDuckGo: "https://duckduckgo.com/?q=",
    Startpage: "https://www.startpage.com/do/dsearch?query=",
};

const loadFrames = () => {
    const params = new URLSearchParams(window.location.search);
    document.title = params.get("q") + " - Side-by-side Search";
    document.getElementById("left-frame").src = engineMap[params.get("left")] + params.get("q");
    document.getElementById("right-frame").src = engineMap[params.get("right")] + params.get("q");
    const isSyncScrollEnabled = localStorage.getItem("syncScroll");

    const sendSettingToFrames = () => {
        Array.from(window.frames).forEach((frame) => {
            if (frame.postMessage) {
                frame.postMessage({ scrollSync: isSyncScrollEnabled }, "*");
            }
        });
    };

    setTimeout(sendSettingToFrames, 100);
    setTimeout(sendSettingToFrames, 300);
    setTimeout(sendSettingToFrames, 600);
    setTimeout(sendSettingToFrames, 1000);
    setTimeout(sendSettingToFrames, 2000);
};

document.addEventListener("DOMContentLoaded", loadFrames);
