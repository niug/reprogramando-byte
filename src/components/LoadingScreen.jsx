// src/components/LoadingScreen.jsx  ← crea aquest fitxer nou
export default function LoadingScreen({ message = "Cargando intérprete de Python" }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap');
        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes load     { 0%{width:0%} 60%{width:75%} 80%{width:82%} 100%{width:100%} }
        @keyframes ls-dots  { 0%{content:''} 25%{content:'.'} 50%{content:'..'} 75%{content:'...'} 100%{content:'...'} }
        @keyframes ls-pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes ls-fade  { from{opacity:0} to{opacity:1} }
        .ls-ring-svg  { animation: spin 2.4s linear infinite; }
        .ls-bar-fill  { animation: load 2.8s cubic-bezier(.4,0,.2,1) infinite; }
        .ls-sub::after { content: ''; animation: ls-dots 1.4s steps(4) infinite; }
        .ls-num       { animation: ls-pulse 2s ease-in-out infinite; }
        .ls-log       { animation: ls-fade .4s ease; }
      `}</style>

      <div style={{
        background: "#0a0d0f",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Gradient de fons */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 40%, rgba(0,255,230,.04) 0%, transparent 65%)",
          pointerEvents: "none"
        }} />

        {/* Cercle animat */}
        <div style={{ position: "relative", width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg className="ls-ring-svg"
            style={{ position: "absolute", top: 0, left: 0, width: 120, height: 120, filter: "drop-shadow(0 0 8px #00ffe6) drop-shadow(0 0 18px rgba(0,255,230,.4))" }}
            viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(0,255,230,0.08)" strokeWidth="2"/>
            <circle cx="60" cy="60" r="52" fill="none"
              stroke="#00ffe6" strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="245"
              strokeDashoffset="75"
              transform="rotate(-90 60 60)"/>
            <circle cx="60" cy="8" r="3.5" fill="#00ffe6" opacity="0.9"/>
          </svg>
          <div style={{
            width: 86, height: 86,
            border: "1px solid rgba(0,255,230,.12)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,255,230,.03)",
            boxShadow: "0 0 20px rgba(0,255,230,.08) inset"
          }}>
            <span className="ls-num" style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: 22, fontWeight: 700,
              color: "#00ffe6", letterSpacing: ".1em",
              textShadow: "0 0 10px rgba(0,255,230,.8)"
            }}>01</span>
          </div>
        </div>

        {/* Títol */}
        <div style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: 20, fontWeight: 700,
          color: "#00ffe6", letterSpacing: ".2em",
          textTransform: "uppercase",
          textShadow: "0 0 12px rgba(0,255,230,.5)",
          textAlign: "center"
        }}>
          Inicializando núcleo BYTE_OS
        </div>

        {/* Subtítol */}
        <div className="ls-sub" style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 13, color: "#00cc44",
          letterSpacing: ".12em",
          textShadow: "0 0 8px rgba(0,200,60,.5)"
        }}>
          {message}
        </div>

        {/* Barra de progrés */}
        <div style={{ width: 220, height: 4, background: "rgba(0,255,230,.08)" }}>
          <div className="ls-bar-fill" style={{
            height: "100%",
            background: "#00ffe6",
            boxShadow: "0 0 8px rgba(0,255,230,.8)"
          }} />
        </div>

        {/* Log del sistema */}
        <div className="ls-log" style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 10, color: "rgba(0,255,230,.3)",
          letterSpacing: ".1em"
        }}>
          ► Inicializando módulos del sistema...
        </div>
      </div>
    </>
  );
}