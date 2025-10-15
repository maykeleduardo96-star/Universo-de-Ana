// ===== GALAXIA ANA - CONTENIDO ESPECÍFICO =====
function initAnaGalaxyContent(canvas, contentContainer) {
    // Detección simple de móvil para optimizaciones
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 760;

    // Variables principales
    let scene, camera, renderer, controls;
    let blackHole, accretionDisk;
    let starField;
    let loveTexts = [];
    let zoomIndicator;

    // Mensajes para la Galaxia Ana
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

    // Inicializar Three.js
    function init() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // AJUSTE: 30% más alejado y ligera inclinación hacia abajo
        camera.position.z = 8 * 1.3; // 30% más alejado
        camera.position.y = 2; // Inclinación hacia abajo
        camera.position.x = 1; // Ligero desplazamiento lateral para mejor perspectiva

        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
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

        zoomIndicator = contentContainer.querySelector('.ana-zoom-indicator');

        // Crear escena
        createRealisticBlackHole();
        createRealisticAccretionDisk();
        createStarField();
        createLoveTexts();

        // Ocultar loading
        setTimeout(() => {
            const loadingEl = contentContainer.querySelector('.ana-loading');
            if (loadingEl) loadingEl.style.display = 'none';
        }, 1200);

        // Luces
        const ambientLight = new THREE.AmbientLight(0x333333);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);

        // Resize
        let resizeTimeout = null;
        window.addEventListener('resize', () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(onWindowResize, 120);
        }, { passive: true });

        // Start animation
        animate();
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
        const textContainer = contentContainer;
        const msgs = isMobile ? loveMessagesMobile : loveMessages;
        loveTexts = [];

        msgs.forEach((msg, index) => {
            const textElement = document.createElement('div');
            textElement.className = 'ana-love-text';
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

    // Actualizar posiciones de textos
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
        const discoverMessage = contentContainer.querySelector('.ana-discover-message');
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
        if (!camera || !renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        updateTextPositions();
    }

    // Animación principal
    function animate() {
        requestAnimationFrame(animate);

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

    // Inicializar
    init();
}