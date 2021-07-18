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
    setOpensearchUrl(engines);
    document.getElementById("left").value = engines.left;
    document.getElementById("right").value = engines.right;
};

const setOpensearchUrl = ({ left, right }) => {
    document.querySelector(
        "link[rel=search]"
    ).href = `https://side-by-side-search.vercel.app/api/opensearch.xml?left=${left}&right=${right}`;
};

window.onload = () => {
    loadPreferences();
};
