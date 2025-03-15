document.addEventListener("DOMContentLoaded", () => {
    const directoryContainer = document.querySelector("#directory");
    const gridViewBtn = document.querySelector("#gridViewBtn");
    const listViewBtn = document.querySelector("#listViewBtn");
    let isGridView = true;

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
    })

    fetchMembers();

});

document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = 'Last modified: ' + document.lastModified;