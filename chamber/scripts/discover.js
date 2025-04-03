import { sites } from "../data/sites.mjs";

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("discover-container");

    sites.forEach((site, index) => {
        const card = document.createElement("div");
        card.classList.add("discover-card");

        card.innerHTML = `
            <figure>
                <img src="${site.image}" alt="${site.name}" width="300" height="200">
            </figure>
            <h2>${site.name}</h2>
            <address>${site.address}</address>
            <p>${site.description}</p>
            <button onclick="location.href='#'">Learn More</button>
        `;

        container.appendChild(card);
    });
});
console.log(document.querySelectorAll('.discover-card').length);