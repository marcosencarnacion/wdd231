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

    // Mobile menu functionality
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

    const setupInteractiveTools = async () => {
        try {
            const res = await fetch('data/tools.json');
            const tools = await res.json();

            // Sheet Music Controls
            const sheetMusicAudio = new Audio(tools.sheetMusic.audio);
            const playBtn = document.querySelector('.play-btn');
            const slowBtn = document.querySelector('.slow-btn');
            const loopBtn = document.querySelector('.loop-btn');
            const sheetImgs = document.querySelectorAll('.sheet-pages img');

            // Optional: If using single image, update like this
            if (sheetImgs.length === 1) {
                sheetImgs[0].src = tools.sheetMusic.sheet;
            }

            playBtn.addEventListener('click', () => {
                sheetMusicAudio.playbackRate = 1;
                sheetMusicAudio.play();
            });

            slowBtn.addEventListener('click', () => {
                sheetMusicAudio.playbackRate = 0.75;
                sheetMusicAudio.play();
            });

            loopBtn.addEventListener('click', () => {
                sheetMusicAudio.currentTime = 0;
                sheetMusicAudio.loop = true;
                sheetMusicAudio.play();
            });

            // Scale Trainer
            document.querySelector('[data-exercise="scales"] .start-exercise')
                .addEventListener('click', () => {
                    const key = document.querySelector('.key-selector').value;
                    const scaleAudio = new Audio(tools.scales[key]);
                    scaleAudio.play();
                });

            // Rhythm Trainer
            document.querySelector('[data-exercise="rhythm"] .start-exercise')
                .addEventListener('click', () => {
                    const tempo = document.querySelector('.tempo-selector').value;
                    const rhythmAudio = new Audio(tools.rhythm[tempo]);
                    rhythmAudio.play();
                });

        } catch (err) {
            console.error("Failed to load interactive tools:", err);
        }
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

    const highlightCurrentPage = () => {
        const navLinks = document.querySelectorAll('nav a');
        const currentPath = window.location.pathname;

        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;

            if (currentPath === linkPath || currentPath.endsWith(linkPath)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };
});
