// ===== GALAXIA DE CORAZONES - CONTENIDO ORIGINAL =====
function initHeartGalaxyWithFloatingTexts(canvas, contentContainer) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x110022, 1);
    
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(2, 2, 4, 0, 0, -3);
    heartShape.bezierCurveTo(-4, 0, -2, 2, 0, 0);
    
    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, {
        depth: 0.2,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 5
    });
    
    const heartColors = [
        0xff4d88, 0xff88aa, 0xffaacc, 0xffffff, 0x4d4dff, 0x8888ff, 0xaaccff
    ];
    
    const hearts = [];
    
    for (let i = 0; i < 20; i++) {
        const heartMaterial = new THREE.MeshPhongMaterial({
            color: heartColors[i % heartColors.length],
            emissive: heartColors[i % heartColors.length],
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.8
        });
        
        const heart = new THREE.Mesh(heartGeometry, heartMaterial);
        heart.position.x = (Math.random() - 0.5) * 20;
        heart.position.y = (Math.random() - 0.5) * 20;
        heart.position.z = (Math.random() - 0.5) * 20;
        heart.rotation.x = Math.random() * Math.PI;
        heart.rotation.y = Math.random() * Math.PI;
        heart.scale.setScalar(Math.random() * 0.5 + 0.3);
        
        scene.add(heart);
        hearts.push(heart);
    }
    
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 50;
        starPositions[i * 3 + 1] = (Math.random() - 0.5) * 50;
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 50;
        
        const colorType = i % 3;
        if (colorType === 0) {
            starColors[i * 3] = 1.0;
            starColors[i * 3 + 1] = 1.0;
            starColors[i * 3 + 2] = 1.0;
        } else if (colorType === 1) {
            starColors[i * 3] = 0.4 + Math.random() * 0.3;
            starColors[i * 3 + 1] = 0.6 + Math.random() * 0.4;
            starColors[i * 3 + 2] = 1.0;
        } else {
            starColors[i * 3] = 1.0;
            starColors[i * 3 + 1] = 0.6 + Math.random() * 0.3;
            starColors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
        }
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        size: 0.3,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xff4d88, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    const blueLight = new THREE.PointLight(0x4d4dff, 0.5, 80);
    blueLight.position.set(-10, -5, 5);
    scene.add(blueLight);
    
    camera.position.z = 33;
    
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.minDistance = 33;
    controls.maxDistance = 33;
    
    // Variables para los textos flotantes
    const heartTexts = [];
    const heartMessages = [
        "Te Amo Ana", "Mi corazón es tuyo", "Eres mi todo Ana", 
        "Mi amor eterno", "Eres mi sueño Ana", "Mi destino",
        "Cada latido es por ti", "Eres mi inspiración", "Mi razón",
        "Te Amo infinito", "Eres mi felicidad", "Mi complemento",
        "Te Amo con locura", "Mi alma", "Eres mi paz Ana",
        "Mi refugio", "Te Amo profundamente", "Mi confidente",
        "Eres mi fuerza", "Mi motivación"
    ];

    let currentGroup = [];
    let textTimer = null;
    
    // Crear textos flotantes
    function createHeartTexts() {
        const textContainer = contentContainer;
        heartTexts.length = 0;

        heartMessages.forEach((msg, index) => {
            const textElement = document.createElement('div');
            textElement.className = 'heart-text';
            textElement.textContent = msg;
            textElement.style.opacity = '0';
            
            textElement.style.fontFamily = 'Quicksand, sans-serif';
            textElement.style.color = '#ffccff';
            textElement.style.textShadow = '0 0 10px rgba(255, 204, 255, 0.9), 0 0 20px rgba(255, 153, 204, 0.7)';

            const baseSize = 36;
            const sizeVariation = Math.random() * 12;
            textElement.style.fontSize = `${baseSize + sizeVariation}px`;
            textElement.style.fontWeight = '600';

            textContainer.appendChild(textElement);

            const layer = Math.floor(index / 5);
            const distance = 8 + (layer * 10) + (Math.random() * 8);
            const phi = Math.acos(-1 + (2 * (index % 5)) / 5);
            const theta = Math.sqrt(5 * Math.PI) * phi;

            const x = distance * Math.cos(theta) * Math.sin(phi);
            const y = distance * Math.sin(theta) * Math.sin(phi);
            const z = distance * Math.cos(phi);

            const variation = 3;
            heartTexts.push({
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

    // Función para mostrar grupo de textos
    function showTextGroup() {
        currentGroup.forEach(text => {
            text.element.style.opacity = '0';
        });
        
        const visibleTexts = heartTexts.filter(text => {
            const vector = text.position.clone();
            vector.project(camera);
            return vector.z < 1;
        });
        
        const availableTexts = visibleTexts.length >= 4 ? visibleTexts : heartTexts;
        
        currentGroup = availableTexts
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
        
        currentGroup.forEach(text => {
            text.element.style.opacity = '1';
        });
        
        const duration = 3000 + Math.random() * 4000;
        if (textTimer) clearTimeout(textTimer);
        textTimer = setTimeout(showTextGroup, duration);
    }

    // Actualizar posiciones de textos
    function updateTextPositions() {
        if (!camera) return;

        for (let i = 0; i < heartTexts.length; i++) {
            const text = heartTexts[i];
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

            const scale = Math.max(0.5, Math.min(2, 30 / textDistance));

            const el = text.element;
            el.style.display = 'block';
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
            el.style.transform = `translate(-50%, -50%) scale(${scale})`;
            text.visible = (textDistance < 35);
        }

        const visibleTexts = heartTexts.filter(t => t.visible).length;
        const discoverMessage = contentContainer.querySelector('.heart-discover-message');
        if (discoverMessage) {
            if (visibleTexts === 0) {
                discoverMessage.textContent = "Gira la cámara para descubrir mensajes de amor...";
            } else if (visibleTexts < 5) {
                discoverMessage.textContent = `Has encontrado ${visibleTexts} mensaje${visibleTexts !== 1 ? 's' : ''} de amor`;
            } else {
                discoverMessage.textContent = `¡Mi corazón late fuerte! ${visibleTexts} mensajes de amor`;
            }
        }
    }

    // Detectar movimiento de cámara
    let lastCameraPosition = camera.position.clone();
    let lastCameraRotation = camera.rotation.clone();
    
    function checkCameraMovement() {
        const positionChanged = !lastCameraPosition.equals(camera.position);
        const rotationChanged = !lastCameraRotation.equals(camera.rotation);
        
        if (positionChanged || rotationChanged) {
            if (!textTimer) {
                showTextGroup();
            }
            
            lastCameraPosition.copy(camera.position);
            lastCameraRotation.copy(camera.rotation);
        }
    }

    // Ocultar mensaje de carga
    setTimeout(() => {
        const loadingEl = contentContainer.querySelector('.heart-loading');
        if (loadingEl) loadingEl.style.display = 'none';
    }, 2000);

    // Crear textos
    setTimeout(() => {
        createHeartTexts();
        setTimeout(showTextGroup, 1000);
    }, 1000);

    const animate = function () {
        requestAnimationFrame(animate);
        
        hearts.forEach(heart => {
            heart.rotation.y += 0.01;
            heart.rotation.x += 0.005;
        });
        
        stars.rotation.y += 0.001;
        
        updateTextPositions();
        checkCameraMovement();
        controls.update();
        renderer.render(scene, camera);
    };
    
    animate();

    // Manejar redimensionado
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        updateTextPositions();
    });
}