document.addEventListener("DOMContentLoaded", () => {
    const directoryContainer = document.querySelector("#directory");
    const gridViewBtn = document.querySelector("#gridViewBtn");
    const listViewBtn = document.querySelector("#listViewBtn");
    let isGridView = true;

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

    // Fetch JSON File with Async function
    async function fetchMembers() {
        try {
            const response = await fetch("members.json");
            const data = await response.json();
            localStorage.setItem("members", JSON.stringify(data));
            displayBusinesses(data);
        } catch (error) {
            console.error("Error fetching members:", error);
        }

    }

    // Function to display businesses
    function displayBusinesses(businesses) {
        directoryContainer.innerHTML = "";
        directoryContainer.className = isGridView ? "grid-view" : "list-view";

        businesses.forEach(business => {
            const card = document.createElement("div");
            card.className = "business-card";

            card.innerHTML = `
                <img src="${business.image}" alt="${business.name} Logo">
                <h3>${business.name}</h3>
                <p><strong>Address:</strong> ${business.address}</p>
                <p><strong>Phone:</strong> ${business.phone}</p>
                <p><strong>Membership:</strong> ${business.membership}</p>  
                <a href="${business.website}" target="_blank">Visit Website</a>
                `;

            directoryContainer.appendChild(card);
        });

        gridViewBtn.classList.toggle("active", isGridView);
        listViewBtn.classList.toggle("active", !isGridView);

    }

    gridViewBtn.addEventListener("click", () => {
        isGridView = true;
        displayBusinesses(JSON.parse(localStorage.getItem("members")));
    });

    listViewBtn.addEventListener("click", () => {
        isGridView = false;
        displayBusinesses(JSON.parse(localStorage.getItem("members")));
    });


    // Fetch Spotlight Members from JSON file
    async function fetchSpotlights() {
        try {
            const response = await fetch('members.json');
            if (response.ok) {
                const membersData = await response.json();
                displaySpotlights(membersData);
            } else {
                throw new Error("Failed to fetch member data");
            }
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    }

    // Display Spotlight Ads for Gold and Silver Members
    function displaySpotlights(membersData) {
        // Filter Gold and Silver Members
        const filteredMembers = membersData.filter(member => member.membership === "Gold" || member.membership === "Silver");

        // Randomly select 2 or 3 members to spotlight
        const randomSpotlights = [];
        const numSpotlights = Math.min(3, filteredMembers.length); // Ensure we don't exceed the available members

        while (randomSpotlights.length < numSpotlights && filteredMembers.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredMembers.length);
            randomSpotlights.push(filteredMembers[randomIndex]);
            filteredMembers.splice(randomIndex, 1); // Remove the selected member from the array
        }

        // Render Spotlight Ads
        randomSpotlights.forEach(member => {
            const spotlightDiv = document.createElement("div");
            spotlightDiv.classList.add("spotlight");

            spotlightDiv.innerHTML = `
                    <img src="${member.image}" alt="${member.name} Logo" class="spotlight-image">
                    <h4>${member.name}</h4>
                    <p><strong>Phone:</strong> ${member.phone}</p>
                    <p><strong>Address:</strong> ${member.address}</p>
                    <p><strong>Website:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
                    <p><strong>Membership Level:</strong> ${member.membership}</p>
                `;

            spotlightContainer.appendChild(spotlightDiv);
        });
    }

    fetchSpotlights();
    fetchMembers();

});

document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = 'Last modified: ' + document.lastModified;