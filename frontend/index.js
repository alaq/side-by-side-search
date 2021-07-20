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
        document.getElementById(
            "install-text"
        ).innerHTML = `💡 Now, install <b>Side-by-side search</b> as a search engine in Chrome:
        <ul>
            <li>
                - Go to
                <a
                    href="chrome://settings/searchEngines"
                    class="font-medium text-indigo-600 hover:text-indigo-500"
                    >chrome://settings/searchEngines</a
                >.
            </li>
            <li>
                - Find <b>Side-by-side Search</b>, click on the three dots and select <b>Make
                default</b>.
            </li>
        </ul>`;
    } else {
        document.getElementById(
            "install-text"
        ).innerHTML = `💡 Now, install <b>Side-by-side search</b> as a search engine in Firefox:
        <ul>
            <li>- Right click in the address bar and select <b>Add Side-by-side Search</b>.</li>
            <li>
                - Go to
                <a
                    href="about:preferences#search"
                    class="font-medium text-indigo-600 hover:text-indigo-500"
                    >about:preferences#search</a
                >
                and under <b>Default Search Engine</b>, select <b>Side-by-side Search</b>.
            </li>
        </ul>`;
    }
};

window.onload = () => {
    loadPreferences();
    loadInstructions();
};
