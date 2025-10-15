// ===== GALAXY MANAGER COMPLETO - SOLUCIÓN DEFINITIVA =====
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
            
            // Galaxia Rompecabezas
            { 
                id: 'rompecabezas', 
                name: 'Galaxia Rompecabezas', 
                x: baseRadius * Math.cos(Math.PI/4), 
                y: baseRadius * Math.sin(Math.PI/4), 
                z: -800, 
                size: 55,
                color: { core: 0x4d4dff, disk: 0x6666ff, halo: 0x8888ff },
                rotation: { x: 0.2, y: 0, z: 0.1 }
            },
            
            // Galaxia Laberinto
            { 
                id: 'laberinto', 
                name: 'Galaxia Laberinto', 
                x: baseRadius, y: 0, z: -1000, 
                size: 60,
                color: { core: 0xffff4d, disk: 0xffff66, halo: 0xffff88 },
                rotation: { x: 0.4, y: 0, z: 0.2 }
            },
            
            // Galaxia Final
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
            
            // Galaxia Recuerdos
            { 
                id: 'recuerdos', 
                name: 'Galaxia Recuerdos', 
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

        // SOLUCIÓN DEFINITIVA: Nuevo sistema de autenticación
        this.isFinalGalaxyAuthenticated = false;
        this.authModal = null;
        this.notificationModal = null;
        this.attemptingFinalGalaxy = false;
        this.finalGalaxyLoadAttempts = 0; // Nuevo: Contador de intentos

        // Añadir propiedades para galaxias registradas dinámicamente
        this.registeredGalaxies = {};
        this.contentContainer = null;
        this.canvas = null;
        
        // Nuevas propiedades para manejo de estado
        this.activeGalaxyContent = null;
        this.isInGalaxyView = false;

        // CORRECCIÓN: Propiedades para música global - VOLUMEN CONSTANTE 30%
        this.backgroundMusic = null;
        this.isMusicPlaying = false;
        this.musicVolume = 0.3; // 30% - VOLUMEN GLOBAL
        this.libroMusicVolume = 0.3; // Mismo volumen para libro
        this.excludedMusicGalaxies = ['musica'];
        this.userInteracted = false;
        this.persistentVolume = 0.3; // Siempre 30%
    }
    
    init() {
        this.setupScene();
        this.createStarField();
        this.createGalaxies();
        this.createGalaxyLabels();
        this.setupControls();
        
        // CORRECCIÓN: Configurar música con volumen persistente
        this.setupBackgroundMusic();
        
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
                if (this.authModal && this.authModal.style.display === 'flex') {
                    this.hideAuthModal();
                }
                if (this.notificationModal && this.notificationModal.style.display === 'flex') {
                    this.hideNotificationModal();
                }
            }
        });
        
        this.setupClickEvents();
        this.showZoomInstruction();

        if (!this.contentContainer) {
            this.contentContainer = document.getElementById('galaxyContent') || document.body;
        }
        if (!this.canvas) {
            this.canvas = document.getElementById('galaxyCanvas');
        }

        this.setupUserInteraction();
    }

    // ===== SISTEMA DE AUTENTICACIÓN COMPLETAMENTE NUEVO =====
    createAuthModal() {
        const existingModals = document.querySelectorAll('#finalGalaxyAuthModal');
        existingModals.forEach(modal => modal.remove());
        
        const authModal = document.createElement('div');
        authModal.id = 'finalGalaxyAuthModal';
        authModal.style.cssText = `
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
        
        authModal.innerHTML = `
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
        
        document.body.appendChild(authModal);
        this.authModal = authModal;
        this.setupAuthEvents();
    }

    createNotificationModal() {
        const existingModals = document.querySelectorAll('#finalGalaxyNotification');
        existingModals.forEach(modal => modal.remove());
        
        const notificationModal = document.createElement('div');
        notificationModal.id = 'finalGalaxyNotification';
        notificationModal.style.cssText = `
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
        
        notificationModal.innerHTML = `
            <div class="notification-container" style="
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
                <div class="notification-header" style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                    <h2 class="notification-title" style="color: #ff69b4; margin: 0; font-size: 28px;">🔓 ¡Clave Correcta!</h2>
                    <button class="close-notification" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">×</button>
                </div>
                <div class="notification-content" style="margin-bottom: 25px;">
                    <p class="notification-message" style="font-size: 18px; margin-bottom: 15px;">
                        ¿Creiste que la clave era <span class="clue-highlight" style="color: #ff9900; font-weight: bold;">"Mi hermosa bolita de queso"</span>?
                    </p>
                    <p class="notification-subtitle" style="color: #ccc; font-size: 16px;">¡Bienvenido al lugar más especial del universo!</p>
                </div>
                <button class="enter-galaxy-btn" style="
                    background: linear-gradient(45deg, #ff69b4, #ff1493);
                    color: white; border: none; padding: 12px 25px;
                    border-radius: 10px; cursor: pointer; font-size: 16px;
                    font-weight: bold; width: 100%; transition: all 0.3s ease;
                ">Ingresar a la Galaxia</button>
            </div>
        `;
        
        document.body.appendChild(notificationModal);
        this.notificationModal = notificationModal;
        this.setupNotificationEvents();
    }

    setupNotificationEvents() {
        const closeButton = this.notificationModal.querySelector('.close-notification');
        const enterButton = this.notificationModal.querySelector('.enter-galaxy-btn');

        closeButton.addEventListener('click', () => {
            this.hideNotificationModal();
        });

        enterButton.addEventListener('click', () => {
            this.hideNotificationModal();
            this.currentGalaxy = this.galaxies.find(g => g.id === 'final');
            if (this.currentGalaxy) {
                console.log('🚀 SOLUCIÓN DEFINITIVA: Iniciando carga de Galaxia Final...');
                this.showGalaxyView(true);
            }
        });

        this.notificationModal.addEventListener('click', (e) => {
            if (e.target === this.notificationModal) {
                this.hideNotificationModal();
            }
        });
    }

    showNotificationModal() {
        if (!this.notificationModal) {
            this.createNotificationModal();
        }
        
        this.notificationModal.style.display = 'flex';
        console.log('🔓 Modal de notificación mostrado');
    }

    hideNotificationModal() {
        if (!this.notificationModal) return;
        this.notificationModal.style.display = 'none';
    }
    
    setupAuthEvents() {
        document.addEventListener('click', (e) => {
            if (!this.authModal || this.authModal.style.display !== 'flex') return;
            
            if (e.target.id === 'submitFinalGalaxyPassword' || e.target.closest('#submitFinalGalaxyPassword')) {
                e.preventDefault();
                e.stopPropagation();
                this.checkAuthPassword();
                return;
            }
            
            if (e.target === this.authModal) {
                this.hideAuthModal();
                return;
            }
        });

        document.addEventListener('keypress', (e) => {
            if (!this.authModal || this.authModal.style.display !== 'flex') return;
            
            if (e.target.id === 'finalGalaxyPasswordInput' && e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                this.checkAuthPassword();
            }
        });
    }

    checkAuthPassword() {
        console.log('🔐 SOLUCIÓN DEFINITIVA: Verificando contraseña...');
        
        const authPasswordInput = document.getElementById('finalGalaxyPasswordInput');
        const authError = document.getElementById('finalGalaxyAuthError');
        const submitButton = document.getElementById('submitFinalGalaxyPassword');
        
        if (!authPasswordInput || !authError) {
            console.error('❌ Elementos del modal no encontrados');
            return;
        }

        const password = authPasswordInput.value.trim();
        console.log('🔑 Contraseña ingresada:', `"${password}"`);
        
        if (password.toLowerCase() === "mi hermosa bolita de maldad") {
            console.log('✅ CLAVE CORRECTA - SOLUCIÓN DEFINITIVA');
            
            authError.textContent = '✅ ¡Clave correcta! Accediendo...';
            authError.style.color = '#00ff00';
            authError.style.opacity = '1';
            
            authPasswordInput.disabled = true;
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = '🎮 Accediendo...';
            }
            
            // SOLUCIÓN DEFINITIVA: Resetear contador y establecer autenticación
            this.finalGalaxyLoadAttempts = 0;
            this.isFinalGalaxyAuthenticated = true;
            this.currentGalaxy = this.galaxies.find(g => g.id === 'final');
            
            setTimeout(() => {
                this.hideAuthModal();
                console.log('🔄 SOLUCIÓN DEFINITIVA: Mostrando notificación...');
                this.showNotificationModal();
            }, 1200);
            
        } else if (password === "") {
            authError.textContent = "Por favor, ingresa la clave secreta.";
            authError.style.color = '#ff9900';
            authError.style.opacity = '1';
        } else {
            console.log('❌ Clave incorrecta');
            authError.textContent = "❌ Clave incorrecta. Inténtalo de nuevo.";
            authError.style.color = '#ff4444';
            authError.style.opacity = '1';
            
            authPasswordInput.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                authPasswordInput.style.animation = '';
                authPasswordInput.focus();
                authPasswordInput.select();
            }, 500);
        }
    }
    
    showAuthModal() {
        if (!this.authModal || !document.body.contains(this.authModal)) {
            this.createAuthModal();
        }
        
        const authPasswordInput = document.getElementById('finalGalaxyPasswordInput');
        const authError = document.getElementById('finalGalaxyAuthError');
        const submitButton = document.getElementById('submitFinalGalaxyPassword');
        
        if (!authPasswordInput || !authError || !submitButton) {
            this.createAuthModal();
        }
        
        this.authModal.style.display = 'flex';
        this.authModal.offsetHeight;
        
        authPasswordInput.value = '';
        authPasswordInput.disabled = false;
        authError.textContent = '';
        authError.style.opacity = '0';
        submitButton.disabled = false;
        submitButton.textContent = '🎮 Acceder a la Galaxia';
        
        setTimeout(() => {
            const authContainer = this.authModal.querySelector('.auth-container');
            if (authContainer) {
                authContainer.style.opacity = '1';
                authContainer.style.transform = 'scale(1)';
                authContainer.style.transition = 'all 0.3s ease';
            }
            
            setTimeout(() => {
                if (authPasswordInput) {
                    authPasswordInput.focus();
                }
            }, 300);
        }, 50);
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
        }, 400);
    }

    // ===== SOLUCIÓN DEFINITIVA: Métodos críticos completamente reescritos =====
    selectGalaxy(galaxyId) {
        const galaxy = this.galaxies.find(g => g.id === galaxyId);
        if (!galaxy) return;
        
        console.log('🌌 SOLUCIÓN DEFINITIVA: Seleccionando galaxia:', galaxyId);
        
        if (galaxyId === 'final') {
            console.log('🔄 SOLUCIÓN DEFINITIVA: Verificando autenticación para Galaxia Final');
            
            if (this.isFinalGalaxyAuthenticated) {
                console.log('✅ SOLUCIÓN DEFINITIVA: Usuario autenticado, mostrando notificación...');
                this.currentGalaxy = galaxy;
                this.showNotificationModal();
                return;
            }
            
            console.log('🔐 SOLUCIÓN DEFINITIVA: Mostrando modal de autenticación');
            this.attemptingFinalGalaxy = true;
            this.isFinalGalaxyAuthenticated = false;
            
            setTimeout(() => {
                this.showAuthModal();
            }, 100);
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
            console.log('🚀 SOLUCIÓN DEFINITIVA: Entrando a galaxia:', this.currentGalaxy.id);
            
            this.isInGalaxyView = true;
            galaxiesView.classList.add('hidden');
            galaxyView.classList.remove('hidden');
            galaxyTitle.textContent = this.currentGalaxy.name;
            
            // CORRECCIÓN: Manejo simplificado de música
            if (this.excludedMusicGalaxies.includes(this.currentGalaxy.id)) {
                this.pauseBackgroundMusic();
            } else {
                setTimeout(() => {
                    this.backgroundMusic.volume = this.persistentVolume;
                    this.playBackgroundMusic();
                }, 300);
            }
            
            if (this.backToUniverseBtn) {
                this.backToUniverseBtn.style.display = 'none';
            }
            
            this.loadGalaxyContent(this.currentGalaxy.id);
        } else {
            console.log("🔄 SOLUCIÓN DEFINITIVA: Saliendo de galaxia");
            this.isInGalaxyView = false;
            
            if (this.currentGalaxy && this.currentGalaxy.id === 'final') {
                console.log('🔒 SOLUCIÓN DEFINITIVA: Reseteando autenticación de Galaxia Final');
                this.isFinalGalaxyAuthenticated = false;
                this.attemptingFinalGalaxy = false;
            }
            
            // CORRECCIÓN: Restaurar volumen persistente al salir
            setTimeout(() => {
                if (!this.backgroundMusic.paused) {
                    this.backgroundMusic.volume = this.persistentVolume;
                    console.log('🎵 Volumen restaurado a:', this.persistentVolume);
                } else {
                    this.backgroundMusic.volume = this.persistentVolume;
                    this.playBackgroundMusic();
                }
            }, 300);
            
            this.cleanupCurrentGalaxy();
            
            galaxyView.classList.add('hidden');
            galaxiesView.classList.remove('hidden');
            this.currentGalaxy = null;
            this.zoomedGalaxy = null;
            this.focusedGalaxy = null;
            
            if (this.backToUniverseBtn) {
                this.backToUniverseBtn.style.display = 'block';
            }
            
            this.resetView();
        }
    }

    loadGalaxyContent(galaxyId) {
        const contentContainer = document.getElementById('galaxyContent');
        if (!contentContainer) {
            console.error('❌ No se encontró el contenedor de contenido');
            return;
        }
        
        console.log('📦 SOLUCIÓN DEFINITIVA: Cargando contenido para:', galaxyId);
        
        // LIMPIEZA AGREGVA
        this.cleanupCurrentGalaxy();
        contentContainer.innerHTML = '';
        
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
                    console.log('✅ SOLUCIÓN DEFINITIVA: Cargando Galaxia Final...');
                    console.log('🔢 Intento número:', ++this.finalGalaxyLoadAttempts);
                    
                    // SOLUCIÓN DEFINITIVA: Enfoque completamente nuevo
                    this.loadFinalGalaxyWithRetry();
                } else {
                    console.error('❌ Usuario NO autenticado para Galaxia Final');
                    contentContainer.innerHTML = `
                        <div style="color: white; text-align: center; padding: 50px;">
                            <h2>❌ Error de autenticación</h2>
                            <p>No tienes acceso a esta galaxia.</p>
                            <button onclick="galaxyManager.showGalaxyView(false)" style="
                                background: #ff69b4; color: white; border: none; 
                                padding: 10px 20px; border-radius: 5px; cursor: pointer;
                            ">Volver al Universo</button>
                        </div>
                    `;
                }
                break;
            case 'comienzo':
                this.loadExternalGalaxy(galaxyId, 'initComienzoGalaxy');
                break;
            case 'laberinto':
                this.loadExternalGalaxy(galaxyId, 'initLaberintoGalaxy');
                break;
            case 'libro':
                this.loadExternalGalaxy(galaxyId, 'initLibroGalaxy');
                break;
            case 'rompecabezas':
                this.loadExternalGalaxy(galaxyId, 'initRompecabezasGalaxy');
                break;
            case 'recuerdos':
                this.loadExternalGalaxy(galaxyId, 'initRecuerdosGalaxy');
                break;
            default:
                this.initGenericGalaxy(galaxyId);
        }
    }

    // ===== SOLUCIÓN DEFINITIVA: Nuevo método para cargar Galaxia Final =====
    loadFinalGalaxyWithRetry() {
        const contentContainer = document.getElementById('galaxyContent');
        const canvas = document.getElementById('galaxyCanvas');
        
        if (!contentContainer || !canvas) {
            console.error('❌ Elementos críticos no encontrados');
            return;
        }

        console.log('🎯 SOLUCIÓN DEFINITIVA: Iniciando carga con reintento...');

        // Preparar canvas
        canvas.style.cssText = `
            display: block !important;
            visibility: visible !important;
            pointer-events: auto !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            z-index: 1 !important;
        `;

        // SOLUCIÓN DEFINITIVA: Verificar si la función existe
        if (typeof initFinalGalaxy !== 'function') {
            console.error('❌ initFinalGalaxy NO está definida');
            this.initFallbackFinalGalaxy(canvas, contentContainer);
            return;
        }

        console.log('✅ initFinalGalaxy encontrada, ejecutando...');

        // SOLUCIÓN DEFINITIVA: Enfoque de reintento con timeout
        const loadFinalGalaxy = () => {
            try {
                initFinalGalaxy(canvas, contentContainer);
                console.log('✅ SOLUCIÓN DEFINITIVA: Galaxia Final cargada exitosamente');
            } catch (error) {
                console.error('❌ Error cargando Galaxia Final:', error);
                
                if (this.finalGalaxyLoadAttempts < 3) {
                    console.log(`🔄 Reintentando... Intento ${this.finalGalaxyLoadAttempts + 1}/3`);
                    setTimeout(() => {
                        this.finalGalaxyLoadAttempts++;
                        loadFinalGalaxy();
                    }, 500);
                } else {
                    console.error('❌ Límite de reintentos alcanzado, cargando fallback');
                    this.initFallbackFinalGalaxy(canvas, contentContainer);
                }
            }
        };

        // Iniciar carga
        loadFinalGalaxy();
    }

    initFallbackFinalGalaxy(canvas, contentContainer) {
        console.log('🔄 SOLUCIÓN DEFINITIVA: Cargando fallback para Galaxia Final');
        
        contentContainer.innerHTML = `
            <div style="color: white; text-align: center; padding: 50px; font-family: 'Brush Script MT', cursive;">
                <div style="font-size: 2.8em; margin-bottom: 30px;">
                    ¿Final? Pero si apenas estamos comenzando mi amor...
                </div>
                <div style="font-size: 2.3em;">
                    Este es el inicio de nuestra eternidad juntos
                </div>
            </div>
        `;
        
        this.createBasicGalaxyScene(canvas, 0xff69b4, 3);
    }

    // ===== MÉTODOS DE LIMPIEZA MEJORADOS =====
    cleanupCurrentGalaxy() {
        if (!this.currentGalaxy) return;
        
        const galaxyId = this.currentGalaxy.id;
        console.log(`🧹 SOLUCIÓN DEFINITIVA: Limpiando galaxia: ${galaxyId}`);
        
        // Limpiar Galaxia Final específicamente
        if (galaxyId === 'final' && typeof cleanupFinalGalaxy === 'function') {
            console.log('🧹 Llamando a cleanupFinalGalaxy...');
            try {
                cleanupFinalGalaxy();
            } catch (error) {
                console.error('❌ Error en cleanupFinalGalaxy:', error);
            }
        }
        
        // Limpieza general agresiva
        const containersToRemove = [
            'rompecabezasContainer', 'laberintoContent', 'libroContent', 
            'recuerdosContent', 'victoryMessage', 'puzzleBoard',
            'rompecabezasContent', 'laberintoContainer', 'musicaContainer',
            'musicaVisualizer', 'musicaNotesContainer'
        ];
        
        containersToRemove.forEach(id => {
            const container = document.getElementById(id);
            if (container) container.remove();
        });
        
        const classesToRemove = [
            'ana-love-text', 'heart-text', 'musica-note', 'musica-visualizer',
            'scroll-container', 'libro-message', 'libro-discover-message',
            'libro-instructions', 'libro-zoom-indicator', 'libro-loading',
            'laberinto-container', 'laberinto-message', 'laberinto-discover-message',
            'laberinto-instructions', 'laberinto-zoom-indicator', 'laberinto-loading',
            'puzzle-piece', 'music-note', 'note', 'musica-element', 'music-element',
            'floating-note', 'animated-note'
        ];
        
        classesToRemove.forEach(className => {
            const elements = document.querySelectorAll(`.${className}`);
            elements.forEach(element => element.remove());
        });
        
        const contentContainer = document.getElementById('galaxyContent');
        if (contentContainer) {
            contentContainer.innerHTML = '';
            contentContainer.style.cssText = '';
        }
        
        const canvas = document.getElementById('galaxyCanvas');
        if (canvas) {
            canvas.style.cssText = `
                display: block !important;
                visibility: visible !important;
                pointer-events: auto !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                z-index: 1 !important;
            `;
        }
        
        document.body.style.display = 'none';
        document.body.offsetHeight;
        document.body.style.display = '';
        
        console.log(`✅ SOLUCIÓN DEFINITIVA: Limpieza completada para: ${galaxyId}`);
    }

    // ===== MÉTODOS RESTANTES (sin cambios críticos) =====
    createBackToUniverseButton() {
        const existingBtn = document.getElementById('backToUniverseBtn');
        if (existingBtn) existingBtn.remove();
        
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
            button.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseout', () => {
            button.style.background = 'rgba(0, 0, 0, 0.8)';
            button.style.transform = 'scale(1)';
        });
        
        button.addEventListener('click', () => this.resetView());
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
            } else if (this.highlightedGalaxy) {
                this.removeHighlight();
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
        
        if (this.backToUniverseBtn) {
            this.backToUniverseBtn.style.display = 'none';
        }
        
        this.controls.enableRotate = false;
        this.animateCameraTo(this.initialCameraPosition, this.initialControlsTarget);
        
        this.hideAllInstructions();
        this.showZoomInstruction();
    }

    // ===== CORRECCIÓN COMPLETA DEL SISTEMA DE MÚSICA =====
    setupBackgroundMusic() {
        let musicElement = document.getElementById('backgroundMusic');
        if (!musicElement) {
            musicElement = document.createElement('audio');
            musicElement.id = 'backgroundMusic';
            musicElement.loop = true;
            musicElement.volume = this.persistentVolume;
            musicElement.preload = 'auto';
            document.body.appendChild(musicElement);
        }
        this.backgroundMusic = musicElement;
        this.loadBackgroundMusic();
    }

    loadBackgroundMusic() {
        const musicPath = 'https://www.dropbox.com/scl/fi/ju447r9wmlj7r499nq42c/Keane-Somewhere-Only-We-Know-espa-ol-lyrics-_2_2.mp3?rlkey=dx6g00mnwmp3t46jml887ij49&st=ict2wghd&dl=1';
        this.backgroundMusic.volume = this.persistentVolume;
        this.backgroundMusic.src = musicPath;
        console.log('🎵 Audio configurado con volumen:', this.persistentVolume);
    }

    setupUserInteraction() {
        const enableMusic = () => {
            if (!this.userInteracted) {
                this.userInteracted = true;
                this.backgroundMusic.volume = this.persistentVolume;
                this.playBackgroundMusic();
            }
        };
        document.addEventListener('click', enableMusic);
        document.addEventListener('keydown', enableMusic);
        document.addEventListener('touchstart', enableMusic);
        const canvas = document.getElementById('galaxiesCanvas');
        if (canvas) canvas.addEventListener('click', enableMusic);
    }

    playBackgroundMusic() {
        if (!this.userInteracted || !this.backgroundMusic || this.isMusicPlaying) return;
        if (this.currentGalaxy && this.excludedMusicGalaxies.includes(this.currentGalaxy.id)) return;
        if (this.backgroundMusic.readyState < 2) {
            setTimeout(() => {
                this.backgroundMusic.volume = this.persistentVolume;
                this.playBackgroundMusic();
            }, 1000);
            return;
        }
        this.backgroundMusic.volume = this.persistentVolume;
        const playPromise = this.backgroundMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isMusicPlaying = true;
                console.log('🎵 Música iniciada con volumen:', this.backgroundMusic.volume);
            }).catch(error => {
                console.error('❌ Error reproduciendo música:', error);
            });
        }
    }

    pauseBackgroundMusic() {
        if (this.backgroundMusic && !this.backgroundMusic.paused && 
            this.currentGalaxy && this.excludedMusicGalaxies.includes(this.currentGalaxy.id)) {
            this.backgroundMusic.pause();
            this.isMusicPlaying = false;
        }
    }

    // ===== MÉTODOS DE INICIALIZACIÓN DE GALAXIAS =====
    initAnaGalaxy() {
        const canvas = document.getElementById('galaxyCanvas');
        const contentContainer = document.getElementById('galaxyContent');
        contentContainer.innerHTML = `
            <div class="ana-message">Eres el centro de mi universo Ana</div>
            <div class="ana-discover-message">Explora el universo para descubrir mensajes de amor</div>
            <div class="ana-instructions">Haz clic y arrastra para girar en 3D • Rueda del mouse para zoom</div>
            <div class="ana-zoom-indicator">Zoom: 100%</div>
            <div class="ana-loading" id="anaLoading">Cargando galaxia de amor...</div>
        `;
        if (typeof initAnaGalaxyContent === 'function') {
            initAnaGalaxyContent(canvas, contentContainer);
        } else {
            this.initGenericGalaxy('ana');
        }
    }

    initPinwheelGalaxy() {
        const canvas = document.getElementById('galaxyCanvas');
        const contentContainer = document.getElementById('galaxyContent');
        contentContainer.innerHTML = `
            <div class="heart-message">Galaxia De Corazones</div>
            <div class="heart-discover-message">Descubre el amor en cada estrella...</div>
            <div class="heart-instructions">Usa el ratón para explorar esta galaxia especial</div>
            <div class="heart-zoom-indicator">Zoom: 100%</div>
            <div class="heart-loading" id="heartLoading">Cargando galaxia de corazones...</div>
        `;
        if (typeof initHeartGalaxyWithFloatingTexts === 'function') {
            initHeartGalaxyWithFloatingTexts(canvas, contentContainer);
        } else {
            this.initHeartGalaxyDirect(canvas, contentContainer);
        }
    }

    initHeartGalaxyDirect(canvas, contentContainer) {
        contentContainer.innerHTML = `
            <div class="heart-message">Galaxia De Corazones</div>
            <div class="heart-discover-message">Descubre el amor en cada estrella...</div>
            <div class="heart-instructions">Usa el ratón para explorar esta galaxia especial</div>
            <div class="heart-zoom-indicator">Zoom: 100%</div>
            <div class="heart-loading" id="heartLoading">Cargando galaxia de corazones...</div>
        `;
        this.createHeartGalaxyScene(canvas);
    }

    createHeartGalaxyScene(canvas) {
        try {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000011, 1);
            
            const galaxyGroup = new THREE.Group();
            const coreGeometry = new THREE.SphereGeometry(1.5, 16, 16);
            const coreMaterial = new THREE.MeshBasicMaterial({ color: 0xff4d4d, emissive: 0xff4d4d });
            const core = new THREE.Mesh(coreGeometry, coreMaterial);
            galaxyGroup.add(core);
            
            const particlesCount = 1500;
            const positions = new Float32Array(particlesCount * 3);
            const colors = new Float32Array(particlesCount * 3);
            const sizes = new Float32Array(particlesCount);
            
            for(let i = 0; i < particlesCount; i++) {
                const i3 = i * 3;
                const radius = Math.sqrt(Math.random()) * 15;
                const angle = Math.random() * Math.PI * 2;
                const spiralAngle = angle + Math.log(radius / 15 + 0.1) * 4;
                
                positions[i3] = Math.cos(spiralAngle) * radius;
                positions[i3 + 1] = (Math.random() - 0.5) * 3;
                positions[i3 + 2] = Math.sin(spiralAngle) * radius;
                
                const colorVariation = Math.random() * 0.3;
                colors[i3] = 1.0;
                colors[i3 + 1] = 0.2 + colorVariation;
                colors[i3 + 2] = 0.3 + colorVariation;
                sizes[i] = Math.random() * 0.8 + 0.3;
            }
            
            const particlesGeometry = new THREE.BufferGeometry();
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
            
            const particlesMaterial = new THREE.PointsMaterial({
                size: 0.5, vertexColors: true, sizeAttenuation: true, transparent: false, opacity: 1.0
            });
            
            const particles = new THREE.Points(particlesGeometry, particlesMaterial);
            galaxyGroup.add(particles);
            
            const haloParticlesCount = 500;
            const haloPositions = new Float32Array(haloParticlesCount * 3);
            const haloColors = new Float32Array(haloParticlesCount * 3);
            
            for(let i = 0; i < haloParticlesCount; i++) {
                const i3 = i * 3;
                const radius = 15 + Math.random() * 8;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                
                haloPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
                haloPositions[i3 + 1] = radius * Math.cos(phi);
                haloPositions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
                haloColors[i3] = 1.0; haloColors[i3 + 1] = 0.5; haloColors[i3 + 2] = 0.6;
            }
            
            const haloGeometry = new THREE.BufferGeometry();
            haloGeometry.setAttribute('position', new THREE.BufferAttribute(haloPositions, 3));
            haloGeometry.setAttribute('color', new THREE.BufferAttribute(haloColors, 3));
            
            const haloMaterial = new THREE.PointsMaterial({
                size: 0.4, vertexColors: true, sizeAttenuation: true, transparent: false, opacity: 0.6
            });
            
            const halo = new THREE.Points(haloGeometry, haloMaterial);
            galaxyGroup.add(halo);
            
            scene.add(galaxyGroup);
            camera.position.z = 25;
            const controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            
            const animate = () => {
                requestAnimationFrame(animate);
                galaxyGroup.rotation.y += 0.003;
                particles.rotation.y += 0.001;
                halo.rotation.y += 0.0005;
                controls.update();
                renderer.render(scene, camera);
            };
            animate();
        } catch (error) {
            console.error('❌ Error creando Galaxia de Corazones:', error);
        }
    }

    initMusicaGalaxy() {
        const canvas = document.getElementById('galaxyCanvas');
        const contentContainer = document.getElementById('galaxyContent');
        contentContainer.innerHTML = `
            <div class="musica-message">Galaxia Música</div>
            <div class="musica-discover-message">Disfruta de la letra de "Somewhere Only We Know"</div>
            <div class="musica-instructions">La música comenzará automáticamente</div>
            <div class="musica-zoom-indicator">Zoom: 100%</div>
            <div class="musica-loading" id="musicaLoading">Cargando galaxia musical...</div>
        `;
        if (typeof initMusicaGalaxyContent === 'function') {
            initMusicaGalaxyContent(canvas, contentContainer);
        } else {
            this.initGenericGalaxy('musica');
        }
    }

    loadExternalGalaxy(galaxyId, initFunctionName) {
        const canvas = document.getElementById('galaxyCanvas');
        const contentContainer = document.getElementById('galaxyContent');
        if (!canvas || !contentContainer) return;
        
        canvas.style.cssText = `
            display: block !important; visibility: visible !important; pointer-events: auto !important;
            position: absolute !important; top: 0 !important; left: 0 !important;
            width: 100% !important; height: 100% !important; z-index: 1 !important;
        `;
        
        const initFunction = window[initFunctionName];
        if (typeof initFunction === 'function') {
            try {
                initFunction(canvas, contentContainer);
            } catch (error) {
                console.error(`❌ Error ejecutando ${initFunctionName}:`, error);
                this.initFallbackGalaxy(galaxyId, canvas, contentContainer);
            }
        } else {
            this.initFallbackGalaxy(galaxyId, canvas, contentContainer);
        }
    }

    initFallbackGalaxy(galaxyId, canvas, contentContainer) {
        const galaxy = this.galaxies.find(g => g.id === galaxyId);
        if (!galaxy) return;
        
        switch(galaxyId) {
            case 'pinwheel': this.initHeartGalaxyDirect(canvas, contentContainer); break;
            case 'libro': this.initLibroGalaxyDirect(canvas, contentContainer); break;
            case 'rompecabezas': this.initRompecabezasGalaxyDirect(canvas, contentContainer); break;
            case 'recuerdos': this.initRecuerdosGalaxyDirect(canvas, contentContainer); break;
            case 'laberinto': this.initLaberintoGalaxyDirect(canvas, contentContainer); break;
            default: this.initGenericGalaxy(galaxyId);
        }
    }

    initGenericGalaxy(galaxyId) {
        const canvas = document.getElementById('galaxyCanvas');
        const contentContainer = document.getElementById('galaxyContent');
        const galaxy = this.galaxies.find(g => g.id === galaxyId);
        contentContainer.innerHTML = `
            <div class="galaxy-message">Explorando ${galaxy.name}</div>
            <div class="galaxy-discover-message">Un lugar misterioso en el universo</div>
            <div class="galaxy-instructions">Haz clic y arrastra para girar en 3D</div>
        `;
        this.createBasicGalaxyScene(canvas, galaxy.color.core);
    }

    createBasicGalaxyScene(canvas, color, coreSize = 2) {
        try {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000011, 1);
            
            const galaxyGroup = new THREE.Group();
            const coreGeometry = new THREE.SphereGeometry(coreSize, 32, 32);
            const coreMaterial = new THREE.MeshBasicMaterial({ color: color, emissive: color });
            const core = new THREE.Mesh(coreGeometry, coreMaterial);
            galaxyGroup.add(core);
            
            const particlesCount = 2000;
            const positions = new Float32Array(particlesCount * 3);
            const colors = new Float32Array(particlesCount * 3);
            const r = (color >> 16) & 255; const g = (color >> 8) & 255; const b = color & 255;
            
            for(let i = 0; i < particlesCount; i++) {
                const i3 = i * 3;
                const radius = Math.random() * 20;
                const angle = Math.random() * Math.PI * 2;
                positions[i3] = Math.cos(angle) * radius;
                positions[i3 + 1] = (Math.random() - 0.5) * 4;
                positions[i3 + 2] = Math.sin(angle) * radius;
                colors[i3] = r / 255; colors[i3 + 1] = g / 255; colors[i3 + 2] = b / 255;
            }
            
            const particlesGeometry = new THREE.BufferGeometry();
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            
            const particlesMaterial = new THREE.PointsMaterial({
                size: 0.3, vertexColors: true, sizeAttenuation: true, transparent: true, opacity: 0.8
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
        } catch (error) {
            console.error('❌ Error creando visualización básica:', error);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.galaxyMeshes.forEach(mesh => mesh.rotation.y += 0.001);
        if (this.starField) this.starField.rotation.y += 0.0001;
        if (this.controls) this.controls.update();
        this.updateGalaxyLabels();
        this.renderer.render(this.scene, this.camera);
    }

    updateGalaxyLabels() {
        const labels = document.querySelectorAll('.galaxy-label');
        labels.forEach((label, index) => {
            const galaxy = this.galaxies[index];
            if (!galaxy) return;
            
            if (this.zoomedGalaxy) {
                if (galaxy.id === this.zoomedGalaxy.id) {
                    label.style.display = 'none';
                    return;
                } else {
                    label.style.display = 'block';
                    label.classList.add('zoomed');
                }
            } else {
                label.style.display = 'block';
                label.classList.remove('zoomed');
            }
            
            let labelYOffset = galaxy.size * 1.2;
            if (galaxy.id !== 'ana') labelYOffset = galaxy.size * 1.5;
            
            const labelPosition = new THREE.Vector3(galaxy.x, galaxy.y + labelYOffset, galaxy.z);
            labelPosition.project(this.camera);
            
            const x = (labelPosition.x * 0.5 + 0.5) * window.innerWidth;
            const y = (-labelPosition.y * 0.5 + 0.5) * window.innerHeight;
            
            if (labelPosition.z < 1) {
                label.style.left = `${x}px`;
                label.style.top = `${y}px`;
                const distance = this.camera.position.distanceTo(new THREE.Vector3(galaxy.x, galaxy.y, galaxy.z));
                const maxVisibleDistance = 3000;
                const opacity = Math.max(0.9, 1 - (distance / maxVisibleDistance));
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
    
    window.addEventListener('resize', function() {
        if (window.galaxyManager) {
            window.galaxyManager.onWindowResize();
        }
    });

    const musicButton = document.createElement('button');
    musicButton.innerHTML = '🎵 Activar Música (30%)';
    musicButton.style.position = 'fixed';
    musicButton.style.bottom = '20px';
    musicButton.style.right = '20px';
    musicButton.style.zIndex = '10000';
    musicButton.style.padding = '10px 15px';
    musicButton.style.background = 'rgba(255, 77, 136, 0.9)';
    musicButton.style.color = 'white';
    musicButton.style.border = 'none';
    musicButton.style.borderRadius = '8px';
    musicButton.style.cursor = 'pointer';
    musicButton.style.fontFamily = 'Quicksand, sans-serif';
    musicButton.style.fontSize = '12px';
    musicButton.style.display = 'none';
    
    musicButton.addEventListener('click', () => {
        if (window.galaxyManager) {
            window.galaxyManager.userInteracted = true;
            window.galaxyManager.backgroundMusic.volume = window.galaxyManager.persistentVolume;
            window.galaxyManager.playBackgroundMusic();
            musicButton.style.display = 'none';
        }
    });

    setTimeout(() => {
        if (window.galaxyManager && !window.galaxyManager.isMusicPlaying) {
            musicButton.style.display = 'block';
        }
    }, 5000);

    document.body.appendChild(musicButton);
});