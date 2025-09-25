// Galaxia de Amor para Ana (tu código original adaptado)
function initLoveGalaxy() {
    const canvas = document.getElementById('galaxyCanvas');
    const contentContainer = document.getElementById('galaxyContent');
    
    // Limpiar canvas y contenido previo
    const oldCanvas = canvas.cloneNode(false);
    canvas.parentNode.replaceChild(oldCanvas, canvas);
    
    // Aquí iría tu código original de la galaxia de amor
    // He simplificado para este ejemplo
    contentContainer.innerHTML = `
        <div class="message">Eres el centro de mi universo Ana</div>
        <div class="discover-message">Explora el universo para descubrir mensajes de amor</div>
        <div class="instructions">Haz clic y arrastra para girar en 3D • Rueda del mouse para zoom</div>
        <div class="zoom-indicator">Zoom: 100%</div>
    `;
    
    // En una implementación completa, aquí inicializarías Three.js
    // para la galaxia de amor con agujero negro, mensajes, etc.
    console.log("Inicializando Galaxia de Amor...");
    
    // Ejemplo simplificado de escena
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: oldCanvas });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Esfera simple como placeholder
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshPhongMaterial({ 
        color: 0xff4d88,
        emissive: 0x440022
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    
    camera.position.z = 15;
    
    const animate = function () {
        requestAnimationFrame(animate);
        sphere.rotation.y += 0.01;
        renderer.render(scene, camera);
    };
    
    animate();
    
    // Controles de órbita
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
}