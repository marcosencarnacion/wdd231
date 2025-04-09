const tips = [
    "🎻 Start each practice session with tuning your violin.",
    "🪞 Use a mirror to check your posture and bow hold.",
    "🐢 Practice slowly and increase speed gradually.",
    "🧩 Break difficult pieces into smaller sections.",
    "⏱️ Use a metronome to improve timing and rhythm.",
    "🤲 Keep your wrist relaxed when shifting positions.",
    "🎙️ Record yourself to catch things you might not hear while playing.",
    "🧘‍♀️ Take short breaks to avoid tension or fatigue.",
    "🎶 Always warm up with scales and arpeggios.",
    "👂 Listen to professional violinists to develop your musical ear."
];

document.addEventListener("DOMContentLoaded", () => {
    // 1. Footer dates functionality
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById("currentyear");
    if (yearElement) {
        yearElement.textContent = currentYear;
    }

    const lastModified = document.lastModified;
    const modifiedElement = document.getElementById("lastModified");
    if (modifiedElement) {
        modifiedElement.textContent = `Last updated: ${lastModified}`;
    }

    // 2. Mobile menu functionality
    const openMenu = document.getElementById("open");
    const closeMenu = document.getElementById("close");
    const nav = document.getElementById("nav");

    if (openMenu && closeMenu && nav) {
        openMenu.addEventListener("click", () => {
            nav.classList.add("active");
        });

        closeMenu.addEventListener("click", () => {
            nav.classList.remove("active");
        });
    }

    // 3. Highlight current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-list li a');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        
        // Check if the link href matches the current page
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
        
        // Special case for index.html which might be just '/'
        if (currentPage === '' && linkPage === 'index.html') {
            link.classList.add('active');
        }
    });

    // 4. Violin tip generator
    const generateTipBtn = document.getElementById("generateTip");
    if (generateTipBtn) {
        generateTipBtn.addEventListener("click", function() {
            const randomIndex = Math.floor(Math.random() * tips.length);
            document.getElementById("tipDisplay").textContent = tips[randomIndex];
        });
    }

    // 5. Remaining tips functionality (if generateSaying button exists)
    const generateSayingBtn = document.getElementById("generateSaying");
    if (generateSayingBtn) {
        let remainingTips = [...tips];
        
        generateSayingBtn.addEventListener("click", () => {
            const display = document.getElementById("sayingDisplay");

            if (remainingTips.length === 0) {
                display.textContent = "✅ You've seen all the tips! Refresh the page to start over.";
                return;
            }

            const randomIndex = Math.floor(Math.random() * remainingTips.length);
            const tip = remainingTips.splice(randomIndex, 1)[0];
            display.textContent = tip;
        });
    }
});