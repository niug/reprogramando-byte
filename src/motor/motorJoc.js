// src/motor/motorJoc.js

export class MotorJoc {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext("2d");
        
        // --- CONFIGURACIÓ DE LA GRAELLA ---
        // Assegura't que el canvas a l'HTML té width="600" height="600"
        this.midaCasella = 60; // 10x10 caselles de 60px
        
        // --- ESTAT DEL JOC ---
        this.personatge = { x: 0, y: 0 }; // Posició en caselles (0,0)
        this.objectiu = { x: 9, y: 9 };   // Posició final (casella 9,9)

        // --- CARREGA DE L'SPRITE DEL ROBOT (Nou!) ---
        this.robotReady = false;
        this.robotSprite = new Image();
        
        // Definim què fer quan la imatge s'acabi de carregar
        this.robotSprite.onload = () => {
            this.robotReady = true;
            this.dibuixar(); // Dibuixem el joc un cop tenim el robot
            console.log("/> Sprite d'en Byte carregat correctament.");
        };
        
        // Indiquem la ruta relativa des de la carpeta 'public'
        this.robotSprite.src = '/assets/robot_byte.svg'; 

        // --- CARREGA DE L'SPRITE DE L'OBJECTIU (Opcional, per estètica) ---
        this.targetReady = false;
        this.targetSprite = new Image();
        this.targetSprite.onload = () => { this.targetReady = true; this.dibuixar(); };
        // Pots posar una imatge d'un portal o una xip cyberpunk aquí
        this.targetSprite.src = '/assets/portal_cyberpunk.png'; 
    }

    // --- FUNCIÓ PRINCIPAL DE DIBUIX ---
    dibuixar() {
        const ctx = this.ctx;
        if (!ctx) return;

        // 1. Netejar el canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 2. Dibuixar el fons (fosc cyberpunk)
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 3. Dibuixar la graella (línies suaus cian)
        this.dibuixarGraella();

        // 4. Dibuixar l'objectiu
        this.dibuixarObjectiu();

        // 5. Dibuixar el robot Byte (Modificat!)
        this.dibuixarPersonatge();
    }

    dibuixarGraella() {
        const ctx = this.ctx;
        ctx.strokeStyle = "rgba(0, 242, 255, 0.15)"; // Cian molt suau
        ctx.lineWidth = 1;

        for (let i = 0; i <= this.canvas.width; i += this.midaCasella) {
            // Línies verticals
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, this.canvas.height); ctx.stroke();
            // Línies horitzontals
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(this.canvas.width, i); ctx.stroke();
        }
    }

    dibuixarObjectiu() {
        const ctx = this.ctx;
        const xPx = this.objectiu.x * this.midaCasella;
        const yPx = this.objectiu.y * this.midaCasella;

        if (this.targetReady) {
            // Si tenim imatge per al portal, la dibuixem
            ctx.drawImage(this.targetSprite, xPx + 5, yPx + 5, this.midaCasella - 10, this.midaCasella - 10);
        } else {
          // Si no, un quadrat vermell neó de seguretat
          ctx.fillStyle = "rgba(255, 49, 49, 0.3)";
          ctx.fillRect(xPx + 5, yPx + 5, this.midaCasella - 10, this.midaCasella - 10);
          ctx.strokeStyle = "#ff3131";
          ctx.lineWidth = 2;
          ctx.strokeRect(xPx + 5, yPx + 5, this.midaCasella - 10, this.midaCasella - 10);
        }
    }

    // --- LA NOVA FUNCIÓ DE DIBUIX DEL ROBOT ---
    dibuixarPersonatge() {
        const ctx = this.ctx;
        
        // Calculem la posició en píxels reals
        const xPx = this.personatge.x * this.midaCasella;
        const yPx = this.personatge.y * this.midaCasella;

        if (this.robotReady) {
            // Dibuixem la imatge
            // drawImage(imatge, x, y, amplada, alçada)
            // Afegim un petit 'padding' de 5px perquè el robot no toqui les línies de la graella
            ctx.drawImage(
                this.robotSprite, 
                xPx + 5, 
                yPx + 5, 
                this.midaCasella - 10, 
                this.midaCasella - 10
            );

            // OPCIONAL: Afegir un efecte de llum neó sota el robot
            ctx.shadowColor = "#00f2ff";
            ctx.shadowBlur = 15;
            // Dibuixem un cercle suau sota els peus
            ctx.beginPath();
            ctx.arc(xPx + this.midaCasella/2, yPx + this.midaCasella - 10, 15, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0, 242, 255, 0.2)";
            ctx.fill();
            ctx.shadowBlur = 0; // Resetegem el shadow perquè no afecti a altres dibuixos
            
        } else {
            // Si la imatge triga a carregar, dibuixem el quadrat cian original com a 'fallback'
            ctx.fillStyle = "#00f2ff";
            ctx.fillRect(xPx + 10, yPx + 10, this.midaCasella - 20, this.midaCasella - 20);
        }
    }

    // --- LÒGICA D'ACTUALITZACIÓ DE POSICIÓ (No canvia) ---
    actualitzarPosicio(novaX, novaY) {
        // Validem límits
        if (novaX >= 0 && novaX < (this.canvas.width / this.midaCasella) &&
            novaY >= 0 && novaY < (this.canvas.height / this.midaCasella)) {
            this.personatge.x = novaX;
            this.personatge.y = novaY;
            this.dibuixar(); // Tornem a dibuixar-ho tot amb la nova posició
        }
    }

    // --- LÒGICA D'ANIMACIÓ (No canvia, només crida a actualitzarPosicio) ---
    async animarMoviments(itinerari) {
        for (const pos of itinerari) {
            // 'pos' és un array [x, y] que ve de Python
            this.actualitzarPosicio(pos[0], pos[1]);
            // Esperem 300ms entre moviment i moviment per veure l'animació
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }
}