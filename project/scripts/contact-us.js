document.addEventListener('DOMContentLoaded', function () {
    // Set timestamp
    document.getElementById('timestamp').value = new Date().toISOString();

    // Classical dialog
    const classicalOpen = document.getElementById('openClassical');
    const classicalDialog = document.getElementById('classicalDialog');
    const classicalClose = document.getElementById('closeClassical');

    classicalOpen.addEventListener('click', () => classicalDialog.showModal());
    classicalClose.addEventListener('click', () => classicalDialog.close());

    // Jazz dialog
    const jazzOpen = document.getElementById('openJazz');
    const jazzDialog = document.getElementById('jazzDialog');
    const jazzClose = document.getElementById('closeJazz');

    jazzOpen.addEventListener('click', () => jazzDialog.showModal());
    jazzClose.addEventListener('click', () => jazzDialog.close());

    // Covers dialog
    const coversOpen = document.getElementById('openCovers');
    const coversDialog = document.getElementById('coversDialog');
    const coversClose = document.getElementById('closeCovers');

    coversOpen.addEventListener('click', () => coversDialog.showModal());
    coversClose.addEventListener('click', () => coversDialog.close());

    // Performing dialog
    const performingOpen = document.getElementById('openPerforming');
    const performingDialog = document.getElementById('performingDialog');
    const performingClose = document.getElementById('closePerforming');

    performingOpen.addEventListener('click', () => performingDialog.showModal());
    performingClose.addEventListener('click', () => performingDialog.close());

    // Close dialogs when clicking outside
    [classicalDialog, jazzDialog, coversDialog, performingDialog].forEach(dialog => {
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) dialog.close();
        });
    });

    // Get the selected type from URL
    const params = new URLSearchParams(window.location.search);
    const selectedType = params.get('type'); // 'classical', 'jazz', etc.

    if (selectedType) {
        const radioToCheck = document.querySelector(`input[name="style"][value="${selectedType}"]`);
        if (radioToCheck) {
            radioToCheck.checked = true;
        }
    }
});