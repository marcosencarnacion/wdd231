document.addEventListener("DOMContentLoaded", () => {
    // Fetch lessons from JSON file
    const fetchLessons = async () => {
        try {
            const response = await fetch('data/lessons.json');
            if (!response.ok) throw new Error('Failed to fetch lessons');
            return await response.json();
        } catch (error) {
            console.error('Error loading lessons:', error);
            return [];
        }
    };

    // Display lessons in a responsive, accessible grid
    const displayLessons = (lessons) => {
        const grid = document.querySelector('.lessons-grid');
        grid.innerHTML = ''; // Clear any existing content

        lessons.forEach(lesson => {
            const lessonCard = document.createElement('article');
            lessonCard.className = `lesson-card ${lesson.level.toLowerCase()}`;
            lessonCard.dataset.level = lesson.level.toLowerCase();
            lessonCard.setAttribute('tabindex', '0');
            lessonCard.setAttribute('role', 'region');
            lessonCard.setAttribute('aria-label', `Lesson: ${lesson.title}`);

            lessonCard.innerHTML = `
                <div class="video-container">
                    <iframe 
                        src="${lesson.videoUrl}" 
                        title="${lesson.title}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                        loading="lazy">
                    </iframe>
                </div>
                <div class="lesson-info">
                    <h3>${lesson.title}</h3>
                    <div class="lesson-meta">
                        <span><strong>Level:</strong> ${lesson.level}</span>
                        <span><strong>Duration:</strong> ${lesson.duration}</span>
                    </div>
                    <p>${lesson.description}</p>
                    <button class="download-btn" data-resource="${lesson.resourceUrl}" aria-label="Download resources for ${lesson.title}">
                        Download Resources
                    </button>
                </div>
            `;
            grid.appendChild(lessonCard);
        });
    };

    // Setup filter buttons with accessibility
    const setupFilterButtons = () => {
        const filterButtons = document.querySelectorAll('.filter-btn');

        filterButtons.forEach(button => {
            button.setAttribute('role', 'button');
            button.setAttribute('tabindex', '0');

            const filterLessons = () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const level = button.dataset.level.toLowerCase();
                const allLessons = document.querySelectorAll('.lesson-card');

                allLessons.forEach(lesson => {
                    const lessonLevel = lesson.dataset.level;
                    const shouldShow = level === 'all' || lessonLevel === level;
                    lesson.style.display = shouldShow ? 'block' : 'none';
                });
            };

            // Click support
            button.addEventListener('click', filterLessons);

            // Keyboard accessibility
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    filterLessons();
                }
            });
        });
    };

    // Setup download buttons to trigger file download
    const setupDownloadButtons = () => {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('download-btn')) {
                const resourceUrl = e.target.dataset.resource;
                if (resourceUrl) {
                    const link = document.createElement('a');
                    link.href = resourceUrl;
                    link.download = ''; // Use the default filename from the URL
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    alert('Resource not available.');
                }
            }
        });
    };

    const setupInteractiveTools = () => {
        // Leave your existing metronome, tuner, etc. logic here
    };

    const init = async () => {
        const lessons = await fetchLessons();
        displayLessons(lessons);
        setupFilterButtons();
        setupInteractiveTools();
        setupDownloadButtons(); // <-- Add this line

        if (typeof highlightCurrentPage === 'function') {
            highlightCurrentPage();
        }
    };

    init();
});
