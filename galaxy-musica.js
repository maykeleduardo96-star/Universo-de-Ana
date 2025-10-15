// ===== GALAXIA MÚSICA - CONTENIDO ESPECÍFICO =====
function initMusicaGalaxyContent(canvas, contentContainer) {
    // Reiniciar y reproducir la música automáticamente
    const music = document.getElementById('backgroundMusic');
    music.currentTime = 0;
    music.play().catch(e => {
        console.log("La reproducción automática fue bloqueada:", e);
        // Mostrar instrucción para hacer clic
        contentContainer.querySelector('.musica-instructions').textContent = "Haz clic en cualquier lugar para comenzar la música";
        document.addEventListener('click', function startMusic() {
            music.play();
            document.removeEventListener('click', startMusic);
        }, { once: true });
    });

    // Crear escena Three.js simple de fondo
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x001122, 0.3);
    
    // Crear estrellas de fondo
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 100;
        starPositions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 100;
        
        const colorType = i % 4;
        if (colorType === 0) {
            starColors[i * 3] = 1.0;
            starColors[i * 3 + 1] = 1.0;
            starColors[i * 3 + 2] = 1.0;
        } else if (colorType === 1) {
            starColors[i * 3] = 0.4 + Math.random() * 0.3;
            starColors[i * 3 + 1] = 0.6 + Math.random() * 0.4;
            starColors[i * 3 + 2] = 1.0;
        } else if (colorType === 2) {
            starColors[i * 3] = 1.0;
            starColors[i * 3 + 1] = 0.6 + Math.random() * 0.3;
            starColors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
        } else {
            starColors[i * 3] = 0.8 + Math.random() * 0.2;
            starColors[i * 3 + 1] = 0.4 + Math.random() * 0.3;
            starColors[i * 3 + 2] = 1.0;
        }
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    
    camera.position.z = 50;
    
    // Crear pergamino con letras
    const scrollContainer = document.createElement('div');
    scrollContainer.className = 'scroll-container';
    
    scrollContainer.innerHTML = `
        <div class="scroll-top"></div>
        <div class="scroll-content">
            <div class="lyrics-container" id="lyricsContainer"></div>
        </div>
        <div class="scroll-bottom"></div>
        <div class="music-time" id="musicTime">0:00 / 0:00</div>
        <div class="music-progress">
            <div class="music-progress-bar" id="musicProgressBar"></div>
        </div>
    `;
    
    contentContainer.appendChild(scrollContainer);
    
    // Letra de la canción con tiempos corregidos (empezando en el segundo 23)
    const lyrics = [
        { time: 23, text: "I walked across an empty land" },
        { time: 28, text: "I knew the pathway like the back of my hand" },
        { time: 34, text: "I felt the earth beneath my feet" },
        { time: 39, text: "Sat by the river and it made me complete" },
        { time: 45, text: "Oh, simple thing, where have you gone?" },
        { time: 51, text: "I'm getting old and I need something to rely on" },
        { time: 56, text: "So tell me when you're gonna let me in" },
        { time: 62, text: "I'm getting tired and I need somewhere to begin" },
        { time: 67, text: "I came across a fallen tree" },
        { time: 73, text: "I felt the branches of it looking at me" },
        { time: 78, text: "Is this the place we used to love?" },
        { time: 84, text: "Is this the place that I've been dreaming of?" },
        { time: 90, text: "Oh, simple thing, where have you gone?" },
        { time: 95, text: "I'm getting old and I need something to rely on" },
        { time: 101, text: "So tell me when you're gonna let me in" },
        { time: 106, text: "I'm getting tired and I need somewhere to begin" },
        { time: 112, text: "And if you have a minute, why don't we go" },
        { time: 118, text: "Talk about it somewhere only we know?" },
        { time: 123, text: "This could be the end of everything" },
        { time: 128, text: "So why don't we go somewhere only we know?" },
        { time: 136, text: "Somewhere only we know" },
        { time: 145, text: "Oh, simple thing, where have you gone?" },
        { time: 151, text: "I'm getting old and I need something to rely on" },
        { time: 157, text: "So tell me when you're gonna let me in" },
        { time: 162, text: "I'm getting tired and I need somewhere to begin" },
        { time: 168, text: "And if you have a minute, why don't we go" },
        { time: 173, text: "Talk about it somewhere only we know?" },
        { time: 179, text: "This could be the end of everything" },
        { time: 184, text: "So why don't we go? Somewhere only we know" },
        { time: 202, text: "This could be the end of everything" },
        { time: 207, text: "So why don't we go? Somewhere only we know" },
        { time: 214, text: "Somewhere only we know" },
        { time: 220, text: "Somewhere only we know" }
    ];

    // Crear elementos de letra
    const lyricsContainer = document.getElementById('lyricsContainer');
    lyrics.forEach(lyric => {
        const line = document.createElement('div');
        line.className = 'lyric-line';
        line.textContent = lyric.text;
        line.dataset.time = lyric.time;
        lyricsContainer.appendChild(line);
    });

    // Variables para el karaoke
    const progressBar = document.getElementById('musicProgressBar');
    const timeDisplay = document.getElementById('musicTime');
    const lyricLines = document.querySelectorAll('.lyric-line');

    // Actualizar karaoke
    function updateKaraoke() {
        const currentTime = music.currentTime;
        const duration = music.duration || 227; // Duración real de la canción
        
        // Actualizar barra de progreso
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        // Actualizar tiempo
        const currentMinutes = Math.floor(currentTime / 60);
        const currentSeconds = Math.floor(currentTime % 60);
        const durationMinutes = Math.floor(duration / 60);
        const durationSeconds = Math.floor(duration % 60);
        
        timeDisplay.textContent = 
            `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds} / ${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
        
        // Actualizar líneas de letra
        let activeLineFound = false;
        
        // Reiniciar todas las líneas
        lyricLines.forEach(line => {
            line.classList.remove('active', 'past');
        });
        
        // Encontrar la línea actual
        for (let i = lyricLines.length - 1; i >= 0; i--) {
            const lineTime = parseFloat(lyricLines[i].dataset.time);
            
            if (currentTime >= lineTime) {
                lyricLines[i].classList.add('active');
                activeLineFound = true;
                
                // Marcar líneas anteriores
                for (let j = 0; j < i; j++) {
                    lyricLines[j].classList.add('past');
                }
                break;
            }
        }
        
        // Hacer scroll automático para mantener la línea activa visible
        const activeLine = document.querySelector('.lyric-line.active');
        if (activeLine) {
            activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Escuchar eventos de tiempo de la música
    music.addEventListener('timeupdate', updateKaraoke);
    
    // Crear notas musicales flotantes
    function createFloatingNotes() {
        const noteSymbols = ["♪", "♫", "♬", "🎵", "🎶"];
        
        function createNote() {
            const note = document.createElement('div');
            note.className = 'musica-note';
            note.textContent = noteSymbols[Math.floor(Math.random() * noteSymbols.length)];
            note.style.left = `${Math.random() * 100}%`;
            note.style.top = `${Math.random() * 100}%`;
            note.style.fontSize = `${20 + Math.random() * 30}px`;
            note.style.opacity = '0';
            
            contentContainer.appendChild(note);
            
            // Animación de entrada
            setTimeout(() => {
                note.style.opacity = '0.7';
                note.style.transform = `translateY(-${100 + Math.random() * 200}px) rotate(${Math.random() * 360}deg)`;
            }, 100);
            
            // Animación de salida
            setTimeout(() => {
                note.style.opacity = '0';
            }, 3000);
            
            // Eliminar después de la animación
            setTimeout(() => {
                if (note.parentNode) {
                    note.parentNode.removeChild(note);
                }
            }, 4000);
        }
        
        // Crear notas periódicamente
        setInterval(createNote, 800);
    }

    // Crear visualizador de música
    function createMusicVisualizer() {
        const visualizer = document.createElement('div');
        visualizer.className = 'musica-visualizer';
        
        const bars = [];
        for (let i = 0; i < 32; i++) {
            const bar = document.createElement('div');
            bar.className = 'musica-bar';
            bar.style.height = '5px';
            visualizer.appendChild(bar);
            bars.push(bar);
        }
        
        contentContainer.appendChild(visualizer);
        
        // Simular animación de barras
        function animateBars() {
            bars.forEach((bar, index) => {
                const height = 5 + Math.sin(Date.now() * 0.005 + index * 0.3) * 40 + Math.random() * 20;
                bar.style.height = `${Math.max(5, height)}px`;
            });
            requestAnimationFrame(animateBars);
        }
        
        animateBars();
    }

    // Ocultar mensaje de carga
    setTimeout(() => {
        const loadingEl = contentContainer.querySelector('.musica-loading');
        if (loadingEl) loadingEl.style.display = 'none';
    }, 2000);

    // Iniciar efectos
    createFloatingNotes();
    createMusicVisualizer();

    // Animación de las estrellas
    const animate = function () {
        requestAnimationFrame(animate);
        stars.rotation.y += 0.001;
        renderer.render(scene, camera);
    };
    
    animate();

    // Manejar redimensionado
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}