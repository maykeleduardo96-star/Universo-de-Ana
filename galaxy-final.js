// ===== GALAXIA FINAL CON SISTEMA DE CLAVE =====

let finalScene, finalCamera, finalRenderer, finalControls;
let finalAnimationId;
let shootingStars = [];
let starField = null;

// CONTRASEÑA ACTUALIZADA
const FINAL_GALAXY_PASSWORD = "Mi hermosa bolita de maldad";

function initFinalGalaxy(canvas, contentContainer) {
    console.log("Inicializando Galaxia Final");
    
    const galaxyCanvas = canvas || document.getElementById('galaxyCanvas');
    
    // Limpiar cualquier contenido anterior
    contentContainer.innerHTML = '';
    
    // Mostrar el canvas de estrellas fugaces
    const shootingStarsCanvas = document.getElementById('shootingStarsCanvas');
    if (shootingStarsCanvas) {
        shootingStarsCanvas.classList.remove('hidden');
    }
    
    // Mostrar contenido de la Galaxia Final con FUENTE MÁS ROMÁNTICA
    contentContainer.innerHTML = `
        <div class="final-central-message" style="transform: translate(5%, -10%); font-family: 'Brush Script MT', 'Lucida Calligraphy', 'Apple Chancery', cursive; font-weight: normal; letter-spacing: 1px; line-height: 1.3;">
            <div class="final-main-text" style="font-family: inherit; font-weight: inherit; letter-spacing: inherit; line-height: inherit; font-size: 2.8em;">
                ¿Final? Pero si apenas estamos comenzando mi amor...
            </div>
            <div class="final-main-text" style="margin-top: 40px; font-size: 2.3em; line-height: 1.2; font-family: inherit; font-weight: inherit; letter-spacing: inherit;">
                Este es el inicio de nuestra eternidad juntos
            </div>
        </div>
    `;
    
    // Configurar la escena 3D
    setupFinalScene(galaxyCanvas);
    
    // Configurar el botón de volver correctamente
    setupFinalBackButton();
    
    // Iniciar animaciones
    startFinalAnimations();
}

function setupFinalScene(canvas) {
    // Limpiar escena anterior si existe
    if (finalAnimationId) {
        cancelAnimationFrame(finalAnimationId);
        finalAnimationId = null;
    }
    
    finalScene = new THREE.Scene();
    finalCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    finalRenderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    
    finalRenderer.setSize(window.innerWidth, window.innerHeight);
    finalRenderer.setClearColor(0x000011, 1);
    
    // Configurar cámara
    finalCamera.position.z = 50;
    
    // Configurar controles
    finalControls = new THREE.OrbitControls(finalCamera, finalRenderer.domElement);
    finalControls.enableDamping = true;
    finalControls.dampingFactor = 0.05;
    finalControls.enableZoom = true;
    finalControls.minDistance = 20;
    finalControls.maxDistance = 200;
    
    // Crear estrellas de fondo CON MOVIMIENTO
    createMovingStars();
    
    // Configurar iluminación
    const ambientLight = new THREE.AmbientLight(0x333333);
    finalScene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    finalScene.add(directionalLight);
    
    // Crear efecto de estrellas fugaces
    createShootingStars();
}

function createMovingStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3000; // Más estrellas para mejor efecto de movimiento
    
    // Crear arrays para posiciones y velocidades
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const velocities = new Float32Array(starCount * 3); // Velocidades para cada estrella
    
    for (let i = 0; i < starCount; i++) {
        // Posiciones aleatorias en un espacio más amplio
        positions[i * 3] = (Math.random() - 0.5) * 3000;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 3000;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 3000;
        
        // Todas las estrellas blancas con variaciones sutiles
        const brightness = Math.random() * 0.3 + 0.7; // 0.7 a 1.0 de brillo
        colors[i * 3] = brightness;     // R
        colors[i * 3 + 1] = brightness; // G
        colors[i * 3 + 2] = brightness; // B
        
        // Velocidades aleatorias para movimiento natural
        velocities[i * 3] = (Math.random() - 0.5) * 0.2;     // Velocidad X
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1; // Velocidad Y  
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.3; // Velocidad Z
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        size: 1.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true
    });
    
    starField = new THREE.Points(starGeometry, starMaterial);
    starField.userData = {
        velocities: velocities,
        positions: positions
    };
    
    finalScene.add(starField);
}

function createShootingStars() {
    // Crear estrellas fugaces en el canvas 2D
    const canvas = document.getElementById('shootingStarsCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    for (let i = 0; i < 5; i++) {
        shootingStars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: Math.random() * 10 + 5,
            length: Math.random() * 50 + 30,
            opacity: Math.random() * 0.5 + 0.5,
            angle: Math.random() * Math.PI * 2
        });
    }
}

