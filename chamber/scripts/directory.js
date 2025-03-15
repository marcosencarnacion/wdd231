document.addEventListener("DOMContentLoaded", () => {
    const directoryContainer = document.querySelector("#directory");
    const toggleButton = document.querySelector("#toggleView");
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

    }

    fetchMembers();

    // Event listener to toggle view
    toggleButton.addEventListener("click", () => {
        isGridView = !isGridView;
        const storedData = JSON.parse(localStorage.getItem("businesses"));
        if (storedData) {
            displayBusinesses(storedData);
        }
    });
});

document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = 'Last modified: ' + document.lastModified;