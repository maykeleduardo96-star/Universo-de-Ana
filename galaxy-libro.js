// galaxy-libro.js - VERSIÓN CON TEXTO MEJORADO
class GalaxyLibro {
    constructor(container) {
        console.log("🏰 Inicializando Libro Galaxia...");
        
        this.container = container;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // Crear canvas principal para Three.js
        this.canvas = document.getElementById('galaxyCanvas') || this.createCanvas();
        
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000011, 0);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // DIMENSIONES PERFECTAS
        this.bookWidth = 4.8;
        this.bookHeight = 6.5;
        this.bookThickness = 0.8;
        this.coverThickness = 0.06;

        this.book = null;
        this.frontCover = null;
        this.backCover = null;
        this.pagesGroup = null;
        this.currentPage = 0;
        this.isBookOpen = false;
        this.isAnimating = false;
        
        this.storyPages = [];
        
        // Sistema IDÉNTICO de estrellas fugaces de galaxy-final.js
        this.shootingStars = [];
        this.starField = null;
        this.finalAnimationId = null;
        
        // Solo página derecha
        this.page = null;
        this.pageCanvas = null;
        this.pageContext = null;
        this.pageTexture = null;

        // CONTROL DE AUDIO MEJORADO
        this.bookAudio = null;
        this.isBookAudioPlaying = false;
        this.globalAudioWasPlaying = false;
        this.globalAudioCurrentTime = 0;

