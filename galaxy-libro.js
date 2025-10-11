// galaxy-laberinto.js - SOLUCIÓN DE ÚLTIMO RECURSO SIN THREE.JS
class LaberintoGalaxy {
    constructor(container) {
        this.container = container;
        this.maze = [];
        this.playerPosition = { x: 1, y: 1 };
        this.goalPosition = { x: 13, y: 13 };
        this.mazeSize = 15;
        this.cellSize = 30;
        this.isMoving = false;
        
        this.init();
    }

    init() {
        console.log("🚀 INICIANDO LABERINTO HTML PURO - SIN THREE.JS");
        
        // Limpiar contenedor completamente
        this.container.innerHTML = '';
        
        // Crear estructura principal
        this.createHTMLMaze();
        this.setupEventListeners();
        
        // Forzar redibujado
        setTimeout(() => {
            this.drawMaze();
            console.log("✅ Laberinto HTML listo - MOUSE DEBERÍA FUNCIONAR");
        }, 100);
    }

    createHTMLMaze() {
        // Crear contenedor del laberinto
        this.mazeContainer = document.createElement('div');
        this.mazeContainer.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: grid;
            grid-template-columns: repeat(${this.mazeSize}, ${this.cellSize}px);
            grid-template-rows: repeat(${this.mazeSize}, ${this.cellSize}px);
            gap: 2px;
            background: #0a0a2a;
            padding: 20px;
            border-radius: 15px;
            border: 3px solid #ff4d88;
            box-shadow: 0 0 30px rgba(255, 77, 136, 0.5);
            z-index: 1000;
            pointer-events: auto;
        `;

        // Crear controles de movimiento
        this.createMovementControls();

        this.container.appendChild(this.mazeContainer);
    }

    createMovementControls() {
        const controlsHTML = `
            <div style="
                position: absolute;
                bottom: 20px;
                right: 20px;
                display: grid;
                grid-template-columns: repeat(3, 50px);
                grid-template-rows: repeat(3, 50px);
                gap: 5px;
                z-index: 1001;
                pointer-events: auto;
            ">
                <div class="control-btn" data-dir="up-left">↖️</div>
                <div class="control-btn" data-dir="up">⬆️</div>
                <div class="control-btn" data-dir="up-right">↗️</div>
                <div class="control-btn" data-dir="left">⬅️</div>
                <div class="control-btn" style="background: rgba(255,77,136,0.3);">🎮</div>
                <div class="control-btn" data-dir="right">➡️</div>
                <div class="control-btn" data-dir="down-left">↙️</div>
                <div class="control-btn" data-dir="down">⬇️</div>
                <div class="control-btn" data-dir="down-right">↘️</div>
            </div>
        `;

        const controlsContainer = document.createElement('div');
        controlsContainer.innerHTML = controlsHTML;
        controlsContainer.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: 20px;
            z-index: 1001;
            pointer-events: auto;
        `;

        this.container.appendChild(controlsContainer);
    }

    generateMaze() {
        // Inicializar laberinto vacío
        this.maze = [];
        for (let y = 0; y < this.mazeSize; y++) {
            this.maze[y] = [];
            for (let x = 0; x < this.mazeSize; x++) {
                // Bordes son muros
                if (y === 0 || y === this.mazeSize - 1 || x === 0 || x === this.mazeSize - 1) {
                    this.maze[y][x] = 1;
                } else {
                    // Patrón de laberinto simple
                    this.maze[y][x] = (x % 2 === 0 && y % 2 === 0) ? 1 : 0;
                }
            }
        }

        // Asegurar camino de salida
        this.maze[1][1] = 0; // Posición inicial del jugador
        this.maze[this.mazeSize - 2][this.mazeSize - 2] = 0; // Meta
        this.maze[this.mazeSize - 2][this.mazeSize - 3] = 0;
        this.maze[this.mazeSize - 3][this.mazeSize - 2] = 0;

        // Crear algunos caminos adicionales
        for (let i = 2; i < this.mazeSize - 2; i++) {
            if (Math.random() > 0.3) {
                this.maze[1][i] = 0;
                this.maze[i][1] = 0;
            }
        }

        // Posiciones iniciales
        this.playerPosition = { x: 1, y: 1 };
        this.goalPosition = { x: this.mazeSize - 2, y: this.mazeSize - 2 };
    }

