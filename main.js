// Archivo principal que inicializa la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el gestor de galaxias
    galaxyManager.init();
    
    // Configurar controles de música
    setupMusicControls();
    
    // Manejar redimensionado de ventana
    window.addEventListener('resize', () => {
        galaxyManager.onWindowResize();
    });
});

function setupMusicControls() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    let isPlaying = false;
    
    // Configurar música
    if (backgroundMusic) {
        backgroundMusic.volume = volumeSlider ? volumeSlider.value / 100 : 0.7;
        
        // Intentar autoplay
        backgroundMusic.play().then(() => {
            isPlaying = true;
            if (playPauseBtn) playPauseBtn.innerHTML = '⏸️';
        }).catch(error => {
            console.log("Autoplay bloqueado:", error);
        });
    }
    
    // Controles de play/pause
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function() {
            if (!backgroundMusic) return;
            
            if (isPlaying) {
                backgroundMusic.pause();
                this.innerHTML = '▶️';
            } else {
                backgroundMusic.play();
                this.innerHTML = '⏸️';
            }
            isPlaying = !isPlaying;
        });
    }
    
    // Control de volumen
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            if (backgroundMusic) {
                backgroundMusic.volume = this.value / 100;
            }
        });
    }
    
    // Activar audio con la primera interacción del usuario
    const activateAudio = function() {
        if (backgroundMusic && backgroundMusic.muted) {
            backgroundMusic.muted = false;
        }
        document.removeEventListener('click', activateAudio);
        document.removeEventListener('touchstart', activateAudio);
    };
    
    document.addEventListener('click', activateAudio);
    document.addEventListener('touchstart', activateAudio);
}