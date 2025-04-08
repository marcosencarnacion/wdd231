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
    // Footer: Display the current year and the last modified date
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
});

document.getElementById("generateTip").addEventListener("click", function () {
    const randomIndex = Math.floor(Math.random() * tips.length);
    document.getElementById("tipDisplay").textContent = tips[randomIndex];
});

let remainingTips = [...tips];

document.getElementById("generateSaying").addEventListener("click", () => {
    const display = document.getElementById("sayingDisplay");

    if (remainingTips.length === 0) {
        display.textContent = "✅ You've seen all the tips! Refresh the page to start over.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * remainingTips.length);
    const tip = remainingTips.splice(randomIndex, 1)[0]; // Remove and store the tip
    display.textContent = tip;

    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const navContainer = document.getElementById('navContainer');

    menuToggle.addEventListener('click', function () {
        navContainer.classList.add('active');
    });

    closeMenu.addEventListener('click', function () {
        navContainer.classList.remove('active');
    });

});
