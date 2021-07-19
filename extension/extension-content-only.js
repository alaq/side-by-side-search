if (!document.URL.includes("search.html")) {
    document.getElementsByTagName("form")[0].classList.remove("hidden");
    Array.from(document.getElementsByClassName("extension-stores")).forEach((image) => image.classList.add("hidden"));
    if (!localStorage.getItem("hideInstallationInstructions")) {
        document.getElementById("installation-notification").classList.remove("hidden");
    }
}
