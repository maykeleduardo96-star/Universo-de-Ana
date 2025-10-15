// ===== MAIN INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // CORRECCIÓN: Asignar galaxyManager a window para que sea accesible globalmente
    window.galaxyManager = new GalaxyManager();
    window.galaxyManager.init();
    
    setupMusicControls();
    
    window.addEventListener('resize', () => {
        if (window.galaxyManager) {
            window.galaxyManager.onWindowResize();
        }
    });
});

function setupMusicControls() {
    const music = document.getElementById('backgroundMusic');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    
    music.load();
    
    playPauseBtn.addEventListener('click', function() {
        if (music.paused) {
            music.play();
            playPauseBtn.textContent = '⏸';
        } else {
            music.pause();
            playPauseBtn.textContent = '▶';
        }
    });
    
    volumeSlider.addEventListener('input', function() {
        music.volume = volumeSlider.value / 100;
    });
    
    // Permitir la reproducción al hacer clic en cualquier lugar (para el autoplay bloqueado)
    document.addEventListener('click', function() {
        if (music.paused) {
            music.play().catch(e => console.log("No se pudo reproducir:", e));
        }
    }, { once: true });
}

// AGREGAR AL FINAL DE MAIN.JS
function setupLibroGalaxyIntegration() {
    console.log("🔗 Configurando integración con Libro Galaxy...");
    
    // Sobrescribir la función de cierre de galaxias si existe
    if (window.closeCurrentGalaxy) {
        const originalClose = window.closeCurrentGalaxy;
        window.closeCurrentGalaxy = function() {
            console.log("🔧 Cerrando galaxia actual con integración de libro...");
            
            // Cerrar el libro si está activo
            if (window.currentLibroGalaxy) {
                window.currentLibroGalaxy.cleanup();
                window.currentLibroGalaxy = null;
            }
            
            // Ejecutar función original
            originalClose();
        };
    }
    
    // Escuchar evento de cierre del libro
    window.addEventListener('closeGalaxy', function() {
        console.log("🎯 Evento closeGalaxy recibido en main.js");
        if (window.currentLibroGalaxy) {
            window.currentLibroGalaxy.cleanup();
            window.currentLibroGalaxy = null;
        }
    });
}

// Llamar después de que se cargue el DOM
document.addEventListener('DOMContentLoaded', function() {
    setupLibroGalaxyIntegration();
});