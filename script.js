// script.js
document.addEventListener('DOMContentLoaded', function() {
    const universeContainer = document.getElementById('universeContainer');
    let galaxyExpanded = false;
    
    // Detección simple de móvil para optimizaciones
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 760;

    // Variables para la galaxia de amor
    let scene, camera, renderer, controls;
    let blackHole, accretionDisk;
    let starField;
    let loveTexts = [];
    let zoomIndicator;
    let backgroundMusic, playPauseBtn, volumeSlider;
    let isPlaying = false;

    // Variables para la vista de Andrómeda
    let andromedaScene, andromedaCamera, andromedaRenderer, andromedaControls, raycaster, mouse;
    let andromedaGalaxy, backgroundStars, distantGalaxies = [];

    // Mensajes de amor
    const loveMessages = [
        "Te amo", "Te quiero", "Me encantas", "Te adoro", 
        "Eres mi persona favorita", "Eres mi sueño", "Eres mi todo", 
        "Eres hermosa", "Eres única", "Eres especial", 
        "Eres increíble", "Eres perfecta", "Eres maravillosa", 
        "Eres mi sol", "Eres mi luz", "Eres mi alegría", 
        "Eres mi inspiración", "Eres mi razón", "Eres mi destino", 
        "Eres mi felicidad", "Eres mi paz", "Eres mi vida", 
        "Eres mi amor", "Eres mi cielo", "Eres mi estrella", 
        "Eres mi universo", "Eres mi todo", "Eres mi pasión", 
        "Eres mi deseo", "Eres mi energía", "Eres mi fortuna", 
        "Eres mi complemento", "Eres mi media naranja", "Eres mi alma gemela", 
        "Eres mi complicidad", "Eres mi confidente", "Eres mi refugio", 
        "Eres mi hogar", "Eres mi ritmo", "Eres mi melodía", 
        "Eres mi poesía", "Eres mi arte", "Eres mi musa", 
        "Eres mi canción", "Eres mi baile", "Eres mi viaje", 
        "Eres mi aventura", "Eres mi descanso", "Eres mi norte", 
        "Eres mi sur", "Eres mi este", "Eres mi oeste", 
        "Eres mi día", "Eres mi noche", "Eres mi amanecer", 
        "Eres mi atardecer", "Eres mi verano", "Eres mi invierno", 
        "Eres mi primavera", "Eres mi otoño", "Eres mi risa", 
        "Eres mi llanto", "Eres mi silencio", "Eres mi voz", 
        "Eres mi fuerza", "Eres mi vulnerabilidad", "Eres mi certeza", 
        "Eres mi duda", "Eres mi quietud", "Eres mi movimiento", 
        "Eres mi paz", "Eres mi guerra", "Eres mi Yin", 
        "Eres mi Yang", "Eres mi equilibrio", "Eres mi caos", 
        "Eres mi comienzo", "Eres mi final", "Eres mi infinito", 
        "Eres mi eternidad", "Eres mi presente", "Eres mi futuro", 
        "Eres mi pasado", "Eres mi historia", "Eres mi realidad", 
        "Eres mi fantasía", "Eres mi magia", "Eres mi milagro", 
        "Eres mi tesoro", "Eres mi regalo", "Eres mi bendición", 
        "Eres mi sonrisa", "Eres mi mirada", "Eres mi respiro", 
        "Eres mi latido", "Eres mi calor", "Eres mi frío", 
        "Eres mi fuego", "Eres mi agua", "Eres mi tierra", 
        "Eres mi aire", "Eres mi esencia", "Eres mi existencia"
    ];

    // Lista reducida para móviles
    const loveMessagesMobile = loveMessages.slice(0, 40);

    // Contenido para cada galaxia fija (puedes personalizar esto con mensajes, imágenes, etc.)
    const galaxyContents = [
        { title: "Galaxia 1: Nuestro Primer Encuentro", content: "Aquí comenzó nuestra historia de amor..." },
        { title: "Galaxia 2: Tus Sonrisas", content: "Cada sonrisa tuya ilumina mi mundo..." },
        { title: "Galaxia 3: Nuestros Viajes", content: "Recuerdos de aventuras juntos..." },
        { title: "Galaxia 4: Tus Ojos", content: "Me pierdo en la profundidad de tus ojos..." },
        { title: "Galaxia 5: Nuestro Futuro", content: "Imaginando una vida eterna juntos..." },
        { title: "Galaxia 6: Tus Abrazos", content: "El lugar más seguro del universo..." },
        { title: "Galaxia 7: Nuestras Canciones", content: "Melodías que nos unen..." },
        { title: "Galaxia 8: Tus Sueños", content: "Apoyándote en cada aspiración..." },
        { title: "Galaxia 9: Nuestro Amor Eterno", content: "Un lazo que trasciende el tiempo..." },
        { title: "Galaxia 10: Tú y Yo", content: "El dúo perfecto en el cosmos..." }
    ];

    // Inicializar la vista de Andrómeda
    function initAndromedaView() {
        andromedaScene = new THREE.Scene();
        
        andromedaCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
        andromedaCamera.position.z = 50;
        
        andromedaRenderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('andromedaCanvas'),
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        
        const DPR = Math.min(window.devicePixelRatio || 1, 2);
        andromedaRenderer.setPixelRatio(DPR);
        andromedaRenderer.setSize(window.innerWidth, window.innerHeight);
        andromedaRenderer.setClearColor(0x000011, 1);
        
        // Controles para Andrómeda
        andromedaControls = new THREE.OrbitControls(andromedaCamera, andromedaRenderer.domElement);
        andromedaControls.enableDamping = true;
        andromedaControls.dampingFactor = 0.05;
        andromedaControls.enablePan = false;

        // Crear galaxia Andrómeda principal con textura hiperrealista
        createAndromedaGalaxy();

        // Crear estrellas de fondo
        createBackgroundStars();
        
        // Crear 10 galaxias distantes fijas y clickeables
        createFixedDistantGalaxies();
        
        // Configurar raycaster para clics
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
        andromedaRenderer.domElement.addEventListener('click', onGalaxyClick, false);
        
        // Animación de la vista de Andrómeda
        animateAndromeda();
    }
    
    // Crear representación hiperrealista de Andrómeda usando textura
    function createAndromedaGalaxy() {
        const loader = new THREE.TextureLoader();
        // Usa una textura de galaxia real (puedes reemplazar con una URL de GIF o imagen de alta resolución, e.g., de NASA)
        // Para GIF animado, necesitarías un approach diferente, como un sprite animado, pero por simplicidad usamos imagen estática hiperreal.
        // Ejemplo: 'https://www.nasa.gov/sites/default/files/thumbnails/image/main_image_galaxies_stephans_quintet_sq_nircam_miri_webbpotm2207a16k.png'
        const galaxyTexture = loader.load('https://upload.wikimedia.org/wikipedia/commons/9/98/Andromeda_Galaxy_%28with_h-alpha%29.jpg'); // Textura de Andrómeda real (puedes cambiarla)

        // Núcleo
        const coreGeometry = new THREE.SphereGeometry(3, 64, 64);
        const coreMaterial = new THREE.MeshBasicMaterial({ 
            map: galaxyTexture,
            color: 0xffccaa,
            transparent: true,
            opacity: 0.9
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        andromedaScene.add(core);
        
        // Disco espiral
        const diskGeometry = new THREE.RingGeometry(3, 15, 128);
        const diskMaterial = new THREE.MeshBasicMaterial({
            map: galaxyTexture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7
        });
        const disk = new THREE.Mesh(diskGeometry, diskMaterial);
        disk.rotation.x = Math.PI / 2;
        andromedaScene.add(disk);
        
        // Estrellas en brazos
        const spiralStarsGeometry = new THREE.BufferGeometry();
        const spiralStarsCount = 2000;
        const spiralStarsPositions = new Float32Array(spiralStarsCount * 3);
        
        for (let i = 0; i < spiralStarsCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 3 + Math.random() * 12;
            const height = (Math.random() - 0.5) * 2;
            
            spiralStarsPositions[i * 3] = Math.cos(angle) * radius;
            spiralStarsPositions[i * 3 + 1] = height;
            spiralStarsPositions[i * 3 + 2] = Math.sin(angle) * radius;
        }
        
        spiralStarsGeometry.setAttribute('position', new THREE.BufferAttribute(spiralStarsPositions, 3));
        const spiralStarsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            sizeAttenuation: true
        });
        const spiralStars = new THREE.Points(spiralStarsGeometry, spiralStarsMaterial);
        andromedaScene.add(spiralStars);
        
        andromedaGalaxy = new THREE.Group();
        andromedaGalaxy.add(core);
        andromedaGalaxy.add(disk);
        andromedaGalaxy.add(spiralStars);
    }
    
    // Crear estrellas de fondo
    function createBackgroundStars() {
        const starsGeometry = new THREE.BufferGeometry();
        const starsCount = 5000;
        const starsPositions = new Float32Array(starsCount * 3);
        
        for (let i = 0; i < starsCount; i++) {
            starsPositions[i * 3] = (Math.random() - 0.5) * 2000;
            starsPositions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
            starsPositions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
        }
        
        starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.8
        });
        
        backgroundStars = new THREE.Points(starsGeometry, starsMaterial);
        andromedaScene.add(backgroundStars);
    }
    
    // Crear 10 galaxias distantes fijas (posiciones predefinidas, no aleatorias)
    function createFixedDistantGalaxies() {
        const fixedPositions = [
            { x: 100, y: 50, z: 200 },
            { x: -150, y: 100, z: 300 },
            { x: 200, y: -50, z: 400 },
            { x: -250, y: 150, z: 100 },
            { x: 300, y: -100, z: 250 },
            { x: -100, y: 200, z: 350 },
            { x: 150, y: -150, z: 150 },
            { x: -200, y: 50, z: 450 },
            { x: 250, y: 100, z: 50 },
            { x: -300, y: -200, z: 500 }
        ];

        fixedPositions.forEach((pos, index) => {
            const galaxyGroup = new THREE.Group();
            galaxyGroup.position.set(pos.x, pos.y, pos.z);
            
            // Tamaño fijo para consistencia
            const size = 5;
            
            // Tipo alternado para variedad
            const galaxyType = index % 2 === 0 ? 'elliptical' : 'spiral';
            
            if (galaxyType === 'elliptical') {
                const geometry = new THREE.SphereGeometry(size, 32, 32);
                const material = new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setHSL(0.5 + index * 0.1, 0.7, 0.3)
                    // Eliminado 'emissive' para corregir la advertencia
                });
                const galaxy = new THREE.Mesh(geometry, material);
                galaxyGroup.add(galaxy);
            } else {
                const diskGeometry = new THREE.RingGeometry(size * 0.3, size, 64);
                const diskMaterial = new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setHSL(0.4 + index * 0.1, 0.7, 0.4),
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.6
                });
                const disk = new THREE.Mesh(diskGeometry, diskMaterial);
                disk.rotation.x = Math.PI / 2;
                galaxyGroup.add(disk);
            }
            
            // Agregar ID para identificación en clics
            galaxyGroup.userData = { id: index };
            
            andromedaScene.add(galaxyGroup);
            distantGalaxies.push(galaxyGroup);
        });
    }

    // Manejar clic en galaxias
    function onGalaxyClick(event) {
        if (galaxyExpanded) return; // Solo en vista Andrómeda

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, andromedaCamera);

        const intersects = raycaster.intersectObjects(distantGalaxies, true);

        if (intersects.length > 0) {
            const clickedGalaxy = intersects[0].object.parent; // Asumiendo group
            const galaxyId = clickedGalaxy.userData.id;
            
            // Abrir contenido (aquí usamos alert como placeholder; puedes reemplazar con modal, redirect, etc.)
            const content = galaxyContents[galaxyId];
            alert(`${content.title}\n\n${content.content}`);
            
            // Opcional: redirigir a otra página
            // window.location.href = `pagina${galaxyId + 1}.html`;
            
            // O muestra un modal en la página
            // showModal(content.title, content.content);
        } else {
            // Si no se cliquea una galaxia, expandir como antes
            expandUniverse();
        }
    }

    // Función placeholder para modal (puedes implementarla con CSS/JS)
    // function showModal(title, content) {
    //     // Crea un div modal y añádelo al body
    //     const modal = document.createElement('div');
    //     modal.style.position = 'fixed';
    //     modal.style.top = '50%';
    //     modal.style.left = '50%';
    //     modal.style.transform = 'translate(-50%, -50%)';
    //     modal.style.background = '#fff';
    //     modal.style.padding = '20px';
    //     modal.style.color = '#000';
    //     modal.innerHTML = `<h2>${title}</h2><p>${content}</p><button onclick="this.parentNode.remove()">Cerrar</button>`;
    //     document.body.appendChild(modal);
    // }

    // Animación de la vista de Andrómeda
    function animateAndromeda() {
        requestAnimationFrame(animateAndromeda);
        
        // Rotación lenta de la galaxia Andrómeda
        if (andromedaGalaxy) {
            andromedaGalaxy.rotation.y += 0.001;
        }
        
        // Animación individual de galaxias distantes (rotación lenta, sin movimiento de posición)
        distantGalaxies.forEach(galaxy => {
            galaxy.rotation.y += 0.0005; // Animación de rotación fija
        });
        
        andromedaControls.update();
        andromedaRenderer.render(andromedaScene, andromedaCamera);
    }

    // Inicializar Three.js para la galaxia de amor
    function initGalaxy() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 8;

        renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('galaxyCanvas'),
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });

        const DPR = Math.min(window.devicePixelRatio || 1, 2);
        renderer.setPixelRatio(DPR);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000);

        // Controles
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = isMobile ? 0.6 : 1.0;
        controls.zoomSpeed = isMobile ? 0.8 : 1.2;
        controls.enablePan = false;

        zoomIndicator = document.querySelector('.zoom-indicator');

        // Música y controles UI
        backgroundMusic = document.getElementById('backgroundMusic');
        playPauseBtn = document.getElementById('playPauseBtn');
        volumeSlider = document.getElementById('volumeSlider');

        // Inicializa audio seguro
        if (backgroundMusic) {
            backgroundMusic.muted = true;
            backgroundMusic.volume = (volumeSlider ? volumeSlider.value / 100 : 0.7);
            backgroundMusic.preload = 'auto';
        }

        // Registra listeners de audio
        if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause, { passive: true });
        if (volumeSlider) volumeSlider.addEventListener('input', setVolume, { passive: true });

        // Desmutear al primer click/touch
        const activateAudio = function () {
            if (backgroundMusic && backgroundMusic.muted) {
                backgroundMusic.muted = false;
                backgroundMusic.play().then(() => {
                    isPlaying = true;
                    if (playPauseBtn) playPauseBtn.innerHTML = '⏸️';
                }).catch(err => {
                    console.log("Error al reproducir tras interacción:", err);
                });
            }
        };
        document.addEventListener('click', activateAudio, { once: true, passive: true });
        document.addEventListener('touchstart', activateAudio, { once: true, passive: true });

        // Intentar autoplay silencioso
        setTimeout(() => {
            if (backgroundMusic) {
                backgroundMusic.play().then(() => {
                    isPlaying = true;
                    if (playPauseBtn) playPauseBtn.innerHTML = '⏸️';
                }).catch(error => {
                    console.log("La reproducción automática falló:", error);
                });
            }
        }, 500);

        // Crear escena: agujero negro, disco, estrellas y textos
        createRealisticBlackHole();
        createRealisticAccretionDisk();
        createStarField();
        createLoveTexts();

        // Luces
        const ambientLight = new THREE.AmbientLight(0x333333);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);

        // Resize con debounce
        let resizeTimeout = null;
        window.addEventListener('resize', () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(onWindowResize, 120);
        }, { passive: true });

        // Iniciar animación
        animateGalaxy();
    }

    // Toggle play/pause
    function togglePlayPause () {
        if (!backgroundMusic) return;
        if (isPlaying) {
            backgroundMusic.pause();
            playPauseBtn.innerHTML = '▶️';
        } else {
            backgroundMusic.play();
            playPauseBtn.innerHTML = '⏸️';
        }
        isPlaying = !isPlaying;
    }

    function setVolume () {
        if (!backgroundMusic) return;
        backgroundMusic.volume = volumeSlider.value / 100;
    }

    // Crear agujero negro
    function createRealisticBlackHole() {
        const geometry = new THREE.SphereGeometry(1, 64, 64);
        const material = new THREE.MeshPhongMaterial({
            color: 0x000000,
            emissive: 0x220022,
            specular: 0x330033,
            shininess: 100,
            transparent: true,
            opacity: 0.95
        });
        blackHole = new THREE.Mesh(geometry, material);
        scene.add(blackHole);

        const coronaGeometry = new THREE.SphereGeometry(1.1, 64, 64);
        const coronaMaterial = new THREE.ShaderMaterial({
            uniforms: { intensity: { value: 2.0 }, time: { value: 0 } },
            vertexShader: `
                varying vec3 vNormal;
                varying vec2 vUv;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                varying vec2 vUv;
                uniform float intensity;
                uniform float time;
                void main() {
                    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0,0.0,1.0))), 3.0);
                    float waves = sin((vUv.x * 10.0) + time) * 0.5 + 0.5;
                    float opacity = fresnel * intensity * (0.7 + 0.3 * waves);
                    vec3 coronaColor = mix(vec3(0.3,0.1,0.5), vec3(0.5,0.2,0.6), waves);
                    gl_FragColor = vec4(coronaColor, opacity * 0.8);
                }
            `,
            transparent: true,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });
        const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
        scene.add(corona);
    }

    // Crear disco de acreción
    function createRealisticAccretionDisk() {
        const diskGeometry = new THREE.RingGeometry(1.2, 3.5, 128);
        const diskMaterial = new THREE.ShaderMaterial({
            uniforms: { time: { value: 0 }, innerRadius: { value: 1.2 }, outerRadius: { value: 3.5 } },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                uniform float time;
                uniform float innerRadius;
                uniform float outerRadius;
                void main() {
                    float radius = (vUv.x * (outerRadius - innerRadius) + innerRadius);
                    float normalizedRadius = (radius - innerRadius) / (outerRadius - innerRadius);
                    vec3 color1 = vec3(0.8,0.4,0.2);
                    vec3 color2 = vec3(0.6,0.2,0.8);
                    vec3 color3 = vec3(0.2,0.4,0.9);
                    vec3 finalColor;
                    if (normalizedRadius < 0.3) {
                        finalColor = mix(color1, color2, normalizedRadius / 0.3);
                    } else if (normalizedRadius < 0.7) {
                        finalColor = mix(color2, color3, (normalizedRadius - 0.3) / 0.4);
                    } else {
                        finalColor = color3;
                    }
                    float timeVariation = sin(time * 0.5 + normalizedRadius * 10.0) * 0.5 + 0.5;
                    finalColor *= (0.8 + 0.2 * timeVariation);
                    float alpha = 1.0 - smoothstep(0.7, 1.0, normalizedRadius);
                    alpha *= 0.9;
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        accretionDisk = new THREE.Mesh(diskGeometry, diskMaterial);
        accretionDisk.rotation.x = Math.PI/2;
        scene.add(accretionDisk);

        const innerDiskGeometry = new THREE.RingGeometry(1.1, 1.8, 64);
        const innerDiskMaterial = new THREE.ShaderMaterial({
            uniforms: { time: { value: 0 } },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                uniform float time;
                void main() {
                    float intensity = sin(time * 2.0 + vUv.x * 20.0) * 0.5 + 0.5;
                    vec3 hotColor = mix(vec3(1.0,0.9,0.5), vec3(1.0,0.5,0.2), intensity);
                    float alpha = 1.0 - smoothstep(0.0, 1.0, vUv.x);
                    alpha *= 0.9;
                    gl_FragColor = vec4(hotColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        const innerDisk = new THREE.Mesh(innerDiskGeometry, innerDiskMaterial);
        innerDisk.rotation.x = Math.PI/2;
        scene.add(innerDisk);
    }

    // Crear campo de estrellas
    function createStarField() {
        const starGeometry = new THREE.BufferGeometry();
        const count = isMobile ? 4500 : 15000;
        const starVertices = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            starVertices[i*3] = (Math.random() - 0.5) * 2500;
            starVertices[i*3 + 1] = (Math.random() - 0.5) * 2500;
            starVertices[i*3 + 2] = (Math.random() - 0.5) * 2500;
        }
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starVertices, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: isMobile ? 0.08 : 0.1, transparent: true, blending: THREE.AdditiveBlending });
        starField = new THREE.Points(starGeometry, starMaterial);
        scene.add(starField);
    }

    // Crear textos amorosos
    function createLoveTexts() {
        const textContainer = document.body;
        const msgs = isMobile ? loveMessagesMobile : loveMessages;
        loveTexts = [];

        msgs.forEach((msg, index) => {
            const textElement = document.createElement('div');
            textElement.className = 'love-text';
            textElement.textContent = msg;
            textElement.style.animation = `float ${8 + Math.random() * 8}s infinite ease-in-out`;
            textElement.style.animationDelay = `${Math.random() * 5}s`;

            const fonts = ['Dancing Script', 'Pacifico', 'Great Vibes', 'cursive'];
            textElement.style.fontFamily = fonts[Math.floor(Math.random() * fonts.length)];

            const baseSize = isMobile ? 20 : 28;
            const sizeVariation = Math.random() * (isMobile ? 8 : 12);
            textElement.style.fontSize = `${baseSize + sizeVariation}px`;

            textContainer.appendChild(textElement);

            const layer = Math.floor(index / 30);
            const distance = 5 + (layer * 8) + (Math.random() * 6);
            const phi = Math.acos(-1 + (2 * (index % 30)) / 30);
            const theta = Math.sqrt(30 * Math.PI) * phi;

            const x = distance * Math.cos(theta) * Math.sin(phi);
            const y = distance * Math.sin(theta) * Math.sin(phi);
            const z = distance * Math.cos(phi);

            const variation = 2;
            loveTexts.push({
                element: textElement,
                position: new THREE.Vector3(
                    x + (Math.random() - 0.5) * variation,
                    y + (Math.random() - 0.5) * variation,
                    z + (Math.random() - 0.5) * variation
                ),
                size: parseFloat(textElement.style.fontSize),
                visible: false
            });
        });
    }

    // Actualizar posiciones 2D de textos
    function updateTextPositions() {
        if (!camera) return;
        const cameraDistance = camera.position.length();
        const zoomLevel = Math.max(10, Math.min(200, Math.round(1000 / cameraDistance)));
        if (zoomIndicator) zoomIndicator.textContent = `Zoom: ${zoomLevel}%`;

        for (let i = 0; i < loveTexts.length; i++) {
            const text = loveTexts[i];
            const vector = text.position.clone();
            vector.project(camera);
            
            if (vector.z >= 1) {
                if (text.element.style.display !== 'none') text.element.style.display = 'none';
                text.visible = false;
                continue;
            }
            
            const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;
            const textDistance = text.position.distanceTo(camera.position);
            
            const scale = Math.max(0.3, Math.min(2, 15 / textDistance));
            let opacity = 0;
            if (textDistance < 15) {
                opacity = Math.max(0.3, Math.min(1, (15 - textDistance) / 10));
            }

            const el = text.element;
            el.style.display = 'block';
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
            el.style.transform = `translate(-50%, -50%) scale(${scale})`;
            el.style.opacity = opacity;
            text.visible = (textDistance < 20);
        }

        const visibleTexts = loveTexts.filter(t => t.visible).length;
        const discoverMessage = document.querySelector('.discover-message');
        if (discoverMessage) {
            if (visibleTexts === 0) {
                discoverMessage.textContent = "Explora el universo para descubrir mensajes de amor";
            } else if (visibleTexts < 5) {
                discoverMessage.textContent = `Has encontrado ${visibleTexts} mensaje${visibleTexts !== 1 ? 's' : ''} de amor`;
            } else {
                discoverMessage.textContent = `¡Wow! Has descubierto ${visibleTexts} mensajes de amor`;
            }
        }
    }

    function onWindowResize() {
        if (camera && renderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            updateTextPositions();
        }
        
        if (andromedaCamera && andromedaRenderer) {
            andromedaCamera.aspect = window.innerWidth / window.innerHeight;
            andromedaCamera.updateProjectionMatrix();
            andromedaRenderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    // Animación de la galaxia de amor
    function animateGalaxy() {
        requestAnimationFrame(animateGalaxy);

        try {
            if (accretionDisk && accretionDisk.material && accretionDisk.material.uniforms && accretionDisk.material.uniforms.time) {
                accretionDisk.material.uniforms.time.value += 0.01;
            }
        } catch (e) {}

        if (accretionDisk) accretionDisk.rotation.z += isMobile ? 0.0015 : 0.002;
        if (starField) starField.rotation.y += isMobile ? 0.0003 : 0.0005;

        updateTextPositions();
        if (controls) controls.update();
        if (renderer && scene && camera) renderer.render(scene, camera);
    }

    // Función para expandir el universo
    function expandUniverse() {
        if (galaxyExpanded) return;
        
        galaxyExpanded = true;
        universeContainer.classList.add('expanded');
        document.body.style.cursor = 'default';
        
        // Ocultar canvas de Andrómeda y mostrar el de la galaxia
        document.getElementById('andromedaCanvas').style.display = 'none';
        document.getElementById('galaxyCanvas').style.display = 'block';
        
        // Inicializar la galaxia después de la expansión
        setTimeout(() => {
            initGalaxy();
        }, 500);
    }

    // Inicializar la vista de Andrómeda al cargar
    initAndromedaView();
    
    // Evento de clic general ahora manejado en onGalaxyClick (incluye fallback a expandir si no es galaxia)
});