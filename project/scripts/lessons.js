document.addEventListener("DOMContentLoaded", () => {
    // API Integration - Fetch lessons from JSON file
    const fetchLessons = async () => {
        try {
            const response = await fetch('data/lessons.json');
            if (!response.ok) {
                throw new Error('Failed to fetch lessons');
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading lessons:', error);
            return [];
        }
    };

    // Display lessons in the grid
    const displayLessons = (lessons) => {
        const grid = document.querySelector('.lessons-grid');
        grid.innerHTML = ''; // Clear loading spinner

        lessons.forEach(lesson => {
            const lessonCard = document.createElement('div');
            lessonCard.className = `lesson-card ${lesson.level.toLowerCase()}`;
            lessonCard.dataset.level = lesson.level.toLowerCase();
            lessonCard.innerHTML = `
                <div class="video-container">
                    <iframe src="${lesson.videoUrl}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen
                            loading="lazy"></iframe>
                </div>
                <div class="lesson-info">
                    <h3>${lesson.title}</h3>
                    <div class="lesson-meta">
                        <span>Level: ${lesson.level}</span>
                        <span>Duration: ${lesson.duration}</span>
                    </div>
                    <p>${lesson.description}</p>
                    <button class="download-btn" data-resource="${lesson.resourceUrl}">
                        Download Resources
                    </button>
                </div>
            `;
            grid.appendChild(lessonCard);
        });
    };

    // Filter lessons by level
    const setupFilterButtons = () => {
        const filterButtons = document.querySelectorAll('.filter-btn');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Get filter level
                const level = button.dataset.level.toLowerCase();
                const allLessons = document.querySelectorAll('.lesson-card');

                // Debugging: Log the filter action
                console.log(`Filtering by: ${level}`);

                allLessons.forEach(lesson => {
                    const lessonLevel = lesson.dataset.level; // Get level from data attribute
                    const shouldShow = level === 'all' || lessonLevel === level;

                    // Debugging: Log each lesson's status
                    console.log(`Lesson: ${lesson.querySelector('h3').textContent}, Level: ${lessonLevel}, Show: ${shouldShow}`);

                    lesson.style.display = shouldShow ? 'block' : 'none';
                });
            });
        });
    };

    // Interactive tools functionality
    const setupInteractiveTools = () => {
        // ... (keep your existing interactive tools code)
    };

    // Initialize the page
    const init = async () => {
        const lessons = await fetchLessons();

        // Debugging: Log loaded lessons
        console.log('Loaded lessons:', lessons);

        displayLessons(lessons);
        setupFilterButtons();
        setupInteractiveTools();

        // Make sure highlightCurrentPage exists or add this:
        if (typeof highlightCurrentPage === 'function') {
            highlightCurrentPage();
        }
    };

    init();
});