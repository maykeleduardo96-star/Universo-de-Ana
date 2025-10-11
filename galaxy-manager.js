// ===== GALAXY MANAGER =====
class GalaxyManager {
    constructor() {
        // Galaxias organizadas en forma de agujas del reloj alrededor de Ana
        const baseRadius = 1200;
        
        // Definir colores únicos para cada galaxia
        this.galaxies = [
            // Galaxia Ana en el centro - colores rosas/morados
            { 
                id: 'ana', 
                name: 'Galaxia Ana', 
                x: 0, y: -50, z: 0, 
                size: 80,
                color: { core: 0xff4d88, disk: 0xff88aa, halo: 0xffaacc },
                rotation: { x: 0.3, y: 0, z: 0 }
            },
            
            // Galaxias organizadas en forma de agujas del reloj
            { 
                id: 'andromeda', 
                name: 'Andrómeda', 
                x: baseRadius * Math.cos(Math.PI/4), 
                y: baseRadius * Math.sin(Math.PI/4), 
                z: -800, 
                size: 55,
                color: { core: 0x4d4dff, disk: 0x6666ff, halo: 0x8888ff },
                rotation: { x: 0.2, y: 0, z: 0.1 }
            },
            
            // CAMBIO: Vía Láctea -> Galaxia Laberinto
            { 
                id: 'laberinto', 
                name: 'Galaxia Laberinto', 
                x: baseRadius, y: 0, z: -1000, 
                size: 60,
                color: { core: 0xffff4d, disk: 0xffff66, halo: 0xffff88 },
                rotation: { x: 0.4, y: 0, z: 0.2 }
            },
            
            // Galaxia Final (reemplaza a Ojo Negro)
            { 
                id: 'final', 
                name: 'Galaxia Final', 
                x: baseRadius * Math.cos(7*Math.PI/4), 
                y: baseRadius * Math.sin(7*Math.PI/4), 
                z: -700, 
                size: 60,
                color: { core: 0xff69b4, disk: 0xff1493, halo: 0xff00ff },
                rotation: { x: 0.1, y: 0, z: 0.3 }
            },
            
            { 
                id: 'pinwheel', 
                name: 'Galaxia De Corazones', 
                x: 0, y: -baseRadius + 400, z: -1200, 
                size: 50,
                color: { core: 0xff4d4d, disk: 0xff6666, halo: 0xff8888 },
                rotation: { x: 0.3, y: 0, z: 0.1 }
            },
            
            // Galaxia Libro
            { 
                id: 'libro', 
                name: 'Galaxia Libro', 
                x: baseRadius * Math.cos(5*Math.PI/4), 
                y: baseRadius * Math.sin(5*Math.PI/4), 
                z: -780, 
                size: 60,
                color: { core: 0x4dffff, disk: 0x66ffff, halo: 0x88ffff },
                rotation: { x: 0.2, y: 0, z: 0.2 }
            },
            
            // Galaxia del Comienzo
            { 
                id: 'comienzo', 
                name: 'Galaxia del Comienzo', 
                x: -baseRadius, y: 0, z: -1000, 
                size: 50,
                color: { core: 0xff4dff, disk: 0xff66ff, halo: 0xff88ff },
                rotation: { x: 0.5, y: 0, z: 0.3 }
            },
            
            { 
                id: 'musica', 
                name: 'Galaxia Música', 
                x: baseRadius * Math.cos(3*Math.PI/4), 
                y: baseRadius * Math.sin(3*Math.PI/4), 
                z: -900, 
                size: 50,
                color: { core: 0xffa54d, disk: 0xffb366, halo: 0xffc188 },
                rotation: { x: 0.2, y: 0, z: 0.4 }
            },
            
            { 
                id: 'orion', 
                name: 'Nebulosa de Orión', 
                x: 0, y: baseRadius - 500, z: -600, 
                size: 35,
                color: { core: 0x4d4d4d, disk: 0x666666, halo: 0x888888 },
                rotation: { x: 0.1, y: 0, z: 0.1 }
            }
        ];
        
        this.currentGalaxy = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.galaxyMeshes = [];
        this.starField = null;
        this.controls = null;
        this.focusedGalaxy = null;
        this.isAnimating = false;
        this.zoomedGalaxy = null;
        this.initialCameraPosition = new THREE.Vector3(0, 0, 2500);
        this.initialControlsTarget = new THREE.Vector3(0, 0, 0);
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.highlightedGalaxy = null;
        this.galaxyAuras = new Map();
        this.clickTimer = null;
        this.isClicking = false;
        this.clickProgress = 0;
        this.spinningGalaxy = null;

        // Añadir propiedades para la autenticación
        this.isFinalGalaxyAuthenticated = false;
        this.authModal = null;
        this.notificationModal = null;
        this.attemptingFinalGalaxy = false;

        // Añadir propiedades para galaxias registradas dinámicamente
        this.registeredGalaxies = {};
        this.contentContainer = null;
        this.canvas = null;
    }
    