    drawMaze() {
        this.generateMaze();
        this.mazeContainer.innerHTML = '';

        for (let y = 0; y < this.mazeSize; y++) {
            for (let x = 0; x < this.mazeSize; x++) {
                const cell = document.createElement('div');
                cell.style.cssText = `
                    width: ${this.cellSize}px;
                    height: ${this.cellSize}px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    cursor: pointer;
                    border-radius: 4px;
                    transition: all 0.2s;
                    pointer-events: auto;
                `;

                if (this.maze[y][x] === 1) {
                    // Pared
                    cell.style.background = 'linear-gradient(135deg, #8a2be2, #4a1a8a)';
                    cell.style.boxShadow = '0 0 10px rgba(138, 43, 226, 0.5)';
                } else if (x === this.playerPosition.x && y === this.playerPosition.y) {
                    // Jugador
                    cell.style.background = 'linear-gradient(135deg, #ff4d88, #ff1a6a)';
                    cell.innerHTML = '🔴';
                    cell.style.boxShadow = '0 0 15px rgba(255, 77, 136, 0.8)';
                } else if (x === this.goalPosition.x && y === this.goalPosition.y) {
                    // Meta
                    cell.style.background = 'linear-gradient(135deg, #00ff88, #00aa55)';
                    cell.innerHTML = '🎯';
                    cell.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.8)';
                } else {
                    // Camino
                    cell.style.background = 'rgba(26, 26, 58, 0.8)';
                    cell.style.border = '1px solid rgba(255, 77, 136, 0.2)';
                }

                // Hacer las celdas clickeables para movimiento
                if (this.maze[y][x] === 0) {
                    cell.addEventListener('click', () => {
                        this.handleCellClick(x, y);
                    });
                    
                    cell.addEventListener('mouseenter', () => {
                        if (!this.isMoving && this.isValidMove(x, y)) {
                            cell.style.transform = 'scale(1.1)';
                            cell.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.3)';
                        }
                    });
                    
                    cell.addEventListener('mouseleave', () => {
                        cell.style.transform = 'scale(1)';
                        if (!(x === this.playerPosition.x && y === this.playerPosition.y) && 
                            !(x === this.goalPosition.x && y === this.goalPosition.y)) {
                            cell.style.boxShadow = 'none';
                        }
                    });
                }

                this.mazeContainer.appendChild(cell);
            }
        }
    }

    handleCellClick(x, y) {
        console.log(`🎯 Clic en celda: (${x}, ${y})`);
        
        if (this.isMoving) return;
        
        if (this.isValidMove(x, y)) {
            this.movePlayer(x, y);
        }
    }

    setupEventListeners() {
        // Eventos de teclado
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });

        // Eventos de botones de control
        setTimeout(() => {
            const controlBtns = document.querySelectorAll('.control-btn');
            controlBtns.forEach(btn => {
                if (btn.dataset.dir) {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.handleControlButton(btn.dataset.dir);
                    });
                }
            });
        }, 100);

        console.log("🎯 Event listeners configurados");
    }

    handleControlButton(direction) {
        if (this.isMoving) return;

        let newX = this.playerPosition.x;
        let newY = this.playerPosition.y;

        switch(direction) {
            case 'up': newY--; break;
            case 'down': newY++; break;
            case 'left': newX--; break;
            case 'right': newX++; break;
            case 'up-left': newX--; newY--; break;
            case 'up-right': newX++; newY--; break;
            case 'down-left': newX--; newY++; break;
            case 'down-right': newX++; newY++; break;
        }

        if (this.isValidMove(newX, newY)) {
            this.movePlayer(newX, newY);
        }
    }

    handleKeyPress(event) {
        if (this.isMoving) return;

        let newX = this.playerPosition.x;
        let newY = this.playerPosition.y;

        switch(event.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                newY--;
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                newY++;
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                newX--;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                newX++;
                break;
            default:
                return;
        }

        if (this.isValidMove(newX, newY)) {
            this.movePlayer(newX, newY);
        }
    }

    isValidMove(x, y) {
        // Verificar límites
        if (x < 0 || x >= this.mazeSize || y < 0 || y >= this.mazeSize) {
            return false;
        }
        
        // Verificar si es pared
        if (this.maze[y][x] === 1) {
            return false;
        }
        
        // Verificar distancia (solo movimientos adyacentes)
        const distance = Math.abs(x - this.playerPosition.x) + Math.abs(y - this.playerPosition.y);
        return distance === 1;
    }

    movePlayer(targetX, targetY) {
        if (this.isMoving) return;
        
        this.isMoving = true;
        
        // Animación simple
        const playerCell = this.getCellElement(this.playerPosition.x, this.playerPosition.y);
        if (playerCell) {
            playerCell.style.transform = 'scale(0.8)';
            playerCell.style.opacity = '0.7';
        }

        setTimeout(() => {
            this.playerPosition.x = targetX;
            this.playerPosition.y = targetY;
            this.drawMaze();
            this.isMoving = false;
            
            this.checkWinCondition();
        }, 200);
    }

    getCellElement(x, y) {
        const index = y * this.mazeSize + x;
        return this.mazeContainer.children[index];
    }

    checkWinCondition() {
        if (this.playerPosition.x === this.goalPosition.x && this.playerPosition.y === this.goalPosition.y) {
            this.showWinMessage();
        }
    }

    showWinMessage() {
        const winDiv = document.createElement('div');
        winDiv.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #ff4d88, #8a2be2);
            color: white;
            padding: 40px 60px;
            border-radius: 20px;
            font-family: 'Pacifico', cursive;
            font-size: 36px;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 0 40px rgba(255, 77, 136, 0.8);
            border: 3px solid #ffffff;
            pointer-events: auto;
        `;
        winDiv.innerHTML = `
            <div>¡Felicidades! 🎉</div>
            <div style="font-size: 20px; margin-top: 15px; font-family: 'Quicksand', sans-serif;">
                Has completado el laberinto
            </div>
            <button onclick="this.parentElement.remove(); location.reload();" style="
                margin-top: 25px;
                background: rgba(255,255,255,0.3);
                border: 2px solid white;
                color: white;
                padding: 12px 25px;
                border-radius: 10px;
                cursor: pointer;
                font-family: 'Quicksand', sans-serif;
                font-size: 16px;
                font-weight: bold;
                pointer-events: auto;
                transition: all 0.3s;
            " onmouseover="this.style.background='rgba(255,255,255,0.5)'" 
            onmouseout="this.style.background='rgba(255,255,255,0.3)'">Jugar de Nuevo</button>
        `;
        
        this.container.appendChild(winDiv);
        
        // Efectos de confeti
        this.createConfetti();
    }

    createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${this.getRandomColor()};
                top: -10px;
                left: ${Math.random() * 100}%;
                animation: fall ${Math.random() * 3 + 2}s linear forwards;
                border-radius: 2px;
            `;
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fall {
                    to {
                        transform: translateY(100vh) rotate(${Math.random() * 360}deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
            
            confettiContainer.appendChild(confetti);
        }
        
        this.container.appendChild(confettiContainer);
        
        // Limpiar confeti después de 5 segundos
        setTimeout(() => {
            confettiContainer.remove();
        }, 5000);
    }

    getRandomColor() {
        const colors = ['#ff4d88', '#8a2be2', '#00ff88', '#ffcc00', '#00ccff', '#ff6b6b'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    cleanup() {
        // Limpiar event listeners
        document.removeEventListener('keydown', this.handleKeyPress);
        
        // Limpiar contenedor
        if (this.container) {
            this.container.innerHTML = '';
        }
        
        console.log("🧹 Laberinto HTML limpiado");
    }
}

// INICIALIZACIÓN SIMPLIFICADA
let laberintoInstance = null;

function initLaberinto() {
    document.addEventListener('galaxyEntered', function(e) {
        if (e.detail && e.detail.galaxyId === 'laberinto') {
            const container = document.getElementById('galaxyContent');
            if (container) {
                console.log("🚀 INICIANDO LABERINTO HTML PURO");
                
                // Limpiar instancia anterior
                if (laberintoInstance) {
                    laberintoInstance.cleanup();
                }
                
                // Limpiar contenedor completamente
                container.innerHTML = '';
                
                // Crear contenedor específico
                const laberintoContainer = document.createElement('div');
                laberintoContainer.id = 'laberintoContainer';
                laberintoContainer.style.cssText = `
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    background: #0a0a2a;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    pointer-events: auto;
                    overflow: hidden;
                `;
                container.appendChild(laberintoContainer);
                
                // Crear instancia
                laberintoInstance = new LaberintoGalaxy(laberintoContainer);
                
                // Mostrar instrucciones
                showLaberintoInstructions();
                
                console.log("✅ Laberinto HTML puro INICIADO");
            }
        }
    });

    document.addEventListener('galaxyExited', function() {
        if (laberintoInstance) {
            console.log("🔙 Saliendo del laberinto...");
            laberintoInstance.cleanup();
            laberintoInstance = null;
        }
    });
}

function showLaberintoInstructions() {
    const instructions = document.createElement('div');
    instructions.style.cssText = `
        position: absolute;
        top: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.95);
        color: white;
        padding: 25px;
        border-radius: 15px;
        font-family: 'Quicksand', sans-serif;
        max-width: 400px;
        z-index: 10001;
        border: 3px solid #ff4d88;
        box-shadow: 0 0 30px rgba(255, 77, 136, 0.6);
        font-size: 14px;
        line-height: 1.6;
        pointer-events: auto;
    `;
    instructions.innerHTML = `
        <h3 style="color: #ff4d88; margin-bottom: 15px; font-family: 'Pacifico', cursive; font-size: 28px;">🎮 Laberinto Mágico</h3>
        
        <div style="margin-bottom: 20px;">
            <strong style="color: #ffcc00; display: block; margin-bottom: 10px;">🎯 OBJETIVO:</strong>
            <div>Lleva el círculo <span style="color: #ff4d88;">🔴 ROJO</span> hasta la meta <span style="color: #00ff88;">🎯 VERDE</span></div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <strong style="color: #ffcc00; display: block; margin-bottom: 10px;">🖱️ CONTROLES MOUSE:</strong>
            <div>• Clic en celdas adyacentes para moverte</div>
            <div>• Usa los botones de flechas en la esquina inferior derecha</div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <strong style="color: #ffcc00; display: block; margin-bottom: 10px;">⌨️ CONTROLES TECLADO:</strong>
            <div>• Flechas o WASD para moverte</div>
        </div>
        
        <div style="color: #00ff88; font-weight: bold; font-size: 18px; margin: 20px 0; text-align: center;">
            ¡Buena suerte! 🍀
        </div>
    `;
    
    const galaxyContent = document.getElementById('galaxyContent');
    if (galaxyContent) {
        galaxyContent.appendChild(instructions);
        
        // Botón para cerrar instrucciones
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            background: #ff4d88;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            font-weight: bold;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: auto;
        `;
        closeBtn.onclick = () => {
            instructions.style.transition = 'opacity 0.5s';
            instructions.style.opacity = '0';
            setTimeout(() => instructions.remove(), 500);
        };
        instructions.appendChild(closeBtn);
        
        // Auto-eliminar después de 30 segundos
        setTimeout(() => {
            if (instructions.parentNode) {
                instructions.style.transition = 'opacity 0.5s';
                instructions.style.opacity = '0';
                setTimeout(() => instructions.remove(), 500);
            }
        }, 30000);
    }
}

// Inicializar inmediatamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLaberinto);
} else {
    initLaberinto();
}

console.log("🎯 galaxy-laberinto.js CARGADO - VERSIÓN HTML PURA");