        this.init();
    }

    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = 'galaxyCanvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: block;
            z-index: 2;
        `;
        this.container.appendChild(canvas);
        return canvas;
    }

    async init() {
        console.log("🔮 Inicializando libro...");
        
        this.setupCamera();
        this.setupLights();
        
        // GUARDAR ESTADO DEL AUDIO GLOBAL ANTES DE MODIFICAR
        this.saveGlobalAudioState();
        
        this.setupFinalScene();
        
        await this.createBookStructure();
        this.createStoryContent();
        
        // INICIAR AUDIO DEL LIBRO
        this.setupBookAudio();
        
        this.startFinalAnimations();
        
        window.addEventListener('resize', () => this.onWindowResize());
        
        console.log("✅ Libro listo para interactuar");
    }

    // GUARDAR ESTADO DEL AUDIO GLOBAL - VERSIÓN MEJORADA
    saveGlobalAudioState() {
        console.log("💾 Guardando estado del audio global...");
        
        const backgroundMusic = document.getElementById('backgroundMusic');
        
        if (backgroundMusic) {
            this.globalAudioWasPlaying = !backgroundMusic.paused;
            this.globalAudioCurrentTime = backgroundMusic.currentTime;
            
            console.log("✅ Estado global guardado - Reproduciendo:", this.globalAudioWasPlaying, "Tiempo:", this.globalAudioCurrentTime);
            
            // PAUSAR AUDIO GLOBAL CON FADE OUT
            if (this.globalAudioWasPlaying) {
                this.fadeOutGlobalAudio(backgroundMusic, 500).then(() => {
                    backgroundMusic.pause();
                    console.log("⏸️ Audio global pausado con fade out");
                });
            }
        } else {
            console.log("❌ No se encontró backgroundMusic");
        }
    }

    // FADE OUT PARA AUDIO GLOBAL
    fadeOutGlobalAudio(audioElement, duration) {
        return new Promise((resolve) => {
            const initialVolume = audioElement.volume;
            const step = initialVolume / (duration / 50);
            let currentVolume = initialVolume;
            
            const fadeInterval = setInterval(() => {
                currentVolume -= step;
                if (currentVolume <= 0) {
                    audioElement.volume = 0;
                    clearInterval(fadeInterval);
                    resolve();
                } else {
                    audioElement.volume = currentVolume;
                }
            }, 50);
        });
    }

    // FADE IN PARA AUDIO GLOBAL
    fadeInGlobalAudio(audioElement, duration, targetVolume = 0.7) {
        return new Promise((resolve) => {
            audioElement.volume = 0;
            const step = targetVolume / (duration / 50);
            let currentVolume = 0;
            
            const fadeInterval = setInterval(() => {
                currentVolume += step;
                if (currentVolume >= targetVolume) {
                    audioElement.volume = targetVolume;
                    clearInterval(fadeInterval);
                    resolve();
                } else {
                    audioElement.volume = currentVolume;
                }
            }, 50);
        });
    }

    // RESTAURAR AUDIO GLOBAL - VERSIÓN MEJORADA
    restoreGlobalAudio() {
        console.log("🔄 Restaurando audio global...");
        
        const backgroundMusic = document.getElementById('backgroundMusic');
        
        if (backgroundMusic) {
            // Restaurar tiempo exacto
            backgroundMusic.currentTime = this.globalAudioCurrentTime;
            backgroundMusic.volume = 0; // Empezar en volumen 0
            
            console.log("🔧 Configurando audio global - Tiempo:", this.globalAudioCurrentTime);
            
            // Reanudar si estaba reproduciéndose
            if (this.globalAudioWasPlaying) {
                console.log("▶️ Reanudando audio global con fade in...");
                
                // Usar el método de main.js para reproducir si está disponible
                if (window.galaxyManager && typeof window.galaxyManager.playGlobalMusic === 'function') {
                    window.galaxyManager.playGlobalMusic();
                    this.fadeInGlobalAudio(backgroundMusic, 1000).then(() => {
                        console.log("✅ Audio global reanudado con fade in");
                    });
                } else {
                    // Método directo como fallback
                    const playPromise = backgroundMusic.play();
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            return this.fadeInGlobalAudio(backgroundMusic, 1000);
                        }).then(() => {
                            console.log("✅ Audio global reanudado con fade in");
                        }).catch(error => {
                            console.error("❌ Error al reanudar audio global:", error);
                            // Reintentar sin fade
                            backgroundMusic.volume = 0.7;
                        });
                    }
                }
            } else {
                console.log("⏸️ Audio global permanece pausado");
                backgroundMusic.volume = 0.7; // Restaurar volumen aunque esté pausado
            }
        } else {
            console.log("❌ No se encontró backgroundMusic para restaurar");
        }
    }

    // CONFIGURAR AUDIO DEL LIBRO - VERSIÓN MEJORADA
    setupBookAudio() {
        console.log("🎵 Configurando audio del libro...");
        
        // Si ya existe audio del libro, reutilizarlo
        if (window.galaxyBookAudio) {
            console.log("🔄 Reutilizando audio existente del libro");
            this.bookAudio = window.galaxyBookAudio;
            
            // Si ya está reproduciéndose, no hacer nada
            if (!this.bookAudio.paused) {
                this.isBookAudioPlaying = true;
                return;
            }
        } else {
            // Crear nuevo audio
            this.bookAudio = new Audio();
            this.bookAudio.src = 'https://www.dropbox.com/scl/fi/i8pjh6dor59ef4xzu6hsf/Ed-Sheeran-Photograph-Subtitulado-al-Espa-ol..mp3?rlkey=vpe1cixqj20q3h7six0odizjb&st=5idloycp&dl=1';
            this.bookAudio.loop = true;
            this.bookAudio.volume = 0; // Empezar en volumen 0
            
            // Hacer global para reutilizar
            window.galaxyBookAudio = this.bookAudio;
            
            console.log("📥 Cargando audio del libro...");
        }
        
        // Reproducir audio del libro con fade in
        this.playBookAudio();
    }

    // REPRODUCIR AUDIO DEL LIBRO CON FADE IN
    playBookAudio() {
        if (this.bookAudio) {
            console.log("🎶 Reproduciendo audio del libro con fade in...");
            
            // Configurar volumen inicial
            this.bookAudio.volume = 0;
            
            const playPromise = this.bookAudio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.isBookAudioPlaying = true;
                    // Fade in del audio del libro
                    this.fadeInGlobalAudio(this.bookAudio, 1500, 0.7).then(() => {
                        console.log("✅ Audio del libro reproduciéndose con volumen completo");
                    });
                }).catch(error => {
                    console.error("❌ Error al reproducir audio del libro:", error);
                    // Reintentar después de un tiempo
                    setTimeout(() => this.playBookAudio(), 1000);
                });
            }
        }
    }

    // DETENER AUDIO DEL LIBRO CON FADE OUT
    stopBookAudio() {
        if (this.bookAudio && !this.bookAudio.paused) {
            console.log("⏹️ Deteniendo audio del libro con fade out...");
            
            this.fadeOutGlobalAudio(this.bookAudio, 800).then(() => {
                this.bookAudio.pause();
                this.bookAudio.currentTime = 0;
                this.isBookAudioPlaying = false;
                console.log("✅ Audio del libro detenido completamente");
            });
        } else if (this.bookAudio) {
            // Si ya está pausado, solo resetear
            this.bookAudio.currentTime = 0;
            this.isBookAudioPlaying = false;
        }
    }

    // LIMPIAR RECURSOS - VERSIÓN MEJORADA
    cleanup() {
        console.log("🧹 Ejecutando limpieza...");
        
        // Detener animaciones
        if (this.finalAnimationId) {
            cancelAnimationFrame(this.finalAnimationId);
        }
        
        // Remover canvas de estrellas
        if (this.shootingStarsCanvas) {
            this.shootingStarsCanvas.remove();
        }
        
        // DETENER AUDIO DEL LIBRO CON FADE OUT
        this.stopBookAudio();
        
        // RESTAURAR AUDIO GLOBAL CON UN PEQUEÑO DELAY
        setTimeout(() => {
            this.restoreGlobalAudio();
        }, 500);
        
        console.log("✅ Limpieza completada - Audio global restaurado");
    }

    setupCamera() {
        this.camera.position.set(0, 0, 12);
        this.camera.lookAt(0, 0, 0);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xfff5e1, 1.3);
        mainLight.position.set(3, 8, 5);
        mainLight.castShadow = true;
        this.scene.add(mainLight);

        const accentLight = new THREE.DirectionalLight(0xe6e6ff, 0.3);
        accentLight.position.set(-3, 2, 3);
        this.scene.add(accentLight);
    }

    setupFinalScene() {
        console.log("🌟 Configurando escena final...");
        
        this.createShootingStarsCanvas();
        this.createMovingStars();
        this.createShootingStars();
    }

    createShootingStarsCanvas() {
        const existingCanvas = document.getElementById('shootingStarsCanvas');
        if (existingCanvas) {
            existingCanvas.remove();
        }
        
        this.shootingStarsCanvas = document.createElement('canvas');
        this.shootingStarsCanvas.id = 'shootingStarsCanvas';
        this.shootingStarsCanvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: block;
            pointer-events: none;
            z-index: 1;
        `;
        this.container.appendChild(this.shootingStarsCanvas);
        
        this.shootingStarsCtx = this.shootingStarsCanvas.getContext('2d');
        this.shootingStarsCanvas.width = window.innerWidth;
        this.shootingStarsCanvas.height = window.innerHeight;
    }

    createMovingStars() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 8000;
        
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const velocities = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 3000;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 3000;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 3000;
            
            const brightness = Math.random() * 0.3 + 0.7;
            colors[i * 3] = brightness;
            colors[i * 3 + 1] = brightness;
            colors[i * 3 + 2] = brightness;
            
            velocities[i * 3] = (Math.random() - 0.5) * 0.2;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            size: 1.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        
        this.starField = new THREE.Points(starGeometry, starMaterial);
        this.starField.userData = {
            velocities: velocities,
            positions: positions
        };
        
        this.scene.add(this.starField);
    }

    createShootingStars() {
        this.shootingStars = [];
        for (let i = 0; i < 5; i++) {
            this.shootingStars.push({
                x: Math.random() * this.shootingStarsCanvas.width,
                y: Math.random() * this.shootingStarsCanvas.height,
                speed: Math.random() * 10 + 5,
                length: Math.random() * 50 + 30,
                opacity: Math.random() * 0.5 + 0.5,
                angle: Math.random() * Math.PI * 2
            });
        }
    }

    startFinalAnimations() {
        console.log("🚀 Iniciando animaciones...");
        
        const animate3D = () => {
            this.finalAnimationId = requestAnimationFrame(animate3D);
            
            if (this.starField) {
                const positions = this.starField.geometry.attributes.position.array;
                const velocities = this.starField.userData.velocities;
                
                for (let i = 0; i < positions.length; i += 3) {
                    positions[i] += velocities[i];
                    positions[i + 1] += velocities[i + 1];
                    positions[i + 2] += velocities[i + 2];
                    
                    if (Math.abs(positions[i]) > 1500 || 
                        Math.abs(positions[i + 1]) > 1500 || 
                        Math.abs(positions[i + 2]) > 1500) {
                        
                        positions[i] = (Math.random() - 0.5) * 3000;
                        positions[i + 1] = (Math.random() - 0.5) * 3000;
                        positions[i + 2] = (Math.random() - 0.5) * 3000;
                    }
                }
                
                this.starField.geometry.attributes.position.needsUpdate = true;
            }
            
            if (this.book && !this.isBookOpen && !this.isAnimating) {
                const time = Date.now() * 0.001;
                this.book.rotation.y = Math.sin(time * 0.1) * 0.02 + 0.3;
                this.book.position.y = Math.sin(time * 0.2) * 0.02;
            }
            
            this.updatePagePosition();
            this.renderer.render(this.scene, this.camera);
        };
        
        const animate2D = () => {
            if (!this.shootingStarsCtx) return;
            
            this.shootingStarsCtx.clearRect(0, 0, this.shootingStarsCanvas.width, this.shootingStarsCanvas.height);
            
            this.shootingStars.forEach((star, index) => {
                this.shootingStarsCtx.beginPath();
                this.shootingStarsCtx.moveTo(star.x, star.y);
                this.shootingStarsCtx.lineTo(
                    star.x + Math.cos(star.angle) * star.length,
                    star.y + Math.sin(star.angle) * star.length
                );
                
                this.shootingStarsCtx.strokeStyle = `rgba(255, 255, 255, ${star.opacity})`;
                this.shootingStarsCtx.lineWidth = 2;
                this.shootingStarsCtx.stroke();
                
                star.x += Math.cos(star.angle) * star.speed;
                star.y += Math.sin(star.angle) * star.speed;
                
                if (star.x < -star.length || star.x > this.shootingStarsCanvas.width + star.length ||
                    star.y < -star.length || star.y > this.shootingStarsCanvas.height + star.length) {
                    star.x = Math.random() * this.shootingStarsCanvas.width;
                    star.y = Math.random() * this.shootingStarsCanvas.height;
                    star.angle = Math.random() * Math.PI * 2;
                    star.opacity = Math.random() * 0.5 + 0.5;
                }
                
                star.opacity -= 0.01;
                if (star.opacity <= 0) {
                    star.opacity = Math.random() * 0.5 + 0.5;
                }
            });
            
            requestAnimationFrame(animate2D);
        };
        
        animate3D();
        animate2D();
    }

    async createBookStructure() {
        console.log("📖 Creando estructura del libro...");
        
        this.book = new THREE.Group();
        
        const { bookWidth, bookHeight, bookThickness, coverThickness } = this;

        // CUERPO DEL LIBRO
        const pagesGeometry = new THREE.BoxGeometry(bookWidth - 0.05, bookHeight - 0.05, bookThickness);
        const pagesMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xf8f8f8,
            shininess: 10
        });
        const pagesVolume = new THREE.Mesh(pagesGeometry, pagesMaterial);
        pagesVolume.position.z = 0;
        this.book.add(pagesVolume);

        // PORTADA DELANTERA
        const coverGeometry = new THREE.BoxGeometry(bookWidth, bookHeight, coverThickness);
        const leatherTexture = this.createLeatherTexture();
        
        const coverMaterial = new THREE.MeshPhongMaterial({ 
            map: leatherTexture,
            color: 0x8B0000,
            shininess: 30,
            specular: 0x222222
        });
        
        this.frontCover = new THREE.Mesh(coverGeometry, coverMaterial);
        this.frontCover.position.set(bookWidth / 2, 0, coverThickness / 2);
        this.frontCover.castShadow = true;
        
        this.coverPivot = new THREE.Group();
        this.coverPivot.position.set(-bookWidth / 2, 0, bookThickness / 2);
        this.coverPivot.add(this.frontCover);
        this.book.add(this.coverPivot);

        // PORTADA TRASERA
        this.backCover = new THREE.Mesh(coverGeometry, coverMaterial);
        this.backCover.position.set(-bookWidth / 0, 0, -bookThickness / 2 - coverThickness / 2);
        this.book.add(this.backCover);

        // LOMO
        const spineGeometry = new THREE.BoxGeometry(coverThickness, bookHeight, bookThickness + coverThickness);
        const spineMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x5a0f0f,
            shininess: 20
        });
        const spine = new THREE.Mesh(spineGeometry, spineMaterial);
        spine.position.set(-bookWidth / 2 - coverThickness / 2, 0, 0);
        this.book.add(spine);

        this.scene.add(this.book);
        
        this.createPageSystem();

        this.book.position.set(0, 0, 0);
        this.book.rotation.y = 0.3;
        
        this.makeBookInteractive();
        
        console.log("✅ Estructura del libro creada");
    }

    createLeatherTexture() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 512;

        ctx.fillStyle = '#8B0000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < 2000; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 3;
            
            ctx.fillStyle = `rgba(${139 + Math.random() * 30}, 0, 0, ${0.1 + Math.random() * 0.2})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.strokeStyle = 'rgba(90, 15, 15, 0.3)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 100; i++) {
            ctx.beginPath();
            const startX = Math.random() * canvas.width;
            const startY = Math.random() * canvas.height;
            ctx.moveTo(startX, startY);
            
            for (let j = 0; j < 5; j++) {
                const endX = startX + (Math.random() - 0.5) * 50;
                const endY = startY + (Math.random() - 0.5) * 50;
                ctx.lineTo(endX, endY);
            }
            ctx.stroke();
        }

        for (let i = 0; i < 100; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const width = 10 + Math.random() * 20;
            const height = 5 + Math.random() * 10;
            
            ctx.fillStyle = `rgba(${120 + Math.random() * 50}, 0, 0, ${0.05 + Math.random() * 0.1})`;
            ctx.fillRect(x, y, width, height);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        
        return texture;
    }

    createPageSystem() {
        console.log("📄 Creando sistema de páginas...");
        
        this.pagesGroup = new THREE.Group();
        this.pagesGroup.visible = false;
        
        const pageWidth = this.bookWidth - 0.03;
        const pageHeight = this.bookHeight - 0.03;

        // VOLVEMOS A LA RESOLUCIÓN ORIGINAL PERO CON MEJORES CONFIGURACIONES
        this.pageCanvas = document.createElement('canvas');
        this.pageCanvas.width = 1024;
        this.pageCanvas.height = 1024;
        this.pageContext = this.pageCanvas.getContext('2d');
        
        // CONFIGURACIÓN ÓPTIMA PARA TEXTO NÍTIDO
        this.pageContext.imageSmoothingEnabled = true;
        this.pageContext.imageSmoothingQuality = 'high';

        this.pageTexture = new THREE.CanvasTexture(this.pageCanvas);
        this.pageTexture.minFilter = THREE.LinearFilter;
        this.pageTexture.magFilter = THREE.LinearFilter;
        this.pageTexture.generateMipmaps = true;

        const pageMaterial = new THREE.MeshBasicMaterial({
            map: this.pageTexture,
            side: THREE.DoubleSide,
            transparent: true
        });

        this.page = new THREE.Mesh(
            new THREE.PlaneGeometry(pageWidth, pageHeight), 
            pageMaterial
        );
        
        // POSICIÓN ORIGINAL CORREGIDA
        this.page.position.set(-0.18, 0, 0.16);
        this.page.rotation.y = -0.015;

        this.pagesGroup.add(this.page);
        this.scene.add(this.pagesGroup);
    }

    updatePagePosition() {
        if (!this.book || !this.pagesGroup) return;
        
        this.pagesGroup.position.copy(this.book.position);
        this.pagesGroup.rotation.copy(this.book.rotation);
        
        if (this.isBookOpen) {
            this.pagesGroup.position.x += 0.12;
            this.pagesGroup.position.z += 0.3;
            this.pagesGroup.rotation.y += 0.005;
        }
    }

    createStoryContent() {
        this.storyPages = [
            {
                title: "La historia de Maykel y Ana",
                content: "A veces la vida tiene una manera extraña de juntar a las personas. No siempre lo hace con fuegos artificiales o casualidades cinematográficas… a veces basta un simple live de TikTok, un comentario perdido entre cientos, y un nombre que se queda rondando en la cabeza sin saber por qué.\n\nAsí comenzó la historia de Maykel y Ana.",
            },
            {
                title: "Capítulo I – La primera vez",
                content: "Era una noche cualquiera. Maykel navegaba por TikTok sin esperar nada, saltando de un video a otro. De pronto, entró a un live del juego que tanto disfrutaba.\n\nAllí, entre los comentarios que pasaban a toda velocidad, vio un nombre: Ana.\n\nNo hablaron. No hubo un saludo, ni una chispa evidente. Pero hubo algo. Un pequeño instante, tan breve que casi se confunde con el azar.\n\nÉl no lo supo entonces, pero ese nombre quedaría guardado en un rincón de su memoria.",
            },
            {
                title: "Capítulo II – La segunda vez",
                content: "Pasaron algunos días.\n\nMaykel entró en un grupo del mismo juego, buscando partidas o quizá solo pasar el rato. Y ahí estaba otra vez: Ana, como si el destino hubiera decidido repetir su aparición para asegurarse de que no la olvidara.\n\nIntercambiaron algunos mensajes, nada fuera de lo normal. Pero la familiaridad de su nombre, su forma de escribir, o quizá simplemente su energía, empezaron a despertar una curiosidad distinta.",
            },
            {
                title: "Capítulo III – La tercera vez",
                content: "La tercera vez no fue casualidad.\n\nEsta vez se encontraron dentro del juego, compartiendo la misma partida, el mismo universo digital.\n\nY fue Ana quien dio el primer paso: un mensaje directo, corto, preguntando algo simple.\n\nPero esa pequeña chispa bastó.\n\nLa conversación comenzó siendo sobre el juego… y, sin darse cuenta, empezó a girar hacia todo lo demás.\n\nRieron, bromearon, compartieron anécdotas, y el tiempo —tan cruel con los desconocidos— de pronto se volvió amable.\n\nEsa noche hablaron más de lo esperado. Y al día siguiente, volvieron a hacerlo, Y al siguiente también.\n\nLo que empezó siendo una charla trivial se convirtió en costumbre, y la costumbre en necesidad.",
            },
            {
                title: "Capítulo IV – Las conversaciones",
                content: "Cada mensaje de Ana tenía algo que lo hacía sonreír sin motivo.\n\nMaykel se descubrió esperando su saludo, su voz, su manera de contar las cosas. Ella, por su parte, encontraba en él una calma, una compañía diferente a las demás.\n\nEntre risas y desvelos, fueron creando su propio espacio: uno donde las palabras bastaban para sentirse cerca, aunque hubiera kilómetros de por medio.\n\nHablaron de todo y de nada: del juego, de sus días, de lo que los hacía reír, de lo que dolía un poco, de lo que soñaban.\n\nY sin planearlo, el cariño se fue colando entre las letras, creciendo en silencio, hasta volverse imposible de disimular.",
            },
            {
                title: "Capítulo V – El primer mes",
                content: "Hoy, mirando hacia atrás, parece increíble todo lo que ha pasado en tan poco tiempo.\n\nUn mes. Solo un mes desde aquel primer mensaje… y sin embargo, ya hay una historia detrás de cada sonrisa, de cada 'buenos días', de cada llamada que duró más de lo previsto.\n\nUn mes de conocerse, de aprender a leerse sin palabras, de entender que la conexión no siempre necesita explicaciones.\n\nUn mes desde que la vida, sin previo aviso, decidió cruzar dos caminos que estaban destinados a encontrarse.\n\nY así, Maykel y Ana celebran su primer mes juntos: recordando cómo todo empezó, con la certeza de que esta historia —la suya— apenas está empezando.\n\nPorque hay amores que no necesitan ruido para ser grandes.\nSolo necesitan una casualidad, una conversación… y dos personas que decidan no soltarse.",
            },
            {
                title: "Capítulo VI – Entre risas, juegos y otoños",
                content: `Ana ya había leído la historia.
