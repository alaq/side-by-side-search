const engineMap = {
    Google: "https://google.com/search?igu=1&ei=&q=",
    Brave: "https://search.brave.com/search?q=",
    DuckDuckGo: "https://duckduckgo.com/?q=",
    Startpage: "https://www.startpage.com/do/dsearch?query=",
};

const loadFrames = () => {
    const params = new URLSearchParams(window.location.search);
    document.getElementById("left-frame").src = engineMap[params.get("left")] + params.get("q");
    document.getElementById("right-frame").src = engineMap[params.get("right")] + params.get("q");
};

document.addEventListener("DOMContentLoaded", loadFrames);