    init() {
        this.setupScene();
        this.createStarField();
        this.createGalaxies();
        this.createGalaxyLabels();
        this.setupControls();
        this.animate();
        
        // Crear el modal de autenticación
        this.createAuthModal();
        
        // Crear el modal de notificación
        this.createNotificationModal();
        
        document.getElementById('backButton').addEventListener('click', () => this.showGalaxyView(false));
        
        // Crear botón de volver para vista zoom
        this.createBackToUniverseButton();
        
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                if (this.zoomedGalaxy) {
                    this.resetView();
                } else if (this.currentGalaxy) {
                    this.showGalaxyView(false);
                }
                // Cerrar modal de autenticación con Escape
                if (this.authModal && this.authModal.style.display === 'flex') {
                    this.hideAuthModal();
                }
                // Cerrar modal de notificación con Escape
                if (this.notificationModal && this.notificationModal.style.display === 'flex') {
                    this.hideNotificationModal();
                }
            }
        });
        
        this.setupClickEvents();
        this.showZoomInstruction();

        // Asegurar que el contentContainer esté disponible
        if (!this.contentContainer) {
            this.contentContainer = document.getElementById('galaxyContent') || document.body;
        }
        if (!this.canvas) {
            this.canvas = document.getElementById('galaxyCanvas');
        }
    }

    // ===== FUNCIONES PARA REGISTRAR Y MOSTRAR GALAXIAS =====
    
    // Función para registrar nuevas galaxias
    registerGalaxy(id, galaxyConfig) {
        if (!this.registeredGalaxies) {
            this.registeredGalaxies = {};
        }
        this.registeredGalaxies[id] = galaxyConfig;
        console.log(`🌌 Galaxia registrada: ${galaxyConfig.name}`);
    }

    // Función para mostrar una galaxia específica
    showGalaxy(galaxyId) {
        if (this.registeredGalaxies && this.registeredGalaxies[galaxyId]) {
            const galaxy = this.registeredGalaxies[galaxyId];
            if (galaxy.initFunction) {
                // Limpiar el contenedor de contenido
                if (this.contentContainer) {
                    this.contentContainer.innerHTML = '';
                }
                // Inicializar la galaxia
                galaxy.initFunction(this.canvas, this.contentContainer);
                console.log(`🎯 Mostrando galaxia: ${galaxy.name}`);
            }
        } else {
            console.error(`❌ Galaxia no encontrada: ${galaxyId}`);
        }
    }
    
    // ===== SISTEMA DE AUTENTICACIÓN CORREGIDO =====
    createAuthModal() {
        // VERIFICACIÓN MÁS ROBUSTA - Eliminar TODOS los modales existentes
        const existingModals = document.querySelectorAll('#finalGalaxyAuthModal');
        existingModals.forEach(modal => modal.remove());
        
        // Crear modal de autenticación
        this.authModal = document.createElement('div');
        this.authModal.id = 'finalGalaxyAuthModal';
        this.authModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(15px);
        `;
        
        this.authModal.innerHTML = `
            <div class="auth-container" style="
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                padding: 30px;
                border-radius: 20px;
                border: 2px solid rgba(255, 105, 180, 0.3);
                box-shadow: 0 0 40px rgba(255, 105, 180, 0.3);
                max-width: 500px;
                width: 90%;
                color: white;
                font-family: 'Quicksand', sans-serif;
                text-align: center;
            ">
                <div class="auth-header" style="margin-bottom: 25px;">
                    <h2 style="color: #ff69b4; margin: 0 0 10px 0; font-size: 28px;">🔐 Acceso Restringido</h2>
                    <div class="auth-subtitle" style="color: #888; font-size: 16px;">Galaxia Final - Área Protegida</div>
                </div>
                
                <div class="auth-form" style="margin-bottom: 25px;">
                    <label for="finalGalaxyPasswordInput" style="display: block; margin-bottom: 10px; color: #ccc;">
                        Ingresa la clave secreta para continuar:
                    </label>
                    <input type="text" id="finalGalaxyPasswordInput" 
                           placeholder="Escribe la clave aquí..." 
                           autocomplete="off"
                           style="width: 100%; padding: 12px; margin-bottom: 15px; 
                                  border: 2px solid #333; border-radius: 10px; 
                                  background: #0f3460; color: white; font-size: 16px;
                                  text-align: center;">
                    <button id="submitFinalGalaxyPassword" class="auth-btn"
                            style="background: linear-gradient(45deg, #ff69b4, #ff1493);
                                   color: white; border: none; padding: 12px 25px;
                                   border-radius: 10px; cursor: pointer; font-size: 16px;
                                   font-weight: bold; width: 100%; transition: all 0.3s ease;">
                        🎮 Acceder a la Galaxia
                    </button>
                    <div id="finalGalaxyAuthError" class="auth-error"
                         style="margin-top: 15px; min-height: 20px; color: #ff4444; 
                                font-weight: bold; transition: all 0.3s ease; opacity: 0;">
                    </div>
                </div>
                
                <div class="auth-instructions" style="margin-bottom: 20px; text-align: left;">
                    <h3 style="color: #ff9900; margin-bottom: 10px;">📋 Instrucciones:</h3>
                    <p style="color: #aaa; line-height: 1.5; margin: 0;">
                        En algunas Galaxias encontrarás palabras de color 
                        <span style="color: #ff9900; font-weight: bold;">Naranja</span> 
                        con un número delante, consigue el orden correcto y descubre la clave secreta.
                    </p>
                </div>
                
                <div class="auth-hint" style="background: rgba(255, 153, 0, 0.1); 
                                             padding: 15px; border-radius: 10px; border-left: 4px solid #ff9900;">
                    <p style="margin: 0; color: #ff9900;">
                        <strong>💡 Pista:</strong> 
                        <span class="hint-text">"¿Pista? Hagale pues a buscar"</span>
                    </p>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.authModal);
        console.log('✅ Modal de autenticación creado correctamente');
        
        // Configurar eventos del modal
        this.setupAuthEvents();
    }

    // ===== NUEVO MODAL DE NOTIFICACIÓN =====
    createNotificationModal() {
        // Eliminar modal anterior si existe
        const existingModals = document.querySelectorAll('#finalGalaxyNotification');
        existingModals.forEach(modal => modal.remove());
        
        // Crear modal de notificación
        this.notificationModal = document.createElement('div');
        this.notificationModal.id = 'finalGalaxyNotification';
        this.notificationModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 10001;
            backdrop-filter: blur(15px);
        `;
        
        this.notificationModal.innerHTML = `
            <div class="notification-container">
                <div class="notification-header">
                    <h2 class="notification-title">🔓 ¡Clave Correcta!</h2>
                    <button class="close-notification">×</button>
                </div>
                <div class="notification-content">
                    <p class="notification-message">
                        ¿Creiste que la clave era <span class="clue-highlight">"Mi hermosa bolita de queso"</span>?
                    </p>
                    <p class="notification-subtitle">¡Bienvenido al lugar más especial del universo!</p>
                </div>
                <button class="enter-galaxy-btn">Ingresar a la Galaxia</button>
            </div>
        `;
        
        document.body.appendChild(this.notificationModal);
        console.log('✅ Modal de notificación creado correctamente');
        
        // Configurar eventos del modal de notificación
        this.setupNotificationEvents();
    }

    setupNotificationEvents() {
        const closeButton = this.notificationModal.querySelector('.close-notification');
        const enterButton = this.notificationModal.querySelector('.enter-galaxy-btn');

        // Cerrar modal al hacer clic en la X
        closeButton.addEventListener('click', () => {
            this.hideNotificationModal();
            // No hacemos nada, el usuario cancela el acceso
        });

        // Ingresar a la galaxia al hacer clic en el botón
        enterButton.addEventListener('click', () => {
            this.hideNotificationModal();
            // Proceder a cargar la galaxia
            this.currentGalaxy = this.galaxies.find(g => g.id === 'final');
            if (this.currentGalaxy) {
                console.log('🚀 Iniciando carga de Galaxia Final...');
                this.showGalaxyView(true);
            }
        });

        // Cerrar modal al hacer clic fuera del contenido
        this.notificationModal.addEventListener('click', (e) => {
            if (e.target === this.notificationModal) {
                this.hideNotificationModal();
            }
        });
    }

    showNotificationModal() {
        if (!this.notificationModal) {
            console.error('❌ No se pudo encontrar el modal de notificación');
            this.createNotificationModal();
        }
        
        this.notificationModal.style.display = 'flex';
        console.log('🔓 Modal de notificación mostrado');
    }

    hideNotificationModal() {
        if (!this.notificationModal) return;
        
        this.notificationModal.style.display = 'none';
        console.log('🔒 Modal de notificación ocultado');
    }
    
    setupAuthEvents() {
        const authPasswordInput = document.getElementById('finalGalaxyPasswordInput');
        const submitAuthPassword = document.getElementById('submitFinalGalaxyPassword');
        const authError = document.getElementById('finalGalaxyAuthError');
        
        if (!authPasswordInput || !submitAuthPassword) {
            console.error('❌ No se encontraron los elementos del formulario de autenticación');
            return;
        }
        
        console.log('✅ Elementos de autenticación encontrados, configurando eventos...');
        
        // Función para verificar contraseña
        const checkPassword = () => {
            const password = authPasswordInput.value.trim();
            console.log('🔑 Contraseña ingresada:', `"${password}"`);
            
            // Comparación case-insensitive y sin espacios extras
            if (password.toLowerCase() === "mi hermosa bolita de maldad") {
                console.log('✅ CLAVE CORRECTA - Acceso concedido a Galaxia Final');
                
                // Mostrar éxito
                authError.textContent = '✅ ¡Clave correcta! Accediendo...';
                authError.style.color = '#00ff00';
                authError.style.opacity = '1';
                
                // Deshabilitar inputs durante la transición
                authPasswordInput.disabled = true;
                submitAuthPassword.disabled = true;
                submitAuthPassword.textContent = '🎮 Accediendo...';
                
                // Pequeño delay para mostrar el mensaje de éxito
                setTimeout(() => {
                    this.isFinalGalaxyAuthenticated = true;
                    this.hideAuthModal();
                    
                    // MOSTRAR NOTIFICACIÓN EN LUGAR DE IR DIRECTAMENTE A LA GALAXIA
                    this.showNotificationModal();
                    
                }, 1200);
                
            } else if (password === "") {
                authError.textContent = "Por favor, ingresa la clave secreta.";
                authError.style.color = '#ff9900';
                authError.style.opacity = '1';
            } else {
                console.log('❌ Clave incorrecta, se esperaba: "mi hermosa bolita de maldad"');
                authError.textContent = "❌ Clave incorrecta. Inténtalo de nuevo.";
                authError.style.color = '#ff4444';
                authError.style.opacity = '1';
                
                // Efecto de vibración
                authPasswordInput.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    authPasswordInput.style.animation = '';
                    authPasswordInput.focus();
                    authPasswordInput.select();
                }, 500);
            }
        };
        
        // Eventos
        submitAuthPassword.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🖱️ Botón de autenticación clickeado');
            checkPassword();
        });
        
        authPasswordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                console.log('⌨️ Enter presionado en input de contraseña');
                e.preventDefault();
                checkPassword();
            }
        });
        
        // Enfocar automáticamente el input cuando se muestra el modal
        this.authModal.addEventListener('shown', () => {
            setTimeout(() => {
                authPasswordInput.focus();
            }, 100);
        });
        
        // Cerrar modal al hacer clic fuera
        this.authModal.addEventListener('click', (e) => {
            if (e.target === this.authModal) {
                this.hideAuthModal();
            }
        });
        
        console.log('✅ Eventos de autenticación configurados correctamente');
    }
    
    showAuthModal() {
        if (!this.authModal) {
            console.error('❌ No se pudo encontrar el modal de autenticación');
            this.createAuthModal();
        }
        
        this.authModal.style.display = 'flex';
        
        // Animación de entrada
        setTimeout(() => {
            const authContainer = this.authModal.querySelector('.auth-container');
            if (authContainer) {
                authContainer.style.opacity = '1';
                authContainer.style.transform = 'scale(1)';
            }
            
            // Enfocar el input
            const authPasswordInput = document.getElementById('finalGalaxyPasswordInput');
            if (authPasswordInput) {
                authPasswordInput.value = '';
                setTimeout(() => {
                    authPasswordInput.focus();
                }, 200);
            }
            
            // Limpiar error
            const authError = document.getElementById('finalGalaxyAuthError');
            if (authError) {
                authError.textContent = '';
                authError.style.opacity = '0';
            }
        }, 10);
        
        console.log('🔓 Modal de autenticación mostrado');
    }
    
    hideAuthModal() {
        if (!this.authModal) return;
        
        const authContainer = this.authModal.querySelector('.auth-container');
        if (authContainer) {
            authContainer.style.opacity = '0';
            authContainer.style.transform = 'scale(0.9)';
        }
        
        setTimeout(() => {
            this.authModal.style.display = 'none';
            this.attemptingFinalGalaxy = false;
            
            // Rehabilitar inputs
            const authPasswordInput = document.getElementById('finalGalaxyPasswordInput');
            const submitAuthPassword = document.getElementById('submitFinalGalaxyPassword');
            if (authPasswordInput) authPasswordInput.disabled = false;
            if (submitAuthPassword) {
                submitAuthPassword.disabled = false;
                submitAuthPassword.textContent = '🎮 Acceder a la Galaxia';
            }
        }, 400);
    }
    
    createBackToUniverseButton() {
        // Eliminar botón anterior si existe
        const existingBtn = document.getElementById('backToUniverseBtn');
        if (existingBtn) {
            existingBtn.remove();
        }
        
        const button = document.createElement('button');
        button.id = 'backToUniverseBtn';
        button.innerHTML = '← Volver al Universo';
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.left = '20px';
        button.style.zIndex = '10000';
        button.style.padding = '12px 18px';
        button.style.background = 'rgba(0, 0, 0, 0.8)';
        button.style.color = '#ffffff';
        button.style.border = '1px solid rgba(255, 77, 136, 0.5)';
        button.style.borderRadius = '8px';
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Quicksand, sans-serif';
        button.style.fontSize = '14px';
        button.style.fontWeight = '600';
        button.style.backdropFilter = 'blur(10px)';
        button.style.display = 'none';
        button.style.transition = 'all 0.3s ease';
        button.style.textShadow = '0 0 10px rgba(255, 77, 136, 0.7)';
        button.style.boxShadow = '0 0 15px rgba(255, 77, 136, 0.3)';
        
        button.addEventListener('mouseover', () => {
            button.style.background = 'rgba(255, 77, 136, 0.9)';
            button.style.border = '1px solid rgba(255, 255, 255, 0.8)';
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 0 25px rgba(255, 77, 136, 0.6)';
        });
        
        button.addEventListener('mouseout', () => {
            button.style.background = 'rgba(0, 0, 0, 0.8)';
            button.style.border = '1px solid rgba(255, 77, 136, 0.5)';
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 0 15px rgba(255, 77, 136, 0.3)';
        });
        
        button.addEventListener('click', () => {
            this.resetView();
        });
        
        document.body.appendChild(button);
        this.backToUniverseBtn = button;
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.copy(this.initialCameraPosition);
        
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('galaxiesCanvas'),
            antialias: true,
            alpha: true
        });
        
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000011, 1);
        
        const ambientLight = new THREE.AmbientLight(0x333333);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 3, 5);
        this.scene.add(directionalLight);
    }
    
    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 0.5;
        this.controls.zoomSpeed = 1.0;
        this.controls.minDistance = 100;
        this.controls.maxDistance = 10000;
        this.controls.enablePan = false;
        this.controls.enableRotate = false;
    }
    
    setupClickEvents() {
        const canvas = document.getElementById('galaxiesCanvas');
        
        canvas.addEventListener('click', (event) => {
            if (this.isAnimating) return;
            
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
            
            this.raycaster.setFromCamera(this.mouse, this.camera);
            
            // Verificar colisión con galaxias
            const intersects = this.raycaster.intersectObjects(this.galaxyMeshes, true);
            
            if (intersects.length > 0) {
                const galaxyMesh = this.findParentGalaxy(intersects[0].object);
                if (!galaxyMesh) return;
                
                const galaxyId = galaxyMesh.userData.galaxyId;
                const galaxy = this.galaxies.find(g => g.id === galaxyId);
                
                if (!galaxy) return;
                
                if (this.zoomedGalaxy) {
                    if (this.zoomedGalaxy.id === galaxyId) {
                        this.selectGalaxy(galaxyId);
                    } else {
                        this.zoomToGalaxy(galaxyId);
                    }
                } else {
                    this.zoomToGalaxy(galaxyId);
                }
            }
        });
        
        canvas.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
            
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.galaxyMeshes, true);
            
            if (intersects.length > 0) {
                const galaxyMesh = this.findParentGalaxy(intersects[0].object);
                if (!galaxyMesh) return;
                
                const galaxyId = galaxyMesh.userData.galaxyId;
                
                if (this.highlightedGalaxy !== galaxyId) {
                    this.highlightGalaxy(galaxyId);
                }
                
                if (this.galaxyAuras.has(galaxyId)) {
                    const aura = this.galaxyAuras.get(galaxyId);
                    aura.children.forEach(child => {
                        if (child.material) {
                            child.material.opacity = Math.min(0.8, aura.userData.originalOpacity + 0.2);
                            child.material.needsUpdate = true;
                        }
                    });
                }
            } else if (this.highlightedGalaxy) {
                this.removeHighlight();
            }
        });
        
        canvas.addEventListener('mouseout', () => {
            if (this.highlightedGalaxy && this.galaxyAuras.has(this.highlightedGalaxy)) {
                const aura = this.galaxyAuras.get(this.highlightedGalaxy);
                aura.children.forEach(child => {
                    if (child.material) {
                        child.material.opacity = aura.userData.originalOpacity;
                        child.material.needsUpdate = true;
                    }
                });
            }
        });
    }
    
    findParentGalaxy(object) {
        let current = object;
        while (current && current.userData && !current.userData.galaxyId) {
            current = current.parent;
        }
        return current;
    }
    
    highlightGalaxy(galaxyId) {
        this.removeHighlight();
        
        const galaxy = this.galaxies.find(g => g.id === galaxyId);
        if (!galaxy) return;
        
        this.highlightedGalaxy = galaxyId;
        
        const galaxyMesh = this.galaxyMeshes.find(mesh => mesh.userData.galaxyId === galaxyId);
        if (!galaxyMesh) return;
        
        this.createAura(galaxyMesh, galaxy);
        
        if (this.zoomedGalaxy) {
            if (this.zoomedGalaxy.id === galaxyId) {
                this.showSecondClickInstruction();
            } else {
                this.showNavigationInstruction();
            }
        } else {
            this.showZoomInstruction();
        }
    }
    
    createAura(galaxyMesh, galaxy) {
        if (this.galaxyAuras.has(galaxy.id)) {
            const existingAura = this.galaxyAuras.get(galaxy.id);
            galaxyMesh.remove(existingAura);
        }

        const auraGroup = new THREE.Group();
        auraGroup.name = 'aura';

        galaxyMesh.traverse((child) => {
            if (child instanceof THREE.Points) {
                const geometry = child.geometry;
                const positions = geometry.getAttribute('position');
                const colors = geometry.getAttribute('color');
                
                const auraGeometry = new THREE.BufferGeometry();
                const auraPositions = new Float32Array(positions.count * 3);
                const auraColors = new Float32Array(positions.count * 3);
                const auraSizes = new Float32Array(positions.count);

                for (let i = 0; i < positions.count; i++) {
                    auraPositions[i * 3] = positions.getX(i);
                    auraPositions[i * 3 + 1] = positions.getY(i);
                    auraPositions[i * 3 + 2] = positions.getZ(i);

                    if (colors) {
                        auraColors[i * 3] = 1.0;
                        auraColors[i * 3 + 1] = 0.3;
                        auraColors[i * 3 + 2] = 0.53;
                    } else {
                        const r = (galaxy.color.core >> 16) & 255;
                        const g = (galaxy.color.core >> 8) & 255;
                        const b = galaxy.color.core & 255;
                        auraColors[i * 3] = r / 255;
                        auraColors[i * 3 + 1] = g / 255;
                        auraColors[i * 3 + 2] = b / 255;
                    }

                    auraSizes[i] = 2.5;
                }

                auraGeometry.setAttribute('position', new THREE.BufferAttribute(auraPositions, 3));
                auraGeometry.setAttribute('color', new THREE.BufferAttribute(auraColors, 3));
                auraGeometry.setAttribute('size', new THREE.BufferAttribute(auraSizes, 1));

                const auraMaterial = new THREE.PointsMaterial({
                    size: 2.5,
                    vertexColors: true,
                    transparent: true,
                    opacity: 0.6,
                    sizeAttenuation: true,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                });

                const auraParticles = new THREE.Points(auraGeometry, auraMaterial);
                auraGroup.add(auraParticles);
            }
        });

        auraGroup.userData.pulseTime = 0;
        auraGroup.userData.originalOpacity = 0.6;

        galaxyMesh.add(auraGroup);
        this.galaxyAuras.set(galaxy.id, auraGroup);
    }
    
    removeHighlight() {
        if (!this.highlightedGalaxy) return;
        
        const galaxyMesh = this.galaxyMeshes.find(mesh => mesh.userData.galaxyId === this.highlightedGalaxy);
        if (galaxyMesh && this.galaxyAuras.has(this.highlightedGalaxy)) {
            const aura = this.galaxyAuras.get(this.highlightedGalaxy);
            galaxyMesh.remove(aura);
            this.galaxyAuras.delete(this.highlightedGalaxy);
        }
        
        this.highlightedGalaxy = null;
        this.hideAllInstructions();
    }
    
    showZoomInstruction() {
        const instruction = document.getElementById('zoomInstruction');
        if (instruction) instruction.style.opacity = '1';
    }
    
    showSecondClickInstruction() {
        const instruction = document.getElementById('secondClickInstruction');
        if (instruction) instruction.style.opacity = '1';
    }
    
    showNavigationInstruction() {
        const instruction = document.getElementById('navigationInstruction');
        if (instruction) instruction.style.opacity = '1';
    }
    
    hideAllInstructions() {
        const instructions = document.querySelectorAll('.zoom-instruction, .second-click-instruction, .navigation-instruction');
        instructions.forEach(instruction => {
            if (instruction) instruction.style.opacity = '0';
        });
    }
    
    createStarField() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 10000;
        const starPositions = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
            starPositions[i * 3] = (Math.random() - 0.5) * 6000;
            starPositions[i * 3 + 1] = (Math.random() - 0.5) * 6000;
            starPositions[i * 3 + 2] = (Math.random() - 0.5) * 6000;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.8
        });
        
        this.starField = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.starField);
    }
    
    createGalaxies() {
        this.galaxies.forEach(galaxy => {
            const spiralGalaxy = this.createSpiralGalaxy(galaxy.size, galaxy.color);
            spiralGalaxy.position.set(galaxy.x, galaxy.y, galaxy.z);
            spiralGalaxy.rotation.x = galaxy.rotation.x;
            spiralGalaxy.rotation.y = galaxy.rotation.y;
            spiralGalaxy.rotation.z = galaxy.rotation.z;
            spiralGalaxy.userData = { galaxyId: galaxy.id };
            
            this.scene.add(spiralGalaxy);
            this.galaxyMeshes.push(spiralGalaxy);
        });
    }
    
    createSpiralGalaxy(size, colors) {
        const galaxyGroup = new THREE.Group();
        
        const coreGeometry = new THREE.SphereGeometry(size * 0.3, 32, 32);
        const coreMaterial = new THREE.MeshPhongMaterial({
            color: colors.core,
            emissive: colors.core,
            specular: 0x332200,
            shininess: 100,
            transparent: true,
            opacity: 0.95
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        galaxyGroup.add(core);
        
        const diskParticles = 3000;
        const diskGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(diskParticles * 3);
        const diskColors = new Float32Array(diskParticles * 3);
        
        for (let i = 0; i < diskParticles; i++) {
            const radius = Math.sqrt(Math.random()) * size;
            const angle = Math.random() * Math.PI * 2;
            const spiralAngle = angle + Math.log(radius / size + 0.1) * 5;
            
            positions[i * 3] = Math.cos(spiralAngle) * radius;
            positions[i * 3 + 1] = (Math.random() - 0.5) * size * 0.1;
            positions[i * 3 + 2] = Math.sin(spiralAngle) * radius;
            
            const distanceFromCenter = radius / size;
            
            const r = (colors.disk >> 16) & 255;
            const g = (colors.disk >> 8) & 255;
            const b = colors.disk & 255;
            
            if (distanceFromCenter < 0.3) {
                diskColors[i * 3] = r / 255;
                diskColors[i * 3 + 1] = g / 255;
                diskColors[i * 3 + 2] = b / 255;
            } else {
                diskColors[i * 3] = (r / 255) * (0.8 + distanceFromCenter * 0.2);
                diskColors[i * 3 + 1] = (g / 255) * (0.7 + distanceFromCenter * 0.2);
                diskColors[i * 3 + 2] = (b / 255) * 0.8;
            }
        }
        
        diskGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        diskGeometry.setAttribute('color', new THREE.BufferAttribute(diskColors, 3));
        
        const diskMaterial = new THREE.PointsMaterial({
            size: 2.0,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending
        });
        
        const disk = new THREE.Points(diskGeometry, diskMaterial);
        galaxyGroup.add(disk);
        
        const haloParticles = 800;
        const haloGeometry = new THREE.BufferGeometry();
        const haloPositions = new Float32Array(haloParticles * 3);
        const haloColors = new Float32Array(haloParticles * 3);
        
        const hr = (colors.halo >> 16) & 255;
        const hg = (colors.halo >> 8) & 255;
        const hb = colors.halo & 255;
        
        for (let i = 0; i < haloParticles; i++) {
            const radius = size + Math.random() * size * 0.5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            haloPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            haloPositions[i * 3 + 1] = radius * Math.cos(phi);
            haloPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
            
            haloColors[i * 3] = hr / 255;
            haloColors[i * 3 + 1] = hg / 255;
            haloColors[i * 3 + 2] = hb / 255;
        }
        
        haloGeometry.setAttribute('position', new THREE.BufferAttribute(haloPositions, 3));
        haloGeometry.setAttribute('color', new THREE.BufferAttribute(haloColors, 3));
        
        const haloMaterial = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.4,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending
        });
        
        const halo = new THREE.Points(haloGeometry, haloMaterial);
        galaxyGroup.add(halo);
        
        return galaxyGroup;
    }
    
    createGalaxyLabels() {
        const namesContainer = document.getElementById('galaxyNames');
        if (!namesContainer) return;
        
        namesContainer.innerHTML = '';
        
        this.galaxies.forEach(galaxy => {
            const label = document.createElement('div');
            label.className = 'galaxy-label';
            label.textContent = galaxy.name;
            label.dataset.galaxyId = galaxy.id;
            
            label.addEventListener('click', (e) => {
                e.stopPropagation();
                this.zoomToGalaxy(galaxy.id);
            });
            
            namesContainer.appendChild(label);
        });
        
        this.updateGalaxyLabels();
    }
    
    zoomToGalaxy(galaxyId) {
        const galaxy = this.galaxies.find(g => g.id === galaxyId);
        if (!galaxy) return;
        
        this.focusedGalaxy = galaxy;
        this.zoomedGalaxy = galaxy;
        this.isAnimating = true;
        
        // Mostrar botón de volver solo en vista zoom
        if (this.backToUniverseBtn) {
            this.backToUniverseBtn.style.display = 'block';
        }
        
        const targetPosition = new THREE.Vector3(galaxy.x, galaxy.y, galaxy.z);
        const cameraDistance = galaxy.size * 4;
        
        const newCameraPosition = new THREE.Vector3(
            targetPosition.x + cameraDistance * 0.3,
            targetPosition.y + cameraDistance * 0.2,
            targetPosition.z + cameraDistance * 0.8
        );
        
        this.controls.enableRotate = true;
        this.animateCameraTo(newCameraPosition, targetPosition);
        
        // Ocultar instrucción de zoom y mostrar instrucción de segundo click
        this.hideAllInstructions();
        this.showSecondClickInstruction();
    }
    
    animateCameraTo(newPosition, target) {
        const startPosition = this.camera.position.clone();
        const startTarget = this.controls.target.clone();
        const duration = 1500;
        let startTime = null;
        
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const t = Math.min(progress / duration, 1);
            
            const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            
            this.camera.position.lerpVectors(startPosition, newPosition, easeT);
            this.controls.target.lerpVectors(startTarget, target, easeT);
            
            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
            }
            
            this.controls.update();
        };
        
        requestAnimationFrame(animate);
    }
    
    resetView() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.zoomedGalaxy = null;
        this.focusedGalaxy = null;
        this.removeHighlight();
        
        // Ocultar botón de volver
        if (this.backToUniverseBtn) {
            this.backToUniverseBtn.style.display = 'none';
        }
        
        this.controls.enableRotate = false;
        this.animateCameraTo(this.initialCameraPosition, this.initialControlsTarget);
        
        // Mostrar instrucción de zoom nuevamente
        this.hideAllInstructions();
        this.showZoomInstruction();
    }
    
    selectGalaxy(galaxyId) {
        const galaxy = this.galaxies.find(g => g.id === galaxyId);
        if (!galaxy) return;
        
        console.log('🌌 Seleccionando galaxia:', galaxyId);
        
        // Si es la Galaxia Final y no está autenticada, mostrar modal
        if (galaxyId === 'final' && !this.isFinalGalaxyAuthenticated) {
            console.log('🔐 Galaxia Final requiere autenticación - Mostrando modal');
            this.attemptingFinalGalaxy = true;
            this.showAuthModal();
            return;
        }
        
        this.currentGalaxy = galaxy;
        this.showGalaxyView(true);
    }
    
    showGalaxyView(show) {
        const galaxiesView = document.getElementById('galaxiesView');
        const galaxyView = document.getElementById('galaxyView');
        const galaxyTitle = document.getElementById('galaxyTitle');
        
        if (show && this.currentGalaxy) {
            galaxiesView.classList.add('hidden');
            galaxyView.classList.remove('hidden');
            galaxyTitle.textContent = this.currentGalaxy.name;
            
            // Ocultar botón de volver al universo cuando entramos a una galaxia
            if (this.backToUniverseBtn) {
                this.backToUniverseBtn.style.display = 'none';
            }
            
            this.loadGalaxyContent(this.currentGalaxy.id);
        } else {
            console.log("Saliendo de galaxia, volviendo al universo completo");
            
            // Limpiar elementos específicos de cada galaxia al salir
            if (this.currentGalaxy) {
                const galaxyId = this.currentGalaxy.id;
                
                // CORRECCIÓN ESPECIAL PARA GALAXIA FINAL
                if (galaxyId === 'final') {
                    // Llamar a la función de limpieza específica
                    if (typeof cleanupFinalGalaxy === 'function') {
                        cleanupFinalGalaxy();
                    }
                    
                    // Asegurar que el canvas de estrellas fugaces esté oculto
                    const shootingStarsCanvas = document.getElementById('shootingStarsCanvas');
                    if (shootingStarsCanvas) {
                        shootingStarsCanvas.classList.add('hidden');
                    }
                } else if (galaxyId === 'ana') {
                    const loveTexts = document.querySelectorAll('.ana-love-text');
                    loveTexts.forEach(text => text.remove());
                } else if (galaxyId === 'pinwheel') {
                    const heartTexts = document.querySelectorAll('.heart-text');
                    heartTexts.forEach(text => text.remove());
                } else if (galaxyId === 'musica') {
                    const notes = document.querySelectorAll('.musica-note');
                    notes.forEach(note => note.remove());
                    const visualizer = document.querySelector('.musica-visualizer');
                    if (visualizer) visualizer.remove();
                    const scroll = document.querySelector('.scroll-container');
                    if (scroll) scroll.remove();
                    
                    // Pausar la música cuando salimos de la galaxia música
                    const music = document.getElementById('backgroundMusic');
                    if (music) {
                        music.pause();
                    }
                }
                // CORRECCIÓN: Limpieza para Galaxia Libro
                else if (galaxyId === 'libro') {
                    const libroElements = document.querySelectorAll('.libro-message, .libro-discover-message, .libro-instructions, .libro-zoom-indicator, .libro-loading');
                    libroElements.forEach(element => element.remove());
                }
                // CORRECCIÓN: Limpieza para Galaxia Laberinto
                else if (galaxyId === 'laberinto') {
                    const laberintoElements = document.querySelectorAll('.laberinto-container, .laberinto-message, .laberinto-discover-message, .laberinto-instructions, .laberinto-zoom-indicator, .laberinto-loading');
                    laberintoElements.forEach(element => element.remove());
                }
            }
            
            // RESTABLECER ESTADO COMPLETAMENTE - CORRECCIÓN CRÍTICA
            galaxyView.classList.add('hidden');
            galaxiesView.classList.remove('hidden');
            this.currentGalaxy = null;
            this.zoomedGalaxy = null; // ESTA LÍNEA ES CRÍTICA: asegura que no quedemos en vista zoom
            this.focusedGalaxy = null;
            
            // Mostrar botón de volver al universo
            if (this.backToUniverseBtn) {
                this.backToUniverseBtn.style.display = 'block';
            }
            
            // Resetear la vista al universo completo
            this.resetView();
        }
    }
    
    loadGalaxyContent(galaxyId) {
        const contentContainer = document.getElementById('galaxyContent');
        contentContainer.innerHTML = '';
        
        console.log('Cargando contenido para:', galaxyId);
        
        switch(galaxyId) {
            case 'ana':
                this.initAnaGalaxy();
                break;
            case 'pinwheel':
                this.initPinwheelGalaxy();
                break;
            case 'musica':
                this.initMusicaGalaxy();
                break;
            case 'final':
                if (this.isFinalGalaxyAuthenticated) {
                    console.log('✅ Usuario autenticado, cargando Galaxia Final...');
                    
                    const canvas = document.getElementById('galaxyCanvas');
                    const oldCanvas = canvas.cloneNode(false);
                    canvas.parentNode.replaceChild(oldCanvas, canvas);
                    
                    if (typeof initFinalGalaxy === 'function') {
                        console.log('✅ initFinalGalaxy encontrada, ejecutando...');
                        initFinalGalaxy(oldCanvas, contentContainer);
                    } else {
                        console.error('❌ initFinalGalaxy NO está definida');
                        this.initGenericGalaxy(galaxyId);
                    }
                } else {
                    console.error('❌ Usuario NO autenticado para Galaxia Final');
                    this.showAuthModal();
                }
                break;
            case 'comienzo':
                const canvasComienzo = document.getElementById('galaxyCanvas');
                const oldCanvasComienzo = canvasComienzo.cloneNode(false);
                canvasComienzo.parentNode.replaceChild(oldCanvasComienzo, canvasComienzo);
                
                if (typeof initComienzoGalaxy === 'function') {
                    console.log('✅ initComienzoGalaxy encontrada (global), ejecutando...');
                    initComienzoGalaxy(oldCanvasComienzo, contentContainer);
                } else if (window.initComienzoGalaxy) {
                    console.log('✅ initComienzoGalaxy encontrada (window), ejecutando...');
                    window.initComienzoGalaxy(oldCanvasComienzo, contentContainer);
                } else {
                    console.log('⚠️ initComienzoGalaxy no disponible, cargando contenido específico directamente...');
                    this.initComienzoGalaxyDirect(oldCanvasComienzo, contentContainer);
                }
                break;
            // CORRECCIÓN CRÍTICA: Galaxia Laberinto - CARGAR SIEMPRE EL CONTENIDO ESPECÍFICO
            case 'laberinto':
                console.log('🎮 Cargando Galaxia Laberinto...');
                
                const canvasLaberinto = document.getElementById('galaxyCanvas');
                if (!canvasLaberinto) {
                    console.error('❌ No se encontró galaxyCanvas');
                    break;
                }
                
                // Crear nuevo canvas
                const newCanvas = document.createElement('canvas');
                newCanvas.id = 'galaxyCanvas';
                newCanvas.className = 'galaxy-canvas';
                newCanvas.width = canvasLaberinto.width;
                newCanvas.height = canvasLaberinto.height;
                
                // Reemplazar el canvas
                canvasLaberinto.parentNode.replaceChild(newCanvas, canvasLaberinto);
                
                // Limpiar el contenedor de contenido
                contentContainer.innerHTML = '<div id="laberintoContent"></div>';
                
                console.log('🔍 Buscando initLaberintoGalaxy...');
                console.log('📍 initLaberintoGalaxy:', typeof initLaberintoGalaxy);
                console.log('📍 window.initLaberintoGalaxy:', typeof window.initLaberintoGalaxy);
                
                // Esperar un momento para asegurar que el DOM esté listo
                setTimeout(() => {
                    if (typeof window.initLaberintoGalaxy === 'function') {
                        console.log('✅ EJECUTANDO initLaberintoGalaxy...');
                        window.initLaberintoGalaxy(newCanvas, contentContainer);
                    } else if (typeof initLaberintoGalaxy === 'function') {
                        console.log('✅ EJECUTANDO initLaberintoGalaxy (global)...');
                        initLaberintoGalaxy(newCanvas, contentContainer);
                    } else {
                        console.error('❌ initLaberintoGalaxy NO encontrada');
                        this.initLaberintoGalaxyDirect(newCanvas, contentContainer);
                    }
                }, 100);
                break;
            case 'libro':
                const canvasLibro = document.getElementById('galaxyCanvas');
                const oldCanvasLibro = canvasLibro.cloneNode(false);
                canvasLibro.parentNode.replaceChild(oldCanvasLibro, canvasLibro);
                
                if (typeof initLibroGalaxy === 'function') {
                    console.log('✅ initLibroGalaxy encontrada (global), ejecutando...');
                    initLibroGalaxy(oldCanvasLibro, contentContainer);
                } else if (window.initLibroGalaxy) {
                    console.log('✅ initLibroGalaxy encontrada (window), ejecutando...');
                    window.initLibroGalaxy(oldCanvasLibro, contentContainer);
                } else {
                    console.log('⚠️ initLibroGalaxy no disponible, cargando contenido específico directamente...');
                    this.initLibroGalaxyDirect(oldCanvasLibro, contentContainer);
                }
                break;
            default:
                this.initGenericGalaxy(galaxyId);
        }
    }

    // ===== GALAXIA ANA - CONTENIDO ESPECÍFICO =====
    initAnaGalaxy() {
        const canvas = document.getElementById('galaxyCanvas');
        const contentContainer = document.getElementById('galaxyContent');
        
        const oldCanvas = canvas.cloneNode(false);
        canvas.parentNode.replaceChild(oldCanvas, canvas);
        
        contentContainer.innerHTML = `
            <div class="ana-message">Eres el centro de mi universo Ana</div>
            <div class="ana-discover-message">Explora el universo para descubrir mensajes de amor</div>
            <div class="ana-instructions">Haz clic y arrastra para girar en 3D • Rueda del mouse para zoom</div>
            <div class="ana-zoom-indicator">Zoom: 100%</div>
            <div class="ana-loading" id="anaLoading">Cargando galaxia de amor...</div>
        `;
        
        if (typeof initAnaGalaxyContent === 'function') {
            initAnaGalaxyContent(oldCanvas, contentContainer);
        }
    }

    // ===== GALAXIA DE CORAZONES - CONTENIDO ORIGINAL =====
    initPinwheelGalaxy() {
        const canvas = document.getElementById('galaxyCanvas');
        const contentContainer = document.getElementById('galaxyContent');
        
        const oldCanvas = canvas.cloneNode(false);
        canvas.parentNode.replaceChild(oldCanvas, canvas);
        
        contentContainer.innerHTML = `
            <div class="heart-message">Galaxia De Corazones</div>
            <div class="heart-discover-message">Descubre el amor en cada estrella...</div>
            <div class="heart-instructions">Usa el ratón para explorar esta galaxia especial</div>
            <div class="heart-zoom-indicator">Zoom: 100%</div>
            <div class="heart-loading" id="heartLoading">Cargando galaxia de corazones...</div>
        `;
        
        if (typeof initHeartGalaxyWithFloatingTexts === 'function') {
            initHeartGalaxyWithFloatingTexts(oldCanvas, contentContainer);
        }
    }

    // ===== GALAXIA MÚSICA - CONTENIDO ESPECÍFICO =====
    initMusicaGalaxy() {
        const canvas = document.getElementById('galaxyCanvas');
        const contentContainer = document.getElementById('galaxyContent');
        
        const oldCanvas = canvas.cloneNode(false);
        canvas.parentNode.replaceChild(oldCanvas, canvas);
        
        contentContainer.innerHTML = `
            <div class="musica-message">Galaxia Música</div>
            <div class="musica-discover-message">Disfruta de la letra de "Somewhere Only We Know"</div>
            <div class="musica-instructions">La música comenzará automáticamente</div>
            <div class="musica-zoom-indicator">Zoom: 100%</div>
            <div class="musica-loading" id="musicaLoading">Cargando galaxia musical...</div>
        `;
        
        if (typeof initMusicaGalaxyContent === 'function') {
            initMusicaGalaxyContent(oldCanvas, contentContainer);
        }
    }

    // ===== GALAXIA DEL COMIENZO - CONTENIDO DIRECTO =====
    initComienzoGalaxyDirect(canvas, contentContainer) {
        console.log('🎮 Inicializando Galaxia del Comienzo directamente...');
        
        contentContainer.innerHTML = `
            <div class="comienzo-message">Galaxia del Comienzo</div>
            <div class="comienzo-discover-message">Donde todo tiene su origen...</div>
            <div class="comienzo-instructions">Explora este lugar especial</div>
            <div class="comienzo-content" style="color: white; text-align: center; margin-top: 20px;">
                <h3 style="color: #ff4dff;">Bienvenido a la Galaxia del Comienzo</h3>
                <p>Este es el lugar donde todo comenzó...</p>
            </div>
        `;
        
        // Contenido 3D básico para la galaxia
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true 
        });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000011, 1);
        
        // Crear galaxia espiral personalizada
        const galaxyGroup = new THREE.Group();
        
        // Núcleo brillante
        const coreGeometry = new THREE.SphereGeometry(2, 32, 32);
        const coreMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xff4dff,
            emissive: 0xff4dff
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        galaxyGroup.add(core);
        
        // Brazos espirales
        const spiralParticles = 2000;
        const spiralGeometry = new THREE.BufferGeometry();
        const spiralPositions = new Float32Array(spiralParticles * 3);
        const spiralColors = new Float32Array(spiralParticles * 3);
        
        for (let i = 0; i < spiralParticles; i++) {
            const radius = Math.sqrt(Math.random()) * 15;
            const angle = Math.random() * Math.PI * 2;
            const spiralAngle = angle + Math.log(radius / 15 + 0.1) * 3;
            
            spiralPositions[i * 3] = Math.cos(spiralAngle) * radius;
            spiralPositions[i * 3 + 1] = (Math.random() - 0.5) * 2;
            spiralPositions[i * 3 + 2] = Math.sin(spiralAngle) * radius;
            
            spiralColors[i * 3] = 1.0; // R
            spiralColors[i * 3 + 1] = 0.3; // G  
            spiralColors[i * 3 + 2] = 1.0; // B
        }
        
        spiralGeometry.setAttribute('position', new THREE.BufferAttribute(spiralPositions, 3));
        spiralGeometry.setAttribute('color', new THREE.BufferAttribute(spiralColors, 3));
        
        const spiralMaterial = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            sizeAttenuation: true
        });
        
        const spiral = new THREE.Points(spiralGeometry, spiralMaterial);
        galaxyGroup.add(spiral);
        
        scene.add(galaxyGroup);
        
        camera.position.z = 25;
        
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        
        const animate = function () {
            requestAnimationFrame(animate);
            
            galaxyGroup.rotation.y += 0.005;
            
            controls.update();
            renderer.render(scene, camera);
        };
        
        animate();
    }

    // ===== GALAXIA LABERINTO - CONTENIDO DIRECTO =====
    initLaberintoGalaxyDirect(canvas, contentContainer) {
        console.log('🌀 Inicializando Galaxia Laberinto (contenido directo)...');
        
        // Contenido HTML de fallback
        contentContainer.innerHTML = `
            <div style="color: white; text-align: center; padding: 50px; font-family: 'Quicksand', sans-serif;">
                <h1 style="color: #ffff4d; font-size: 2.5em; margin-bottom: 20px; text-shadow: 0 0 10px rgba(255, 255, 77, 0.5);">
                    🌌 Galaxia Laberinto
                </h1>
                <p style="font-size: 1.2em; margin-bottom: 30px; color: #cccccc;">
                    Responde preguntas cósmicas para encontrar el camino a través del laberinto
                </p>
                
                <div style="background: rgba(255, 255, 77, 0.1); padding: 30px; border-radius: 15px; 
                            border: 2px solid #ffff4d; margin: 20px auto; max-width: 600px;">
                    <h3 style="color: #ffff4d; margin-bottom: 15px;">⚠️ Contenido Interactivo</h3>
                    <p style="margin-bottom: 15px;">El laberinto cósmico se cargará aquí.</p>
                    <p style="margin-bottom: 20px; color: #ff4444;">
                        ⚠️ Si ves este mensaje, el archivo galaxy-laberinto.js no se cargó correctamente.
                    </p>
                    
                    <div style="display: flex; justify-content: center; gap: 15px; margin-top: 25px;">
                        <button onclick="window.galaxyManager.showGalaxyView(false)" 
                                style="background: #ffff4d; color: #000; border: none; padding: 12px 25px; 
                                       border-radius: 8px; cursor: pointer; font-weight: bold; font-family: 'Quicksand';">
                            ← Volver al Universo
                        </button>
                        <button onclick="location.reload()" 
                                style="background: #4dffff; color: #000; border: none; padding: 12px 25px; 
                                       border-radius: 8px; cursor: pointer; font-weight: bold; font-family: 'Quicksand';">
                            🔄 Recargar
                        </button>
                    </div>
                </div>
                
                <div style="margin-top: 40px; color: #888;">
                    <p>💡 Verifica la consola del navegador (F12) para ver mensajes de error</p>
                </div>
            </div>
        `;
        
        // Crear una visualización 3D básica
        try {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ 
                canvas: canvas,
                antialias: true,
                alpha: true
            });
            
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000011, 1);
            
            // Crear galaxia amarilla básica
            const galaxyGroup = new THREE.Group();
            
            // Núcleo central
            const coreGeometry = new THREE.SphereGeometry(2, 32, 32);
            const coreMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xffff4d,
                emissive: 0xffff4d
            });
            const core = new THREE.Mesh(coreGeometry, coreMaterial);
            galaxyGroup.add(core);
            
            // Partículas espirales
            const particlesCount = 2000;
            const positions = new Float32Array(particlesCount * 3);
            const colors = new Float32Array(particlesCount * 3);
            
            for(let i = 0; i < particlesCount; i++) {
                const i3 = i * 3;
                const radius = Math.random() * 20;
                const angle = Math.random() * Math.PI * 2;
                
                positions[i3] = Math.cos(angle) * radius;
                positions[i3 + 1] = (Math.random() - 0.5) * 4;
                positions[i3 + 2] = Math.sin(angle) * radius;
                
                colors[i3] = 1.0;     // R
                colors[i3 + 1] = 1.0; // G
                colors[i3 + 2] = 0.3; // B
            }
            
            const particlesGeometry = new THREE.BufferGeometry();
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            
            const particlesMaterial = new THREE.PointsMaterial({
                size: 0.3,
                vertexColors: true,
                sizeAttenuation: true,
                transparent: true,
                opacity: 0.8
            });
            
            const particles = new THREE.Points(particlesGeometry, particlesMaterial);
            galaxyGroup.add(particles);
            
            scene.add(galaxyGroup);
            camera.position.z = 25;
            
            const controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            
            const animate = () => {
                requestAnimationFrame(animate);
                galaxyGroup.rotation.y += 0.005;
                controls.update();
                renderer.render(scene, camera);
            };
            
            animate();
            
            console.log('✅ Visualización básica de Galaxia Laberinto creada');
        } catch (error) {
            console.error('❌ Error creando visualización básica:', error);
        }
    }

    // ===== GALAXIA LIBRO - CONTENIDO DIRECTO =====
    initLibroGalaxyDirect(canvas, contentContainer) {
        console.log('📚 Inicializando Galaxia Libro directamente...');
        
        contentContainer.innerHTML = `
            <div class="libro-message">Galaxia Libro</div>
            <div class="libro-discover-message">Un universo de historias y conocimiento...</div>
            <div class="libro-instructions">Explora las páginas del conocimiento infinito</div>
            <div class="libro-zoom-indicator">Zoom: 100%</div>
            <div class="libro-loading" id="libroLoading">Cargando galaxia literaria...</div>
            <div class="libro-content" style="color: white; text-align: center; margin-top: 20px;">
                <h3 style="color: #4dffff;">Bienvenido a la Galaxia Libro</h3>
                <p>Donde cada estrella es una página, cada constelación un capítulo...</p>
            </div>
        `;
        
        // Contenido 3D básico para la galaxia libro
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true 
        });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000011, 1);
        
        // Crear galaxia espiral personalizada para libro
        const galaxyGroup = new THREE.Group();
        
        // Núcleo brillante (color azul característico)
        const coreGeometry = new THREE.SphereGeometry(2, 32, 32);
        const coreMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x4dffff,
            emissive: 0x4dffff
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        galaxyGroup.add(core);
        
        // Brazos espirales con partículas que simulan páginas
        const spiralParticles = 2500;
        const spiralGeometry = new THREE.BufferGeometry();
        const spiralPositions = new Float32Array(spiralParticles * 3);
        const spiralColors = new Float32Array(spiralParticles * 3);
        
        for (let i = 0; i < spiralParticles; i++) {
            const radius = Math.sqrt(Math.random()) * 18;
            const angle = Math.random() * Math.PI * 2;
            const spiralAngle = angle + Math.log(radius / 18 + 0.1) * 4;
            
            spiralPositions[i * 3] = Math.cos(spiralAngle) * radius;
            spiralPositions[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
            spiralPositions[i * 3 + 2] = Math.sin(spiralAngle) * radius;
            
            // Colores azules y blancos para simular páginas
            spiralColors[i * 3] = 0.3 + Math.random() * 0.7; // R
            spiralColors[i * 3 + 1] = 0.8 + Math.random() * 0.2; // G  
            spiralColors[i * 3 + 2] = 1.0; // B
        }
        
        spiralGeometry.setAttribute('position', new THREE.BufferAttribute(spiralPositions, 3));
        spiralGeometry.setAttribute('color', new THREE.BufferAttribute(spiralColors, 3));
        
        const spiralMaterial = new THREE.PointsMaterial({
            size: 0.6,
            vertexColors: true,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.8
        });
        
        const spiral = new THREE.Points(spiralGeometry, spiralMaterial);
        galaxyGroup.add(spiral);
        
        scene.add(galaxyGroup);
        
        camera.position.z = 28;
        
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        
        const animate = function () {
            requestAnimationFrame(animate);
            
            galaxyGroup.rotation.y += 0.004;
            
            controls.update();
            renderer.render(scene, camera);
        };
        
        animate();
    }

    // ===== GALAXIAS GENÉRICAS =====
    initGenericGalaxy(galaxyId) {
        const canvas = document.getElementById('galaxyCanvas');
        const contentContainer = document.getElementById('galaxyContent');
        
        const oldCanvas = canvas.cloneNode(false);
        canvas.parentNode.replaceChild(oldCanvas, canvas);
        
        const galaxy = this.galaxies.find(g => g.id === galaxyId);
        contentContainer.innerHTML = `
            <div class="galaxy-message">Explorando ${galaxy.name}</div>
            <div class="galaxy-discover-message">Un lugar misterioso en el universo</div>
            <div class="galaxy-instructions">Haz clic y arrastra para girar en 3D</div>
        `;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            canvas: oldCanvas,
            antialias: true 
        });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000011, 1);
        
        const blackHoleGeometry = new THREE.SphereGeometry(2, 32, 32);
        const blackHoleMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x000000,
            emissive: 0x000000 
        });
        const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
        scene.add(blackHole);
        
        const accretionDiskGeometry = new THREE.RingGeometry(3, 10, 64);
        const accretionDiskMaterial = new THREE.MeshBasicMaterial({ 
            color: galaxy.color.core,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7
        });
        const accretionDisk = new THREE.Mesh(accretionDiskGeometry, accretionDiskMaterial);
        accretionDisk.rotation.x = Math.PI / 2;
        scene.add(accretionDisk);
        
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 2000;
        const starPositions = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
            starPositions[i * 3] = (Math.random() - 0.5) * 100;
            starPositions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            starPositions[i * 3 + 2] = (Math.random() - 0.5) * 100;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            sizeAttenuation: true
        });
        
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);
        
        camera.position.z = 15;
        
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = false;
        
        const animate = function () {
            requestAnimationFrame(animate);
            
            blackHole.rotation.y += 0.01;
            accretionDisk.rotation.z += 0.02;
            
            controls.update();
            renderer.render(scene, camera);
        };
        
        animate();
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotar galaxias
        this.galaxyMeshes.forEach(mesh => {
            mesh.rotation.y += 0.001;
        });

        // Rotar campo de estrellas
        if (this.starField) {
            this.starField.rotation.y += 0.0001;
        }

        // Actualizar controles
        if (this.controls) {
            this.controls.update();
        }

        // Actualizar etiquetas HTML
        this.updateGalaxyLabels();

        // Renderizar escena
        this.renderer.render(this.scene, this.camera);
    }
    
    updateGalaxyLabels() {
        const labels = document.querySelectorAll('.galaxy-label');
        
        labels.forEach((label, index) => {
            const galaxy = this.galaxies[index];
            if (!galaxy) return;
            
            // Si estamos en vista zoom de una galaxia, ocultar la etiqueta de la galaxia actual
            if (this.zoomedGalaxy) {
                if (galaxy.id === this.zoomedGalaxy.id) {
                    label.style.display = 'none';
                    return;
                } else {
                    label.style.display = 'block';
                    // Añadir clase para zoom (texto más grande)
                    label.classList.add('zoomed');
                }
            } else {
                // En vista general, mostrar todas las etiquetas y quitar clase zoom
                label.style.display = 'block';
                label.classList.remove('zoomed');
            }
            
            // Calcular posición de la etiqueta
            let labelYOffset = galaxy.size * 1.2;
            if (galaxy.id !== 'ana') {
                labelYOffset = galaxy.size * 1.5;
            }
            
            const labelPosition = new THREE.Vector3(
                galaxy.x, 
                galaxy.y + labelYOffset,
                galaxy.z
            );
            
            labelPosition.project(this.camera);
            
            const x = (labelPosition.x * 0.5 + 0.5) * window.innerWidth;
            const y = (-labelPosition.y * 0.5 + 0.5) * window.innerHeight;
            
            if (labelPosition.z < 1) {
                label.style.left = `${x}px`;
                label.style.top = `${y}px`;
                
                // Ajustar opacidad basado en la distancia (más brillante)
                const distance = this.camera.position.distanceTo(new THREE.Vector3(galaxy.x, galaxy.y, galaxy.z));
                const maxVisibleDistance = 3000;
                const opacity = Math.max(0.9, 1 - (distance / maxVisibleDistance)); // Mayor opacidad mínima
                label.style.opacity = opacity.toString();
            } else {
                label.style.display = 'none';
            }
        });
    }
    
    onWindowResize() {
        if (this.camera && this.renderer) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            
            this.updateGalaxyLabels();
        }
    }
}

// Inicializar el manager cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    window.galaxyManager = new GalaxyManager();
    window.galaxyManager.init();
    
    // Manejar redimensionamiento de ventana
    window.addEventListener('resize', function() {
        if (window.galaxyManager) {
            window.galaxyManager.onWindowResize();
        }
    });
});