Cada palabra, cada detalle, cada recuerdo que Maykel había dejado por escrito… y al hacerlo, sonrió. No una sonrisa cualquiera, sino de esas que nacen del alma, las que solo aparecen cuando uno se siente querido de verdad.

Maykel la observaba, quizá en silencio, sabiendo que ella lo estaba leyendo en voz baja, entre líneas, encontrando en cada párrafo un pedacito de ellos.
Era extraño —y hermoso— ver cómo algo tan simple como un texto podía unirlos todavía más.
Ahora la historia ya no era solo suya: también era de ella.

Y justo en ese momento, cuando el aire comenzaba a llenarse del olor del otoño y las calles se preparaban para Halloween, su historia seguía creciendo, como una película que no quiere terminar.`
            },
            {
                title: "",
                content: `Ana ya tenía listo su disfraz; se lo había mostrado entre risas y secretos, con ese brillo en los ojos que mezcla ilusión y picardía.
A Maykel le encantaba verla emocionada, imaginársela entre luces naranjas y telarañas falsas, tan metida en su papel que parecía sacada de un mundo mágico.

Últimamente habían estado compartiendo todo:
partidas interminables de It Takes Two, donde cada nivel era una metáfora más de su relación.
Cooperaban, discutían, se reían, y al final siempre encontraban la forma de avanzar juntos.
Era curioso cómo ese juego —hecho de trabajo en equipo y sincronía— parecía hablarles directamente: la historia solo continúa si ambos siguen juntos.`
            },
            {
                  title: "",
                  content:  `Y cuando no jugaban, veían películas del Estudio Ghibli.
