const menuBtn = document.getElementById("menu-toggle");
const menu = document.querySelector(".menu-links");

menuBtn.addEventListener("click", () => {
    menu.classList.toggle("active");

    if (menu.classList.contains("active")) {
        menuBtn.textContent = "✖";
    } else {
        menuBtn.textContent = "☰"; 
    }
});


document.getElementById('currentyear').textContent = new Date().getFullYear();

document.getElementById('lastModified').textContent = 'Last modified: ' + document.lastModified;

