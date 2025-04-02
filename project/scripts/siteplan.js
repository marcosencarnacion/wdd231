document.addEventListener('DOMContentLoaded', () => {
    // Footer: Display the current year and the last modified date
    const currentYear = new Date().getFullYear();
    document.getElementById('currentyear').textContent = currentYear;

    const lastModified = document.lastModified;
    document.getElementById('lastModified').textContent = `Last updated: ${lastModified}`;
});