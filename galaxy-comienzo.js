function initComienzoGalaxy(canvas, contentContainer) {
    console.log('🚀 Inicializando Galaxia del Comienzo - VERSIÓN CORREGIDA');

    // GUARDAR REFERENCIAS CRÍTICAS PARA LIMPIEZA
    const originalCanvas = canvas;
    const originalCanvasStyle = canvas.style.cssText;
    
    // OCULTAR CANVAS TEMPORALMENTE
    canvas.style.display = 'none';
    canvas.style.visibility = 'hidden';

    // Limpiar contenedor de contenido
    contentContainer.innerHTML = '';

    // CREAR CONTENEDOR ESPECÍFICO PARA ESTA GALAXIA
    const comienzoContainer = document.createElement('div');
    comienzoContainer.id = 'comienzoContainer';
    comienzoContainer.style.cssText = `
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        pointer-events: auto;
    `;
    contentContainer.appendChild(comienzoContainer);

    // CREAR NUEVO CANVAS ESPECÍFICO PARA ESTA GALAXIA
    const comienzoCanvas = document.createElement('canvas');
    comienzoCanvas.id = 'comienzoCanvas';
    comienzoCanvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: block;
        pointer-events: auto;
    `;
    comienzoContainer.appendChild(comienzoCanvas);

    // Configuración de Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // RENDERER CON CONFIGURACIÓN ROBUSTA
    const renderer = new THREE.WebGLRenderer({ 
        canvas: comienzoCanvas,
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance"
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000011, 1);
    renderer.autoClear = true;

    // Cargador de texturas
    const textureLoader = new THREE.TextureLoader();

    // Variables para el punto de luz interactivo
    let interactiveLight = null;
    let isRotationPaused = false;
    let isEarthExpanded = false;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Texturas y materiales - SOLO TEXTURA NORMAL DE LA TIERRA
    let normalEarthTexture;
    let earthMaterialNormal;
    let laserSystem = null;
    let controls;
    let animationId;

    // Cargar texturas CON MANEJO DE ERRORES MEJORADO
    function loadTextures() {
        return new Promise((resolve) => {
            // SOLO CARGAR TEXTURA NORMAL DE LA TIERRA
            normalEarthTexture = textureLoader.load(
                'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
                onTextureLoad,
                undefined,
                () => {
                    console.warn('Error cargando textura Tierra, usando color sólido');
                    onTextureLoad();
                }
            );
            
            function onTextureLoad() {
                createMaterials();
                resolve();
            }
            
            function createMaterials() {
                // USAR MATERIALES STANDARD PARA EVITAR ADVERTENCIAS
                earthMaterialNormal = new THREE.MeshStandardMaterial({
                    map: normalEarthTexture,
                    roughness: 0.7,
                    metalness: 0.3
                });
            }
        });
    }

    // Crear fondo estrellado
    function createStarfield() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 15000; // Reducido para mejor rendimiento
        const starPositions = new Float32Array(starCount * 3);
        const starSizes = new Float32Array(starCount);

        for (let i = 0; i < starCount; i++) {
            const radius = 500 + Math.random() * 2000;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            starPositions[i * 3 + 1] = radius * Math.cos(phi);
            starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
            
            starSizes[i] = Math.random() * 1.5 + 0.5;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 1.5,
            sizeAttenuation: true,
            transparent: true,
            opacity: 1,
            depthWrite: false
        });

        const starField = new THREE.Points(starGeometry, starMaterial);
        return starField;
    }

    const starField = createStarfield();
    scene.add(starField);

    // ILUMINACIÓN SUAVE
    const ambientLight = new THREE.AmbientLight(0x888888, 1.0);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xfff4e6, 0.8);
    directionalLight1.position.set(50, 25, 50);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xfff4e6, 0.5);
    directionalLight2.position.set(-25, 12, -25);
    scene.add(directionalLight2);

    // Grupo para la Tierra
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // TIERRA
    const earthSize = 3.64;

    // Crear la Tierra
    function createEarth() {
        const earthGeometry = new THREE.SphereGeometry(earthSize, 64, 64); // Reducida resolución
        
        const earth = new THREE.Mesh(earthGeometry, earthMaterialNormal);
        earthGroup.add(earth);

        return earth;
    }

    let earth;
    let clouds;
    let waterLayer;

    // Crear sistema de nubes
    function createClouds() {
        const cloudsGeometry = new THREE.SphereGeometry(earthSize * 1.015, 64, 64);
        
        const cloudsTexture = textureLoader.load(
            'https://threejs.org/examples/textures/planets/earth_clouds_1024.png',
            undefined,
            undefined,
            () => console.warn('Error cargando nubes')
        );
        
        const cloudsMaterial = new THREE.MeshStandardMaterial({
            map: cloudsTexture,
            color: 0xffffff,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide,
            roughness: 1.0,
            metalness: 0.0
        });

        clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
        earthGroup.add(clouds);
        return clouds;
    }

    // Crear capa de agua
    function createWaterLayer() {
        const waterGeometry = new THREE.SphereGeometry(earthSize * 0.99, 64, 64);
        
        const waterMaterial = new THREE.MeshStandardMaterial({
            color: 0x4d8fff,
            transparent: true,
            opacity: 0.2,
            roughness: 0.2,
            metalness: 0.8,
            side: THREE.DoubleSide
        });

        waterLayer = new THREE.Mesh(waterGeometry, waterMaterial);
        earthGroup.add(waterLayer);
        return waterLayer;
    }

    // Crear punto de luz interactivo en VENEZUELA
    function createInteractiveLight() {
        const lightGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const lightMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6bff,
            emissive: 0xff6bff,
            emissiveIntensity: 1.5
        });
        
        interactiveLight = new THREE.Mesh(lightGeometry, lightMaterial);
        
        // Posicionar en VENEZUELA (coordenadas precisas de Caracas)
        const latitude = 10.5;   // Norte
        const longitude = -66.9; // Oeste
        
        const phi = (90 - latitude) * (Math.PI / 180);
        const theta = (longitude + 180) * (Math.PI / 180);
        
        interactiveLight.position.x = -(earthSize * 1.02) * Math.sin(phi) * Math.cos(theta);
        interactiveLight.position.y = (earthSize * 1.02) * Math.cos(phi);
        interactiveLight.position.z = (earthSize * 1.02) * Math.sin(phi) * Math.sin(theta);
        
        earthGroup.add(interactiveLight);
        
        // Efecto de parpadeo
        let pulseTime = 0;
        
        function pulseAnimation() {
            if (!isRotationPaused && interactiveLight) {
                pulseTime += 0.05;
                const scale = 1 + Math.sin(pulseTime) * 0.3;
                interactiveLight.scale.set(scale, scale, scale);
            }
        }
        
        return pulseAnimation;
    }

    let pulseAnimation;

    // Crear sistema láser integrado con la ventana
    function createLaserSystem() {
        const laserGroup = new THREE.Group();
        
        // Obtener posición de Venezuela
        const venezuelaPosition = getVenezuelaPosition();
        
        // POSICIÓN CORREGIDA: (15, 2, 1) como solicitado
        const windowPosition = new THREE.Vector3(15, 2, 1);
        
        const laserGeometry = new THREE.BufferGeometry().setFromPoints([
            venezuelaPosition,
            windowPosition
        ]);
        
        const laserMaterial = new THREE.LineBasicMaterial({
            color: 0xff6bff,
            transparent: true,
            opacity: 0.8,
            linewidth: 2
        });
        
        const laserLine = new THREE.Line(laserGeometry, laserMaterial);
        laserGroup.add(laserLine);
        
        // Crear efecto de partículas en el láser
        const particleCount = 50; // Reducido para rendimiento
        const particlesGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleColors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const t = i / particleCount;
            const particlePosition = new THREE.Vector3().lerpVectors(
                venezuelaPosition,
                windowPosition,
                t
            );
            
            // Añadir pequeña variación aleatoria para efecto orgánico
            particlePosition.x += (Math.random() - 0.5) * 0.05;
            particlePosition.y += (Math.random() - 0.5) * 0.05;
            particlePosition.z += (Math.random() - 0.5) * 0.05;
            
            particlePositions[i * 3] = particlePosition.x;
            particlePositions[i * 3 + 1] = particlePosition.y;
            particlePositions[i * 3 + 2] = particlePosition.z;
            
            // Colores rosa/morado para las partículas
            particleColors[i * 3] = 1.0;
            particleColors[i * 3 + 1] = 0.4;
            particleColors[i * 3 + 2] = 1.0;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        laserGroup.add(particles);
        
        // Crear punto de impacto en la ventana
        const impactGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const impactMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6bff,
            transparent: true,
            opacity: 0.6,
            emissive: 0xff6bff,
            emissiveIntensity: 0.5
        });
        
        const impactPoint = new THREE.Mesh(impactGeometry, impactMaterial);
        impactPoint.position.copy(windowPosition);
        laserGroup.add(impactPoint);
        
        // Animación del sistema láser
        let time = 0;
        function animateLaser() {
            time += 0.1;
            
            // Animar partículas (movimiento sutil)
            const positions = particlesGeometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                const baseIndex = i * 3;
                const originalX = positions[baseIndex];
                const originalY = positions[baseIndex + 1];
                const originalZ = positions[baseIndex + 2];
                
                positions[baseIndex] = originalX + Math.sin(time + i * 0.5) * 0.01;
                positions[baseIndex + 1] = originalY + Math.cos(time + i * 0.3) * 0.01;
                positions[baseIndex + 2] = originalZ + Math.sin(time + i * 0.7) * 0.01;
            }
            particlesGeometry.attributes.position.needsUpdate = true;
            
            // Pulsación del punto de impacto
            const scale = 1 + Math.sin(time * 2) * 0.2;
            impactPoint.scale.set(scale, scale, scale);
        }
        
        laserGroup.userData.animate = animateLaser;
        return laserGroup;
    }

    // Función auxiliar para obtener la posición de Venezuela
    function getVenezuelaPosition() {
        const latitude = 10.5;
        const longitude = -66.9;
        
        const phi = (90 - latitude) * (Math.PI / 180);
        const theta = (longitude + 180) * (Math.PI / 180);
        
        return new THREE.Vector3(
            -(earthSize * 1.01) * Math.sin(phi) * Math.cos(theta),
            (earthSize * 1.01) * Math.cos(phi),
            (earthSize * 1.01) * Math.sin(phi) * Math.sin(theta)
        );
    }

    // Crear ventana de información como pergamino romántico
    function createInfoWindow() {
        const windowHTML = document.createElement('div');
        windowHTML.id = 'comienzoInfoWindow'; // NOMBRE ÚNICO
        windowHTML.innerHTML = `
            <div class="window-container">
                <div class="parchment-header">
                    <div class="wax-seal">💌</div>
                    <div class="parchment-title">Mensaje Para Ana</div>
                    <button class="close-btn">✕</button>
                </div>
                <div class="parchment-content">
                    <div class="letter-content">
                        <div class="letter-date">30 de Septiembre cuando escribo esto</div>
                        
                        <p class="letter-body">
                            Mi hermosa niña
                        </p>
                        
                        <p class="letter-body">
                            Un dia como hoy, me desperte como cada mañana sin esperar nada especial. Continue
                            mi dia sin ningun pensamiento significativo. Total, no era mas que un dia comùn. Sin
                            embargo todo cambio cuando alguien me invito a hacer algo, sin esperar nada especial. 
                            Segui mi nueva rutina sin pensar que un dia aparecerias ante mis ojos sin ningun aviso, 
                            como si se tratara de un evento especial que cambiaria mi vida para siempre.
                        </p>
                        
                        <p class="letter-body">
                            Desde el momento en que te vi, supe que eras diferente. No era un pensamiento, era un presentimiento
                            algo que me decia que mi vida estaba a punto de cambiar. Y asi fue, porque desde entonces, cada instante 
                            en mi vida se volvio cada vez mas significativo, Cada mañana venia con un nuevo propòsito que aun desconocia.
                            Mis dias se empezaron en centrar en ti. Me empezo a gustar tu presencia, tu voz, tu risa. Empece a mirarte cuando
                            no miraba y a buscarte cuando no estabas, Empece a verte en mis sueños y a pensar en ti en mis momentos de soledad.
                        </p>
                        
                        <p class="letter-body">
                            Sin darme cuenta mis dias se llenaron de ti, mis pensamientos giraban en torno a ti. Cada detalle tuyo
                            me fascinaba. Y empece a caer en ti sin razon, me atraes a ti como la fuerza que ejerce la tierra. Una vez te dije 
                            "Un objeto no tiene que ser grande para hacer un gran cambio" y asi fue, porque tu presencia en mi vida, aunque inesperada, 
                            ha hecho un cambio enorme en mi ser. Has llenado mi vida de alegria, Y no hay forma de agradecerte por eso. 
                        </p>

                        <p class="letter-body">
                            No se que nos depare el futuro, pero si se que quiero seguir descubriendolo contigo a mi lado. No se que haremos mañana,
                            ni que sucedera en un mes, en un año o en diez. Pero de algo si estoy seguro y es que tengo la certeza de que donde sea que te encuentres
                            quiero estar contigo. No necesito una razon para amarte, ni un motivo para quererte. Simplemente sucedio y deje de intentar entenderlo,
                            porque a veces las cosas mas hermosas de la vida no tienen explicacion, simplemente son las mejores cosas que te pasan y llegan sin avisar.
                        </p>

                        <p class="letter-body">
                        Te Amo con la fuerza del viento, Te Amo en la distancia y el tiempo, Te Amo en la alegria y el llanto, Te Amo tanto no sabes cuanto.
                        Te Amo con mi cuerpo y mi alma, Te Amo sin poder compararte, Te Amo como nadie ha de amarte, ¿Ya dije que Te Amo? Te amo.
                        </p>

                        <div class="letter-signature">
                            <p>Te seguire amando aunque el universo mismo se apague</p>
                            <p class="signature">Tu tonto Enamorado.</p>
                        </div>
                        
                        <div class="cosmic-dust"></div>
                    </div>
                </div>
            </div>
        `;
        
        // Ocultar inicialmente
        windowHTML.style.display = 'none';
        comienzoContainer.appendChild(windowHTML); // Añadir al contenedor específico
        
        return windowHTML;
    }

    const infoWindow = createInfoWindow();

    // Función para expandir la Tierra (zoom en Venezuela - VISTA FRONTAL)
    function expandEarth() {
        isRotationPaused = true;
        isEarthExpanded = true;
        
        // DESHABILITAR CONTROLES durante la expansión
        if (controls) {
            controls.enabled = false;
        }
        
        // Ocultar el punto interactivo
        if (interactiveLight) {
            interactiveLight.visible = false;
        }
        
        // CREAR SISTEMA LÁSER - LA TIERRA SE MANTIENE CON SU TEXTURA NORMAL
        if (!laserSystem) {
            laserSystem = createLaserSystem();
            scene.add(laserSystem);
        }
        
        // ROTACIÓN PARA MOSTRAR VENEZUELA DE FRENTE
        const targetRotation = new THREE.Euler(
            -0.1,
            -1.8,
            0.05
        );
        
        // Posición de cámara para enfocar Venezuela frontalmente
        const targetPosition = new THREE.Vector3(
            -2.5,
            1.5,
            earthSize * 0.8
        );
        
        const startRotation = earthGroup.rotation.clone();
        const startPosition = camera.position.clone();
        
        const duration = 2000;
        let startTime = null;
        
        function expansionAnimation(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const t = Math.min(progress / duration, 1);
            
            // Ease out quad
            const easeT = t * (2 - t);
            
            // Rotar Tierra suavemente hacia posición frontal de Venezuela
            earthGroup.rotation.x = startRotation.x + (targetRotation.x - startRotation.x) * easeT;
            earthGroup.rotation.y = startRotation.y + (targetRotation.y - startRotation.y) * easeT;
            earthGroup.rotation.z = startRotation.z + (targetRotation.z - startRotation.z) * easeT;
            
            // Mover cámara suavemente
            camera.position.lerpVectors(startPosition, targetPosition, easeT);
            
            if (t < 1) {
                requestAnimationFrame(expansionAnimation);
            } else {
                // Cuando termina la animación, mostrar la ventana holográfica
                openInfoWindow();
            }
        }
        
        requestAnimationFrame(expansionAnimation);
    }

    // Función para contraer la Tierra (volver a vista normal)
    function contractEarth() {
        isRotationPaused = false;
        isEarthExpanded = false;
        
        // REHABILITAR CONTROLES al contraer
        if (controls) {
            controls.enabled = true;
        }
        
        // Mostrar el punto interactivo
        if (interactiveLight) {
            interactiveLight.visible = true;
        }
        
        // Remover el sistema láser
        if (laserSystem) {
            scene.remove(laserSystem);
            laserSystem = null;
        }
        
        // Posición original de la cámara
        const targetPosition = new THREE.Vector3(0, 1, 13);
        const startPosition = camera.position.clone();
        
        // Rotación original
        const targetRotation = new THREE.Euler(0, 0, 0);
        const startRotation = earthGroup.rotation.clone();
        
        const duration = 1500;
        let startTime = null;
        
        function contractionAnimation(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const t = Math.min(progress / duration, 1);
            
            // Ease out quad
            const easeT = t * (2 - t);
            
            // Rotar Tierra de vuelta
            earthGroup.rotation.x = startRotation.x + (targetRotation.x - startRotation.x) * easeT;
            earthGroup.rotation.y = startRotation.y + (targetRotation.y - startRotation.y) * easeT;
            earthGroup.rotation.z = startRotation.z + (targetRotation.z - startRotation.z) * easeT;
            
            // Mover cámara de vuelta
            camera.position.lerpVectors(startPosition, targetPosition, easeT);
            
            if (t < 1) {
                requestAnimationFrame(contractionAnimation);
            }
        }
        
        requestAnimationFrame(contractionAnimation);
    }

    // Funciones para controlar la ventana de información
    function openInfoWindow() {
        console.log('📖 Abriendo ventana de información');
        
        infoWindow.style.cssText = `
            position: absolute;
            top: 50%;
            right: 20px;
            transform: translateY(-50%) scale(0.8);
            width: 450px;
            height: 650px;
            background: linear-gradient(135deg, #2a0b42 0%, #4a1b6d 100%);
            border-radius: 15px;
            box-shadow: 0 0 40px rgba(255, 107, 255, 0.6);
            z-index: 100;
            overflow: hidden;
            border: 2px solid #ffd700;
            opacity: 0;
            display: flex;
            flex-direction: column;
            font-family: 'Georgia', serif;
            pointer-events: auto;
        `;
        
        // Estilos internos MEJORADOS para mostrar toda la carta
        const style = document.createElement('style');
        style.id = 'comienzoWindowStyles'; // ID ÚNICO
        style.textContent = `
            .window-container {
                height: 100%;
                display: flex;
                flex-direction: column;
            }
            
            .parchment-header {
                background: linear-gradient(90deg, #8b48c7 0%, #a569bd 100%);
                padding: 15px 20px;
                border-bottom: 2px solid #ffd700;
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-shrink: 0;
            }
            
            .wax-seal {
                font-size: 24px;
                background: radial-gradient(circle, #ffd700, #ff6bff);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .parchment-title {
                font-weight: bold;
                color: #ffd700;
                font-size: 18px;
                flex: 1;
                text-align: center;
            }
            
            .close-btn {
                background: #ff6b6b;
                border: 1px solid #ffd700;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .close-btn:hover {
                background: #ff5252;
                transform: scale(1.1);
            }
            
            .parchment-content {
                flex: 1;
                padding: 25px;
                overflow-y: auto;
                color: #f8f1ff;
                line-height: 1.7;
                background: 
                    radial-gradient(circle at 20% 20%, rgba(255, 107, 255, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(147, 112, 219, 0.1) 0%, transparent 50%);
            }
            
            .parchment-content::-webkit-scrollbar {
                width: 8px;
            }
            
            .parchment-content::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
            }
            
            .parchment-content::-webkit-scrollbar-thumb {
                background: #ff6bff;
                border-radius: 4px;
            }
            
            .parchment-content::-webkit-scrollbar-thumb:hover {
                background: #ff88aa;
            }
            
            .letter-content {
                max-height: none;
            }
            
            .letter-date {
                text-align: center;
                font-style: italic;
                color: #ffd700;
                margin-bottom: 25px;
                font-size: 15px;
                border-bottom: 1px solid rgba(255, 215, 0, 0.3);
                padding-bottom: 15px;
            }
            
            .letter-body {
                margin: 20px 0;
                text-align: justify;
                font-size: 15px;
                color: #e8d7ff;
                text-indent: 20px;
            }
            
            .letter-body:first-of-type {
                font-size: 17px;
                color: #ffd700;
                font-weight: bold;
                text-align: center;
                text-indent: 0;
                margin-top: 10px;
            }
            
            .letter-signature {
                margin-top: 40px;
                text-align: right;
                font-style: italic;
                color: #ffd700;
                border-top: 1px solid rgba(255, 215, 0, 0.3);
                padding-top: 20px;
            }
            
            .signature {
                font-family: 'Dancing Script', cursive;
                font-size: 24px;
                color: #ff6bff;
                margin-top: 15px;
            }
            
            .cosmic-dust {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: 
                    radial-gradient(circle at 20% 20%, rgba(255, 107, 255, 0.05) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(147, 112, 219, 0.05) 0%, transparent 50%);
                pointer-events: none;
                opacity: 0.3;
            }
        `;
        
        document.head.appendChild(style);
        
        // Configurar botón de cerrar
        const closeBtn = infoWindow.querySelector('.close-btn');
        closeBtn.onclick = function(event) {
            event.stopPropagation();
            closeInfoWindow();
        };
        
        // Animación de apertura
        setTimeout(() => {
            infoWindow.style.opacity = '1';
            infoWindow.style.transform = 'translateY(-50%) scale(1)';
        }, 10);
    }

    function closeInfoWindow() {
        console.log('🔒 Cerrando ventana de Galaxia Comienzo');
        
        // Animación de cierre
        infoWindow.style.opacity = '0';
        infoWindow.style.transform = 'translateY(-50%) scale(0.8)';
        
        setTimeout(() => {
            infoWindow.style.display = 'none';
            contractEarth();
        }, 500);
    }

    // Posicionar cámara inicial
    camera.position.set(0, 1, 13);

    // Configurar eventos de ratón para el punto interactivo
    function onMouseClick(event) {
        if (isEarthExpanded) return;
        
        // Calcular posición normalizada del ratón
        const rect = comienzoCanvas.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Actualizar raycaster
        raycaster.setFromCamera(mouse, camera);
        
        // Verificar intersección con el punto de luz
        const intersects = raycaster.intersectObject(interactiveLight);
        
        if (intersects.length > 0) {
            expandEarth();
        }
    }

    // Función para manejar tecla ESC
    function onKeyDown(event) {
        if (event.key === 'Escape' && isEarthExpanded) {
            closeInfoWindow();
        }
    }

    // Añadir eventos
    comienzoCanvas.addEventListener('click', onMouseClick);
    window.addEventListener('keydown', onKeyDown);

    // Animación
    function animate() {
        animationId = requestAnimationFrame(animate);

        // Rotación solo si no está pausada
        if (!isRotationPaused && !isEarthExpanded) {
            earthGroup.rotation.y += 0.0008;
            if (clouds) clouds.rotation.y += 0.0012;
            if (waterLayer) waterLayer.rotation.y += 0.0008;
        }

        // Animación del punto de luz (siempre activa)
        if (pulseAnimation) pulseAnimation();

        // Animación del sistema láser
        if (laserSystem && laserSystem.userData.animate) {
            laserSystem.userData.animate();
        }

        if (controls) controls.update();
        
        try {
            renderer.render(scene, camera);
        } catch (error) {
            console.error('Error renderizando Galaxia Comienzo:', error);
        }
    }

    // Manejar redimensionamiento
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onWindowResize);

    // Inicialización asíncrona
    async function initialize() {
        try {
            await loadTextures();
            
            // Crear Tierra después de cargar texturas
            earth = createEarth();
            clouds = createClouds();
            waterLayer = createWaterLayer();
            pulseAnimation = createInteractiveLight();
            
            // Inicializar controles
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.minDistance = 7;
            controls.maxDistance = 30;
            
            // Iniciar animación
            animate();
            
            console.log('✅ Galaxia Comienzo inicializada correctamente');
            
        } catch (error) {
            console.error('❌ Error durante la inicialización:', error);
        }
    }

    // Iniciar todo
    initialize();

    // FUNCIÓN DE LIMPIEZA MEJORADA - VERSIÓN CORREGIDA
    function cleanup() {
        console.log('🧹 LIMPIANDO GALAXIA COMIENZO...');
        
        // 1. DETENER ANIMACIÓN
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        
        // 2. REMOVER EVENT LISTENERS
        if (comienzoCanvas) {
            comienzoCanvas.removeEventListener('click', onMouseClick);
        }
        window.removeEventListener('resize', onWindowResize);
        window.removeEventListener('keydown', onKeyDown);
        
        // 3. DISPOSAR CONTROLES THREE.JS
        if (controls) {
            controls.dispose();
            controls = null;
        }
        
        // 4. LIMPIAR RECURSOS THREE.JS
        if (scene) {
            scene.traverse((object) => {
                if (object.geometry) {
                    object.geometry.dispose();
                }
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
        }
        
        // 5. DISPOSAR RENDERER
        if (renderer) {
            renderer.dispose();
            renderer.forceContextLoss();
            renderer = null;
        }
        
        // 6. REMOVER ELEMENTOS DOM ESPECÍFICOS
        let styles = document.getElementById('comienzoWindowStyles'); // CAMBIÉ CONST POR LET
        if (styles) {
            styles.remove();
        }
        
        if (comienzoContainer && comienzoContainer.parentNode) {
            comienzoContainer.parentNode.removeChild(comienzoContainer);
        }
        
        // 7. RESTAURAR CANVAS ORIGINAL
        if (originalCanvas) {
            originalCanvas.style.cssText = originalCanvasStyle;
            originalCanvas.style.display = 'block';
            originalCanvas.style.visibility = 'visible';
        }
        
        // 8. FORZAR GARBAGE COLLECTION
        earth = null;
        clouds = null;
        waterLayer = null;
        interactiveLight = null;
        laserSystem = null;
        
        console.log('✅ GALAXIA COMIENZO LIMPIADA COMPLETAMENTE');
        
        // 9. RESTAURAR CONTEXTO WEBGL DEL MANAGER
        setTimeout(() => {
            if (window.galaxyManager && typeof window.galaxyManager.restoreWebGLContext === 'function') {
                console.log('🔧 SOLICITANDO RESTAURACIÓN DE CONTEXTO WEBGL...');
                window.galaxyManager.restoreWebGLContext();
            }
        }, 100);
    }

    // Hacer disponible la función de limpieza
    window.cleanupComienzoGalaxy = cleanup;
    
    return cleanup;
}

window.initComienzoGalaxy = initComienzoGalaxy;