document.addEventListener('DOMContentLoaded', function() {
    const detailsContainer = document.getElementById('details-container');
    const urlParams = new URLSearchParams(window.location.search);
    
    // Field labels mapping
    const fieldLabels = {
        first: 'First Name',
        last: 'Last Name',
        email: 'Email Address',
        phone: 'Phone Number',
        age: 'Age',
        experience: 'Years of Experience',
        style: 'Lesson Focus',
        frequency: 'Lesson Frequency',
        notes: 'Additional Notes'
    };

    if (urlParams.size > 0) {
        urlParams.forEach((value, key) => {
            if (value && fieldLabels[key]) {
                createDetailElement(fieldLabels[key], value);
            }
        });
    } else if (localStorage.getItem('formData')) {
        const formData = JSON.parse(localStorage.getItem('formData'));
        for (const key in formData) {
            if (formData[key] && fieldLabels[key]) {
                createDetailElement(fieldLabels[key], formData[key]);
            }
        }
        localStorage.removeItem('formData');
    } else {
        detailsContainer.innerHTML = '<p class="detail-value">No submission data found.</p>';
    }

    function createDetailElement(label, value) {
        const detailItem = document.createElement('div');
        detailItem.className = 'detail-item';
        
        const labelElement = document.createElement('span');
        labelElement.className = 'detail-label';
        labelElement.textContent = label;
        
        const valueElement = document.createElement('span');
        valueElement.className = 'detail-value';
        
        // Format specific values
        if (label === 'Lesson Focus') {
            valueElement.textContent = formatLessonStyle(value);
        } else if (label === 'Lesson Frequency') {
            valueElement.textContent = formatFrequency(value);
        } else {
            valueElement.textContent = value;
        }
        
        detailItem.appendChild(labelElement);
        detailItem.appendChild(valueElement);
        detailsContainer.appendChild(detailItem);
    }

    function formatLessonStyle(style) {
        const styles = {
            'classical': 'Classical Violin',
            'jazz': 'Jazz Violin',
            'covers': 'Covers Violin',
            'performing': 'Performing Violin'
        };
        return styles[style] || style;
    }

    function formatFrequency(freq) {
        const frequencies = {
            'weekly': 'Weekly',
            'biweekly': 'Bi-weekly',
            'monthly': 'Monthly',
            'intensive': 'Intensive (multiple per week)'
        };
        return frequencies[freq] || freq;
    }
});