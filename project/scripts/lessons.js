import { fetchLessons, fetchTools } from './modules/api.js';

document.addEventListener("DOMContentLoaded", () => {
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
                         loading="eager"
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

        setupDownloadButtons();
    };

    const extractVideoId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

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

            button.addEventListener('click', filterLessons);
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    filterLessons();
                }
            });
        });
    };

    const setupDownloadButtons = () => {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('download-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const resourceUrl = e.target.dataset.resource;
                if (resourceUrl) {
                    window.open(resourceUrl, '_blank');
                }
            }
        });
    };

    const setupInteractiveTools = async () => {
        try {
            const tools = await fetchTools();
            if (!tools) return;

            // Sheet Music Controls
            const sheetMusicAudio = new Audio(tools.sheetMusic.audio);

            document.querySelector('.play-btn')?.addEventListener('click', () => {
                sheetMusicAudio.playbackRate = 1;
                sheetMusicAudio.play();
            });
            document.querySelector('.slow-btn')?.addEventListener('click', () => {
                sheetMusicAudio.playbackRate = 0.75;
                sheetMusicAudio.play();
            });
            document.querySelector('.loop-btn')?.addEventListener('click', () => {
                sheetMusicAudio.currentTime = 0;
                sheetMusicAudio.loop = true;
                sheetMusicAudio.play();
            });

            document.querySelector('.stop-btn')?.addEventListener('click', () => {
                sheetMusicAudio.pause();
                sheetMusicAudio.currentTime = 0;
                sheetMusicAudio.loop = false;

            })

            // Scale Trainer
            document.querySelector('[data-exercise="scales"] .start-exercise')?.addEventListener('click', () => {
                const key = document.querySelector('.key-selector').value;
                new Audio(tools.scales[key]).play();
            });

        } catch (err) {
            console.error("Failed to load interactive tools:", err);
        }

        // Metronome Tool
        let bpm = 80;
        let metronomeInterval = null;
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

        document.getElementById('bpm')?.addEventListener('input', (e) => {
            bpm = parseInt(e.target.value);
            document.getElementById('bpm-display').textContent = bpm;
            if (metronomeInterval) {
                clearInterval(metronomeInterval);
                metronomeInterval = setInterval(playClick, (60 / bpm) * 1000);
            }
        });
        document.getElementById('start-metronome')?.addEventListener('click', () => {
            if (!metronomeInterval) {
                metronomeInterval = setInterval(playClick, (60 / bpm) * 1000);
            }
        });
        document.getElementById('stop-metronome')?.addEventListener('click', () => {
            clearInterval(metronomeInterval);
            metronomeInterval = null;
        });
    };

    const init = async () => {
        const lessons = await fetchLessons();
        displayLessons(lessons);
        setupFilterButtons();
        await setupInteractiveTools();

        // Footer dates
        document.getElementById("currentyear").textContent = new Date().getFullYear();
        document.getElementById("lastModified").textContent = `Last updated: ${document.lastModified}`;

        // Highlight current page
        document.querySelectorAll('nav a').forEach(link => {
            if (window.location.pathname.endsWith(new URL(link.href).pathname)) {
                link.classList.add('active');
            }
        });
    };

    init();
});