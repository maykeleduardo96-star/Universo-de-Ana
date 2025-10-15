// laberinto-conocimiento-version-final.js - VERSIÓN COMPLETA FINAL

console.log('🧠 LABERINTO DEL CONOCIMIENTO - VERSIÓN FINAL COMPLETA');

(function() {
    'use strict';
    
    window.initLaberintoGalaxy = function(canvas, contentContainer) {
        console.log('🚀 INICIANDO LABERINTO DEL CONOCIMIENTO VERSIÓN FINAL');
        createLaberintoVersionFinal(contentContainer || document.body);
    };
    
    function createLaberintoVersionFinal(container) {
        console.log('🎮 CREANDO LABERINTO VERSIÓN FINAL');
        
        // Limpiar contenedor
        container.innerHTML = '';
        container.style.cssText = 'margin: 0; padding: 10px; overflow: auto; width: 100%; height: 100%; background: linear-gradient(135deg, #1a2a3a, #0d1b2a);';
        
        // CONFIGURACIÓN DEL LABERINTO MÁS GRANDE (22x22)
        const mazeConfig = {
            size: 22,
            start: { x: 0, y: 0 },
            end: { x: 21, y: 21 },
            cellSize: 28,
            // LABERINTO MÁS GRANDE CON LA MISMA RUTA Y FORMA
            maze: [
                [0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0],
                [0,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,1,0],
                [0,0,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,0,1,0],
                [1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1,1,1],
                [0,0,0,1,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0],
                [0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,0],
                [0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
                [0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
                [0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
                [0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
                [0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0],
                [0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0],
                [0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0],
                [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0],
                [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
                [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
                [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
                [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
                [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0]
            ],
            // 12 PREGUNTAS ESTRATÉGICAMENTE COLOCADAS EN LA RUTA PRINCIPAL
            questions: [
                { x: 2, y: 0, question: "¿Donde fue su primer encuentro?", answer: "tiktok", answered: false },
                { x: 4, y: 2, question: "¿Quien le escribio primero a quien?", answer: "Ana", answered: false },
                { x: 6, y: 4, question: "¿Que color es el favorito de Maykel?", answer: "negro", answered: false },
                { x: 8, y: 6, question: "¿Quien es mas cursi?", answer: "Maykel", answered: false },
                { x: 10, y: 8, question: "¿Que le gusta mas a Maykel, Sushi o Hamburguesa?", answer: "sushi", answered: false },
                { x: 12, y: 10, question: "¿Quien es mas pervertido?", answer: "Ana", answered: false },
                { x: 14, y: 12, question: "¿Que dia empezaron a salir?", answer: "15", answered: false },
                { x: 16, y: 14, question: "¿Que mes empezaron a salir?", answer: "septiembre", answered: false },
                { x: 18, y: 16, question: "¿Quien es mas orgulloso?", answer: "Maykel", answered: false },
                { x: 20, y: 18, question: "¿Que tipo de series son las favoritas de Ana?", answer: "Terror", answered: false },
                { x: 5, y: 20, question: "¿Que tipo de series son las favoritas de Maykel?", answer: "Coreanas", answered: false },
                { x: 10, y: 21, question: "Arepa o Pasta, Respuesta con logica", answer: "Ambas", answered: false }
            ]
        };
        
        // ESTADO DEL JUEGO
        const gameState = {
            playerPosition: { ...mazeConfig.start },
            questionsAnswered: 0,
            movesCount: 0,
            currentQuestion: null,
            completed: false,
            controlsEnabled: true,
            showVictoryScreen: false,
            previousPosition: null,
            escPressCount: 0,
            escTimeout: null,
            inQuestion: false
        };
        
        // CREAR INTERFAZ CON LABERINTO GRANDE Y SIN BOTONES
        const gameHTML = `
            <div id="laberinto-conocimiento" style="
                max-width: 1000px;
                margin: 0 auto;
                background: #1e2d3d;
                border-radius: 12px;
                padding: 15px;
                color: #e8e8e8;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                border: 2px solid #3498db;
                height: auto;
                min-height: auto;
                overflow: visible;
            ">
                <!-- HEADER COMPACTO -->
                <div style="text-align: center; margin-bottom: 15px;">
                    <h1 style="color: #3498db; margin: 0 0 5px 0; font-size: 24px; font-weight: 700;">
                        🧠 Laberinto del Conocimiento
                    </h1>
                    <p style="color: #7f8c8d; margin: 0; font-size: 14px;">
                        8/12 preguntas necesarias • 22x22 • Usa R para reiniciar • ESC para salir
                    </p>
                </div>
                
                <!-- CONTENIDO PRINCIPAL - LABERINTO GRANDE CENTRADO -->
                <div style="display: flex; gap: 15px; align-items: flex-start; justify-content: center;">
                    <!-- LABERINTO GRANDE -->
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div style="background: #2c3e50; padding: 15px; border-radius: 10px; border: 2px solid #34495e; margin-bottom: 10px;">
                            <h2 style="color: #3498db; margin-top: 0; text-align: center; font-size: 18px; margin-bottom: 12px;">
                                Mapa del Conocimiento
                            </h2>
                            
                            <div style="display: flex; justify-content: center;">
                                <canvas id="maze-canvas" 
                                        width="${mazeConfig.size * mazeConfig.cellSize}" 
                                        height="${mazeConfig.size * mazeConfig.cellSize}"
                                        style="display: block; border: 2px solid #2980b9; background: #1c2833; border-radius: 6px;">
                                </canvas>
                            </div>
                            
                            <!-- LEYENDA COMPACTA -->
                            <div style="display: flex; justify-content: center; gap: 12px; margin-top: 12px; flex-wrap: wrap;">
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <div style="width: 14px; height: 14px; background: #e74c3c; border-radius: 3px; border: 1px solid #fff;"></div>
                                    <span style="color: #ecf0f1; font-size: 12px;">Jugador</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <div style="width: 14px; height: 14px; background: #2ecc71; border-radius: 3px; border: 1px solid #fff;"></div>
                                    <span style="color: #ecf0f1; font-size: 12px;">Inicio</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <div style="width: 14px; height: 14px; background: #9b59b6; border-radius: 3px; border: 1px solid #fff;"></div>
                                    <span style="color: #ecf0f1; font-size: 12px;">Meta</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <div style="width: 14px; height: 14px; background: #f39c12; border-radius: 3px; border: 1px solid #fff;"></div>
                                    <span style="color: #ecf0f1; font-size: 12px;">Pregunta</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- PANEL DE INFORMACIÓN COMPACTO -->
                    <div style="min-width: 280px; display: flex; flex-direction: column; gap: 10px;">
                        <!-- ESTADÍSTICAS COMPACTAS -->
                        <div style="background: #2c3e50; padding: 15px; border-radius: 10px; border: 2px solid #34495e;">
                            <h2 style="color: #3498db; margin-top: 0; text-align: center; font-size: 18px; margin-bottom: 15px;">
                                Progreso
                            </h2>
                            
                            <div style="display: flex; justify-content: space-around; margin-bottom: 15px;">
                                <div style="text-align: center;">
                                    <div id="stats-questions" style="font-size: 24px; font-weight: bold; color: #f39c12;">0/8</div>
                                    <div style="color: #bdc3c7; font-size: 12px;">Preguntas</div>
                                </div>
                                <div style="text-align: center;">
                                    <div id="stats-moves" style="font-size: 24px; font-weight: bold; color: #f39c12;">0</div>
                                    <div style="color: #bdc3c7; font-size: 12px;">Movimientos</div>
                                </div>
                            </div>
                            
                            <!-- BARRA DE PROGRESO COMPACTA -->
                            <div style="margin-bottom: 12px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                    <span style="color: #bdc3c7; font-size: 12px;">Progreso:</span>
                                    <span id="progress-percent" style="color: #f39c12; font-size: 12px; font-weight: bold;">0%</span>
                                </div>
                                <div style="height: 8px; background: #34495e; border-radius: 4px; overflow: hidden;">
                                    <div id="progress-bar" style="height: 100%; background: linear-gradient(90deg, #2ecc71, #f39c12); width: 0%; transition: width 0.5s;"></div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- INSTRUCCIONES COMPACTAS -->
                        <div style="background: #2c3e50; padding: 15px; border-radius: 10px; border: 2px solid #34495e;">
                            <h3 style="color: #3498db; margin-top: 0; font-size: 16px; text-align: center; margin-bottom: 10px;">🎮 Controles</h3>
                            <div style="color: #ecf0f1; font-size: 13px; line-height: 1.4;">
                                <div style="display: flex; align-items: center; margin-bottom: 6px;">
                                    <span style="background: #3498db; border-radius: 3px; padding: 3px 6px; margin-right: 8px; font-size: 11px; font-weight: bold;">Flechas</span>
                                    <span style="margin-right: 8px;">o</span>
                                    <span style="background: #3498db; border-radius: 3px; padding: 3px 6px; font-size: 11px; font-weight: bold;">WASD</span>
                                    <span style="margin-left: 8px;">Moverse</span>
                                </div>
                                <div style="display: flex; align-items: center; margin-bottom: 6px;">
                                    <span style="background: #2ecc71; border-radius: 3px; padding: 3px 6px; margin-right: 8px; font-size: 11px; font-weight: bold;">ENTER</span>
                                    <span>Enviar respuesta</span>
                                </div>
                                <div style="display: flex; align-items: center; margin-bottom: 6px;">
                                    <span style="background: #e74c3c; border-radius: 3px; padding: 3px 6px; margin-right: 8px; font-size: 11px; font-weight: bold;">ESC</span>
                                    <span>Cerrar pregunta</span>
                                </div>
                                <div style="display: flex; align-items: center; margin-bottom: 6px;">
                                    <span style="background: #f39c12; border-radius: 3px; padding: 3px 6px; margin-right: 8px; font-size: 11px; font-weight: bold;">R</span>
                                    <span>Reiniciar juego</span>
                                </div>
                                <div style="display: flex; align-items: center;">
                                    <span style="background: #9b59b6; border-radius: 3px; padding: 3px 6px; margin-right: 8px; font-size: 11px; font-weight: bold;">ESC x2</span>
                                    <span>Volver al universo</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- MENSAJES COMPACTOS -->
                        <div id="message-container" style="
                            min-height: 70px; 
                            padding: 15px; 
                            background: #2c3e50; 
                            border-radius: 10px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border: 2px solid #34495e;
                        ">
                            <div style="text-align: center; color: #bdc3c7; font-size: 13px; line-height: 1.4;">
                                <strong>¡Bienvenido!</strong><br>
                                Responde 8 de 12 preguntas para llegar a la meta.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- MODAL DE PREGUNTA COMPACTO -->
            <div id="question-modal" style="
                display: none;
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: rgba(30, 45, 61, 0.95);
                z-index: 1000;
                justify-content: center;
                align-items: center;
            ">
                <div style="
                    background: #2c3e50;
                    padding: 20px;
                    border-radius: 10px;
                    max-width: 500px;
                    width: 90%;
                    border: 2px solid #3498db;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.4);
                ">
                    <h2 style="color: #3498db; margin-top: 0; text-align: center; font-size: 18px; margin-bottom: 15px;">
                        ❓ Pregunta del Conocimiento
                    </h2>
                    
                    <div id="question-text" style="
                        font-size: 15px; 
                        margin-bottom: 15px; 
                        color: #ecf0f1; 
                        text-align: center; 
                        background: #34495e; 
                        padding: 12px; 
                        border-radius: 8px;
                        line-height: 1.4;
                        border: 1px solid #3498db;
                    "></div>
                    
                    <div style="margin-bottom: 15px;">
                        <input type="text" 
                               id="answer-input" 
                               placeholder="Escribe tu respuesta..."
                               style="
                                    width: 100%;
                                    padding: 10px;
                                    font-size: 14px;
                                    border: 2px solid #3498db;
                                    border-radius: 6px;
                                    background: #1c2833;
                                    color: white;
                                    box-sizing: border-box;
                                    text-align: center;
                               "
                               autocomplete="off">
                        <div id="error-message" style="color: #bdc3c7; font-size: 12px; margin-top: 5px; text-align: center;">
                            ENTER para enviar • ESC para cancelar
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <button id="btn-submit-answer" style="
                            flex: 1;
                            background: linear-gradient(145deg, #2ecc71, #27ae60);
                            color: white;
                            border: none;
                            padding: 10px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 13px;
                            font-weight: 600;
                        ">✅ Enviar Respuesta</button>
                        
                        <button id="btn-cancel-question" style="
                            background: linear-gradient(145deg, #e74c3c, #c0392b);
                            color: white;
                            border: none;
                            padding: 10px 15px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 13px;
                            font-weight: 600;
                        ">❌ Cancelar</button>
                    </div>
                </div>
            </div>
            
            <!-- PANTALLA DE VICTORIA MEJORADA -->
            <div id="victory-screen" style="
                display: none;
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: rgba(30, 45, 61, 0.98);
                z-index: 1000;
                justify-content: center;
                align-items: center;
            ">
                <div style="
                    background: #2c3e50;
                    padding: 30px;
                    border-radius: 15px;
                    max-width: 450px;
                    width: 90%;
                    text-align: center;
                    border: 3px solid #2ecc71;
                    box-shadow: 0 15px 30px rgba(0,0,0,0.4);
                ">
                    <div style="font-size: 50px; margin-bottom: 15px;">🏆</div>
                    <h2 style="color: #2ecc71; margin-top: 0; font-size: 26px; margin-bottom: 15px;">¡Felicidades!</h2>
                    
                    <div style="color: #bdc3c7; margin-bottom: 20px; font-size: 18px; line-height: 1.5;">
                        Esta es tu recompensa: <span style="color: #f87103ff; font-weight: bold; font-size: 20px;">1) Mi Hermosa</span>
                    </div>
                    
                    <div style="
                        background: #34495e;
                        padding: 15px;
                        border-radius: 10px;
                        margin-bottom: 25px;
                        border: 1px solid #3498db;
                    ">
                        <div style="display: flex; justify-content: space-around; color: #bdc3c7;">
                            <div>
                                <div style="font-size: 22px; color: #f39c12; font-weight: bold;" id="final-questions">0/8</div>
                                <div style="font-size: 12px;">Preguntas</div>
                            </div>
                            <div>
                                <div style="font-size: 22px; color: #f39c12; font-weight: bold;" id="final-moves">0</div>
                                <div style="font-size: 12px;">Movimientos</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <button id="btn-play-again" style="
                            background: linear-gradient(145deg, #3498db, #2980b9);
                            color: white;
                            border: none;
                            padding: 12px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 14px;
                            font-weight: 600;
                        ">
                            🎮 Jugar otra vez
                            <div style="font-size: 11px; opacity: 0.9; margin-top: 4px;">Presiona ENTER</div>
                        </button>
                        
                        <button id="btn-return-universe" style="
                            background: linear-gradient(145deg, #9b59b6, #8e44ad);
                            color: white;
                            border: none;
                            padding: 12px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 14px;
                            font-weight: 600;
                        ">
                            🌌 Volver al Universo
                            <div style="font-size: 11px; opacity: 0.9; margin-top: 4px;">Presiona 2 veces ESC</div>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = gameHTML;
        
        // INICIALIZAR JUEGO
        initializeGame();
        
        function initializeGame() {
            const canvas = document.getElementById('maze-canvas');
            const ctx = canvas.getContext('2d');
            
            // DIBUJAR LABERINTO
            function drawMaze() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                for (let y = 0; y < mazeConfig.size; y++) {
                    for (let x = 0; x < mazeConfig.size; x++) {
                        const cellX = x * mazeConfig.cellSize;
                        const cellY = y * mazeConfig.cellSize;
                        
                        // COLORES CLARAMENTE DIFERENCIADOS
                        if (x === gameState.playerPosition.x && y === gameState.playerPosition.y) {
                            // JUGADOR - ROJO INTENSO
                            ctx.fillStyle = '#e74c3c';
                            ctx.fillRect(cellX, cellY, mazeConfig.cellSize, mazeConfig.cellSize);
                            
                            // EFECTO DE RESALTADO
                            ctx.strokeStyle = '#fff';
                            ctx.lineWidth = 2;
                            ctx.strokeRect(cellX, cellY, mazeConfig.cellSize, mazeConfig.cellSize);
                        } else if (x === mazeConfig.start.x && y === mazeConfig.start.y) {
                            // INICIO - VERDE
                            ctx.fillStyle = '#2ecc71';
                            ctx.fillRect(cellX, cellY, mazeConfig.cellSize, mazeConfig.cellSize);
                        } else if (x === mazeConfig.end.x && y === mazeConfig.end.y) {
                            // META - MORADO
                            ctx.fillStyle = '#9b59b6';
                            ctx.fillRect(cellX, cellY, mazeConfig.cellSize, mazeConfig.cellSize);
                        } else if (mazeConfig.questions.some(q => q.x === x && q.y === y && !q.answered)) {
                            // PREGUNTA - AMARILLO
                            ctx.fillStyle = '#f39c12';
                            ctx.fillRect(cellX, cellY, mazeConfig.cellSize, mazeConfig.cellSize);
                        } else if (mazeConfig.maze[y][x] === 1) {
                            // PARED - AZUL OSCURO
                            ctx.fillStyle = '#2c3e50';
                            ctx.fillRect(cellX, cellY, mazeConfig.cellSize, mazeConfig.cellSize);
                        } else {
                            // CAMINO - AZUL CLARO
                            ctx.fillStyle = '#3498db';
                            ctx.fillRect(cellX, cellY, mazeConfig.cellSize, mazeConfig.cellSize);
                        }
                        
                        // BORDE DE CELDA SUTIL
                        ctx.strokeStyle = '#1c2833';
                        ctx.lineWidth = 0.5;
                        ctx.strokeRect(cellX, cellY, mazeConfig.cellSize, mazeConfig.cellSize);
                    }
                }
            }
            
            // CONFIGURAR CONTROLES DE TECLADO - CORREGIDO
            function setupKeyboardControls() {
                document.addEventListener('keydown', function(e) {
                    // Si está en pantalla de victoria
                    if (gameState.showVictoryScreen) {
                        if (e.key === 'Enter') {
                            resetGame();
                        } else if (e.key === 'Escape') {
                            gameState.escPressCount++;
                            
                            if (gameState.escPressCount === 1) {
                                // Primera pulsación - iniciar timeout
                                gameState.escTimeout = setTimeout(() => {
                                    gameState.escPressCount = 0;
                                }, 1000);
                            } else if (gameState.escPressCount === 2) {
                                // Segunda pulsación - salir al universo
                                clearTimeout(gameState.escTimeout);
                                returnToUniverse();
                            }
                        }
                        return;
                    }
                    
                    // Si está en una pregunta activa
                    if (gameState.inQuestion) {
                        if (e.key === 'Enter') {
                            checkAnswer();
                        } else if (e.key === 'Escape') {
                            closeQuestionModal(false);
                        }
                        // No permitir otros controles mientras está en pregunta
                        return;
                    }
                    
                    // Controles generales (solo cuando no está en pregunta)
                    if (e.key === 'r' || e.key === 'R') {
                        // Reiniciar juego con R
                        resetGame();
                        return;
                    }
                    
                    if (e.key === 'Escape') {
                        // Doble ESC para volver al universo
                        gameState.escPressCount++;
                        
                        if (gameState.escPressCount === 1) {
                            // Primera pulsación - iniciar timeout
                            gameState.escTimeout = setTimeout(() => {
                                gameState.escPressCount = 0;
                                showMessage('Presiona ESC otra vez para volver al universo', 'info');
                            }, 1000);
                        } else if (gameState.escPressCount === 2) {
                            // Segunda pulsación - salir al universo
                            clearTimeout(gameState.escTimeout);
                            gameState.escPressCount = 0;
                            returnToUniverse();
                        }
                        return;
                    }
                    
                    // Si los controles están deshabilitados o el juego está completado
                    if (!gameState.controlsEnabled || gameState.completed) return;
                    
                    let newX = gameState.playerPosition.x;
                    let newY = gameState.playerPosition.y;
                    let moved = false;
                    
                    switch(e.key) {
                        case 'ArrowUp': case 'w': case 'W':
                            newY--;
                            moved = true;
                            break;
                        case 'ArrowDown': case 's': case 'S':
                            newY++;
                            moved = true;
                            break;
                        case 'ArrowLeft': case 'a': case 'A':
                            newX--;
                            moved = true;
                            break;
                        case 'ArrowRight': case 'd': case 'D':
                            newX++;
                            moved = true;
                            break;
                    }
                    
                    if (moved) {
                        e.preventDefault();
                        if (isValidMove(newX, newY)) {
                            movePlayer(newX, newY);
                        } else {
                            showMessage('¡Movimiento no válido! Es una pared.', 'error');
                        }
                    }
                });
            }
            
            // CONFIGURAR BOTONES
            function setupButtons() {
                document.getElementById('btn-submit-answer').addEventListener('click', checkAnswer);
                document.getElementById('btn-cancel-question').addEventListener('click', () => closeQuestionModal(false));
                document.getElementById('btn-play-again').addEventListener('click', resetGame);
                document.getElementById('btn-return-universe').addEventListener('click', returnToUniverse);
                
                // ENTER en input de respuesta
                document.getElementById('answer-input').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        checkAnswer();
                    }
                });
            }
            
            function isValidMove(x, y) {
                return x >= 0 && x < mazeConfig.size && 
                       y >= 0 && y < mazeConfig.size && 
                       mazeConfig.maze[y][x] === 0;
            }
            
            function movePlayer(x, y) {
                // Guardar posición anterior
                gameState.previousPosition = { ...gameState.playerPosition };
                
                gameState.playerPosition.x = x;
                gameState.playerPosition.y = y;
                gameState.movesCount++;
                
                // Verificar si hay pregunta
                const question = mazeConfig.questions.find(q => 
                    q.x === x && q.y === y && !q.answered
                );
                
                if (question) {
                    gameState.controlsEnabled = false;
                    gameState.currentQuestion = question;
                    gameState.inQuestion = true; // MARCAR QUE ESTÁ EN UNA PREGUNTA
                    showQuestion(question);
                }
                
                drawMaze();
                updateGameStats();
                
                // Verificar victoria - SOLO NECESITA 8 PREGUNTAS DE 12
                if (x === mazeConfig.end.x && y === mazeConfig.end.y && gameState.questionsAnswered >= 8) {
                    gameState.completed = true;
                    showVictoryScreen();
                } else if (x === mazeConfig.end.x && y === mazeConfig.end.y) {
                    showMessage(`¡Llegaste a la meta! Pero necesitas responder ${8 - gameState.questionsAnswered} preguntas más.`, 'error');
                    // Revertir posición para no permitir victoria incompleta
                    gameState.playerPosition.x = gameState.previousPosition.x;
                    gameState.playerPosition.y = gameState.previousPosition.y;
                    drawMaze();
                }
            }
            
            function showQuestion(question) {
                const modal = document.getElementById('question-modal');
                const questionText = document.getElementById('question-text');
                const answerInput = document.getElementById('answer-input');
                const errorMessage = document.getElementById('error-message');
                
                questionText.textContent = question.question;
                answerInput.value = '';
                answerInput.style.borderColor = '#3498db';
                errorMessage.textContent = 'ENTER para enviar • ESC para cancelar';
                errorMessage.style.color = '#bdc3c7';
                modal.style.display = 'flex';
                
                setTimeout(() => {
                    answerInput.focus();
                }, 100);
            }
            
            function checkAnswer() {
                const answerInput = document.getElementById('answer-input');
                const errorMessage = document.getElementById('error-message');
                const userAnswer = answerInput.value.trim().toLowerCase();
                const correctAnswer = gameState.currentQuestion.answer.toLowerCase();
                
                if (userAnswer === correctAnswer) {
                    gameState.currentQuestion.answered = true;
                    gameState.questionsAnswered++;
                    showMessage(`✅ ¡Respuesta correcta! ${Math.max(0, 8 - gameState.questionsAnswered)} preguntas más para ganar.`, 'success');
                    closeQuestionModal(true);
                } else {
                    answerInput.style.borderColor = '#e74c3c';
                    errorMessage.textContent = '❌ Respuesta incorrecta. Intenta de nuevo.';
                    errorMessage.style.color = '#e74c3c';
                    answerInput.focus();
                    answerInput.select();
                }
            }
            
            function closeQuestionModal(success) {
                const modal = document.getElementById('question-modal');
                const errorMessage = document.getElementById('error-message');
                const answerInput = document.getElementById('answer-input');
                
                modal.style.display = 'none';
                errorMessage.textContent = 'ENTER para enviar • ESC para cancelar';
                errorMessage.style.color = '#bdc3c7';
                answerInput.style.borderColor = '#3498db';
                
                // IMPORTANTE: SIEMPRE re-habilitar los controles y marcar que ya no está en pregunta
                gameState.controlsEnabled = true;
                gameState.inQuestion = false;
                
                if (success) {
                    // El jugador permanece en la posición actual después de responder correctamente
                    // No es necesario revertir la posición
                } else {
                    // Revertir posición solo si se cancela la pregunta
                    if (gameState.previousPosition) {
                        gameState.playerPosition.x = gameState.previousPosition.x;
                        gameState.playerPosition.y = gameState.previousPosition.y;
                        drawMaze(); // Redibujar para mostrar la posición revertida
                    }
                    showMessage('Pregunta no respondida. Debes responder para avanzar.', 'error');
                }
                
                gameState.currentQuestion = null;
                updateGameStats();
            }
            
            function showVictoryScreen() {
                gameState.showVictoryScreen = true;
                document.getElementById('victory-screen').style.display = 'flex';
                document.getElementById('final-moves').textContent = gameState.movesCount;
                document.getElementById('final-questions').textContent = `${gameState.questionsAnswered}/8`;
                
                // Enfocar el botón de jugar otra vez para que ENTER funcione
                setTimeout(() => {
                    document.getElementById('btn-play-again').focus();
                }, 100);
            }
            
            function updateGameStats() {
                document.getElementById('stats-questions').textContent = `${gameState.questionsAnswered}/8`;
                document.getElementById('stats-moves').textContent = gameState.movesCount;
                
                // Actualizar barra de progreso - basada en 8 preguntas necesarias
                const progress = (Math.min(gameState.questionsAnswered, 8) / 8) * 100;
                document.getElementById('progress-bar').style.width = `${progress}%`;
                document.getElementById('progress-percent').textContent = `${Math.round(progress)}%`;
            }
            
            function showMessage(text, type) {
                const messageContainer = document.getElementById('message-container');
                messageContainer.innerHTML = '';
                
                const message = document.createElement('div');
                message.textContent = text;
                message.style.cssText = `
                    padding: 10px;
                    border-radius: 6px;
                    text-align: center;
                    font-weight: bold;
                    font-size: 13px;
                    width: 100%;
                    color: white;
                `;
                
                if (type === 'success') {
                    message.style.background = 'linear-gradient(145deg, #2ecc71, #27ae60)';
                    message.style.border = '1px solid #2ecc71';
                } else if (type === 'error') {
                    message.style.background = 'linear-gradient(145deg, #e74c3c, #c0392b)';
                    message.style.border = '1px solid #e74c3c';
                } else {
                    message.style.background = 'linear-gradient(145deg, #3498db, #2980b9)';
                    message.style.border = '1px solid #3498db';
                }
                
                messageContainer.appendChild(message);
                
                if (!gameState.completed) {
                    setTimeout(() => {
                        messageContainer.innerHTML = `
                            <div style="text-align: center; color: #bdc3c7; font-size: 13px; line-height: 1.4;">
                                <strong>Progreso: ${gameState.questionsAnswered}/8 preguntas necesarias</strong><br>
                                Sigue explorando para encontrar más preguntas.
                            </div>
                        `;
                    }, 3000);
                }
            }
            
            function resetGame() {
                // Limpiar timeout de ESC si existe
                if (gameState.escTimeout) {
                    clearTimeout(gameState.escTimeout);
                    gameState.escPressCount = 0;
                }
                
                gameState.playerPosition = { ...mazeConfig.start };
                gameState.questionsAnswered = 0;
                gameState.movesCount = 0;
                gameState.completed = false;
                gameState.controlsEnabled = true;
                gameState.currentQuestion = null;
                gameState.showVictoryScreen = false;
                gameState.previousPosition = null;
                gameState.inQuestion = false; // RESETEAR ESTADO DE PREGUNTA
                
                mazeConfig.questions.forEach(q => q.answered = false);
                
                document.getElementById('victory-screen').style.display = 'none';
                document.getElementById('question-modal').style.display = 'none';
                
                drawMaze();
                updateGameStats();
                showMessage('¡Nueva partida iniciada! Encuentra 8 de 12 preguntas para ganar.', 'success');
            }
            
            function returnToUniverse() {
                // Limpiar timeout de ESC si existe
                if (gameState.escTimeout) {
                    clearTimeout(gameState.escTimeout);
                    gameState.escPressCount = 0;
                }
                
                if (window.galaxyManager) {
                    window.galaxyManager.showGalaxyView(false);
                }
            }
            
            // INICIAR JUEGO
            drawMaze();
            updateGameStats();
            setupKeyboardControls();
            setupButtons();
            showMessage('¡Bienvenido! Usa las flechas o WASD para moverte por el laberinto.', 'success');
        }
    }
    
    // Registro en galaxyManager
    if (window.galaxyManager) {
        window.galaxyManager.registerGalaxy('laberinto', {
            name: '🧠 Laberinto del Conocimiento',
            description: 'Laberinto intelectual grande - Responde 8 de 12 preguntas para ganar',
            initFunction: window.initLaberintoGalaxy,
            type: 'game'
        });
        console.log('✅ Laberinto del Conocimiento VERSIÓN FINAL registrado en galaxyManager');
    }
    
    console.log('🧠 LABERINTO DEL CONOCIMIENTO - VERSIÓN FINAL COMPLETA');
})();