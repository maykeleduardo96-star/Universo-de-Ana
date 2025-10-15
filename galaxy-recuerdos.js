// ===== GALAXIA RECUERDOS - VERSIÓN CON RESTAURACIÓN COMPLETA =====

// DEFINIR TODAS LAS FUNCIONES PRIMERO
function createStars(container) {
    console.log('⭐ Creando estrellas...');
    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        const size = Math.random() * 2 + 1;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 4;
        const duration = 3 + Math.random() * 2;
        
        star.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            top: ${top}%;
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
        `;
        star.className = 'star';
        container.appendChild(star);
    }
}

function createStaticPhotos(recuerdos, container) {
    console.log('📸 Creando fotos estáticas...');
    const positions = [
        { left: '15%', top: '25%', rotate: '-5deg' },
        { left: '30%', top: '60%', rotate: '3deg' },
        { left: '50%', top: '30%', rotate: '-2deg' },
        { left: '70%', top: '55%', rotate: '4deg' },
        { left: '85%', top: '25%', rotate: '-3deg' }
    ];

    recuerdos.forEach((recuerdo, index) => {
        const position = positions[index] || { left: '50%', top: '50%', rotate: '0deg' };
        
        const photoWrapper = document.createElement('div');
        photoWrapper.style.cssText = `
            position: absolute;
            left: ${position.left};
            top: ${position.top};
            transform: translate(-50%, -50%) rotate(${position.rotate});
            pointer-events: auto;
            transition: all 0.4s ease;
            --rotate: ${position.rotate};
        `;
        photoWrapper.className = 'float-animation';

        const photo = document.createElement('div');
        photo.className = 'recuerdo-photo';
        photo.dataset.id = recuerdo.id;
        photo.title = `Haz clic para ver: ${recuerdo.title}`;
        
        photo.style.cssText = `
            background-image: url('${recuerdo.imageUrl}');
            width: 180px;
            height: 250px;
        `;
        
        // Crear partículas suaves
        const particles = document.createElement('div');
        particles.className = 'photo-particles';
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const angle = (i / 6) * Math.PI * 2;
            const distance = 30;
            particle.style.cssText = `
                --tx: ${Math.cos(angle) * distance}px;
                --ty: ${Math.sin(angle) * distance}px;
                left: 50%;
                top: 50%;
                animation-delay: ${i * 0.3}s;
                background: ${recuerdo.color};
            `;
            particles.appendChild(particle);
        }
        
        photo.appendChild(particles);
        
        // EVENTO CLICK SIMPLE Y DIRECTO
        photo.onclick = function(e) {
            e.stopPropagation();
            console.log('🖱 Click en foto:', recuerdo.id);
            expandPhoto(photo, recuerdo, photoWrapper);
        };
        
        photoWrapper.appendChild(photo);
        container.appendChild(photoWrapper);

        // Guardar referencia para restaurar posición
        photo._originalWrapper = photoWrapper;
        photo._originalTransform = photoWrapper.style.transform;
        photo._originalLeft = position.left;
        photo._originalTop = position.top;
    });

    // EVENT DELEGATION como respaldo
    container.addEventListener('click', function(e) {
        const photoElement = e.target.closest('.recuerdo-photo');
        if (photoElement && !photoElement.classList.contains('photo-expanded')) {
            e.preventDefault();
            e.stopPropagation();
            const id = photoElement.dataset.id;
            const recuerdo = recuerdos.find(r => r.id == id);
            if (recuerdo) {
                console.log('🔄 Click por delegación en foto:', id);
                expandPhoto(photoElement, recuerdo, photoElement._originalWrapper);
            }
        }
    }, true);
}

function expandPhoto(photoElement, recuerdo, wrapperElement) {
    console.log('🎯 Expandir foto:', recuerdo.id);
    
    const allPhotos = document.querySelectorAll('.recuerdo-photo');
    const allWrappers = document.querySelectorAll('.float-animation');
    
    // Contraer todas las fotos primero
    allPhotos.forEach(photo => {
        photo.classList.remove('photo-expanded', 'photo-blurred');
        if (photo._originalWrapper) {
            photo._originalWrapper.style.transform = photo._originalTransform;
            photo._originalWrapper.style.zIndex = '10';
        }
    });
    
    // Pausar animaciones de flotación en todos los wrappers
    allWrappers.forEach(wrapper => {
        wrapper.style.animationPlayState = 'paused';
    });
    
    // Expandir foto clickeada
    photoElement.classList.add('photo-expanded');
    
    // Posicionar la foto más arriba para que no la tape el panel
    wrapperElement.style.transform = 'translate(-50%, -60%) scale(1.6)';
    wrapperElement.style.zIndex = '1000';
    
    // Centrar la foto expandida pero más arriba
    wrapperElement.style.left = '50%';
    wrapperElement.style.top = '40%';
    
    // Desenfocar otras fotos
    allPhotos.forEach(photo => {
        if (photo !== photoElement) {
            photo.classList.add('photo-blurred');
            if (photo._originalWrapper) {
                photo._originalWrapper.style.transform = photo._originalTransform + ' scale(0.8)';
            }
        }
    });
    
    // Mostrar panel de información COMPACTO
    showPostal(recuerdo);
}

function showPostal(recuerdo) {
    console.log('📮 Mostrando postal:', recuerdo.title);
    
    // Remover panel existente
    const existingPanel = document.getElementById('photoPostalPanel');
    if (existingPanel) existingPanel.remove();
    
    // Crear nuevo panel MÁS PEQUEÑO
    const panel = document.createElement('div');
    panel.id = 'photoPostalPanel';
    panel.innerHTML = `
        <button class="close-postal-btn" onclick="window.closePostal()">×</button>
        <div style="text-align: center;">
            <div style="font-size: 1.5em; color: #ff69b4; margin-bottom: 10px; font-weight: bold; text-shadow: 0 0 12px rgba(255, 105, 180, 0.6); font-family: 'Quicksand', sans-serif;">
                ${recuerdo.title}
            </div>
            <div style="font-size: 0.9em; color: #ff9900; margin-bottom: 12px; display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; font-family: 'Quicksand', sans-serif;">
                <span style="display: flex; align-items: center;">📅 ${recuerdo.date}</span>
                <span style="margin: 0 6px;">•</span>
                <span style="display: flex; align-items: center;">📍 ${recuerdo.location}</span>
            </div>
            <div style="font-size: 0.85em; color: #e0e0e0; line-height: 1.4; margin-bottom: 0; max-width: 450px; margin-left: auto; margin-right: auto; font-family: 'Quicksand', sans-serif; background: rgba(255, 255, 255, 0.06); padding: 12px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.12);">
                ${recuerdo.message}
            </div>
        </div>
    `;
    
    document.body.appendChild(panel);
}

function closePostal() {
    console.log('🔙 Cerrando postal...');
    
    const panel = document.getElementById('photoPostalPanel');
    if (panel) {
        panel.style.opacity = '0';
        panel.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => panel.remove(), 300);
    }
    
    // Restaurar todas las fotos
    const allPhotos = document.querySelectorAll('.recuerdo-photo');
    const allWrappers = document.querySelectorAll('.float-animation');
    
    allPhotos.forEach(photo => {
        photo.classList.remove('photo-expanded', 'photo-blurred');
    });
    
    allWrappers.forEach(wrapper => {
        wrapper.style.animationPlayState = 'running';
        if (wrapper.firstChild && wrapper.firstChild._originalTransform) {
            wrapper.style.transform = wrapper.firstChild._originalTransform;
            wrapper.style.zIndex = '10';
            // Restaurar posición original
            if (wrapper.firstChild._originalLeft && wrapper.firstChild._originalTop) {
                wrapper.style.left = wrapper.firstChild._originalLeft;
                wrapper.style.top = wrapper.firstChild._originalTop;
            }
        }
    });
}

function createImprovedUI(container, count) {
    console.log('🎨 Creando interfaz mejorada...');
    
    // Título más sutil y posicionado más abajo
    const title = document.createElement('div');
    title.innerHTML = '🌌 Galaxia de Recuerdos';
    title.className = 'galaxy-subtitle';
    title.style.cssText += `
        top: 120px;
        font-size: 1.8em;
        color: rgba(255, 255, 255, 0.85);
    `;
    container.appendChild(title);

    // Contador más sutil
    const counter = document.createElement('div');
    counter.innerHTML = `📸 ${count} Recuerdos Especiales`;
    counter.className = 'galaxy-subtitle';
    counter.style.cssText += `
        top: 170px;
        font-size: 1em;
        color: rgba(0, 255, 255, 0.8);
        background: rgba(0, 255, 255, 0.05);
        border: 1px solid rgba(0, 255, 255, 0.2);
    `;
    container.appendChild(counter);

    // Instrucciones más sutiles
    const instructions = document.createElement('div');
    instructions.innerHTML = '✨ Haz clic en cualquier foto para explorar el recuerdo ✨';
    instructions.className = 'galaxy-subtitle';
    instructions.style.cssText += `
        bottom: 30px;
        font-size: 0.9em;
        color: rgba(255, 255, 0, 0.8);
        background: rgba(255, 255, 0, 0.05);
        border: 1px solid rgba(255, 255, 0, 0.2);
    `;
    container.appendChild(instructions);
}

// FUNCIÓN PRINCIPAL CORREGIDA
function initRecuerdosGalaxy(canvas, contentContainer) {
    console.log('🚀 GALAXIA RECUERDOS - Iniciando versión corregida');
    
    // GUARDAR ESTADO ACTUAL DEL UNIVERSO
    window.galaxyPreviousState = {
        galaxiesCanvas: document.getElementById('galaxiesCanvas'),
        galaxyCanvas: document.getElementById('galaxyCanvas'),
        animationId: window.galaxyManager?.animationId
    };
    
    // LIMPIAR COMPLETAMENTE EL CONTENEDOR
    contentContainer.innerHTML = '';
    
    // CREAR CONTENEDOR PRINCIPAL
    const galaxyContainer = document.createElement('div');
    galaxyContainer.id = 'recuerdosContainer';
    galaxyContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%);
        margin: 0;
        padding: 0;
        overflow: hidden;
        font-family: 'Quicksand', sans-serif;
        z-index: 10000;
        cursor: default;
        opacity: 0;
        transition: opacity 0.8s ease;
    `;
    contentContainer.appendChild(galaxyContainer);

    // AÑADIR ESTILOS CSS GLOBALES MEJORADOS
    const styles = document.createElement('style');
    styles.id = 'recuerdosStyles';
    styles.textContent = `
        .recuerdo-photo {
            position: absolute;
            width: 200px;
            height: 280px;
            background-size: cover;
            background-position: center;
            border: 8px solid white;
            border-radius: 12px;
            cursor: pointer !important;
            transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            box-shadow: 
                0 0 30px rgba(255, 255, 255, 0.3),
                0 10px 25px rgba(0, 0, 0, 0.5);
            z-index: 10;
            pointer-events: auto !important;
            -webkit-user-select: none;
            user-select: none;
            transform-origin: center center;
        }
        
        /* EFECTO DE BORDE SUAVE */
        .recuerdo-photo::before {
            content: '';
            position: absolute;
            top: -4px;
            left: -4px;
            right: -4px;
            bottom: -4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 14px;
            z-index: -1;
            opacity: 0;
            transition: opacity 0.3s ease;
            border: 2px solid transparent;
        }
        
        .recuerdo-photo:hover::before {
            opacity: 1;
            border: 2px solid rgba(255, 105, 180, 0.6);
            background: rgba(255, 105, 180, 0.1);
        }
        
        .recuerdo-photo:hover {
            transform: scale(1.15) translateY(-10px) !important;
            box-shadow: 
                0 0 50px rgba(255, 105, 180, 0.6),
                0 15px 35px rgba(0, 0, 0, 0.4);
            border-color: #ff69b4;
            z-index: 20 !important;
        }
        
        /* EXPANSIÓN MEJORADA */
        .photo-expanded {
            transform: scale(1.6) !important;
            z-index: 1000 !important;
            box-shadow: 
                0 0 80px rgba(255, 105, 180, 0.9),
                0 20px 50px rgba(0, 0, 0, 0.6) !important;
            border-color: #ff69b4 !important;
            cursor: default !important;
        }
        
        .photo-expanded::before {
            opacity: 1 !important;
            border: 3px solid rgba(255, 105, 180, 0.8) !important;
            background: rgba(255, 105, 180, 0.15) !important;
        }
        
        .photo-blurred {
            filter: blur(8px) brightness(0.7);
            opacity: 0.4;
            transform: scale(0.85) !important;
        }
        
        /* PANEL MÁS PEQUEÑO Y ELEGANTE */
        #photoPostalPanel {
            position: fixed;
            bottom: 25px;
            left: 50%;
            transform: translateX(-50%);
            width: 85%;
            max-width: 500px;
            background: rgba(10, 10, 26, 0.92);
            color: white;
            font-family: 'Quicksand', sans-serif;
            z-index: 20000;
            padding: 20px;
            backdrop-filter: blur(25px);
            border: 1px solid rgba(255, 105, 180, 0.4);
            border-radius: 16px;
            box-shadow: 0 8px 35px rgba(0, 0, 0, 0.6);
            transition: all 0.4s ease-out;
        }
        
        .star {
            position: absolute;
            background: white;
            border-radius: 50%;
            animation: twinkle 4s infinite alternate;
            pointer-events: none;
        }
        
        @keyframes twinkle {
            0% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.1); }
            100% { opacity: 0.3; transform: scale(1); }
        }
        
        @keyframes float {
            0% { transform: translateY(0px) rotate(var(--rotate)); }
            50% { transform: translateY(-15px) rotate(var(--rotate)); }
            100% { transform: translateY(0px) rotate(var(--rotate)); }
        }
        
        .float-animation {
            animation: float 6s infinite ease-in-out;
        }
        
        /* Efecto de partículas suaves */
        .photo-particles {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 8px;
            pointer-events: none;
            z-index: -1;
        }
        
        .particle {
            position: absolute;
            width: 3px;
            height: 3px;
            background: rgba(255, 105, 180, 0.6);
            border-radius: 50%;
            opacity: 0;
        }
        
        .recuerdo-photo:hover .particle {
            animation: particle-float 2s infinite;
        }
        
        @keyframes particle-float {
            0% { transform: translate(0, 0); opacity: 0; }
            50% { opacity: 0.7; }
            100% { transform: translate(var(--tx), var(--ty)); opacity: 0; }
        }

        /* Botón de cerrar más elegante */
        .close-postal-btn {
            position: absolute;
            top: -12px;
            right: -12px;
            width: 35px;
            height: 35px;
            background: linear-gradient(45deg, #ff69b4, #ff1493);
            border: none;
            border-radius: 50%;
            color: white;
            font-size: 1.1em;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 0 15px rgba(255, 105, 180, 0.6);
            transition: all 0.3s ease;
            z-index: 20001;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .close-postal-btn:hover {
            transform: scale(1.15);
            box-shadow: 0 0 25px rgba(255, 105, 180, 0.9);
        }

        /* Títulos más sutiles y sin marco negro */
        .galaxy-subtitle {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            color: rgba(255, 255, 255, 0.9);
            font-family: 'Quicksand', sans-serif;
            text-align: center;
            z-index: 100;
            background: rgba(255, 255, 255, 0.05);
            padding: 10px 25px;
            border-radius: 12px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            pointer-events: none;
            text-shadow: 0 0 10px rgba(255, 105, 180, 0.3);
        }
    `;
    document.head.appendChild(styles);

    // CREAR FONDO ESTRELLADO
    createStars(galaxyContainer);

    // CONTENEDOR PARA FOTOS
    const photosContainer = document.createElement('div');
    photosContainer.id = 'photosContainer';
    photosContainer.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        height: 70%;
        pointer-events: none;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 40px;
        padding: 40px;
    `;
    galaxyContainer.appendChild(photosContainer);

    // DATOS DE RECUERDOS ACTUALIZADOS
    const recuerdos = [
        { 
            id: 1, 
            imageUrl: 'https://dl.dropboxusercontent.com/scl/fi/543c2oouwd1501vbzi257/1era-imagen.png?rlkey=0advdg39xtxwor74gqxguwx7i&st=c01r61r9&dl=1',
            date: '24 de Julio de 2025', 
            title: 'Primera Vez', 
            message: 'Primera vez que vi a Ana en mi vida, fue en un Live de Tiktok. Un momento que cambió todo para siempre.',
            location: 'Tiktok Live',
            color: '#ff69b4'
        },
        { 
            id: 2, 
            imageUrl: 'https://dl.dropboxusercontent.com/scl/fi/npwfskoylcf595h0epy87/2da-imagen.png?rlkey=8bpk88q0rct397yxkhre36xkn&st=op97t6yw&dl=1',
            date: '31 de Julio de 2025', 
            title: 'Segunda Vez', 
            message: 'La segunda vez que vi a Ana en el grupo de Profeta en WhatsApp. Cada vez más cerca de su mundo.',
            location: 'WhatsApp Grupo',
            color: '#ff9900'
        },
        { 
            id: 3, 
            imageUrl: 'https://dl.dropboxusercontent.com/scl/fi/389ueg8inaa1e68k7o8wg/3era-imagen.png?rlkey=kni64mk8wogiunk9mho16b603&st=ezilh0io&dl=1',
            date: '06 de Agosto de 2025', 
            title: 'Primera Conversación', 
            message: 'Cuando Ana me rescribió por primera vez. El comienzo de algo especial, nuestras primeras palabras.',
            location: 'WhatsApp Chat',
            color: '#00ffaa'
        },
        { 
            id: 4, 
            imageUrl: 'https://dl.dropboxusercontent.com/scl/fi/dcm0ch2rsn5xa8gm06syn/4ta-imagen.png?rlkey=rjybxuej6hubodupdlvquc9rn&st=dh1fefw6&dl=1',
            date: '15 de Septiembre de 2025', 
            title: 'Inicio de Nuestro Amor', 
            message: 'El día en que empezamos a ser novios. El comienzo oficial de nuestra hermosa relación.',
            location: 'Inicio del Noviazgo',
            color: '#00ffff'
        },
        { 
            id: 5, 
            imageUrl: 'https://dl.dropboxusercontent.com/scl/fi/4kuvqcana2qc08c1ojioc/5ta.jpeg?rlkey=2fh3naqbi9v7585rfi3zwyfkj&st=uevtvl3v&dl=1',
            date: '30 de Septiembre de 2025', 
            title: 'Creando tu Universo', 
            message: 'Maykel editando para crearle a Ana un universo. Demostrando amor a través de la tecnología y la creatividad.',
            location: '3) Maldad',
            color: '#ff1493'
        }
    ];

    // CREAR FOTOS EN DISPOSICIÓN ESTÁTICA
    createStaticPhotos(recuerdos, photosContainer);

    // CREAR INTERFAZ MEJORADA
    createImprovedUI(galaxyContainer, recuerdos.length);

    // EVENT LISTENER GLOBAL PARA CERRAR AL HACER CLIC EN EL FONDO
    galaxyContainer.addEventListener('click', function(e) {
        if (e.target === galaxyContainer) {
            closePostal();
        }
    });

    // ANIMACIÓN DE ENTRADA
    setTimeout(() => {
        galaxyContainer.style.opacity = '1';
    }, 100);

    console.log('✅ Galaxia Recuerdos inicializada correctamente');
}

// FUNCIÓN DE LIMPIEZA COMPLETAMENTE REVISADA
function cleanupRecuerdosGalaxy() {
    console.log('🧹 INICIANDO LIMPIEZA COMPLETA Y ROBUSTA');
    
    // 1. CERRAR TODOS LOS PANELES ABIERTOS
    console.log('📮 Cerrando todos los paneles abiertos...');
    const panel = document.getElementById('photoPostalPanel');
    if (panel) {
        panel.remove();
        console.log('✅ Panel de postal eliminado');
    }
    
    // 2. ELIMINAR TODOS LOS ELEMENTOS DE LA GALAXIA RECUERDOS
    console.log('🗑️ Eliminando elementos de la galaxia...');
    const elementsToRemove = [
        'recuerdosContainer',
        'recuerdosStyles',
        'photosContainer'
    ];
    
    elementsToRemove.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.remove();
            console.log(`✅ Eliminado: ${id}`);
        }
    });
    
    // 3. LIMPIAR CUALQUIER ELEMENTO RESIDUAL
    const residualElements = document.querySelectorAll('.recuerdo-photo, .float-animation, .galaxy-subtitle, .star, .photo-particles');
    residualElements.forEach(element => {
        element.remove();
    });
    if (residualElements.length > 0) {
        console.log(`✅ Eliminados ${residualElements.length} elementos residuales`);
    }
    
    // 4. RESTAURACIÓN COMPLETA DEL UNIVERSO PRINCIPAL
    console.log('🌌 RESTAURANDO UNIVERSO PRINCIPAL...');
    
    // Método directo: forzar la recreación del universo
    restoreMainUniverse();
    
    console.log('🎉 LIMPIEZA COMPLETADA - Universo principal restaurado');
}

// FUNCIÓN ESPECIAL PARA RESTAURAR EL UNIVERSO PRINCIPAL
function restoreMainUniverse() {
    console.log('🔧 Restaurando universo principal de manera forzada...');
    
    // 1. Mostrar los canvas principales
    const galaxiesCanvas = document.getElementById('galaxiesCanvas');
    const galaxyCanvas = document.getElementById('galaxyCanvas');
    
    if (galaxiesCanvas) {
        galaxiesCanvas.style.display = 'block';
        galaxiesCanvas.style.opacity = '1';
        galaxiesCanvas.style.visibility = 'visible';
        galaxiesCanvas.style.pointerEvents = 'auto';
        console.log('✅ galaxiesCanvas restaurado');
    }
    
    if (galaxyCanvas) {
        galaxyCanvas.style.display = 'block';
        galaxyCanvas.style.opacity = '1';
        galaxyCanvas.style.visibility = 'visible';
        galaxyCanvas.style.pointerEvents = 'auto';
        console.log('✅ galaxyCanvas restaurado');
    }
    
    // 2. Reiniciar el Galaxy Manager de manera agresiva
    if (window.galaxyManager) {
        console.log('🔄 Reiniciando Galaxy Manager de manera forzada...');
        
        // Cancelar cualquier animación previa
        if (window.galaxyManager.animationId) {
            cancelAnimationFrame(window.galaxyManager.animationId);
            window.galaxyManager.animationId = null;
        }
        
        // Esperar un frame y luego reiniciar
        setTimeout(() => {
            try {
                // Intentar diferentes métodos de reinicio
                if (typeof window.galaxyManager.init === 'function') {
                    window.galaxyManager.init();
                    console.log('✅ Galaxy Manager reiniciado con init()');
                } else if (typeof window.galaxyManager.restart === 'function') {
                    window.galaxyManager.restart();
                    console.log('✅ Galaxy Manager reiniciado con restart()');
                } else if (typeof window.galaxyManager.animate === 'function') {
                    window.galaxyManager.animate();
                    console.log('✅ Galaxy Manager reiniciado con animate()');
                } else {
                    // Método de emergencia: recrear el manager
                    emergencyUniverseRestore();
                }
            } catch (error) {
                console.error('❌ Error al reiniciar Galaxy Manager:', error);
                emergencyUniverseRestore();
            }
        }, 50);
    } else {
        emergencyUniverseRestore();
    }
    
    // 3. Forzar redibujado del viewport
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        if (typeof render === 'function') {
            render();
        }
    }, 100);
}

// FUNCIÓN DE EMERGENCIA PARA RESTAURAR EL UNIVERSO
function emergencyUniverseRestore() {
    console.log('🚨 EJECUTANDO RESTAURACIÓN DE EMERGENCIA');
    
    // Obtener referencia al contenedor principal
    const mainContainer = document.querySelector('.container, #app, body');
    
    if (mainContainer) {
        // Limpiar completamente
        mainContainer.innerHTML = '';
        
        // Crear elementos canvas desde cero
        const galaxiesCanvas = document.createElement('canvas');
        galaxiesCanvas.id = 'galaxiesCanvas';
        galaxiesCanvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 1;
            display: block;
        `;
        
        const galaxyCanvas = document.createElement('canvas');
        galaxyCanvas.id = 'galaxyCanvas';
        galaxyCanvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 2;
            display: block;
        `;
        
        mainContainer.appendChild(galaxiesCanvas);
        mainContainer.appendChild(galaxyCanvas);
        
        console.log('✅ Canvas recreados desde cero');
        
        // Intentar reiniciar el galaxy manager
        if (window.galaxyManager && typeof window.galaxyManager.init === 'function') {
            setTimeout(() => {
                window.galaxyManager.init();
                console.log('✅ Galaxy Manager reiniciado después de recreación');
            }, 200);
        }
    }
}

// REGISTRAR FUNCIONES GLOBALMENTE
window.closePostal = closePostal;
window.cleanupRecuerdosGalaxy = cleanupRecuerdosGalaxy;
window.initRecuerdosGalaxy = initRecuerdosGalaxy;
window.restoreMainUniverse = restoreMainUniverse;

// REGISTRAR EN EL GALAXY MANAGER
if (typeof galaxyManager !== 'undefined') {
    galaxyManager.registeredGalaxies = galaxyManager.registeredGalaxies || {};
    galaxyManager.registeredGalaxies.recuerdos = {
        init: initRecuerdosGalaxy,
        cleanup: cleanupRecuerdosGalaxy
    };
    console.log('✅ Galaxia Recuerdos registrada en Galaxy Manager');
}

console.log('🚀 galaxy-recuerdos.js cargado - RESTAURACIÓN COMPLETA IMPLEMENTADA');