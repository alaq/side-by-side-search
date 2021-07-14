const loadFrames = () => {
    const params = new URLSearchParams(window.location.search);
    document.getElementById("left-frame").src = "https://search.brave.com/search?q=" + params.get("q");
    document.getElementById("right-frame").src = "https://google.com/search?igu=1&ei=&q=" + params.get("q");
};

document.addEventListener("DOMContentLoaded", loadFrames);
