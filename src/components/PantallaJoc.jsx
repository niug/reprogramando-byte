import React, { useEffect, useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { MotorJoc } from '../motor/motorJoc';

export default function PantallaJoc({ dades, alTornarTeoria, alSuperar }) {
  const canvasRef = useRef(null);
  const motorRef = useRef(null);
  const [codi, setCodi] = useState("# Reprograma Byte aquí...\n\n\n");
  const [consola, setConsola] = useState("/> Sistema operativo ByteOS v11.4. Esperando órdenes...");
  const scrollRef = useRef(null); // 1. Creem la referència
  const [executant, setExecutant] = useState(false);

  // Inicialització del Motor Visual
  useEffect(() => {
    if (canvasRef.current && !motorRef.current) {
      motorRef.current = new MotorJoc(canvasRef.current);
      motorRef.current.dibuixar();
    }
  }, []);

  const executarCodi = async () => {
    if (executant) return;
    setExecutant(true);
    
    // 1. Netegem la consola i preparem un acumulador de text
    let sortidaAcumulada = "";
    setConsola("/> Inicializando ejecución...\n");

    try {
        const py = window.pyodide;

        // 2. Redirigim el 'stdout' (els prints) a una funció de JS
        py.setStdout({
        batched: (text) => {
            sortidaAcumulada += text + "\n";
            setConsola((prev) => prev + "/> " + text + "\n");
        }
        });

        const codiPrevi = motorRef.current.generarCodiPrevi();
        
        // 3. Executem el codi
        await py.runPythonAsync(codiPrevi + "\n" + codi);
        
        // 4. Lògica del robot (moviments)
        const heroiPy = py.globals.get("heroi");
        const itinerari = heroiPy.itinerari.toJs();
        await motorRef.current.animarMoviments(itinerari);

        // Validació final
        if (dades.validarCodi(codi)) {
        setConsola((prev) => prev + "\n/> ✅ GENIAL: Misión completada.");
        setTimeout(alSuperar, 1500);
        }

    } catch (err) {
        // Si hi ha un error de sintaxi a Python, també el veurem a la consola
        setConsola((prev) => prev + `\n/> ⚠️ ERROR: ${err.message}`);
    } finally {
        setExecutant(false);
    }
    };

  return (
    <div className="game-screen">
      <div className="workspace">
        
        {/* COLUMNA 1: EDITOR (Més estreta per focalitzar el codi) */}
        <section className="editor-column">
            <div className="panel-header">
                <span>TERMINAL DE INYECCIÓN</span>
                <button className="btn-back" onClick={alTornarTeoria}>TEORIA</button>
            </div>
            
            <div className="editor-wrapper"> {/* Nou contenidor relatiu */}
                <div className="editor-container">
                <CodeMirror
                    value={codi}
                    height="100%"
                    theme={dracula}
                    extensions={[python()]}
                    onChange={(val) => setCodi(val)}
                />
                </div>
                
                {/* El botó ara està dins del wrapper per poder-lo posicionar */}
                <button 
                className={`run-button-floating ${executant ? 'disabled' : ''}`} 
                onClick={executarCodi}
                >
                {executant ? "PROCESANDO..." : "EJECUTAR SCRIPT"}
                </button>
            </div>
        </section>

        {/* COLUMNA 2: VISUALITZACIÓ (Més grossa) */}
        <section className="visual-column">
          <div className="panel-header">MAPA DEL SECTOR - VISUALIZACIÓN EN TIEMPO REAL</div>
          <div className="canvas-wrapper">
            <canvas 
                ref={canvasRef} 
                width="500" 
                height="500" 
                style={{ width: '100%', height: 'auto', maxWidth: '500px' }}
                ></canvas>
          </div>
          <div className="mission-reminder">
             <strong>OBJETIVO:</strong> {dades.missio}
          </div>
        </section>

      </div>

      {/* PEU DE PÀGINA: CONSOLA */}
      <footer className="console-footer">
        <div className="console-header">
          <span className="console-title">SALIDA DEL SISTEMA</span>
        </div>
        
        <div className="console-content">
          <pre className="console-log">{consola}</pre>
          {/* 3. Aquest div buit marca el final del contingut */}
          <div ref={scrollRef} />
        </div>
      </footer>
    </div>
  );
}