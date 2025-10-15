// ===== GALAXIA FINAL CON SISTEMA DE CLAVE CORREGIDO =====

let finalScene, finalCamera, finalRenderer, finalControls;
let finalAnimationId;
let shootingStars = [];
let starField = null;
let isFinalInitialized = false; // NUEVO: Bandera para controlar estado

// CONTRASEÑA ACTUALIZADA
const FINAL_GALAXY_PASSWORD = "Mi hermosa bolita de maldad";

function initFinalGalaxy(canvas, contentContainer) {
    console.log("🚀 Inicializando Galaxia Final - Estado:", isFinalInitialized);
    
    // CORRECCIÓN: Si ya está inicializado, limpiar primero
    if (isFinalInitialized) {
        console.log("🔄 Galaxia Final ya estaba inicializada, limpiando primero...");
        cleanupFinalGalaxy();
    }
    
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
    
    // MARCADOR DE INICIALIZACIÓN COMPLETADA
    isFinalInitialized = true;
    console.log("✅ Galaxia Final inicializada correctamente");
}

function setupFinalScene(canvas) {
    console.log("🎮 Configurando escena de Galaxia Final...");
    
    // CORRECCIÓN: Limpieza más agresiva de escena anterior
    if (finalAnimationId) {
        console.log("🛑 Cancelando animación anterior...");
        cancelAnimationFrame(finalAnimationId);
        finalAnimationId = null;
    }
    
    // CORRECCIÓN: Limpiar completamente el canvas antes de reusarlo
    if (canvas) {
        const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (context) {
            context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
        }
    }
    
    try {
        // CORRECCIÓN: Crear nueva escena desde cero
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
        
        // CORRECCIÓN: Configurar controles con opciones más restrictivas
        finalControls = new THREE.OrbitControls(finalCamera, finalRenderer.domElement);
        finalControls.enableDamping = true;
        finalControls.dampingFactor = 0.05;
        finalControls.enableZoom = true;
        finalControls.minDistance = 20;
        finalControls.maxDistance = 200;
        finalControls.enablePan = false; // CORRECCIÓN: Deshabilitar pan para evitar problemas
        
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
        
        console.log("✅ Escena de Galaxia Final configurada correctamente");
    } catch (error) {
        console.error("❌ Error configurando escena:", error);
        throw error; // Re-lanzar el error para que Galaxy Manager lo capture
    }
}

