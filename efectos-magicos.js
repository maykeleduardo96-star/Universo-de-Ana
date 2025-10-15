// EFECTOS MÁGICOS PARA EL LIBRO
class MagicEffects {
    constructor(bookElement) {
        this.book = bookElement;
        this.particles = [];
        this.initEffects();
    }

    initEffects() {
        this.createFloatingParticles();
        this.addHoverEffects();
    }

    createFloatingParticles() {
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                this.createParticle();
            }, i * 200);
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'magic-particle';
        
        // Posición aleatoria alrededor del libro
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 50;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        particle.style.left = `calc(50% + ${x}px)`;
        particle.style.top = `calc(50% + ${y}px)`;
        particle.style.animationDelay = `${Math.random() * 2}s`;
        particle.style.background = this.getRandomGoldColor();
        
        this.book.appendChild(particle);
        this.particles.push(particle);
    }

    getRandomGoldColor() {
        const goldColors = [
            '#D4AF37', '#FFD700', '#FFDF00', 
            '#FDB931', '#FFC300', '#FFB347'
        ];
        return goldColors[Math.floor(Math.random() * goldColors.length)];
    }

    addHoverEffects() {
        this.book.addEventListener('mouseenter', () => {
            this.book.classList.add('dynamic-shadow');
        });

        this.book.addEventListener('mouseleave', () => {
            this.book.classList.remove('dynamic-shadow');
        });
    }

    // Efecto de partículas al abrir el libro
    playOpeningEffect() {
        this.particles.forEach(particle => {
            particle.style.animation = 'float 1s ease-out forwards';
        });
    }
}