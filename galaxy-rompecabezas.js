// galaxy-rompecabezas.js - VERSIÓN MEJORADA CON ARRASTRE DE PIEZAS
console.log('🧩 galaxy-rompecabezas.js cargado correctamente - VERSIÓN ARRASTRE');

function initRompecabezasGalaxy(canvas, contentContainer) {
    console.log('🧩 Inicializando Galaxia Rompecabezas - SISTEMA DE ARRASTRE...');
    
    // Guardar referencia al canvas original para restaurarlo después
    const originalCanvas = canvas;
    const originalCanvasStyle = canvas.style.cssText;
    
    // Ocultar el canvas de Three.js temporalmente
    if (canvas) {
        canvas.style.display = 'none';
        canvas.style.visibility = 'hidden';
    }
    
    // Limpiar el contenedor
    contentContainer.innerHTML = '';
    
    // Crear contenedor específico para el rompecabezas
    const rompecabezasContainer = document.createElement('div');
    rompecabezasContainer.id = 'rompecabezasContainer';
    rompecabezasContainer.style.cssText = `
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0a0a2a 0%, #000011 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        overflow-y: auto;
        padding: 20px;
        box-sizing: border-box;
        position: relative;
        z-index: 1000;
        pointer-events: auto;
    `;

    // Crear estrellas de fondo
    createStars(rompecabezasContainer);

    // Contenedor principal del juego
    const gameContainer = document.createElement('div');
    gameContainer.style.cssText = `
        background: rgba(10, 10, 40, 0.95);
        border-radius: 20px;
        border: 2px solid #4d4dff;
        padding: 30px;
        max-width: 1400px;
        width: 95%;
        margin: 40px auto 30px auto;
        text-align: center;
        box-shadow: 0 0 50px rgba(77, 77, 255, 0.4);
        backdrop-filter: blur(10px);
        position: relative;
        z-index: 1001;
        pointer-events: auto;
    `;

    // Header del juego
    const header = document.createElement('div');
    header.innerHTML = `
        <h1 style="color: #4d4dff; font-size: 2.5em; margin: 0 0 10px 0; text-shadow: 0 0 10px rgba(77, 77, 255, 0.5);">
            🧩 Rompecabezas de Maykel y Ana
        </h1>
        <p style="color: #cccccc; font-size: 1.2em; margin: 0 0 20px 0;">
            Arrastra las piezas desde el banco hacia el tablero para reconstruir la imagen
        </p>
        <div style="display: flex; gap: 20px; justify-content: center; margin-bottom: 20px; flex-wrap: wrap;">
            <div style="background: rgba(77, 77, 255, 0.2); padding: 10px 20px; border-radius: 10px; border: 1px solid #4d4dff;">
                <span style="color: #4d4dff; font-weight: bold;">Piezas Colocadas: </span>
                <span id="placedCount" style="color: white;">0/20</span>
            </div>
            <div style="background: rgba(77, 77, 255, 0.2); padding: 10px 20px; border-radius: 10px; border: 1px solid #4d4dff;">
                <span style="color: #4d4dff; font-weight: bold;">Tiempo: </span>
                <span id="timer" style="color: white;">00:00</span>
            </div>
            <div style="background: rgba(77, 77, 255, 0.2); padding: 10px 20px; border-radius: 10px; border: 1px solid #4d4dff;">
                <span style="color: #4d4dff; font-weight: bold;">Dificultad: </span>
                <span style="color: white;">Avanzada (5x4)</span>
            </div>
        </div>
    `;
    gameContainer.appendChild(header);

    // Área principal del juego
    const mainGameArea = document.createElement('div');
    mainGameArea.style.cssText = `
        display: flex;
        gap: 30px;
        justify-content: center;
        align-items: flex-start;
        margin: 20px 0;
        flex-wrap: wrap;
        pointer-events: auto;
    `;

    // BANCO DE PIEZAS (lado izquierdo)
    const pieceBank = document.createElement('div');
    pieceBank.id = 'pieceBank';
    pieceBank.style.cssText = `
        background: rgba(15, 52, 96, 0.8);
        border: 3px solid #4d4dff;
        border-radius: 15px;
        padding: 20px;
        min-width: 350px;
        max-width: 400px;
        box-shadow: 0 0 20px rgba(77, 77, 255, 0.3);
    `;
    
    const bankHeader = document.createElement('h3');
    bankHeader.textContent = '🏦 Banco de Piezas';
    bankHeader.style.cssText = 'color: #4d4dff; margin: 0 0 15px 0; text-align: center;';
    pieceBank.appendChild(bankHeader);

    const pieceGrid = document.createElement('div');
    pieceGrid.id = 'pieceGrid';
    pieceGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(5, 1fr);
        gap: 8px;
        width: 100%;
        min-height: 500px;
    `;
    pieceBank.appendChild(pieceGrid);

    // TABLERO PRINCIPAL (centro)
    const boardArea = document.createElement('div');
    boardArea.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    `;

    const puzzleBoard = document.createElement('div');
    puzzleBoard.id = 'puzzleBoard';
    puzzleBoard.style.cssText = `
        width: 600px;
        height: 480px;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(4, 1fr);
        gap: 2px;
        background: #0a0a2a;
        border: 3px solid #4d4dff;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 0 30px rgba(77, 77, 255, 0.4);
        position: relative;
    `;
    boardArea.appendChild(puzzleBoard);

    // PREVIEW DE IMAGEN (lado derecho)
    const previewArea = document.createElement('div');
    previewArea.style.cssText = `
        background: rgba(15, 52, 96, 0.8);
        border: 3px solid #4d4dff;
        border-radius: 15px;
        padding: 20px;
        min-width: 250px;
        max-width: 300px;
        box-shadow: 0 0 20px rgba(77, 77, 255, 0.3);
    `;

    previewArea.innerHTML = `
        <h3 style="color: #4d4dff; margin: 0 0 15px 0; text-align: center;">🎯 Imagen Objetivo</h3>
        <img id="previewImage" src="" alt="Preview" style="
            width: 100%;
            max-width: 250px;
            height: auto;
            border: 2px solid #4d4dff;
            border-radius: 10px;
            object-fit: cover;
            margin-bottom: 15px;
        ">
        <div style="color: #cccccc; font-size: 0.9em; text-align: left;">
            <p><strong>Dimensiones:</strong> 5x4 (20 piezas)</p>
            <p><strong>Instrucciones:</strong></p>
            <ul style="padding-left: 20px; margin: 10px 0;">
                <li>Arrastra piezas del banco al tablero</li>
                <li>Suelta en la posición correcta</li>
                <li>Puedes reposicionar piezas</li>
                <li>¡Completa la imagen!</li>
            </ul>
        </div>
    `;

    // Añadir áreas al contenedor principal
    mainGameArea.appendChild(pieceBank);
    mainGameArea.appendChild(boardArea);
    mainGameArea.appendChild(previewArea);
    gameContainer.appendChild(mainGameArea);

    // CONTROLES
    const controls = document.createElement('div');
    controls.style.cssText = `
        display: flex;
        gap: 15px;
        justify-content: center;
        margin: 30px 0 20px 0;
        flex-wrap: wrap;
        pointer-events: auto;
    `;
    
    const shuffleBtn = createButton('🔀 Mezclar Piezas', 'shuffleBtn');
    const solveBtn = createButton('✅ Verificar Solución', 'solveBtn');
    const hintBtn = createButton('💡 Mostrar Guía', 'hintBtn');
    const resetBtn = createButton('🗑️ Limpiar Tablero', 'resetBtn');
    
    controls.appendChild(shuffleBtn);
    controls.appendChild(solveBtn);
    controls.appendChild(hintBtn);
    controls.appendChild(resetBtn);
    gameContainer.appendChild(controls);

    rompecabezasContainer.appendChild(gameContainer);
    contentContainer.appendChild(rompecabezasContainer);

    // VARIABLES DEL JUEGO
    const ROWS = 4;
    const COLS = 5;
    const TOTAL_PIECES = ROWS * COLS;
    
    let puzzlePieces = [];
    let boardState = Array(TOTAL_PIECES).fill(null);
    let placedCount = 0;
    let startTime = null;
    let timerInterval = null;
    let isSolved = false;
    let draggedPiece = null;
    
    // USAR TU IMAGEN ESPECÍFICA
    const currentImage = 'https://www.dropbox.com/scl/fi/to1lyvs410j86b0ggvs16/Imagen-de-WhatsApp-2025-10-13-a-las-18.01.22_d3b14c7f.jpg?rlkey=ya2n6q4lx1ape0pmrcq07m3sr&st=f9hogt1c&dl=1';

    // FUNCIONES AUXILIARES
    function createButton(text, id) {
        const button = document.createElement('button');
        button.id = id;
        button.textContent = text;
        button.style.cssText = `
            background: linear-gradient(45deg, #4d4dff, #6666ff);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 8px;
            cursor: pointer;
            font-family: 'Quicksand';
            font-weight: bold;
            font-size: 16px;
            transition: all 0.3s ease;
            pointer-events: auto;
            min-width: 180px;
        `;
        
        button.onmouseover = function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        };
        
        button.onmouseout = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        };
        
        return button;
    }

    function createStars(container) {
        const starCount = 150;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            const size = Math.random() * 2 + 1;
            const opacity = Math.random() * 0.7 + 0.3;
            
            star.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: white;
                border-radius: 50%;
                opacity: ${opacity};
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: twinkle ${3 + Math.random() * 7}s infinite ease-in-out;
                animation-delay: ${Math.random() * 5}s;
                pointer-events: none;
                z-index: 1;
            `;
            
            container.appendChild(star);
        }
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes twinkle {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.2); }
            }
        `;
        document.head.appendChild(style);
    }

    // INICIALIZAR EL JUEGO
    function initGame() {
        console.log('🎮 Inicializando juego con sistema de arrastre...');
        
        // Configurar la imagen de preview
        const previewImage = document.getElementById('previewImage');
        previewImage.src = currentImage;
        previewImage.onerror = function() {
            console.error('❌ Error cargando la imagen');
            previewImage.src = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&h=400&fit=crop';
        };
        
        createPuzzlePieces();
        createBoardSlots();
        startTimer();
        updateDisplay();
        setupEventListeners();
        
        // MEZCLAR PIEZAS AL INICIAR - CORRECCIÓN
        shufflePieces();
        
        console.log('✅ Juego inicializado - Listo para arrastrar piezas');
    }

    // CREAR PIEZAS EN EL BANCO (SIN NÚMEROS)
    function createPuzzlePieces() {
        const pieceGrid = document.getElementById('pieceGrid');
        pieceGrid.innerHTML = '';
        puzzlePieces = [];

        for (let i = 0; i < TOTAL_PIECES; i++) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.dataset.index = i;
            piece.draggable = true;
            
            const row = Math.floor(i / COLS);
            const col = i % COLS;
            
            piece.style.cssText = `
                width: 100%;
                height: 80px;
                background-image: url(${currentImage});
                background-size: ${COLS * 100}% ${ROWS * 100}%;
                background-position: ${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%;
                background-color: #1a1a2e;
                border: 2px solid #4d4dff;
                border-radius: 8px;
                cursor: grab;
                transition: all 0.3s ease;
                user-select: none;
                position: relative;
                z-index: 10;
            `;
            
            // Eventos de arrastre
            piece.addEventListener('dragstart', handleDragStart);
            piece.addEventListener('dragend', handleDragEnd);

            pieceGrid.appendChild(piece);
            puzzlePieces.push(piece);
        }
        
        console.log(`✅ ${TOTAL_PIECES} piezas creadas en el banco (sin números)`);
    }

    // CREAR RANURAS DEL TABLERO
    function createBoardSlots() {
        const puzzleBoard = document.getElementById('puzzleBoard');
        puzzleBoard.innerHTML = '';
        boardState = Array(TOTAL_PIECES).fill(null);

        for (let i = 0; i < TOTAL_PIECES; i++) {
            const slot = document.createElement('div');
            slot.className = 'board-slot';
            slot.dataset.index = i;
            
            slot.style.cssText = `
                background: rgba(26, 26, 46, 0.5);
                border: 2px dashed #4d4dff;
                border-radius: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                color: #4d4dff;
                transition: all 0.3s ease;
                position: relative;
                min-height: 115px;
            `;
            
            // Eventos de drop
            slot.addEventListener('dragover', handleDragOver);
            slot.addEventListener('drop', handleDrop);
            slot.addEventListener('dragenter', handleDragEnter);
            slot.addEventListener('dragleave', handleDragLeave);

            puzzleBoard.appendChild(slot);
        }
    }

    // MANEJADORES DE ARRASTRE
    function handleDragStart(e) {
        draggedPiece = this;
        this.style.opacity = '0.6';
        this.style.cursor = 'grabbing';
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.dataset.index);
        
        console.log('🚀 Iniciando arrastre de pieza:', this.dataset.index);
    }

    function handleDragEnd(e) {
        this.style.opacity = '1';
        this.style.cursor = 'grab';
        this.style.transform = 'scale(1)';
        
        // Remover clases de hover de todos los slots
        document.querySelectorAll('.board-slot').forEach(slot => {
            slot.style.background = 'rgba(26, 26, 46, 0.5)';
            slot.style.border = '2px dashed #4d4dff';
        });
        
        console.log('🏁 Finalizando arrastre');
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDragEnter(e) {
        e.preventDefault();
        this.style.background = 'rgba(77, 77, 255, 0.2)';
        this.style.border = '2px solid #00ff88';
    }

    function handleDragLeave(e) {
        this.style.background = 'rgba(26, 26, 46, 0.5)';
        this.style.border = '2px dashed #4d4dff';
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const pieceIndex = parseInt(e.dataTransfer.getData('text/plain'));
        const slotIndex = parseInt(this.dataset.index);
        
        console.log(`🎯 Soltando pieza ${pieceIndex} en slot ${slotIndex}`);
        
        // Verificar si el slot está vacío
        if (boardState[slotIndex] === null) {
            // Verificar si la pieza ya está en el tablero
            const isPieceOnBoard = !puzzlePieces[pieceIndex].style.display || 
                                  puzzlePieces[pieceIndex].style.display === 'none';
            
            if (isPieceOnBoard) {
                // La pieza ya está en el tablero, buscamos de dónde viene
                const currentSlotIndex = boardState.findIndex(index => index === pieceIndex);
                if (currentSlotIndex !== -1) {
                    // Movemos la pieza de un slot a otro
                    movePieceOnBoard(currentSlotIndex, slotIndex, pieceIndex);
                }
            } else {
                // Pieza nueva del banco
                placePiece(pieceIndex, slotIndex);
            }
        } else {
            console.log('❌ Slot ocupado');
            showMessage('⚠️ Esta posición ya está ocupada!', 'warning');
        }
        
        // Restaurar estilo del slot
        this.style.background = 'rgba(26, 26, 46, 0.5)';
        this.style.border = '2px dashed #4d4dff';
        
        return false;
    }

    // COLOCAR PIEZA EN EL TABLERO
    function placePiece(pieceIndex, slotIndex) {
        const piece = puzzlePieces[pieceIndex];
        const slot = document.querySelector(`.board-slot[data-index="${slotIndex}"]`);
        
        // Crear clon de la pieza para el tablero
        const pieceClone = piece.cloneNode(true);
        pieceClone.style.cssText = piece.style.cssText;
        pieceClone.style.width = '100%';
        pieceClone.style.height = '100%';
        pieceClone.style.margin = '0';
        pieceClone.style.cursor = 'grab'; // Mantener cursor de arrastre
        pieceClone.style.opacity = '1';
        pieceClone.style.transform = 'scale(1)';
        pieceClone.draggable = true; // Mantener arrastrable
        
        // MANTENER EVENTOS DE ARRASTRE EN EL TABLERO
        pieceClone.addEventListener('dragstart', handleDragStart);
        pieceClone.addEventListener('dragend', handleDragEnd);
        
        // Añadir evento para remover pieza (doble click)
        pieceClone.addEventListener('dblclick', function() {
            removePiece(slotIndex);
        });
        
        // Limpiar slot y añadir pieza
        slot.innerHTML = '';
        slot.appendChild(pieceClone);
        slot.style.border = '2px solid #00ff88';
        slot.style.background = 'rgba(0, 255, 136, 0.1)';
        
        // Actualizar estado del tablero
        boardState[slotIndex] = pieceIndex;
        placedCount++;
        
        // Ocultar pieza original del banco
        piece.style.display = 'none';
        
        updateDisplay();
        checkVictory();
        
        console.log(`✅ Pieza ${pieceIndex} colocada en slot ${slotIndex}`);
        showMessage('✅ Pieza colocada correctamente!', 'success');
    }

    // NUEVA FUNCIÓN PARA MOVER PIEZAS DENTRO DEL TABLERO - CORREGIDA
    function movePieceOnBoard(fromSlotIndex, toSlotIndex, pieceIndex) {
        console.log(`🔄 Moviendo pieza ${pieceIndex} de slot ${fromSlotIndex} a ${toSlotIndex}`);
        
        const fromSlot = document.querySelector(`.board-slot[data-index="${fromSlotIndex}"]`);
        const toSlot = document.querySelector(`.board-slot[data-index="${toSlotIndex}"]`);
        
        // Obtener la pieza actual del slot de origen
        const currentPiece = fromSlot.querySelector('.puzzle-piece');
        
        if (!currentPiece) {
            console.error('❌ No se encontró la pieza en el slot de origen');
            return;
        }
        
        // Limpiar slot de origen
        fromSlot.innerHTML = '';
        fromSlot.style.border = '2px dashed #4d4dff';
        fromSlot.style.background = 'rgba(26, 26, 46, 0.5)';
        
        // Mover la pieza REAL al nuevo slot (no clonar)
        toSlot.innerHTML = '';
        toSlot.appendChild(currentPiece);
        toSlot.style.border = '2px solid #00ff88';
        toSlot.style.background = 'rgba(0, 255, 136, 0.1)';
        
        // Actualizar estado del tablero
        boardState[fromSlotIndex] = null;
        boardState[toSlotIndex] = pieceIndex;
        
        updateDisplay();
        
        console.log(`✅ Pieza movida de ${fromSlotIndex} a ${toSlotIndex}`);
        showMessage('🔄 Pieza reposicionada', 'info');
    }

    // REMOVER PIEZA DEL TABLERO
    function removePiece(slotIndex) {
        const pieceIndex = boardState[slotIndex];
        if (pieceIndex === null) return;
        
        const slot = document.querySelector(`.board-slot[data-index="${slotIndex}"]`);
        const piece = puzzlePieces[pieceIndex];
        
        // Restaurar pieza en el banco
        piece.style.display = 'block';
        
        // Limpiar slot
        slot.innerHTML = '';
        slot.style.border = '2px dashed #4d4dff';
        slot.style.background = 'rgba(26, 26, 46, 0.5)';
        
        // Actualizar estado
        boardState[slotIndex] = null;
        placedCount--;
        
        updateDisplay();
        
        console.log(`🗑️ Pieza ${pieceIndex} removida del slot ${slotIndex}`);
        showMessage('↩️ Pieza devuelta al banco', 'info');
    }

    // VERIFICAR VICTORIA
    function checkVictory() {
        if (placedCount !== TOTAL_PIECES) return false;
        
        let solved = true;
        for (let i = 0; i < TOTAL_PIECES; i++) {
            if (boardState[i] !== i) {
                solved = false;
                break;
            }
        }
        
        if (solved) {
            console.log('🎉 ¡Rompecabezas completado correctamente!');
            isSolved = true;
            clearInterval(timerInterval);
            showVictoryMessage();
            return true;
        }
        
        return false;
    }

    // MEZCLAR PIEZAS - MEJORADO PARA MEZCLA MÁS ALEATORIA
    function shufflePieces() {
        console.log('🔀 Mezclando piezas...');
        
        // Limpiar tablero primero
        clearBoard();
        
        // Crear una mezcla más aleatoria y desordenada
        const indices = Array.from({length: TOTAL_PIECES}, (_, i) => i);
        
        // Algoritmo de Fisher-Yates mejorado con más iteraciones
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            // Intercambiar múltiples veces para mayor aleatoriedad
            for (let k = 0; k < 3; k++) {
                const swapIndex = Math.floor(Math.random() * indices.length);
                [indices[i], indices[swapIndex]] = [indices[swapIndex], indices[i]];
            }
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        
        // Reorganizar piezas en el banco
        const pieceGrid = document.getElementById('pieceGrid');
        pieceGrid.innerHTML = '';
        
        indices.forEach((originalIndex) => {
            const piece = puzzlePieces[originalIndex];
            piece.style.display = 'block';
            piece.dataset.index = originalIndex;
            pieceGrid.appendChild(piece);
        });
        
        showMessage('🔀 Piezas mezcladas!', 'info');
        console.log('✅ Piezas mezcladas con algoritmo mejorado');
    }

    // LIMPIAR TABLERO
    function clearBoard() {
        console.log('🗑️ Limpiando tablero...');
        
        boardState.forEach((pieceIndex, slotIndex) => {
            if (pieceIndex !== null) {
                removePiece(slotIndex);
            }
        });
        
        placedCount = 0;
        updateDisplay();
        showMessage('🗑️ Tablero limpiado!', 'info');
    }

    // VERIFICAR SOLUCIÓN
    function verifySolution() {
        if (placedCount !== TOTAL_PIECES) {
            showMessage('❌ Aún faltan piezas por colocar!', 'warning');
            return;
        }
        
        const isCorrect = checkVictory();
        if (!isCorrect) {
            showMessage('❌ La solución no es correcta. Sigue intentando!', 'error');
            
            // Resaltar piezas incorrectas
            boardState.forEach((pieceIndex, slotIndex) => {
                const slot = document.querySelector(`.board-slot[data-index="${slotIndex}"]`);
                if (pieceIndex !== slotIndex) {
                    slot.style.border = '2px solid #ff4444';
                    slot.style.background = 'rgba(255, 68, 68, 0.2)';
                    
                    // Restaurar después de 2 segundos
                    setTimeout(() => {
                        if (boardState[slotIndex] !== null) {
                            slot.style.border = '2px solid #00ff88';
                            slot.style.background = 'rgba(0, 255, 136, 0.1)';
                        }
                    }, 2000);
                }
            });
        }
    }

    // MOSTRAR GUÍA
    function showHint() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3000;
            backdrop-filter: blur(5px);
        `;
        
        const hintContent = document.createElement('div');
        hintContent.style.cssText = `
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            padding: 30px;
            border-radius: 20px;
            border: 3px solid #4d4dff;
            max-width: 500px;
            text-align: center;
            color: white;
        `;
        
        hintContent.innerHTML = `
            <h2 style="color: #4d4dff; margin-bottom: 20px;">💡 Guía del Rompecabezas</h2>
            <div style="text-align: left; line-height: 1.6;">
                <p><strong>🎯 Objetivo:</strong> Reconstruir la imagen arrastrando las piezas al tablero.</p>
                <p><strong>🖱️ Controles:</strong></p>
                <ul style="padding-left: 20px;">
                    <li><strong>Arrastrar:</strong> Click y arrastrar pieza del banco al tablero</li>
                    <li><strong>Remover:</strong> Doble click en pieza del tablero para devolverla al banco</li>
                    <li><strong>Reposicionar:</strong> Arrastrar piezas dentro del tablero para moverlas</li>
                    <li><strong>Mezclar:</strong> Botón "Mezclar Piezas" para reorganizar el banco</li>
                </ul>
                <p><strong>💡 Consejos:</strong></p>
                <ul style="padding-left: 20px;">
                    <li>Comienza con las esquinas y bordes</li>
                    <li>Busca colores y patrones que coincidan</li>
                    <li>Usa la imagen de referencia como guía</li>
                </ul>
            </div>
            <button id="closeHint" style="
                background: linear-gradient(45deg, #4d4dff, #6666ff);
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 8px;
                cursor: pointer;
                font-family: 'Quicksand';
                font-weight: bold;
                margin-top: 20px;
            ">Cerrar</button>
        `;
        
        overlay.appendChild(hintContent);
        document.body.appendChild(overlay);
        
        document.getElementById('closeHint').onclick = function() {
            overlay.remove();
        };
    }

    // MOSTRAR MENSAJE TEMPORAL
    function showMessage(text, type) {
        const message = document.createElement('div');
        const bgColor = type === 'success' ? '#00ff88' : 
                        type === 'error' ? '#ff4444' : 
                        type === 'warning' ? '#ffaa00' : '#4d4dff';
        
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 4000;
            font-weight: bold;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            transform: translateX(400px);
            transition: transform 0.3s ease;
            pointer-events: none;
        `;
        
        message.textContent = text;
        document.body.appendChild(message);
        
        // Animación de entrada
        setTimeout(() => {
            message.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            message.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }, 3000);
    }

    // ACTUALIZAR DISPLAY
    function updateDisplay() {
        document.getElementById('placedCount').textContent = `${placedCount}/${TOTAL_PIECES}`;
    }

    // TEMPORIZADOR
    function startTimer() {
        startTime = new Date();
        clearInterval(timerInterval);
        
        timerInterval = setInterval(() => {
            if (!isSolved) {
                const currentTime = new Date();
                const elapsed = Math.floor((currentTime - startTime) / 1000);
                const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
                const seconds = (elapsed % 60).toString().padStart(2, '0');
                document.getElementById('timer').textContent = `${minutes}:${seconds}`;
            }
        }, 1000);
    }

    // CONFIGURAR EVENT LISTENERS
    function setupEventListeners() {
        shuffleBtn.onclick = shufflePieces;
        solveBtn.onclick = verifySolution;
        hintBtn.onclick = showHint;
        resetBtn.onclick = clearBoard;
    }

    // MENSAJE DE VICTORIA - MODIFICADO CON RECOMPENSA
    function showVictoryMessage() {
        const victoryMessage = document.createElement('div');
        victoryMessage.id = 'victoryMessage';
        victoryMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.95);
            padding: 40px;
            border-radius: 20px;
            border: 3px solid #4d4dff;
            text-align: center;
            z-index: 2000;
            backdrop-filter: blur(10px);
            pointer-events: auto;
            max-width: 500px;
            width: 90%;
        `;
        
        const finalTime = document.getElementById('timer').textContent;
        
        victoryMessage.innerHTML = `
            <h2 style="color: #00ff88; font-size: 2.5em; margin-bottom: 20px;">🎉 ¡Felicidades!</h2>
            <p style="font-size: 1.2em; margin-bottom: 10px;">Has completado el rompecabezas avanzado</p>
            <p style="font-size: 1.1em; margin-bottom: 10px; color: #4d4dff;">
                Tiempo: <span style="color: white;">${finalTime}</span> | 
                Piezas: <span style="color: white;">${TOTAL_PIECES}</span>
            </p>
            <div style="background: rgba(255, 165, 0, 0.1); padding: 15px; border-radius: 10px; border: 2px solid #FFA500; margin: 20px 0;">
                <p style="font-size: 1.1em; margin: 0; color: #cccccc;">
                    Felicidades por completar el rompecabezas tu recompensa es:
                </p>
                <p style="font-size: 1.3em; margin: 10px 0 0 0; color: #FFA500; font-weight: bold;">
                    2) Bolita de
                </p>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 20px;">
                <button id="playAgainBtn" style="
                    background: linear-gradient(45deg, #4d4dff, #6666ff);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-family: 'Quicksand';
                    font-weight: bold;
                    font-size: 16px;
                    pointer-events: auto;
                    min-width: 160px;
                ">🔄 Jugar Otra Vez</button>
                <button id="backToUniverseBtn" style="
                    background: linear-gradient(45deg, #ff4444, #ff6666);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-family: 'Quicksand';
                    font-weight: bold;
                    font-size: 16px;
                    pointer-events: auto;
                    min-width: 160px;
                ">← Volver al Universo</button>
            </div>
        `;
        
        document.body.appendChild(victoryMessage);
        createConfetti();
        
        document.getElementById('playAgainBtn').onclick = function() {
            victoryMessage.remove();
            clearBoard();
            shufflePieces();
            isSolved = false;
            startTimer();
        };
        
        document.getElementById('backToUniverseBtn').onclick = function() {
            cleanup();
            if (window.galaxyManager) {
                window.galaxyManager.showGalaxyView(false);
            }
        };
    }

    // CONFETI
    function createConfetti() {
        const colors = ['#4d4dff', '#6666ff', '#8888ff', '#4dffff', '#ffff4d', '#FFA500'];
        const confettiContainer = document.createElement('div');
        confettiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1999;
        `;

        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -10px;
                left: ${Math.random() * 100}%;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                animation: confetti-fall ${2 + Math.random() * 3}s linear forwards;
            `;
            confettiContainer.appendChild(confetti);
        }

        document.body.appendChild(confettiContainer);

        setTimeout(() => {
            confettiContainer.remove();
        }, 5000);
    }

    // AÑADIR ESTILOS CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confetti-fall {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        .puzzle-piece:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(77, 77, 255, 0.4);
        }
        
        .board-slot.hover {
            background: rgba(77, 77, 255, 0.2) !important;
            border: 2px solid #00ff88 !important;
        }
        
        /* Mejorar visualización de piezas en el tablero */
        .board-slot .puzzle-piece {
            transition: all 0.2s ease;
        }
        
        .board-slot .puzzle-piece:hover {
            transform: scale(1.02);
            box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
        }
    `;
    document.head.appendChild(style);

    // INICIALIZAR JUEGO
    initGame();

    // FUNCIÓN DE LIMPIEZA
    function cleanup() {
        console.log('🧹 Limpiando rompecabezas avanzado...');
        
        clearInterval(timerInterval);
        
        const rompecabezasContainer = document.getElementById('rompecabezasContainer');
        if (rompecabezasContainer) {
            rompecabezasContainer.remove();
        }

        const styleElements = document.querySelectorAll('style');
        styleElements.forEach(style => {
            if (style.textContent.includes('confetti-fall') || 
                style.textContent.includes('puzzle-piece')) {
                style.remove();
            }
        });

        const victoryMessage = document.getElementById('victoryMessage');
        if (victoryMessage) {
            victoryMessage.remove();
        }

        if (originalCanvas) {
            console.log('🔧 Restaurando canvas original de Three.js...');
            originalCanvas.style.cssText = originalCanvasStyle;
            originalCanvas.style.display = 'block';
            originalCanvas.style.visibility = 'visible';
            originalCanvas.style.pointerEvents = 'auto';
        }

        if (window.galaxyManager) {
            console.log('🔧 Forzando restauración del contexto WebGL...');
            
            if (typeof window.galaxyManager.restoreWebGLContext === 'function') {
                window.galaxyManager.restoreWebGLContext();
            }
            
            if (window.galaxyManager.controls) {
                window.galaxyManager.controls.enableRotate = false;
                window.galaxyManager.controls.enableZoom = true;
                window.galaxyManager.controls.enablePan = false;
                window.galaxyManager.controls.reset();
            }
            
            if (window.galaxyManager.renderer && 
                window.galaxyManager.scene && 
                window.galaxyManager.camera) {
                window.galaxyManager.renderer.render(
                    window.galaxyManager.scene, 
                    window.galaxyManager.camera
                );
            }
            
            window.galaxyManager.isAnimating = false;
        }

        console.log('✅ Limpieza completada - Rompecabezas avanzado');
    }

    window.cleanupRompecabezasGalaxy = cleanup;
}

window.initRompecabezasGalaxy = initRompecabezasGalaxy;
console.log('✅ initRompecabezasGalaxy (ARRASTRE MEJORADO) asignada a window');

// Función auxiliar global para crear el efecto de confeti si se necesita externamente
window.createConfetti = function() {
    const colors = ['#4d4dff', '#6666ff', '#8888ff', '#4dffff', '#ffff4d', '#FFA500'];
    const confettiContainer = document.createElement('div');
    confettiContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1999;
    `;

    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}%;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            animation: confetti-fall ${2 + Math.random() * 3}s linear forwards;
        `;
        confettiContainer.appendChild(confetti);
    }

    document.body.appendChild(confettiContainer);

    setTimeout(() => {
        confettiContainer.remove();
    }, 5000);
};

// Asegurar que los estilos CSS estén disponibles globalmente
if (!document.querySelector('#rompecabezas-styles')) {
    const style = document.createElement('style');
    style.id = 'rompecabezas-styles';
    style.textContent = `
        @keyframes confetti-fall {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        .puzzle-piece:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(77, 77, 255, 0.4);
        }
        
        .board-slot.hover {
            background: rgba(77, 77, 255, 0.2) !important;
            border: 2px solid #00ff88 !important;
        }
        
        @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
        }
        
        /* Mejorar visualización de piezas en el tablero */
        .board-slot .puzzle-piece {
            transition: all 0.2s ease;
        }
        
        .board-slot .puzzle-piece:hover {
            transform: scale(1.02);
            box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
        }
    `;
    document.head.appendChild(style);
}

console.log('🎮 Galaxia Rompecabezas - Sistema de Arrastre Mejorado completamente cargado y listo');