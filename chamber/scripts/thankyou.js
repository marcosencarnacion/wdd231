document.addEventListener("DOMContentLoaded", function() {
    // Get the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // Display the submitted data
    if (urlParams.has('first') && urlParams.has('last')) {
        document.getElementById('full-name').textContent = 
            `${urlParams.get('first')} ${urlParams.get('last')}`;
    }
    
    if (urlParams.has('email')) {
        document.getElementById('user-email').textContent = urlParams.get('email');
    }
    
    if (urlParams.has('phone')) {
        document.getElementById('user-phone').textContent = urlParams.get('phone');
    }
    
    if (urlParams.has('organization')) {
        document.getElementById('business-name').textContent = urlParams.get('organization');
    }
    
    if (urlParams.has('membership')) {
        document.getElementById('membership-level').textContent = urlParams.get('membership');
    }
    
    // Format and display the timestamp
    const timestamp = urlParams.get('timestamp') || new Date().toISOString();
    const date = new Date(timestamp);
    document.getElementById('submission-date').textContent = 
        date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
});