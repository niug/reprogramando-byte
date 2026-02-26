export class MotorJoc {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.personatge = { x: 0, y: 0, costat: 40 };
        this.objectiu = { x: 320, y: 320 };
        this.accionsExecutades = [];
        this.midaCasella = 40;
    }

    // 1. DIBUIX DEL CANVAS
    dibuixar(nivellDades) {
        const { ctx, canvas, midaCasella } = this;
        
        // Netejar
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibuixar Graella (Pedagògic: ajuda a comptar passes)
        ctx.strokeStyle = "#1e293b";
        for (let i = 0; i < canvas.width; i += midaCasella) {
            for (let j = 0; j < canvas.height; j += midaCasella) {
                ctx.strokeRect(i, j, midaCasella, midaCasella);
            }
        }

        // Dibuixar Objectiu (La meta)
        ctx.fillStyle = "#4ade80";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#4ade80";
        ctx.fillRect(this.objectiu.x + 10, this.objectiu.y + 10, 20, 20);

        // Dibuixar Personatge
        ctx.fillStyle = "#38bdf8";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#38bdf8";
        ctx.fillRect(this.personatge.x, this.personatge.y, this.personatge.costat, this.personatge.costat);
        
        // Reset de sombres per no afectar la resta
        ctx.shadowBlur = 0;

        // Dibuixar la sortida (Bandera/Porta)
        this.dibuixarSortida(this.objectiu.x, this.objectiu.y);

        // Dibuixar en Byte
        this.dibuixarPersonatge(this.personatge.x, this.personatge.y);
    }

    dibuixarPersonatge(x, y) {
        const ctx = this.ctx;
        const s = this.midaCasella / 40; // Factor d'escala

        ctx.save();
        ctx.translate(x, y);

        // 1. ANTENA
        ctx.fillStyle = "#ff3131"; // Vermell neó
        ctx.fillRect(18*s, 2*s, 4*s, 6*s);
        ctx.fillStyle = "#fff";
        ctx.fillRect(18*s, 0, 4*s, 2*s);

        // 2. COS/CAP (Forma de monitor antic)
        ctx.fillStyle = "#334155"; // Gris metàl·lic
        ctx.beginPath();
        ctx.roundRect(5*s, 8*s, 30*s, 28*s, 5*s);
        ctx.fill();
        
        // 3. PANTALLA (Cara)
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.roundRect(8*s, 11*s, 24*s, 18*s, 3*s);
        ctx.fill();

        // 4. ULLS (Cian neó)
        ctx.fillStyle = "#00f2ff";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#00f2ff";
        // Ull esquerre
        ctx.fillRect(12*s, 16*s, 6*s, 6*s);
        // Ull dret
        ctx.fillRect(22*s, 16*s, 6*s, 6*s);

        // 5. DETALLS METÀL·LICS (Braços/Base)
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#475569";
        ctx.fillRect(2*s, 18*s, 3*s, 10*s); // Braç esquerre
        ctx.fillRect(35*s, 18*s, 3*s, 10*s); // Braç dret
        
        // 6. PEUS / RODES
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(10*s, 36*s, 8*s, 4*s);
        ctx.fillRect(22*s, 36*s, 8*s, 4*s);

        ctx.restore();
    }
    
    dibuixarSortida(x, y) {
        const ctx = this.ctx;
        ctx.fillStyle = "#39ff14"; // Verd neó
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#39ff14";
        ctx.strokeRect(x+5, y+5, 30, 30);
        ctx.font = "20px Arial";
        ctx.fillText("🏁", x + 8, y + 28);
        ctx.shadowBlur = 0;
    }

    // 2. EL PONT AMB PYTHON (Motor Invisible)
    // Aquest codi defineix les funcions que l'alumne podrà usar
    generarCodiPrevi() {
        return `
class PersonatgePy:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.itinerari = []

    def moure_dreta(self):
        self.x += ${this.midaCasella}
        self.itinerari.append(('X', self.x))

    def moure_avall(self):
        self.y += ${this.midaCasella}
        self.itinerari.append(('Y', self.y))

heroi = PersonatgePy(${this.personatge.x}, ${this.personatge.y})
`;
    }

    // 3. ANIMACIÓ SEQÜENCIAL
    // Molt important: perquè l'alumne vegi el moviment pas a pas i no un salt brusc
    async animarMoviments(itinerari) {
        for (const [eix, valor] of itinerari) {
            if (eix === 'X') this.personatge.x = valor;
            if (eix === 'Y') this.personatge.y = valor;
            
            this.dibuixar(); // Re-dibuixar la nova posició
            await new Promise(resolve => setTimeout(resolve, 300)); // Pausa de 300ms
        }
    }

    // 4. RESET DEL NIVELL
    reset(xInici = 0, yInici = 0) {
        this.personatge.x = xInici;
        this.personatge.y = yInici;
        this.dibuixar();
    }
}