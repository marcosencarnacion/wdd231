import { sites } from "../data/sites.mjs";

document.addEventListener("DOMContentLoaded", () => {

    const spotlightContainer = document.querySelector(".spotlights");
    const menuToggle = document.getElementById("menu-toggle");
    const closeMenu = document.getElementById("close-menu");
    const menuLinks = document.querySelector(".menu-links");

    menuToggle.addEventListener("click", () => {
        menuLinks.classList.toggle("active");

        // Change the icon based on menu state
        if (menuLinks.classList.contains("active")) {
            menuToggle.textContent = "✖";
        } else {
            menuToggle.textContent = "☰";
        }

        // Get the current page URL
        const currentPage = window.location.pathname.split("/").pop() || "index.html";

        // Highlight the active page link
        const links = document.querySelectorAll(".menu-links a");
        links.forEach(link => {
            if (link.getAttribute("href") === currentPage) {
                link.classList.add("active-page");
            }
        });
    });

    closeMenu.addEventListener("click", () => {
        menuLinks.classList.remove("active");
        menuToggle.textContent = "☰";
    });

    const container = document.getElementById("discover-container");

    // Create modal element
    const modal = document.createElement("div");
    modal.id = "site-modal";
    modal.classList.add("modal");
    modal.innerHTML = `
    <div class="modal-content">
        <span class="close-modal">&times;</span>
        <div class="modal-header">
            <h2 id="modal-title"></h2>
            <address id="modal-address"></address>
        </div>
        <div class="modal-body">
            <div class="modal-image-container">
                <img id="modal-image" src="" alt="">
            </div>
            <div class="modal-text-content">
                <div id="modal-details" class="modal-details"></div>
                <div id="modal-description" class="modal-description"></div>
            </div>
        </div>
    </div>
    `;

    document.body.appendChild(modal);

    sites.forEach((site, index) => {
        const card = document.createElement("div");
        card.classList.add("discover-card");

        card.innerHTML = `
            <figure>
                <img src="${site.image}" alt="${site.name}" width="300" height="200" loading="lazy">
            </figure>
            <h2>${site.name}</h2>
            <address>${site.address}</address>
            <p>${site.shortDescription || site.description.substring(0, 100)}</p>
            <button class="learn-more" data-site-index="${index}">Learn More</button>
        `;

        container.appendChild(card);
    });

    // Add event listeners to all Learn More buttons
    document.querySelectorAll('.learn-more').forEach(button => {
        button.addEventListener('click', (e) => {
            const siteIndex = e.target.getAttribute('data-site-index');
            const site = sites[siteIndex];
            showModal(site);
        });
    });

    // Close modal when clicking X
    document.querySelector('.close-modal').addEventListener('click', closeModal);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    function showModal(site) {
        // Set basic info
        document.getElementById('modal-title').textContent = site.name;
        document.getElementById('modal-address').textContent = site.address;
        document.getElementById('modal-image').src = site.image;
        document.getElementById('modal-image').alt = site.name;

        // Use detailed description
        document.getElementById('modal-description').textContent = site.detailedDescription;

        // Build details section
        const detailsDiv = document.getElementById('modal-details');
        detailsDiv.innerHTML = '';

        if (site.hours) {
            detailsDiv.innerHTML += `<p><strong>Hours:</strong><br>${site.hours.replace(/\n/g, '<br>')}</p>`;
        }

        if (site.website) {
            detailsDiv.innerHTML += `<p><strong>Website:</strong> <a href="${site.website}" target="_blank">${site.website.replace(/^https?:\/\//, '')}</a></p>`;
        }

        if (site.tip) {
            detailsDiv.innerHTML += `<div class="modal-tip"><strong>Pro Tip:</strong> ${site.tip}</div>`;
        }

        // Show modal
        modal.style.display = "block";
    }

    function closeModal() {
        modal.style.display = "none";
    }


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