Ana adoraba los paisajes, los mundos imposibles, las criaturas que parecían sueños; y Maykel disfrutaba ver cómo se le iluminaban los ojos en cada escena.
A veces no hacía falta decir nada: bastaba con compartir el silencio, sabiendo que ambos estaban en el mismo universo, aunque separados por una pantalla.

Había algo en esas noches de película, en esas partidas compartidas, que hacía sentir que el tiempo se detenía.
Que lo cotidiano se volvía extraordinario.
Que la historia que Maykel había escrito seguía viva, creciendo entre risas, juegos y pequeñas rutinas que ahora sabían a amor.
         
El primer mes había quedado atrás, y el segundo se acercaba con promesas nuevas.
Halloween sería su próximo recuerdo compartido; después, quién sabe.
Pero lo cierto es que cada día juntos añadía una página más al libro que nunca habían planeado escribir, y que ahora ninguno de los dos quería terminar.`
            },
            {
                title: "Capitulo VII, Dulce Amargor",
                content: `Ciertamente esto no es un capitulo que quiera escribir ni menos que desee volver a recordar, Esta es la perspectiva de Maykel.
Hace un tiempo estabamos planeando hacer algo, un evento poco importante en una perspectiva general pero importante para Maykel, No es un tema de ego.
Ni menos de orgullo, Era un plan que contaba con los dedos de las manos de forma regresiva como un niño que espera que su padre llegue con dulces.

