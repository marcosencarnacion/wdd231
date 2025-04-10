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

    // Display lessons with optimized video loading
    const displayLessons = (lessons) => {
        const grid = document.querySelector('.lessons-grid');
        grid.innerHTML = '';

        lessons.forEach(lesson => {
            const videoId = extractVideoId(lesson.videoUrl);
            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
            const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

            const lessonCard = document.createElement('a');
            lessonCard.className = `lesson-card ${lesson.level.toLowerCase()}`;
            lessonCard.dataset.level = lesson.level.toLowerCase();
            lessonCard.href = youtubeUrl;
            lessonCard.target = "_blank";
            lessonCard.rel = "noopener noreferrer";
            lessonCard.setAttribute('aria-label', `Watch ${lesson.title} on YouTube`);

            lessonCard.innerHTML = `
                <div class="video-thumbnail-container">
                    <img src="${thumbnailUrl}" 
                         alt="${lesson.title} thumbnail" 
                         class="video-thumbnail"
                         loading="lazy"
                         width="320"
                         height="180">
                    <div class="play-overlay">
                        <i class="bi bi-play-circle-fill"></i>
                    </div>
                </div>
                <div class="lesson-info">
                    <h3>${lesson.title}</h3>
                    <div class="lesson-meta">
                        <span><strong>Level:</strong> ${lesson.level}</span>
                        <span><strong>Duration:</strong> ${lesson.duration}</span>
                    </div>
                    <p>${lesson.description}</p>
                    <button class="download-btn" data-resource="${lesson.resourceUrl}" 
                            aria-label="Download resources for ${lesson.title}">
                        Download Resources
                    </button>
                </div>
            `;
            grid.appendChild(lessonCard);
        });

        // Prevent download button from triggering the card link
        setupDownloadButtons();
    };


    // Extract YouTube video ID from URL
    const extractVideoId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Setup video players with click-to-load
    const setupVideoPlayers = () => {
        document.querySelectorAll('.video-container').forEach(container => {
            const playBtn = container.querySelector('.play-button');
            const thumbnail = container.querySelector('.video-thumbnail');

            playBtn.addEventListener('click', () => {
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${thumbnail.dataset.videoId}?autoplay=1&rel=0`;
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allowfullscreen', '');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                container.innerHTML = '';
                container.appendChild(iframe);
            });
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
                e.preventDefault();
                e.stopPropagation(); // Prevent the card link from being triggered
                const resourceUrl = e.target.dataset.resource;
                if (resourceUrl) {
                    window.open(resourceUrl, '_blank');
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

            if (sheetImgs.length === 1) {
                sheetImgs[0].src = tools.sheetMusic.sheet;
            }

            if (playBtn) {
                playBtn.addEventListener('click', () => {
                    sheetMusicAudio.playbackRate = 1;
                    sheetMusicAudio.play();
                });
            }

            if (slowBtn) {
                slowBtn.addEventListener('click', () => {
                    sheetMusicAudio.playbackRate = 0.75;
                    sheetMusicAudio.play();
                });
            }

            if (loopBtn) {
                loopBtn.addEventListener('click', () => {
                    sheetMusicAudio.currentTime = 0;
                    sheetMusicAudio.loop = true;
                    sheetMusicAudio.play();
                });
            }

            // ✅ Scale Trainer
            const scaleBtn = document.querySelector('[data-exercise="scales"] .start-exercise');
            if (scaleBtn) {
                scaleBtn.addEventListener('click', () => {
                    const key = document.querySelector('.key-selector').value;
                    const scaleAudio = new Audio(tools.scales[key]);
                    scaleAudio.play();
                });
            }

            // ✅ Rhythm Trainer
            const rhythmBtn = document.querySelector('[data-exercise="rhythm"] .start-exercise');
            if (rhythmBtn) {
                rhythmBtn.addEventListener('click', () => {
                    const tempo = document.querySelector('.tempo-selector').value;
                    const rhythmAudio = new Audio(tools.rhythm[tempo]);
                    rhythmAudio.play();
                });
            }

        } catch (err) {
            console.error("Failed to load interactive tools:", err);
        }

        // 🎵 Metronome Tool
        let bpm = 80;
        let metronomeInterval = null;

        const bpmInput = document.getElementById('bpm');
        const bpmDisplay = document.getElementById('bpm-display');
        const startMetronomeBtn = document.getElementById('start-metronome');
        const stopMetronomeBtn = document.getElementById('stop-metronome');

        const playClick = () => {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.05);
        };

        if (bpmInput && bpmDisplay) {
            bpmInput.addEventListener('input', () => {
                bpm = parseInt(bpmInput.value);
                bpmDisplay.textContent = bpm;
                if (metronomeInterval) {
                    clearInterval(metronomeInterval);
                    metronomeInterval = setInterval(playClick, (60 / bpm) * 1000);
                }
            });
        }

        if (startMetronomeBtn) {
            startMetronomeBtn.addEventListener('click', () => {
                if (!metronomeInterval) {
                    metronomeInterval = setInterval(playClick, (60 / bpm) * 1000);
                }
            });
        }

        if (stopMetronomeBtn) {
            stopMetronomeBtn.addEventListener('click', () => {
                clearInterval(metronomeInterval);
                metronomeInterval = null;
            });
        }
    };

    const init = async () => {
        const lessons = await fetchLessons();
        displayLessons(lessons);
        setupFilterButtons();
        setupInteractiveTools();
        setupDownloadButtons();

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
