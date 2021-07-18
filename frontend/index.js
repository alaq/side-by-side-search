const savePreferences = () => {
    const enginePreferences = {
        left: document.getElementById("left").value,
        right: document.getElementById("right").value,
    };
    localStorage.setItem("engines", JSON.stringify(enginePreferences));
};

const loadPreferences = () => {
    const engines = JSON.parse(localStorage.getItem("engines"));
    document.getElementById("left").value = engines.left;
    document.getElementById("right").value = engines.right;
};

window.onload = () => {
    loadPreferences();
};