Spoiler, No sucedio. Paso todo lo que no debia pasar menos lo que queria que pasara. Ana, ella se le ocurrio una nueva idea que definitivamente apoye.
Sin saber que intervendria de manera directa con lo que estuve esperando por semanas, No fue su culpa. Tuvo una idea y decidio hacerlo aunque no tomo. 
En cuenta si ambos planes se chocarian entre si, Para resumirlo si lo fue, me senti desplazado a un segundo lugar. A esperar que terminara aquella idea.
Que termino pensando unos dias antes, No lo tome bien. Me senti como un niño que le dicen de ultimo minuto que ya no iran al parque de diversiones y no.
Puede hacer mas nada que aceptarlo de mala gana, con mala actitud y con dolor de ser la segunda opcion porque la primera era obligatoria.`
            },
            {
                title: "",
                content: `¿Les ha pasado que hagan lo que hagan no pueden dejar de sentirse vacio? - Coño e la madre - Tipica expresion que usa Maykel.
Pues esta era la clara muestra de su frustración, Todo esto sucedio por falta de organizacion en los tiempos pero, estaba frustrado. Mas porque no hubo.
Ninguna diferencia. Maykel termino viendo todo el trabajo y empeño de Ana por sus estados, como cualquier persona mas. Pero debia admitirlo, Se veia preciosa.

