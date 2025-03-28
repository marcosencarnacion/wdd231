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

    // Fetch Spotlight Members from JSON file
    async function fetchSpotlights() {
        try {
            const response = await fetch('members.json');
            if (response.ok) {
                const membersData = await response.json();
                console.log(membersData);
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
            <div class="spotlight-card">
                <img src="${member.image}" alt="${member.name} Logo">
                <h3>${member.name}</h3>
                <p><strong>Address:</strong> ${member.address}</p>
                <p><strong>Phone:</strong> ${member.phone}</p>
                <p><strong>Membership:</strong> ${member.membership}</p>
                <a href="${member.website}" target="_blank">Visit Website</a>
            </div>
        `;

            spotlightContainer.appendChild(spotlightDiv);
        });
    }

    fetchSpotlights();


    // Constant variables
    const openButton1 = document.querySelector("#openButton1");
    const dialogBox1 = document.querySelector("#dialogBox1");
    const closeButton1 = document.querySelector("#closeButton1");

    const openButton2 = document.querySelector("#openButton2");
    const dialogBox2 = document.querySelector("#dialogBox2");
    const closeButton2 = document.querySelector("#closeButton2");

    const openButton3 = document.querySelector("#openButton3");
    const dialogBox3 = document.querySelector("#dialogBox3");
    const closeButton3 = document.querySelector("#closeButton3");

    const openButton4 = document.querySelector("#openButton4");
    const dialogBox4 = document.querySelector("#dialogBox4");
    const closeButton4 = document.querySelector("#closeButton4");

    // "Show the dialog" button opens the dialog modally
    openButton1.addEventListener("click", () => {
        dialogBox1.showModal();
    });

    openButton2.addEventListener("click", () => {
        dialogBox2.showModal();
    });

    openButton3.addEventListener("click", () => {
        dialogBox3.showModal();
    });

    openButton4.addEventListener("click", () => {
        dialogBox4.showModal();
    });


    // "Close" button closes the dialog
    closeButton1.addEventListener("click", () => {
        dialogBox1.close();
    });

    closeButton2.addEventListener("click", () => {
        dialogBox2.close();
    });

    closeButton3.addEventListener("click", () => {
        dialogBox3.close();
    });

    closeButton4.addEventListener("click", () => {
        dialogBox4.close();
    });


});

document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = 'Last modified: ' + document.lastModified;