document.getElementsByTagName("form")[0].classList.remove("hidden");
if (!localStorage.getItem("hideInstallationInstructions")) {
    document.getElementById("installation-notification").classList.remove("hidden");
}
