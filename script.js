const $ = id => document.getElementById(id);  // shortcut function. Ex: Instead of- document.getElementById("qrText"). we can use $("qrText")

let format = $("formatSelect").value;  //current download format (png/jpg/svg)
let isGenerated = false;    //checks if QR is created or not

const hamburger = document.getElementById("hamburger");
const navMenu = document.querySelector(".nav-menu ul");
const navItems = document.querySelectorAll(".nav-menu a");

hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

//Close menu when link clicked
navItems.forEach(item => {
    item.addEventListener("click", () => {
       navMenu.classList.remove("active");
    });
});

function generateQR() {
    const text = $("qrText").value.trim();  //Get user text
    if (!text) {
        alert("Please enter text or URL");
        return;
    }

    const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}&format=${format}&size=200x200&ecc=H`;

    //Show QR. Image source becomes API URL → QR appears.
    $("qrImage").src = url;
    $("qrSection").classList.remove("hide");

    //Before generation dropdown is disabled. After generation dropdown is enabled
    if (!isGenerated) {
        $("formatSelect").disabled = false;
        isGenerated = true;
    }
}

$("generateBtn").onclick = generateQR;
$("qrText").addEventListener("keydown", e => {
    if (e.key === "Enter") generateQR();
});

$("formatSelect").addEventListener("change", e => {
    format = e.target.value;
    if (isGenerated) generateQR();
});

$("downloadBtn").onclick = async () => {
    if (!isGenerated) {
        alert("Generate a QR code first");
        return;
    }

    const imgUrl = $("qrImage").src;
    try {
        const response = await fetch(imgUrl);
        const blob = await response.blob();  //blob = image file data

        //Creates a temporary download link.
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `QR-Code.${format}`;

        //This forces browser to download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch {
        alert("Download failed. Try again.");
    }
};