import { sites } from "../data/sites.mjs";

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("discover-container");

    sites.forEach((site, index) => {
        const card = document.createElement("div");
        card.classList.add("discover-card");

        card.innerHTML = `
            <figure>
                <img src="${site.image}" alt="${site.name}" width="300" height="200" loading="lazy" class="lazy-load">
            </figure>
            <h2>${site.name}</h2>
            <address>${site.address}</address>
            <p>${site.description}</p>
            <button onclick="location.href='#'">Learn More</button>
        `;

        container.appendChild(card);
    });

    // Visitor message functionality
    function showVisitorMessage() {
        const now = Date.now();
        const lastVisit = localStorage.getItem('lastVisit');
        const visitorMessage = document.getElementById('visitor-message');

        if (!lastVisit) {
            visitorMessage.textContent = "Welcome! Let us know if you have any questions.";
        } else {
            const daysBetween = Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24));

            if (daysBetween === 0) {
                visitorMessage.textContent = "Back so soon! Awesome!";
            } else {
                const dayText = daysBetween === 1 ? "day" : "days";
                visitorMessage.textContent = `You last visited ${daysBetween} ${dayText} ago.`;
            }
        }

        // Store the current visit time
        localStorage.setItem('lastVisit', now);
    }

    // Call the function when page loads
    showVisitorMessage();
});
console.log(document.querySelectorAll('.discover-card').length);