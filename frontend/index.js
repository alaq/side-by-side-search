const savePreferences = () => {
    const enginePreferences = {
        left: document.getElementById("left").value,
        right: document.getElementById("right").value,
    };
    setOpensearchUrl(enginePreferences);
    localStorage.setItem("engines", JSON.stringify(enginePreferences));
};

const loadPreferences = () => {
    const engines = JSON.parse(localStorage.getItem("engines"));
    if (engines) {
        setOpensearchUrl(engines);
        document.getElementById("left").value = engines.left;
        document.getElementById("right").value = engines.right;
    }
};

const setOpensearchUrl = ({ left = "Brave", right = "Google" }) => {
    document.querySelector(
        "link[rel=search]"
    ).href = `https://side-by-side-search.vercel.app/api/opensearch.xml?left=${left}&right=${right}`;
};

const hideInstructions = () => {
    localStorage.setItem("hideInstallationInstructions", true);
    document.getElementById("installation-notification").classList.add("hidden");
};

const loadInstructions = () => {
    if (navigator?.userAgent?.includes("Chrome/")) {
        document.getElementById("install-text").innerHTML =
            "💡 Now, install <b>Side-by-side search</b> as a search engine in your browser by right clicking in the address bar, selecting <b>Manage search engine</b> and making <b>Side-by-side Search</b> your default.";
    }
};

window.onload = () => {
    loadPreferences();
    loadInstructions();
};
