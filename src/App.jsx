import React, { useState, useEffect } from 'react';
import PantallaTeoria from './components/PantallaTeoria';
import PantallaJoc from './components/PantallaJoc';
import { contingutNivells } from './dades/nivells';

function App() {
  // --- ESTATS DE PROGRESSIÓ ---
  const [nivellActual, setNivellActual] = useState(0);
  const [provaActual, setProvaActual] = useState(0);
  const [fase, setFase] = useState('TEORIA'); // 'TEORIA' o 'JOC'
  
  // --- ESTAT DEL MOTOR PYTHON ---
  const [pyodideLlest, setPyodideLlest] = useState(false);
  const [errorPyodide, setErrorPyodide] = useState(null);

  // --- 1. CARREGA DE PYODIDE (Només un cop en obrir l'app) ---
  useEffect(() => {
    async function initPython() {
      try {
        // Accedim al loadPyodide que hem posat a l'index.html
        if (window.loadPyodide) {
          window.pyodide = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
          });
          setPyodideLlest(true);
          console.log("/> Núcleo de Python inyectado correctamente.");
        } else {
          throw new Error("No se ha encontrado el script de Pyodide en index.html");
        }
      } catch (err) {
        setErrorPyodide(err.message);
        console.error("Error cargando Pyodide:", err);
      }
    }
    initPython();
  }, []);

  // --- 2. GESTIÓ DE DADES ACTUALS ---
  const dadesNivell = contingutNivells[nivellActual];
  const dadesProva = dadesNivell.proves[provaActual];

  // --- 3. LÒGICA DE NAVEGACIÓ ---
  const alSuperarProva = () => {
    const esUltimaProvaDelNivell = provaActual === dadesNivell.proves.length - 1;
    const esUltimNivell = nivellActual === contingutNivells.length - 1;

    if (esUltimaProvaDelNivell) {
      if (esUltimNivell) {
        alert("FELICITATS! Has completado la huida de Byte!");
      } else {
        setNivellActual(prev => prev + 1);
        setProvaActual(0);
        setFase('TEORIA');
      }
    } else {
      setProvaActual(prev => prev + 1);
      setFase('TEORIA');
    }
  };

  // --- 4. RENDERITZAT CONDICIONAL ---
  if (errorPyodide) return <div className="error-fatal">Error de sistema: {errorPyodide}</div>;
  // Dins del return de App.jsx, substitueix la línia de "loading-screen" per aquesta:

  if (!pyodideLlest) {
    return (
      <div className="loading-screen">
        <div className="loader-container">
          {/* El logo girant: una representació visual d'un nucli de dades */}
          <div className="spinning-logo">
            <div className="inner-ring"></div>
            <div className="core">01</div>
          </div>
          <h2 className="loading-text">INICIALIZANDO NÚCLEO BYTE_OS</h2>
          <p className="loading-subtext">Cargando intérprete de Python...</p>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-main">
      {/* CAPÇALERA COMÚ (Sempre visible) */}
      <header className="game-header">
        <div className="brand">
          <span className="logo-icon">01</span>
          <div className="titles">
            <h1>REPROGRAMANDO LA HUIDA</h1>
            <h2>DE <span className="highlight">BYTE</span></h2>
          </div>
        </div>

        <div className="status-center">
          <div className="progress-info">
            <span>MOD {nivellActual + 1} | PRUEBA {provaActual + 1}</span>
            <span>{Math.round(((nivellActual * 4 + provaActual) / (contingutNivells.length * 4)) * 100)}%</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${((nivellActual * 4 + provaActual + 1) / (contingutNivells.length * 4)) * 100}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* CANVI DE PANTALLA SEGONS LA FASE */}
      <main className="game-content">
        {fase === 'TEORIA' ? (
          <PantallaTeoria 
            dades={dadesProva} 
            alComencar={() => setFase('JOC')} 
          />
        ) : (
          <PantallaJoc 
            dades={dadesProva} 
            alTornarTeoria={() => setFase('TEORIA')}
            alSuperar={alSuperarProva}
          />
        )}
      </main>
    </div>
  );
}

export default App;