function startFinalAnimations() {
    console.log("Iniciando animaciones de Galaxia Final");
    
    // Animación 3D
    function animate3D() {
        finalAnimationId = requestAnimationFrame(animate3D);
        
        // Animar movimiento de las estrellas
        if (starField) {
            const positions = starField.geometry.attributes.position.array;
            const velocities = starField.userData.velocities;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Mover cada estrella según su velocidad
                positions[i] += velocities[i];     // X
                positions[i + 1] += velocities[i + 1]; // Y
                positions[i + 2] += velocities[i + 2]; // Z
                
                // Si la estrella sale del área visible, resetear su posición
                if (Math.abs(positions[i]) > 1500 || 
                    Math.abs(positions[i + 1]) > 1500 || 
                    Math.abs(positions[i + 2]) > 1500) {
                    
                    positions[i] = (Math.random() - 0.5) * 3000;
                    positions[i + 1] = (Math.random() - 0.5) * 3000;
                    positions[i + 2] = (Math.random() - 0.5) * 3000;
                }
            }
            
            starField.geometry.attributes.position.needsUpdate = true;
        }
        
        // Actualizar controles y renderizar
        finalControls.update();
        finalRenderer.render(finalScene, finalCamera);
    }
    
    // Animación 2D (estrellas fugaces)
    function animate2D() {
        const canvas = document.getElementById('shootingStarsCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // LIMPIAR COMPLETAMENTE el canvas en cada frame (sin rastro)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar estrellas fugaces
        shootingStars.forEach((star, index) => {
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(
                star.x + Math.cos(star.angle) * star.length,
                star.y + Math.sin(star.angle) * star.length
            );
            
            ctx.strokeStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Mover estrella
            star.x += Math.cos(star.angle) * star.speed;
            star.y += Math.sin(star.angle) * star.speed;
            
            // Resetear si sale de la pantalla
            if (star.x < -star.length || star.x > canvas.width + star.length ||
                star.y < -star.length || star.y > canvas.height + star.length) {
                star.x = Math.random() * canvas.width;
                star.y = Math.random() * canvas.height;
                star.angle = Math.random() * Math.PI * 2;
                star.opacity = Math.random() * 0.5 + 0.5;
            }
            
            // Variar opacidad para efecto de parpadeo
            star.opacity -= 0.01;
            if (star.opacity <= 0) {
                star.opacity = Math.random() * 0.5 + 0.5;
            }
        });
        
        requestAnimationFrame(animate2D);
    }
    
    animate3D();
    animate2D();
}

function setupFinalBackButton() {
    // Asegurarse de que el botón de volver funcione correctamente
    const backButton = document.getElementById('backButton');
    if (backButton) {
        // Remover event listeners anteriores para evitar duplicados
        const newBackButton = backButton.cloneNode(true);
        backButton.parentNode.replaceChild(newBackButton, backButton);
        
        // Agregar el event listener correcto
        newBackButton.addEventListener('click', () => {
            console.log("Botón volver clickeado en Galaxia Final");
            
            // Limpiar primero la galaxia actual
            cleanupFinalGalaxy();
            
            // Luego usar el método del GalaxyManager para volver al universo COMPLETO
            if (window.galaxyManager && typeof window.galaxyManager.showGalaxyView === 'function') {
                window.galaxyManager.showGalaxyView(false);
            } else {
                // Fallback si no está disponible el GalaxyManager
                console.error("GalaxyManager no disponible");
                const galaxiesView = document.getElementById('galaxiesView');
                const galaxyView = document.getElementById('galaxyView');
                
                galaxyView.classList.add('hidden');
                galaxiesView.classList.remove('hidden');
            }
        });
    }
    
    // Ocultar el botón flotante de volver al universo en vista de galaxia
    const backToUniverseBtn = document.getElementById('backToUniverseBtn');
    if (backToUniverseBtn) {
        backToUniverseBtn.style.display = 'none';
    }
}

function cleanupFinalGalaxy() {
    console.log("🧹 Limpiando Galaxia Final...");
    
    // Limpiar recursos cuando se sale de la Galaxia Final
    if (finalAnimationId) {
        cancelAnimationFrame(finalAnimationId);
        finalAnimationId = null;
    }
    
    // Limpiar arrays
    shootingStars = [];
    
    // Limpiar escena Three.js
    if (finalScene) {
        while(finalScene.children.length > 0) { 
            finalScene.remove(finalScene.children[0]); 
        }
        finalScene = null;
    }
    
    // Limpiar controles
    if (finalControls) {
        finalControls.dispose();
        finalControls = null;
    }
    
    // Limpiar renderer
    if (finalRenderer) {
        finalRenderer.dispose();
        finalRenderer = null;
    }
    
    // Limpiar cámara
    finalCamera = null;
    starField = null;
    
    // Ocultar canvas de estrellas fugaces
    const shootingStarsCanvas = document.getElementById('shootingStarsCanvas');
    if (shootingStarsCanvas) {
        shootingStarsCanvas.classList.add('hidden');
        
        // Limpiar el canvas
        const ctx = shootingStarsCanvas.getContext('2d');
        ctx.clearRect(0, 0, shootingStarsCanvas.width, shootingStarsCanvas.height);
    }
    
    console.log("✅ Galaxia Final limpiada correctamente");
}

// Manejar redimensionamiento de ventana
window.addEventListener('resize', function() {
    if (finalCamera && finalRenderer) {
        finalCamera.aspect = window.innerWidth / window.innerHeight;
        finalCamera.updateProjectionMatrix();
        finalRenderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    const shootingStarsCanvas = document.getElementById('shootingStarsCanvas');
    if (shootingStarsCanvas) {
        shootingStarsCanvas.width = window.innerWidth;
        shootingStarsCanvas.height = window.innerHeight;
    }
});