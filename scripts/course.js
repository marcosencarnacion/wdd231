document.getElementById('currentyear').textContent = new Date().getFullYear();

document.getElementById('lastModified').textContent = 'Last modified: ' + document.lastModified;

const menuBtn = document.getElementById("menu-toggle");
const menu = document.querySelector(".menu-links");
const closeBtn = document.getElementById("close-menu");

menuBtn.addEventListener("click", () => {
    menu.classList.toggle("active");
    overlay.classList.toggle("active");

    if (menu.classList.contains("active")) {
        menuBtn.textContent = "✖";
    } else {
        menuBtn.textContent = "☰";
    }
});

closeBtn.addEventListener("click", () => {
    menu.classList.remove("active");
    overlay.classList.remove("active");
    menuBtn.textContent = "☰";
});


overlay.addEventListener("click", () => {
    menu.classList.remove("active");
    overlay.classList.remove("active");
    menuBtn.textContent = "☰";
});