Cuando haces algo con esfuerzo y empeño termina notandose, incluso por encima de una pataleta infantil. Pero no supo que le dolio mas, Si ver sus planes no.
realizarse o no ser mas que un espectador mas del otro.

Hoy, fue un dia dificil...`
           }
        ];
    }

    makeBookInteractive() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.renderer.domElement.addEventListener('click', (event) => {
            this.onClick(event);
        });
        
        this.renderer.domElement.style.cursor = 'pointer';
        console.log("🖱️ Interactividad activada");
    }

    onClick(event) {
        if (this.isAnimating) return;
        
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const bookIntersects = this.raycaster.intersectObject(this.book, true);
        const pageIntersects = this.pagesGroup.visible ? this.raycaster.intersectObject(this.pagesGroup, true) : [];
        
        const intersects = [...bookIntersects, ...pageIntersects];
        
        if (intersects.length > 0) {
            console.log("📖 Click detectado en el libro");
            if (!this.isBookOpen) {
                this.openBook();
            } else {
                this.nextPageWithFade();
            }
        }
    }

    openBook() {
        console.log("🔮 Abriendo libro...");
        this.isAnimating = true;
        
        const startRotation = this.coverPivot.rotation.y;
        const targetRotation = -Math.PI * 0.85;
        
        const startBookRotation = this.book.rotation.y;
        const targetBookRotation = 0;
        
        const duration = 1800;
        const startTime = Date.now();
        
        const animate = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const ease = this.easeOutCubic(progress);
            
            this.coverPivot.rotation.y = startRotation + (targetRotation - startRotation) * ease;
            this.book.rotation.y = startBookRotation + (targetBookRotation - startBookRotation) * ease;
            
            this.updatePagePosition();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
                this.isBookOpen = true;
                this.showFirstPage();
                console.log("✅ Libro abierto correctamente");
            }
        };
        
        animate();
    }

    showFirstPage() {
        console.log("📖 Mostrando primera página...");
        this.currentPage = 0;
        this.pagesGroup.visible = true;
        this.drawPageContent(this.storyPages[0]);
    }

    drawPageContent(pageData) {
        const ctx = this.pageContext;
        const width = 1024;
        const height = 1024;

        // FONDO MÁS SUAVE Y NATURAL
        ctx.fillStyle = '#f8f4e8';
        ctx.fillRect(0, 0, width, height);

        this.createPaperTexture(ctx, width, height);

        // CONFIGURACIÓN MEJORADA PARA TEXTO LEGIBLE
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // FUENTES MÁS LEGIBLES Y CONTRASTE MEJORADO
        if (this.currentPage === 0) {
            // PÁGINA 1 CORREGIDA
            ctx.fillStyle = '#8B0000';
            ctx.font = 'bold 48px "Georgia", serif';
            ctx.textAlign = 'center';
            ctx.fillText(pageData.title, width / 2, 100);

            ctx.strokeStyle = '#8B0000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(width / 2 - 120, 140);
            ctx.lineTo(width / 2 + 120, 140);
            ctx.stroke();

            // Texto del contenido en negro con mejor contraste y MÁS GRANDE EN NEGRITA
            ctx.fillStyle = '#2a2a2a'; // Negro más suave
            ctx.font = 'bold 30px "Georgia", serif'; // TEXTO MÁS GRANDE Y EN NEGRITA
            ctx.textAlign = 'left';
            
            const maxWidth = width - 100;
            const lineHeight = 38; // MÁS ESPACIO ENTRE LÍNEAS
            const startY = 180;
            
            const paragraphs = pageData.content.split('\n\n');
            let y = startY;
            
            paragraphs.forEach(paragraph => {
                const lines = this.wrapText(ctx, paragraph, 60, y, maxWidth, lineHeight);
                y += lines * lineHeight + 25;
            });

        } else {
            // Páginas de capítulos
            ctx.fillStyle = '#8B0000';
            ctx.font = 'bold 48px "Georgia", serif';
            ctx.textAlign = 'center';
            ctx.fillText(pageData.title, width / 2, 100);

            ctx.strokeStyle = '#8B0000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(width / 2 - 120, 140);
            ctx.lineTo(width / 2 + 120, 140);
            ctx.stroke();

            // Texto del contenido mejorado - MÁS GRANDE Y EN NEGRITA
            ctx.fillStyle = '#2a2a2a'; // Negro más suave para mejor legibilidad
            ctx.font = 'bold 30px "Georgia", serif'; // TEXTO MÁS GRANDE Y EN NEGRITA
            ctx.textAlign = 'left';
            
            const maxWidth = width - 100;
            const lineHeight = 38; // MÁS ESPACIO ENTRE LÍNEAS
            const startY = 180;
            
            const paragraphs = pageData.content.split('\n\n');
            let y = startY;
            
            paragraphs.forEach(paragraph => {
                const lines = this.wrapText(ctx, paragraph, 60, y, maxWidth, lineHeight);
                y += lines * lineHeight + 25;
            });

            // Número de página
            ctx.fillStyle = '#8B0000';
            ctx.font = 'italic 22px "Georgia", serif';
            ctx.textAlign = 'center';
            ctx.fillText(`${this.currentPage} / ${this.storyPages.length - 1}`, width / 2, height - 80);
        }
        
        this.pageTexture.needsUpdate = true;
    }

    createPaperTexture(ctx, width, height) {
        // TEXTURA DE PAPEL MÁS SUTIL
        ctx.fillStyle = 'rgba(245, 240, 230, 0.2)';
        for (let i = 0; i < 500; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 1;
            ctx.fillRect(x, y, size, size);
        }
        
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.lineWidth = 1;
        ctx.strokeRect(20, 20, width - 40, height - 40);
    }

    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let lines = 0;

        for(let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
                lines++;
            } else {
                line = testLine;
            }
        }
        
        ctx.fillText(line, x, y);
        return lines + 1;
    }

    nextPageWithFade() {
        if (this.isAnimating || !this.isBookOpen) return;
        
        if (this.currentPage < this.storyPages.length - 1) {
            this.isAnimating = true;
            
            console.log(`📖 Cambiando a página ${this.currentPage + 2}`);
            
            const fadeOut = () => {
                let opacity = 1;
                const fadeSpeed = 0.05;
                
                const fade = () => {
                    opacity -= fadeSpeed;
                    this.page.material.opacity = opacity;
                    
                    if (opacity > 0) {
                        requestAnimationFrame(fade);
                    } else {
                        this.currentPage++;
                        this.drawPageContent(this.storyPages[this.currentPage]);
                        fadeIn();
                    }
                };
                
                fade();
            };
            
            const fadeIn = () => {
                let opacity = 0;
                const fadeSpeed = 0.05;
                
                const fade = () => {
                    opacity += fadeSpeed;
                    this.page.material.opacity = opacity;
                    
                    if (opacity < 1) {
                        requestAnimationFrame(fade);
                    } else {
                        this.page.material.opacity = 1;
                        this.isAnimating = false;
                        console.log(`✅ Mostrando página ${this.currentPage + 1}`);
                    }
                };
                
                fade();
            };
            
            fadeOut();
        } else {
            this.closeBook();
        }
    }

    closeBook() {
        console.log("📕 Cerrando libro...");
        this.isAnimating = true;
        
        this.pagesGroup.visible = false;
        
        const startRotation = this.coverPivot.rotation.y;
        const targetRotation = 0;
        
        const startBookRotation = this.book.rotation.y;
        const targetBookRotation = 0.3;
        
        const duration = 1400;
        const startTime = Date.now();
        
        const animate = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const ease = this.easeOutCubic(progress);
            
            this.coverPivot.rotation.y = startRotation + (targetRotation - startRotation) * ease;
            this.book.rotation.y = startBookRotation + (targetBookRotation - startBookRotation) * ease;
            
            this.updatePagePosition();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
                this.isBookOpen = false;
                this.currentPage = 0;
                
                console.log("✅ Libro cerrado - listo para reabrir");
            }
        };
        
        animate();
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        if (this.shootingStarsCanvas) {
            this.shootingStarsCanvas.width = window.innerWidth;
            this.shootingStarsCanvas.height = window.innerHeight;
        }
    }
}

// ... (el resto del código de integración permanece igual)

// INTEGRACIÓN MEJORADA CON BOTÓN "VOLVER AL UNIVERSO"
function setupLibroIntegration() {
    console.log("🔗 Configurando integración con botón Volver al Universo...");
    
    const setupButton = () => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            const buttonText = button.textContent.toLowerCase();
            if ((buttonText.includes('volver') && buttonText.includes('universo')) || 
                button.getAttribute('onclick')?.includes('closeCurrentGalaxy')) {
                
                if (!button.dataset.libroIntegrated) {
                    console.log("🎯 Botón 'Volver al universo' encontrado - integrando...");
                    button.dataset.libroIntegrated = "true";
                    
                    const originalOnClick = button.onclick;
                    button.onclick = function(event) {
                        console.log("🔗 Botón Volver al Universo clickeado - restaurando audio global");
                        
                        // Ejecutar limpieza del libro primero
                        if (window.currentLibroGalaxy) {
                            window.currentLibroGalaxy.cleanup();
                            window.currentLibroGalaxy = null;
                        }
                        
                        // Luego ejecutar la función original
                        if (originalOnClick) {
                            originalOnClick.call(this, event);
                        } else if (button.getAttribute('onclick')) {
                            // Ejecutar el onclick del atributo si existe
                            eval(button.getAttribute('onclick'));
                        }
                    };
                }
            }
        });
    };
    
    // Buscar el botón periódicamente
    const interval = setInterval(setupButton, 500);
    setTimeout(() => clearInterval(interval), 5000);
}

// DETECTOR DE CIERRE DE GALAXIA MEJORADO
function setupGalaxyCloseDetection() {
    console.log("👀 Configurando detección de cierre de galaxia...");
    
    // Observar cambios en el DOM para detectar cuando se cierra la galaxia
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.removedNodes.forEach((node) => {
                    if (node.nodeType === 1 && 
                        (node.classList.contains('galaxy-container') || 
                         node.id === 'galaxyCanvas' ||
                         node.querySelector('#galaxyCanvas'))) {
                        console.log("🚪 Galaxia cerrada detectada - restaurando audio global");
                        if (window.currentLibroGalaxy) {
                            window.currentLibroGalaxy.cleanup();
                            window.currentLibroGalaxy = null;
                        }
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function initLibroGalaxy(container) {
    console.log("🏰 Inicializando Libro Galaxia...");
    
    if (typeof THREE === 'undefined') {
        console.error("❌ Three.js no está cargado");
        return null;
    }
    
    try {
        const galaxyInstance = new GalaxyLibro(container);
        console.log("🎉 ¡Libro Galaxia creado exitosamente!");
        
        // Configurar integración
        setupLibroIntegration();
        setupGalaxyCloseDetection();
        
        // Hacer la instancia global
        window.currentLibroGalaxy = galaxyInstance;
        
        return galaxyInstance;
    } catch (error) {
        console.error("❌ Error al crear el libro:", error);
        return null;
    }
}

// Inicializar integración cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    setupLibroIntegration();
    setupGalaxyCloseDetection();
});

window.initLibroGalaxy = initLibroGalaxy;
console.log("🔮 Libro Galaxia listo para inicializar");



