import { MotorJoc } from './motor.js';
import { contingutNivells } from './dades/nivells.js';

// --- ESTAT DE L'APLICACIÓ ---
let nivellActual = 0;
let provaActual = 0;
let pyodide = null;
const motor = new MotorJoc('gameCanvas');

// --- 1. INICIALITZACIÓ ---
async function init() {
    // A) Inicialitzar Editor (CodeMirror)
    const editorElement = document.getElementById("editor");
    const editor = CodeMirror(editorElement, {
        mode: "python",
        theme: "dracula",
        lineNumbers: true,
        value: "# Escriu el teu codi aquí..."
    });

    // B) Inicialitzar Pyodide
    const consola = document.getElementById("console");
    consola.innerText = "/> Carregant sistema...";
    // Utilitzem la funció global que ve del script de l'HTML
    pyodide = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
    });
    console.log("Pyodide llest!");
    consola.innerText = "/> Sistema llest. Benvingut programador/a.";

    // C) Carregar la primera prova
    carregarProva(editor);

    // D) Escoltar el botó RUN
    document.getElementById("run-btn").addEventListener("click", () => executarRepte(editor));
    motor.dibuixar()
}

// --- 2. GESTIÓ DE PROVES ---
function carregarProva(editor) {
    const dadesNivell = contingutNivells[nivellActual];
    const prova = dadesNivell.proves[provaActual];

    // Omplir la modal
    document.getElementById("theory-title").innerText = prova.titol_prova;
    document.getElementById("theory-explanation").innerHTML = prova.teoria;
    document.getElementById("theory-mission").innerText = prova.missio;

    // Mostrar la modal
    document.getElementById("theory-modal").style.display = "flex";

    
    // Actualitzar Barra de Progrés
    const totalProves = contingutNivells.length * 4;
    const progressat = (nivellActual * 4) + (provaActual + 1);
    const percentatge = (progressat / totalProves) * 100;
    document.querySelector(".progress-bar-fill").style.width = `${percentatge}%`;

    // Reset del Motor i Editor
    motor.reset(0, 0); // O les coordenades d'inici de la prova
    editor.setValue("# " + dadesNivell.titol + "\n");
}

// Escoltador per tancar la modal
document.getElementById("close-theory-btn").addEventListener("click", () => {
    document.getElementById("theory-modal").style.display = "none";
});

// --- 3. EXECUCIÓ I VALIDACIÓ ---
async function executarRepte(editor) {
    const codiAlumne = editor.getValue();
    const consola = document.getElementById("console");
    
    consola.innerText = "/> Executant...";

    try {
        // Generem el codi previ (la classe PersonatgePy)
        const codiPrevi = motor.generarCodiPrevi();
        
        // Executem a Pyodide
        await pyodide.runPythonAsync(codiPrevi + "\n" + codiAlumne);

        // Recuperem itinerari i estat final
        const heroiPy = pyodide.globals.get("heroi");
        const itinerari = heroiPy.itinerari.toJs();
        const posFinal = { x: heroiPy.x, y: heroiPy.y };

        // Animem el personatge
        await motor.animarMoviments(itinerari);

        // VALIDACIÓ PEDAGÒGICA
        validarProva(posFinal, codiAlumne);

    } catch (err) {
        consola.innerText = "/> ERROR: " + err.message;
    }
}

function validarProva(posFinal, codi) {
    const prova = contingutNivells[nivellActual].proves[provaActual];
    const consola = document.getElementById("console");

    // 1. Validació física (Ha arribat on tocava?)
    const haArribat = (posFinal.x === motor.objectiu.x && posFinal.y === motor.objectiu.y);

    // 2. Validació conceptual (Ha usat el que demanàvem?)
    // Per exemple, si estem al mòdul de bucles, comprovem si el codi té la paraula "for"
    const usaConcepte = prova.validarCodi ? prova.validarCodi(codi) : true;

    if (haArribat && usaConcepte) {
        consola.innerText = "/> EXCEL·LENT! Prova superada.";
        setTimeout(passarSegüentProva, 1500);
    } else {
        consola.innerText = "/> Intenta-ho de nou. " + (haArribat ? "Però recorda fer servir el concepte après!" : "No has arribat a l'objectiu.");
    }
}

function passarSegüentProva() {
    provaActual++;
    if (provaActual >= 4) {
        provaActual = 0;
        nivellActual++;
    }
    
    if (nivellActual < contingutNivells.length) {
        carregarProva();
    } else {
        alert("🎉 FELICITATS! Has completat tot el curs de Python!");
    }
}

// Iniciar tot
init();