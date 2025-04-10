document.addEventListener("DOMContentLoaded", () => {
    // ======================🎶 Tuner Tool ===========================================
    // Note names
    const noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

    // DOM elements
    const startButton = document.getElementById('start-tuner');
    const noteDisplay = document.getElementById('tuner-note');
    const freqDisplay = document.getElementById('tuner-frequency');
    const tunerNeedle = document.getElementById('tuner-needle');

    // Audio variables
    let audioContext;
    let analyser;
    let source;
    let dataArray;
    let isRunning = false;
    let animationId;

    function autoCorrelate(buf, sampleRate) {
        let SIZE = buf.length;
        let rms = 0;

        for (let i = 0; i < SIZE; i++) {
            let val = buf[i];
            rms += val * val;
        }
        rms = Math.sqrt(rms / SIZE);
        if (rms < 0.01) return -1; // too quiet

        let r1 = 0, r2 = SIZE - 1, threshold = 0.2;
        for (let i = 0; i < SIZE / 2; i++) {
            if (Math.abs(buf[i]) < threshold) {
                r1 = i;
                break;
            }
        }
        for (let i = 1; i < SIZE / 2; i++) {
            if (Math.abs(buf[SIZE - i]) < threshold) {
                r2 = SIZE - i;
                break;
            }
        }

        buf = buf.slice(r1, r2);
        SIZE = buf.length;

        const c = new Array(SIZE).fill(0);
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE - i; j++) {
                c[i] = c[i] + buf[j] * buf[j + i];
            }
        }

        let d = 0;
        while (c[d] > c[d + 1]) d++;
        let maxval = -1, maxpos = -1;
        for (let i = d; i < SIZE; i++) {
            if (c[i] > maxval) {
                maxval = c[i];
                maxpos = i;
            }
        }

        let T0 = maxpos;
        return sampleRate / T0;
    }

    function getNote(frequency) {
        const A4 = 440;
        const semitones = 12 * Math.log2(frequency / A4);
        const noteIndex = Math.round(semitones) + 69;
        const note = noteStrings[noteIndex % 12];
        const cents = Math.round((semitones - Math.round(semitones)) * 100);
        return { note, cents };
    }

    function updateTuner() {
        if (!isRunning) return;

        const bufferLength = analyser.fftSize;
        const buffer = new Float32Array(bufferLength);
        analyser.getFloatTimeDomainData(buffer);
        const frequency = autoCorrelate(buffer, audioContext.sampleRate);

        if (frequency !== -1) {
            const { note, cents } = getNote(frequency);
            noteDisplay.textContent = `Note: ${note}`;
            freqDisplay.textContent = `Frequency: ${frequency.toFixed(1)} Hz`;

            // Update needle position based on cents (-50 to +50)
            const needleAngle = Math.min(Math.max(cents * 0.9, -45), 45);
            tunerNeedle.style.transform = `translateX(-50%) rotate(${needleAngle}deg)`;

            // Change needle color based on tuning accuracy
            if (Math.abs(cents) < 5) {
                tunerNeedle.style.backgroundColor = '#4CAF50'; // Green for in-tune
            } else if (Math.abs(cents) < 25) {
                tunerNeedle.style.backgroundColor = '#FFC107'; // Yellow for close
            } else {
                tunerNeedle.style.backgroundColor = '#F44336'; // Red for out-of-tune
            }
        } else {
            noteDisplay.textContent = "Note: --";
            freqDisplay.textContent = "Frequency: -- Hz";
            tunerNeedle.style.transform = 'translateX(-50%) rotate(0deg)';
            tunerNeedle.style.backgroundColor = '#333';
        }

        animationId = requestAnimationFrame(updateTuner);
    }

    async function startTuner() {
        try {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                source = audioContext.createMediaStreamSource(stream);
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 2048;
                dataArray = new Float32Array(analyser.fftSize);
                source.connect(analyser);
            }

            isRunning = true;
            startButton.textContent = "Listening...";
            updateTuner();
        } catch (error) {
            console.error('Error starting tuner:', error);
            noteDisplay.textContent = "Error: Microphone access required";
        }
    }

    function stopTuner() {
        isRunning = false;
        cancelAnimationFrame(animationId);

        if (source) {
            source.disconnect();
            source.mediaStream.getTracks().forEach(track => track.stop());
            source = null;
        }

        audioContext = null;
        analyser = null;

        startButton.textContent = "Start Tuner";
        noteDisplay.textContent = "Note: --";
        freqDisplay.textContent = "Frequency: -- Hz";
        tunerNeedle.style.transform = 'translateX(-50%) rotate(0deg)';
        tunerNeedle.style.backgroundColor = '#333';
    }

    // Event listener
    if (startButton) {
        startButton.addEventListener("click", function () {
            if (isRunning) {
                stopTuner();
            } else {
                startTuner();
            }
        });
    }

    // ======================🎶 Metronome Tool ===========================================
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

        // Visual beat indicator
        const beatIndicator = document.querySelector('.beat-indicator');
        beatIndicator.classList.add('active');
        setTimeout(() => beatIndicator.classList.remove('active'), 100);
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


    // ======================🎻 Violin Fingering Chart ======================

    // Fingering Chart Implementation
    const stringSelect = document.getElementById('string-select');
    const fingerboard = document.getElementById('fingerboard');
    const fingeringNotes = document.getElementById('fingering-notes');

    const notesOnStrings = {
        'G': ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D'],
        'D': ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A'],
        'A': ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E'],
        'E': ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    };

    function renderFingeringChart(string) {
        fingerboard.innerHTML = '';
        fingeringNotes.innerHTML = '';

        // Create fingerboard positions
        for (let i = 0; i < 8; i++) {
            const position = document.createElement('div');
            position.className = 'fingerboard-position';
            position.dataset.position = i;

            if (i === 0) {
                position.textContent = '0';
                position.classList.add('open-string');
            } else {
                position.textContent = i;
                position.classList.add('finger-position');
            }

            fingerboard.appendChild(position);
        }

        // Create note labels
        const notes = notesOnStrings[string];
        notes.forEach((note, index) => {
            const noteElement = document.createElement('div');
            noteElement.className = 'fingering-note';
            noteElement.textContent = note;

            // Highlight natural notes
            if (!note.includes('#')) {
                noteElement.classList.add('natural-note');
            }

            fingeringNotes.appendChild(noteElement);
        });
    }

    if (stringSelect) {
        stringSelect.addEventListener('change', (e) => {
            renderFingeringChart(e.target.value);
        });

        // Initial render
        renderFingeringChart(stringSelect.value);
    }

    // ======================💬 Comments Section ======================
    const commentForm = document.getElementById('comment-form');
    const commentsContainer = document.getElementById('comments-container');

    function loadComments() {
        const comments = JSON.parse(localStorage.getItem('violin-comments')) || [];
        commentsContainer.innerHTML = '';

        if (comments.length === 0) {
            commentsContainer.innerHTML = '<p>No comments yet. Be the first to share!</p>';
            return;
        }

        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                 <h4>${comment.name}</h4>
                 <p class="comment-date">${new Date(comment.date).toLocaleString()}</p>
                 <p class="comment-text">${comment.text}</p>
             `;
            commentsContainer.appendChild(commentElement);
        });
    }

    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('comment-name').value;
            const text = document.getElementById('comment-text').value;

            if (!name || !text) return;

            const comments = JSON.parse(localStorage.getItem('violin-comments')) || [];
            const newComment = {
                name,
                text,
                date: new Date().toISOString()
            };

            comments.unshift(newComment);
            localStorage.setItem('violin-comments', JSON.stringify(comments));

            document.getElementById('comment-form').reset();
            loadComments();
        });

        // Load comments on page load
        loadComments();
    }

    // ======================📚 Recommended Resources ======================
    const resourcesContainer = document.getElementById('resources-container');

    const resources = [
        {
            title: "Essential Violin Exercises", type: "exercises", items: [
                "Scales in all keys",
                "Schradieck exercises",
                "Sevcik bowing techniques",
                "Double stop practice",
                "Shifting exercises"
            ]
        },
        {
            title: "Recommended Songs", type: "songs", items: [
                "Twinkle Twinkle Little Star",
                "Ode to Joy",
                "Canon in D",
                "Meditation from Thaïs",
                "Zigeunerweisen"
            ]
        },
        {
            title: "Famous Violinists", type: "violinists", items: [
                "Niccolò Paganini",
                "Jascha Heifetz",
                "Itzhak Perlman",
                "Hilary Hahn",
                "David Oistrakh"
            ]
        }
    ];

    function renderResources() {
        resourcesContainer.innerHTML = '';

        resources.forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'resource-category';

            const titleElement = document.createElement('h3');
            titleElement.textContent = category.title;
            categoryElement.appendChild(titleElement);

            const listElement = document.createElement('ul');
            category.items.forEach(item => {
                const itemElement = document.createElement('li');
                itemElement.textContent = item;
                listElement.appendChild(itemElement);
            });

            categoryElement.appendChild(listElement);
            resourcesContainer.appendChild(categoryElement);
        });
    }

    if (resourcesContainer) {
        renderResources();
    }


});