function createMovingStars() {
    console.log("⭐ Creando estrellas en movimiento...");
    
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3000;
    
    // Crear arrays para posiciones y velocidades
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
    console.log("💫 Creando estrellas fugaces...");
    
    const canvas = document.getElementById('shootingStarsCanvas');
    if (!canvas) {
        console.warn("⚠️ Canvas de estrellas fugaces no encontrado");
        return;
    }
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // CORRECCIÓN: Limpiar array de estrellas fugaces
    shootingStars = [];
    
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
    console.log("🎬 Iniciando animaciones de Galaxia Final");
    
    // CORRECCIÓN: Verificar que todos los componentes estén listos
    if (!finalScene || !finalCamera || !finalRenderer) {
        console.error("❌ Componentes de Three.js no están listos para animar");
        return;
    }
    
    // Animación 3D
    function animate3D() {
        if (!finalScene || !finalCamera || !finalRenderer) {
            console.warn("⚠️ Componentes de Three.js no disponibles, deteniendo animación 3D");
            return;
        }
        
        finalAnimationId = requestAnimationFrame(animate3D);
        
        // Animar movimiento de las estrellas
        if (starField && starField.geometry && starField.geometry.attributes.position) {
            const positions = starField.geometry.attributes.position.array;
            const velocities = starField.userData.velocities;
            
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
            
            starField.geometry.attributes.position.needsUpdate = true;
        }
        
        // Actualizar controles y renderizar
        if (finalControls) {
            finalControls.update();
        }
        finalRenderer.render(finalScene, finalCamera);
    }
    
    // Animación 2D (estrellas fugaces)
    function animate2D() {
        const canvas = document.getElementById('shootingStarsCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // LIMPIAR COMPLETAMENTE el canvas en cada frame
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
    
    // CORRECCIÓN: Iniciar animaciones solo si están listas
    try {
        animate3D();
        animate2D();
        console.log("✅ Animaciones iniciadas correctamente");
    } catch (error) {
        console.error("❌ Error iniciando animaciones:", error);
    }
}

function setupFinalBackButton() {
    console.log("🔙 Configurando botón de volver...");
    
    // Asegurarse de que el botón de volver funcione correctamente
    const backButton = document.getElementById('backButton');
    if (backButton) {
        // CORRECCIÓN: Usar event listener directo sin clonar
        backButton.onclick = () => {
            console.log("🔙 Botón volver clickeado en Galaxia Final");
            
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
                
                if (galaxyView && galaxiesView) {
                    galaxyView.classList.add('hidden');
                    galaxiesView.classList.remove('hidden');
                }
            }
        };
        
        // Asegurar que el botón sea visible
        backButton.style.display = 'block';
    } else {
        console.warn("⚠️ Botón de volver no encontrado");
    }
    
    // Ocultar el botón flotante de volver al universo en vista de galaxia
    const backToUniverseBtn = document.getElementById('backToUniverseBtn');
    if (backToUniverseBtn) {
        backToUniverseBtn.style.display = 'none';
    }
}

function cleanupFinalGalaxy() {
    console.log("🧹 LIMPIEZA CRÍTICA: Limpiando Galaxia Final...");
    
    // CORRECCIÓN: Marcar como no inicializado primero
    isFinalInitialized = false;
    
    // 1. Detener animaciones
    if (finalAnimationId) {
        console.log("🛑 Cancelando animation frame...");
        cancelAnimationFrame(finalAnimationId);
        finalAnimationId = null;
    }
    
    // 2. Limpiar arrays
    shootingStars = [];
    console.log("🗑️ Arrays limpiados");
    
    // 3. Limpiar controles de Three.js
    if (finalControls) {
        console.log("🛑 Disposing controls...");
        finalControls.dispose();
        finalControls = null;
    }
    
    // 4. Limpiar renderer
    if (finalRenderer) {
        console.log("🛑 Disposing renderer...");
        finalRenderer.dispose();
        finalRenderer = null;
    }
    
    // 5. Limpiar escena (más agresivo)
    if (finalScene) {
        console.log("🗑️ Limpiando escena...");
        while(finalScene.children.length > 0) { 
            const child = finalScene.children[0];
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(material => material.dispose());
                } else {
                    child.material.dispose();
                }
            }
            finalScene.remove(child);
        }
        finalScene = null;
    }
    
    // 6. Limpiar cámara y otros objetos
    finalCamera = null;
    starField = null;
    
    // 7. Limpiar canvas de estrellas fugaces
    const shootingStarsCanvas = document.getElementById('shootingStarsCanvas');
    if (shootingStarsCanvas) {
        console.log("🗑️ Limpiando canvas de estrellas fugaces...");
        shootingStarsCanvas.classList.add('hidden');
        const ctx = shootingStarsCanvas.getContext('2d');
        ctx.clearRect(0, 0, shootingStarsCanvas.width, shootingStarsCanvas.height);
    }
    
    // 8. Forzar garbage collection (si es posible)
    if (window.gc) {
        window.gc();
    }
    
    console.log("✅ GALAXIA FINAL LIMPIADA COMPLETAMENTE");
}

// CORRECCIÓN: Manejar redimensionamiento de ventana de forma segura
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

// CORRECCIÓN: Exportar función de limpieza para Galaxy Manager
if (typeof window !== 'undefined') {
    window.cleanupFinalGalaxy = cleanupFinalGalaxy;
}