// Gestor principal de galaxias
class GalaxyManager {
    constructor() {
        this.galaxies = [
            { id: 'andromeda', name: 'Andrómeda', x: -30, y: 10, z: -50, size: 8 },
            { id: 'ana', name: 'Galaxia Ana', x: 0, y: 0, z: -40, size: 10 },
            { id: 'via-lactea', name: 'Vía Láctea', x: 25, y: -5, z: -45, size: 9 },
            { id: 'triangulum', name: 'Triángulum', x: -20, y: -15, z: -55, size: 6 },
            { id: 'sombrero', name: 'Galaxia Sombrero', x: 15, y: 20, z: -60, size: 7 },
            { id: 'orion', name: 'Nebulosa de Orión', x: -10, y: 25, z: -35, size: 5 },
            { id: 'centaurus', name: 'Centaurus A', x: 30, y: -10, z: -65, size: 7 },
            { id: 'whirlpool', name: 'Galaxia Remolino', x: -25, y: -20, z: -40, size: 6 },
            { id: 'black-eye', name: 'Galaxia Ojo Negro', x: 20, y: 15, z: -50, size: 5 },
            { id: 'pinwheel', name: 'Galaxia Molinillo', x: -15, y: -25, z: -45, size: 6 }
        ];
        
        this.currentGalaxy = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.galaxyMeshes = [];
        this.starField = null;
    }
    
    init() {
        this.setupScene();
        this.createStarField();
        this.createGalaxies();
        this.createGalaxyLabels();
        this.animate();
        
        // Event listeners
        document.getElementById('backButton').addEventListener('click', () => this.showGalaxyView(false));
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.camera.position.z = 100;
        
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('galaxiesCanvas'),
            antialias: true,
            alpha: true
        });
        
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000011, 1);
        
        // Luz ambiental
        const ambientLight = new THREE.AmbientLight(0x333333);
        this.scene.add(ambientLight);
        
        // Luz direccional
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 3, 5);
        this.scene.add(directionalLight);
    }
    
    createStarField() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 5000;
        const starPositions = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
            starPositions[i * 3] = (Math.random() - 0.5) * 2000;
            starPositions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
            starPositions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
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
            const geometry = new THREE.SphereGeometry(galaxy.size, 32, 32);
            let material;
            
            // Materiales diferentes para cada galaxia
            if (galaxy.id === 'ana') {
                material = new THREE.MeshPhongMaterial({
                    color: 0xff4d88,
                    emissive: 0x440022,
                    specular: 0xff88aa,
                    shininess: 100,
                    transparent: true,
                    opacity: 0.9
                });
            } else {
                const hue = Math.random();
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color().setHSL(hue, 0.7, 0.5),
                    emissive: new THREE.Color().setHSL(hue, 0.5, 0.2),
                    specular: new THREE.Color().setHSL(hue, 0.8, 0.7),
                    shininess: 80,
                    transparent: true,
                    opacity: 0.8
                });
            }
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(galaxy.x, galaxy.y, galaxy.z);
            mesh.userData = { galaxyId: galaxy.id };
            
            this.scene.add(mesh);
            this.galaxyMeshes.push(mesh);
            
            // Añadir efecto de corona para galaxias espirales
            if (Math.random() > 0.3) {
                const coronaGeometry = new THREE.RingGeometry(galaxy.size * 1.1, galaxy.size * 1.5, 32);
                const coronaMaterial = new THREE.MeshBasicMaterial({
                    color: material.emissive,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.3
                });
                
                const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
                corona.rotation.x = Math.PI / 2;
                mesh.add(corona);
            }
        });
    }
    
    createGalaxyLabels() {
        const namesContainer = document.getElementById('galaxyNames');
        
        this.galaxies.forEach(galaxy => {
            const label = document.createElement('div');
            label.className = 'galaxy-label';
            label.textContent = galaxy.name;
            label.dataset.galaxyId = galaxy.id;
            
            // Posicionar label (aproximado)
            label.style.left = '50%';
            label.style.top = '50%';
            
            namesContainer.appendChild(label);
            
            // Event listener para clic en galaxia
            label.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectGalaxy(galaxy.id);
            });
        });
        
        // También hacer clicable las propias galaxias 3D
        this.addGalaxyClickEvents();
    }
    
    addGalaxyClickEvents() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        const onMouseClick = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
            
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(this.galaxyMeshes);
            
            if (intersects.length > 0) {
                const galaxyId = intersects[0].object.userData.galaxyId;
                this.selectGalaxy(galaxyId);
            }
        };
        
        document.getElementById('galaxiesCanvas').addEventListener('click', onMouseClick);
    }
    
    selectGalaxy(galaxyId) {
        const galaxy = this.galaxies.find(g => g.id === galaxyId);
        if (!galaxy) return;
        
        this.currentGalaxy = galaxy;
        this.showGalaxyView(true);
        
        // Animación de zoom hacia la galaxia seleccionada
        this.animateCameraToGalaxy(galaxy);
    }
    
    animateCameraToGalaxy(galaxy) {
        // Esta función animaría la cámara hacia la galaxia seleccionada
        // Implementación simplificada por ahora
        console.log(`Navegando a la galaxia: ${galaxy.name}`);
    }
    
    showGalaxyView(show) {
        const galaxiesView = document.getElementById('galaxiesView');
        const galaxyView = document.getElementById('galaxyView');
        const galaxyTitle = document.getElementById('galaxyTitle');
        
        if (show && this.currentGalaxy) {
            galaxiesView.classList.add('hidden');
            galaxyView.classList.remove('hidden');
            galaxyTitle.textContent = this.currentGalaxy.name;
            
            // Cargar contenido específico de la galaxia
            this.loadGalaxyContent(this.currentGalaxy.id);
        } else {
            galaxyView.classList.add('hidden');
            galaxiesView.classList.remove('hidden');
            this.currentGalaxy = null;
        }
    }
    
    loadGalaxyContent(galaxyId) {
        const contentContainer = document.getElementById('galaxyContent');
        contentContainer.innerHTML = '';
        
        switch(galaxyId) {
            case 'ana':
                // Cargar la galaxia de amor
                if (typeof initLoveGalaxy === 'function') {
                    initLoveGalaxy();
                }
                break;
            default:
                // Contenido placeholder para otras galaxias
                contentContainer.innerHTML = `
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                        <h2 style="font-family: 'Pacifico', cursive; color: #ff4d88; margin-bottom: 20px;">
                            ${this.currentGalaxy.name}
                        </h2>
                        <p style="font-family: 'Dancing Script', cursive; font-size: 24px;">
                            Próximamente más contenido para esta galaxia
                        </p>
                    </div>
                `;
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotar galaxias lentamente
        this.galaxyMeshes.forEach(mesh => {
            mesh.rotation.y += 0.001;
            if (mesh.children.length > 0) {
                mesh.children[0].rotation.z += 0.002;
            }
        });
        
        // Rotar campo de estrellas muy lentamente
        if (this.starField) {
            this.starField.rotation.y += 0.0001;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        if (this.camera && this.renderer) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
}

// Instancia global del gestor de galaxias
const galaxyManager = new GalaxyManager();