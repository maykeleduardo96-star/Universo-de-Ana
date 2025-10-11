// SOLUCIÓN CANVAS - galaxy-laberinto.js CON MOUSE 100% FUNCIONAL
console.log('🎯 SOLUCIÓN CANVAS - LABERINTO 25x25 CON MOUSE 100% FUNCIONAL');

// Inicialización inmediata
(function() {
    'use strict';
    
    console.log('🚀 INICIALIZANDO LABERINTO CANVAS 25x25 CON MOUSE COMPLETO');
    
    // Definir función global
    window.initLaberintoGalaxy = function(canvas, contentContainer) {
        console.log('🎯 EJECUTANDO initLaberintoGalaxy CON CANVAS Y MOUSE COMPLETO');
        createMazeGame(contentContainer || document.body);
    };
    
    // Función principal del juego
    function createMazeGame(container) {
        console.log('🎮 CREANDO JUEGO DEL LABERINTO CON CANVAS Y MOUSE COMPLETO');
        
        // Limpiar contenedor completamente
        container.innerHTML = '';
        container.style.cssText = 'margin: 0; padding: 0; overflow: auto; width: 100%; height: 100%;';
        
        // CONFIGURACIÓN DEL LABERINTO 25x25
        const mazeConfig = {
            size: 25,
            start: { x: 0, y: 0 },
            end: { x: 24, y: 24 },
            cellSize: 24, // Tamaño de cada celda en píxeles
            maze: [
                [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
                [0,1,0,1,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
                [0,0,0,1,0,0,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0],
                [1,1,0,1,1,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
                [0,0,0,0,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1],
                [0,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0],
                [1,1,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0,1,0],
                [0,0,0,1,0,0,0,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0],
                [0,1,1,1,1,1,1,1,0,0,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0],
                [0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1,0],
                [1,1,1,1,0,1,1,1,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0],
                [0,0,0,0,0,1,0,0,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0],
                [0,1,1,1,1,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0],
                [0,1,1,1,1,1,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0],
                [0,0,0,0,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,0,1,0],
                [1,1,1,1,0,1,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0],
                [0,0,0,1,0,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
                [0,1,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0],
                [0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0],
                [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0]
            ],
            questions: [
                { 
                    x: 2, y: 2, 
                    question: "¿Cuál es el planeta más grande del sistema solar?", 
                    answers: ["Júpiter", "Saturno", "Neptuno", "Tierra"], 
                    correct: 0,
                    answered: false
                },
                { 
                    x: 4, y: 0, 
                    question: "¿En qué año llegó el hombre a la Luna?", 
                    answers: ["1965", "1969", "1972", "1958"], 
                    correct: 1,
                    answered: false
                },
                { 
                    x: 8, y: 6, 
                    question: "¿Qué gas es el más abundante en la atmósfera terrestre?", 
                    answers: ["Oxígeno", "Nitrógeno", "Dióxido de Carbono", "Argón"], 
                    correct: 1,
                    answered: false
                },
                { 
                    x: 12, y: 10, 
                    question: "¿Cuál es la velocidad de la luz en el vacío?", 
                    answers: ["300,000 km/s", "150,000 km/s", "1,000,000 km/s", "30,000 km/s"], 
                    correct: 0,
                    answered: false
                },
                { 
                    x: 16, y: 14, 
                    question: "¿Qué elemento químico tiene el símbolo 'Au'?", 
                    answers: ["Plata", "Oro", "Arsénico", "Aluminio"], 
                    correct: 1,
                    answered: false
                },
                { 
                    x: 20, y: 18, 
                    question: "¿Quién propuso la teoría de la relatividad?", 
                    answers: ["Isaac Newton", "Albert Einstein", "Stephen Hawking", "Galileo Galilei"], 
                    correct: 1,
                    answered: false
                },
                { 
                    x: 6, y: 22, 
                    question: "¿Cuál es el océano más grande del mundo?", 
                    answers: ["Atlántico", "Índico", "Pacífico", "Ártico"], 
                    correct: 2,
                    answered: false
                },
                { 
                    x: 18, y: 4, 
                    question: "¿Qué planeta es conocido como el 'planeta rojo'?", 
                    answers: ["Venus", "Marte", "Júpiter", "Saturno"], 
                    correct: 1,
                    answered: false
                },
                { 
                    x: 22, y: 12, 
                    question: "¿Cuántos huesos tiene el cuerpo humano adulto?", 
                    answers: ["206", "300", "150", "250"], 
                    correct: 0,
                    answered: false
                },
                { 
                    x: 10, y: 20, 
                    question: "¿Qué científico descubrió la penicilina?", 
                    answers: ["Marie Curie", "Alexander Fleming", "Louis Pasteur", "Robert Koch"], 
                    correct: 1,
                    answered: false
                }
            ]
        };
        
        // ESTADO DEL JUEGO
        const gameState = {
            playerPosition: { ...mazeConfig.start },
            questionsAnswered: 0,
            movesCount: 0,
            currentQuestion: null,
            completed: false,
            controlsEnabled: true
        };
        
        // VARIABLES CANVAS
        let canvas, ctx;
        
        // CREAR INTERFAZ DE USUARIO
        createGameInterface(container);
        
        // INICIALIZAR COMPONENTES
        initializeGame();
        
        // FUNCIONES PRINCIPALES
        function createGameInterface(container) {
            console.log('🎨 CREANDO INTERFAZ CON CANVAS Y MOUSE COMPLETO');
            
            const gameHTML = `
                <div id="maze-game" style="
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0c0032, #190061, #240090);
                    color: white;
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    box-sizing: border-box;
                    width: 100%;
                    overflow: auto;
                ">
                    <!-- HEADER -->
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #ffff4d; margin: 0 0 10px 0; font-size: 2.5rem;">🌌 Laberinto Galáctico 25x25</h1>
                        <p style="color: #a3a3ff; margin: 0; font-size: 1.2rem;">Responde preguntas para avanzar - VERSIÓN CANVAS CON MOUSE COMPLETO</p>
                    </div>
                    
                    <!-- CONTENIDO PRINCIPAL -->
                    <div style="display: flex; flex-wrap: wrap; gap: 30px; justify-content: center; width: 100%;">
                        
                        <!-- LABERINTO CANVAS -->
                        <div style="flex: 2; min-width: 650px; background: rgba(10, 0, 40, 0.8); padding: 20px; border-radius: 15px; box-shadow: 0 0 20px rgba(100, 65, 255, 0.4);">
                            <h2 style="color: #ffff4d; margin-top: 0;">Laberinto Canvas (25x25) - Haz clic para moverte</h2>
                            
                            <div style="overflow: auto; max-height: 650px; padding: 10px; border: 2px solid #6441ff; border-radius: 10px; background: #0d0033; display: flex; justify-content: center;">
                                <canvas id="maze-canvas" width="600" height="600" style="border: 1px solid #6441ff; cursor: pointer; background: #0d0033;"></canvas>
                            </div>
                            
                            <!-- CONTROLES -->
                            <div style="margin-top: 20px;">
                                <!-- CONTROLES DE MOVIMIENTO -->
                                <div style="display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(2, 1fr); gap: 10px; max-width: 200px; margin: 0 auto 20px auto;">
                                    <button id="btn-up" style="grid-column: 2; grid-row: 1; padding: 15px; background: #4d00ff; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 18px; font-weight: bold;">↑</button>
                                    <button id="btn-left" style="grid-column: 1; grid-row: 2; padding: 15px; background: #4d00ff; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 18px; font-weight: bold;">←</button>
                                    <button id="btn-down" style="grid-column: 2; grid-row: 2; padding: 15px; background: #4d00ff; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 18px; font-weight: bold;">↓</button>
                                    <button id="btn-right" style="grid-column: 3; grid-row: 2; padding: 15px; background: #4d00ff; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 18px; font-weight: bold;">→</button>
                                </div>
                                
                                <!-- BOTONES DE ACCIÓN -->
                                <div style="display: flex; gap: 10px; justify-content: center;">
                                    <button id="btn-reset" style="padding: 12px 24px; background: #4d00ff; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px;">Reiniciar Juego</button>
                                    <button id="btn-back" style="padding: 12px 24px; background: #ff4444; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px;">Volver al Universo</button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- PANEL DE INFORMACIÓN -->
                        <div style="flex: 1; min-width: 300px; max-width: 400px; background: rgba(10, 0, 40, 0.8); padding: 20px; border-radius: 15px; box-shadow: 0 0 20px rgba(100, 65, 255, 0.4);">
                            <h2 style="color: #ffff4d; margin-top: 0;">Información del Juego</h2>
                            
                            <!-- ESTADÍSTICAS -->
                            <div style="display: flex; justify-content: space-around; margin-bottom: 20px; padding: 15px; background: rgba(20, 0, 60, 0.5); border-radius: 10px;">
                                <div style="text-align: center;">
                                    <div id="stats-questions" style="font-size: 2rem; font-weight: bold; color: #ffff4d;">0</div>
                                    <div>Preguntas</div>
                                </div>
                                <div style="text-align: center;">
                                    <div id="stats-moves" style="font-size: 2rem; font-weight: bold; color: #ffff4d;">0</div>
                                    <div>Movimientos</div>
                                </div>
                            </div>
                            
                            <!-- BARRA DE PROGRESO -->
                            <div style="margin-bottom: 20px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                    <span>Progreso</span>
                                    <span id="progress-text">0%</span>
                                </div>
                                <div style="height: 10px; background: #1a0033; border-radius: 5px; overflow: hidden;">
                                    <div id="progress-bar" style="height: 100%; background: linear-gradient(to right, #ffcc00, #ff9900); width: 0%; transition: width 0.3s;"></div>
                                </div>
                            </div>
                            
                            <!-- MENSAJES -->
                            <div id="message-container" style="min-height: 60px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px;">
                                <div style="text-align: center; color: #a3a3ff;">Los mensajes aparecerán aquí</div>
                            </div>
                            
                            <!-- INSTRUCCIONES -->
                            <div style="margin-top: 20px;">
                                <h3 style="color: #ffff4d; margin-bottom: 10px;">Instrucciones:</h3>
                                <ul style="padding-left: 20px; margin: 0;">
                                    <li><strong>Haz clic en las celdas adyacentes</strong> para moverte</li>
                                    <li>Usa los botones o teclas de flecha para moverte</li>
                                    <li>Responde preguntas en las casillas amarillas</li>
                                    <li>Llega a la meta roja para ganar</li>
                                    <li><strong>10 preguntas</strong> en este laberinto</li>
                                </ul>
                            </div>

                            <!-- LEYENDA -->
                            <div style="margin-top: 20px;">
                                <h3 style="color: #ffff4d; margin-bottom: 10px;">Leyenda:</h3>
                                <div style="display: flex; flex-direction: column; gap: 5px;">
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <div style="width: 15px; height: 15px; background: #00cc66; border-radius: 3px;"></div>
                                        <span>Inicio (Verde)</span>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <div style="width: 15px; height: 15px; background: #ff4444; border-radius: 3px;"></div>
                                        <span>Meta (Rojo)</span>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <div style="width: 15px; height: 15px; background: #ffcc00; border-radius: 3px;"></div>
                                        <span>Pregunta (Amarillo)</span>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <div style="width: 15px; height: 15px; background: #ff00ff; border-radius: 50%;"></div>
                                        <span>Jugador (Rosa)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- MODAL DE PREGUNTAS -->
                <div id="question-modal" style="
                    display: none;
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: rgba(0,0,0,0.95);
                    z-index: 10000;
                    justify-content: center;
                    align-items: center;
                ">
                    <div style="
                        background: linear-gradient(135deg, #1a0033, #0d0033);
                        padding: 30px;
                        border-radius: 15px;
                        max-width: 500px;
                        width: 90%;
                        box-shadow: 0 0 30px rgba(100, 65, 255, 0.8);
                        border: 2px solid #6441ff;
                        position: relative;
                    ">
                        <button id="btn-close-modal" style="
                            position: absolute;
                            top: 10px; right: 15px;
                            background: #ff4444;
                            color: white;
                            border: none;
                            border-radius: 50%;
                            width: 35px; height: 35px;
                            cursor: pointer;
                            font-size: 20px;
                            font-weight: bold;
                        ">×</button>
                        
                        <h2 style="color: #ffff4d; margin-top: 0; margin-bottom: 20px; font-size: 24px;">Pregunta Galáctica</h2>
                        <div id="question-text" style="font-size: 18px; margin-bottom: 25px; color: #ffff99; line-height: 1.4;"></div>
                        <div id="answers-container" style="display: flex; flex-direction: column; gap: 10px;"></div>
                    </div>
                </div>
                
                <!-- PANTALLA DE VICTORIA -->
                <div id="victory-screen" style="
                    display: none;
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: rgba(0,0,0,0.95);
                    z-index: 20000;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                ">
                    <div style="
                        background: linear-gradient(135deg, #1a0033, #0d0033);
                        padding: 40px;
                        border-radius: 20px;
                        max-width: 500px;
                        box-shadow: 0 0 40px rgba(100, 65, 255, 0.9);
                        border: 3px solid #6441ff;
                    ">
                        <h2 style="color: #ffff4d; font-size: 2.5rem; margin-bottom: 20px;">¡Felicidades! 🎉</h2>
                        <p style="margin-bottom: 10px; font-size: 18px;">Has completado el Laberinto Galáctico</p>
                        <p style="margin-bottom: 5px;">Preguntas respondidas: <span id="victory-questions" style="color: #ffff4d; font-weight: bold;">0</span>/10</p>
                        <p style="margin-bottom: 20px;">Movimientos: <span id="victory-moves" style="color: #ffff4d; font-weight: bold;">0</span></p>
                        <div style="margin-top: 30px;">
                            <button id="btn-play-again" style="padding: 12px 24px; background: #4d00ff; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; margin-right: 10px; font-size: 16px;">Jugar Otra Vez</button>
                            <button id="btn-victory-back" style="padding: 12px 24px; background: #ff4444; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px;">Volver al Universo</button>
                        </div>
                    </div>
                </div>
            `;
            
            container.innerHTML = gameHTML;
            console.log('✅ Interfaz Canvas con mouse creada');
        }
        
        function initializeGame() {
            console.log('🎮 INICIALIZANDO JUEGO CANVAS CON MOUSE COMPLETO');
            
            // Inicializar canvas
            canvas = document.getElementById('maze-canvas');
            ctx = canvas.getContext('2d');
            
            // Asegurar que el canvas esté listo
            if (!canvas) {
                console.error('❌ Canvas no encontrado');
                return;
            }
            
            console.log('✅ Canvas encontrado e inicializado');
            
            setupEventListeners();
            drawMaze();
            updateGameStats();
            
            console.log('✅ Juego Canvas con mouse completamente inicializado');
        }
        
        function drawMaze() {
            console.log('🎨 DIBUJANDO LABERINTO EN CANVAS');
            
            // Limpiar canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Dibujar fondo
            ctx.fillStyle = '#0d0033';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Dibujar celdas
            for (let y = 0; y < mazeConfig.size; y++) {
                for (let x = 0; x < mazeConfig.size; x++) {
                    const cellX = x * mazeConfig.cellSize;
                    const cellY = y * mazeConfig.cellSize;
                    
                    // Determinar color de la celda
                    if (x === mazeConfig.start.x && y === mazeConfig.start.y) {
                        ctx.fillStyle = '#00cc66'; // Inicio - Verde
                    } else if (x === mazeConfig.end.x && y === mazeConfig.end.y) {
                        ctx.fillStyle = '#ff4444'; // Meta - Rojo
                    } else if (mazeConfig.questions.some(q => q.x === x && q.y === y && !q.answered)) {
                        ctx.fillStyle = '#ffcc00'; // Pregunta - Amarillo
                    } else if (mazeConfig.maze[y][x] === 1) {
                        ctx.fillStyle = '#35007c'; // Pared - Azul oscuro
                    } else {
                        ctx.fillStyle = '#1a0033'; // Camino - Azul más oscuro
                    }
                    
                    // Dibujar celda
                    ctx.fillRect(cellX, cellY, mazeConfig.cellSize, mazeConfig.cellSize);
                    
                    // Borde de celda
                    ctx.strokeStyle = '#240090';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(cellX, cellY, mazeConfig.cellSize, mazeConfig.cellSize);
                }
            }
            
            // Dibujar jugador
            drawPlayer();
            
            // Dibujar celdas adyacentes disponibles
            drawAvailableMoves();
        }
        
        function drawPlayer() {
            const playerX = gameState.playerPosition.x * mazeConfig.cellSize;
            const playerY = gameState.playerPosition.y * mazeConfig.cellSize;
            const centerX = playerX + mazeConfig.cellSize / 2;
            const centerY = playerY + mazeConfig.cellSize / 2;
            const radius = mazeConfig.cellSize / 2 - 2;
            
            // Dibujar jugador como círculo
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fillStyle = '#ff00ff';
            ctx.fill();
            
            // Borde del jugador
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        function drawAvailableMoves() {
            const directions = [
                { dx: 0, dy: -1 }, // Arriba
                { dx: 1, dy: 0 },  // Derecha
                { dx: 0, dy: 1 },  // Abajo
                { dx: -1, dy: 0 }  // Izquierda
            ];
            
            directions.forEach(dir => {
                const newX = gameState.playerPosition.x + dir.dx;
                const newY = gameState.playerPosition.y + dir.dy;
                
                // Verificar si el movimiento es válido
                if (isValidMove(newX, newY)) {
                    const cellX = newX * mazeConfig.cellSize;
                    const cellY = newY * mazeConfig.cellSize;
                    
                    // Dibujar un indicador sutil de celda disponible
                    ctx.fillStyle = 'rgba(100, 255, 100, 0.3)';
                    ctx.fillRect(cellX + 2, cellY + 2, mazeConfig.cellSize - 4, mazeConfig.cellSize - 4);
                    
                    // Dibujar borde de celda disponible
                    ctx.strokeStyle = 'rgba(100, 255, 100, 0.7)';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(cellX + 4, cellY + 4, mazeConfig.cellSize - 8, mazeConfig.cellSize - 8);
                }
            });
        }
        
        function isValidMove(x, y) {
            // Verificar límites del laberinto
            if (x < 0 || x >= mazeConfig.size || y < 0 || y >= mazeConfig.size) {
                return false;
            }
            
            // Verificar si no es una pared
            if (mazeConfig.maze[y][x] === 1) {
                return false;
            }
            
            return true;
        }
        
        function moveToCell(x, y) {
            if (!gameState.controlsEnabled || gameState.completed) return;
            
            console.log(`🎯 INTENTANDO MOVER A: [${x}, ${y}]`);
            
            // Verificar si es un movimiento válido
            if (!isValidMove(x, y)) {
                showMessage('¡Movimiento no válido!', 'error');
                return;
            }
            
            // Verificar si es un movimiento adyacente
            const dx = Math.abs(x - gameState.playerPosition.x);
            const dy = Math.abs(y - gameState.playerPosition.y);
            
            if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
                // Movimiento válido y adyacente
                
                // Verificar pregunta
                const question = mazeConfig.questions.find(q => q.x === x && q.y === y && !q.answered);
                if (question) {
                    console.log('❓ ENCONTRADA PREGUNTA EN CELDA');
                    gameState.controlsEnabled = false;
                    showQuestion(question);
                    return;
                }
                
                // Mover jugador
                gameState.playerPosition.x = x;
                gameState.playerPosition.y = y;
                gameState.movesCount++;
                
                drawMaze();
                updateGameStats();
                
                // Verificar victoria
                if (gameState.playerPosition.x === mazeConfig.end.x && gameState.playerPosition.y === mazeConfig.end.y) {
                    console.log('🎉 ¡VICTORIA ALCANZADA!');
                    setTimeout(showVictoryScreen, 500);
                }
            } else {
                showMessage('Solo puedes moverte a celdas adyacentes', 'error');
            }
        }
        
        function movePlayer(dx, dy) {
            if (!gameState.controlsEnabled || gameState.completed) return;
            
            const newX = gameState.playerPosition.x + dx;
            const newY = gameState.playerPosition.y + dy;
            
            moveToCell(newX, newY);
        }
        
        function showQuestion(question) {
            console.log('❓ MOSTRANDO PREGUNTA');
            gameState.currentQuestion = question;
            
            const modal = document.getElementById('question-modal');
            const questionText = document.getElementById('question-text');
            const answersContainer = document.getElementById('answers-container');
            
            questionText.textContent = question.question;
            answersContainer.innerHTML = '';
            
            // Crear botones de respuesta
            question.answers.forEach((answer, index) => {
                const button = document.createElement('button');
                button.textContent = answer;
                button.dataset.index = index;
                button.style.cssText = `
                    padding: 15px;
                    background: rgba(50, 0, 120, 0.9);
                    color: white;
                    border: 2px solid #6441ff;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: bold;
                    transition: all 0.2s;
                `;
                
                // Eventos directos
                button.onmouseover = function() { this.style.background = 'rgba(80, 0, 180, 0.9)'; };
                button.onmouseout = function() { this.style.background = 'rgba(50, 0, 120, 0.9)'; };
                button.onclick = function() { 
                    console.log('🎯 CLICK EN RESPUESTA:', index);
                    checkAnswer(index);
                };
                
                answersContainer.appendChild(button);
            });
            
            modal.style.display = 'flex';
        }
        
        function checkAnswer(answerIndex) {
            console.log('🔍 VERIFICANDO RESPUESTA:', answerIndex);
            const modal = document.getElementById('question-modal');
            const question = gameState.currentQuestion;
            
            if (answerIndex === question.correct) {
                // Respuesta correcta
                question.answered = true;
                gameState.questionsAnswered++;
                gameState.movesCount++;
                
                showMessage('¡Respuesta correcta! Puedes avanzar.', 'success');
                closeQuestionModal();
                
                // Mover al jugador a la celda de la pregunta
                gameState.playerPosition.x = question.x;
                gameState.playerPosition.y = question.y;
                
                drawMaze();
                updateGameStats();
            } else {
                // Respuesta incorrecta
                showMessage('Respuesta incorrecta. Intenta de nuevo.', 'error');
                closeQuestionModal();
            }
            
            gameState.controlsEnabled = true;
        }
        
        function closeQuestionModal() {
            console.log('❌ CERRANDO MODAL');
            const modal = document.getElementById('question-modal');
            modal.style.display = 'none';
            gameState.controlsEnabled = true;
        }
        
        function showVictoryScreen() {
            console.log('🎉 MOSTRANDO PANTALLA DE VICTORIA');
            gameState.completed = true;
            
            const victoryScreen = document.getElementById('victory-screen');
            const victoryQuestions = document.getElementById('victory-questions');
            const victoryMoves = document.getElementById('victory-moves');
            
            victoryQuestions.textContent = gameState.questionsAnswered;
            victoryMoves.textContent = gameState.movesCount;
            victoryScreen.style.display = 'flex';
        }
        
        function resetGame() {
            console.log('🔄 REINICIANDO JUEGO');
            
            // Reiniciar estado
            gameState.playerPosition = { ...mazeConfig.start };
            gameState.questionsAnswered = 0;
            gameState.movesCount = 0;
            gameState.completed = false;
            gameState.controlsEnabled = true;
            
            // Reiniciar preguntas
            mazeConfig.questions.forEach(q => q.answered = false);
            
            // Ocultar pantallas
            document.getElementById('victory-screen').style.display = 'none';
            document.getElementById('question-modal').style.display = 'none';
            
            // Redibujar juego
            drawMaze();
            updateGameStats();
            clearMessages();
        }
        
        function showMessage(text, type) {
            const messageContainer = document.getElementById('message-container');
            messageContainer.innerHTML = '';
            
            const message = document.createElement('div');
            message.textContent = text;
            message.style.cssText = `
                padding: 10px;
                border-radius: 8px;
                text-align: center;
                font-weight: bold;
                font-size: 16px;
            `;
            
            if (type === 'success') {
                message.style.background = 'rgba(0, 200, 0, 0.3)';
                message.style.border = '2px solid #00cc66';
                message.style.color = '#00cc66';
            } else {
                message.style.background = 'rgba(255, 0, 0, 0.3)';
                message.style.border = '2px solid #ff4444';
                message.style.color = '#ff4444';
            }
            
            messageContainer.appendChild(message);
            
            // Auto-eliminar después de 3 segundos
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 3000);
        }
        
        function clearMessages() {
            document.getElementById('message-container').innerHTML = 
                '<div style="text-align: center; color: #a3a3ff;">Los mensajes aparecerán aquí</div>';
        }
        
        function updateGameStats() {
            document.getElementById('stats-questions').textContent = gameState.questionsAnswered;
            document.getElementById('stats-moves').textContent = gameState.movesCount;
            
            // Actualizar progreso
            const totalDistance = Math.sqrt(Math.pow(mazeConfig.size, 2) + Math.pow(mazeConfig.size, 2));
            const currentDistance = Math.sqrt(
                Math.pow(gameState.playerPosition.x, 2) + Math.pow(gameState.playerPosition.y, 2)
            );
            const progress = Math.min(100, Math.round((currentDistance / totalDistance) * 100));
            document.getElementById('progress-bar').style.width = `${progress}%`;
            document.getElementById('progress-text').textContent = `${progress}%`;
        }
        
        function setupEventListeners() {
            console.log('🖱️ CONFIGURANDO EVENT LISTENERS CANVAS CON MOUSE COMPLETO');
            
            // FUNCIÓN ROBUSTA PARA BOTONES
            function setupButton(id, action) {
                const element = document.getElementById(id);
                if (element) {
                    // Remover event listeners anteriores
                    element.replaceWith(element.cloneNode(true));
                    const newElement = document.getElementById(id);
                    
                    newElement.onclick = function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log(`🎯 CLICK EN ${id}`);
                        action();
                    };
                    newElement.style.cursor = 'pointer';
                    
                    // También agregar event listener tradicional
                    newElement.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log(`🎯 CLICK (addEventListener) EN ${id}`);
                        action();
                    }, true);
                } else {
                    console.error(`❌ Botón ${id} no encontrado`);
                }
            }
            
            // BOTONES DE MOVIMIENTO
            setupButton('btn-up', () => movePlayer(0, -1));
            setupButton('btn-down', () => movePlayer(0, 1));
            setupButton('btn-left', () => movePlayer(-1, 0));
            setupButton('btn-right', () => movePlayer(1, 0));
            
            // BOTONES DE ACCIÓN
            setupButton('btn-reset', resetGame);
            setupButton('btn-back', () => {
                if (window.galaxyManager) {
                    window.galaxyManager.showGalaxyView(false);
                }
            });
            
            // BOTÓN CERRAR MODAL
            setupButton('btn-close-modal', closeQuestionModal);
            
            // BOTONES DE VICTORIA
            setupButton('btn-play-again', resetGame);
            setupButton('btn-victory-back', () => {
                if (window.galaxyManager) {
                    window.galaxyManager.showGalaxyView(false);
                }
            });
            
            // EVENTOS DEL CANVAS - MÉTODO ROBUSTO
            function setupCanvasEvents() {
                if (!canvas) {
                    console.error('❌ Canvas no disponible para eventos');
                    return;
                }
                
                console.log('🎯 CONFIGURANDO EVENTOS DEL CANVAS');
                
                // Limpiar eventos anteriores
                canvas.replaceWith(canvas.cloneNode(true));
                canvas = document.getElementById('maze-canvas');
                ctx = canvas.getContext('2d');
                
                // EVENTO DE CLICK EN CANVAS
                canvas.addEventListener('click', function(event) {
                    console.log('🖱️ CLICK EN CANVAS DETECTADO');
                    
                    if (!gameState.controlsEnabled || gameState.completed) {
                        console.log('❌ Controles deshabilitados o juego completado');
                        return;
                    }
                    
                    // Obtener coordenadas del click relativas al canvas
                    const rect = canvas.getBoundingClientRect();
                    const scaleX = canvas.width / rect.width;
                    const scaleY = canvas.height / rect.height;
                    
                    const x = (event.clientX - rect.left) * scaleX;
                    const y = (event.clientY - rect.top) * scaleY;
                    
                    // Convertir coordenadas de píxeles a coordenadas de celda
                    const cellX = Math.floor(x / mazeConfig.cellSize);
                    const cellY = Math.floor(y / mazeConfig.cellSize);
                    
                    console.log(`🎯 CLICK EN CELDA: [${cellX}, ${cellY}] - Coordenadas: (${x}, ${y})`);
                    
                    // Mover a la celda clickeada
                    moveToCell(cellX, cellY);
                }, true);
                
                // EVENTO DE MOUSEMOVE PARA CAMBIAR CURSOR
                canvas.addEventListener('mousemove', function(event) {
                    if (!gameState.controlsEnabled || gameState.completed) return;
                    
                    const rect = canvas.getBoundingClientRect();
                    const scaleX = canvas.width / rect.width;
                    const scaleY = canvas.height / rect.height;
                    
                    const x = (event.clientX - rect.left) * scaleX;
                    const y = (event.clientY - rect.top) * scaleY;
                    
                    const cellX = Math.floor(x / mazeConfig.cellSize);
                    const cellY = Math.floor(y / mazeConfig.cellSize);
                    
                    // Verificar si la celda es adyacente y válida
                    const dx = Math.abs(cellX - gameState.playerPosition.x);
                    const dy = Math.abs(cellY - gameState.playerPosition.y);
                    const isAdjacent = (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
                    
                    if (isAdjacent && isValidMove(cellX, cellY)) {
                        canvas.style.cursor = 'pointer';
                    } else {
                        canvas.style.cursor = 'default';
                    }
                }, true);
                
                console.log('✅ Eventos del canvas configurados correctamente');
            }
            
            // Configurar eventos del canvas después de un breve delay
            setTimeout(setupCanvasEvents, 100);
            
            // TECLADO
            document.addEventListener('keydown', function(e) {
                if (!gameState.controlsEnabled || gameState.completed) return;
                if (document.getElementById('question-modal').style.display === 'flex') return;
                
                switch(e.key) {
                    case 'ArrowUp': case 'w': case 'W':
                        e.preventDefault(); movePlayer(0, -1); break;
                    case 'ArrowDown': case 's': case 'S':
                        e.preventDefault(); movePlayer(0, 1); break;
                    case 'ArrowLeft': case 'a': case 'A':
                        e.preventDefault(); movePlayer(-1, 0); break;
                    case 'ArrowRight': case 'd': case 'D':
                        e.preventDefault(); movePlayer(1, 0); break;
                    case 'Escape':
                        e.preventDefault(); 
                        closeQuestionModal();
                        document.getElementById('victory-screen').style.display = 'none';
                        break;
                }
            }, true);
            
            console.log('✅ Todos los event listeners configurados');
        }
    }
    
    // Registrar en galaxyManager si existe
    if (window.galaxyManager) {
        window.galaxyManager.registerGalaxy('laberinto', {
            name: 'Laberinto Galáctico',
            description: 'Responde preguntas para avanzar en el laberinto 25x25',
            initFunction: window.initLaberintoGalaxy,
            type: 'interactive'
        });
        console.log('✅ Laberinto Canvas con mouse registrado en galaxyManager');
    }
    
    console.log('🎯 LABERINTO GALÁCTICO CANVAS CON MOUSE COMPLETAMENTE LISTO');
})();

// Función global para acceso directo
window.galaxyLaberinto = {
    show: function() {
        if (window.galaxyManager) {
            window.galaxyManager.showGalaxy('laberinto');
        } else {
            window.initLaberintoGalaxy(null, document.body);
        }
    }
};

console.log('✅ galaxy-laberinto.js - CARGA CANVAS CON MOUSE COMPLETAMENTE COMPLETADA');