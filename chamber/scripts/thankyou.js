document.addEventListener("DOMContentLoaded", function () {
    // Get the URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    function setTextContent(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        }
    }

    // Display the submitted data with checks
    if (urlParams.has('first') && urlParams.has('last')) {
        setTextContent('full-name', `${urlParams.get('first')} ${urlParams.get('last')}`);
    }

    if (urlParams.has('email')) {
        setTextContent('user-email', urlParams.get('email'));
    }

    if (urlParams.has('phone')) {
        setTextContent('user-phone', urlParams.get('phone'));
    }

    if (urlParams.has('organization')) {
        setTextContent('business-name', urlParams.get('organization'));
    }

    if (urlParams.has('membership')) {
        setTextContent('membership-level', urlParams.get('membership'));
    }

    // Format and display the timestamp with check
    const dateElement = document.getElementById('submission-date');
    if (dateElement) {
        const timestamp = urlParams.get('timestamp') || new Date().toISOString();
        const date = new Date(timestamp);
        dateElement.textContent = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
});