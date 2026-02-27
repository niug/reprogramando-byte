import React from 'react';

export default function PantallaTeoria({ dades, alComencar }) {
  return (
    <div className="teoria-overlay">
      <div className="teoria-card">
        <header className="header-teoria">
          <span className="badge">BRIEFING DE MISIÓN</span>
          <h2>{dades.titol_prova}</h2>
        </header>

        <div className="teoria-content">
          <div className="text-section" dangerouslySetInnerHTML={{ __html: dades.teoria }} />
          
          <div className="missio-section">
            <h3>OBJETIVO:</h3>
            <p>{dades.missio}</p>
          </div>
        </div>

        <div className="footer-teoria">
          <button className="btn-start" onClick={alComencar}>
            INICIAR REPROGRAMACIÓN
          </button>
        </div>
      </div>
    </div>
  );
}