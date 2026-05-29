import { useParams, useNavigate } from "react-router-dom";
import { BLOCKS } from "../data/curriculum";

export default function Theory() {
  const { blockId } = useParams();
  const navigate = useNavigate();
  const block = BLOCKS.find(b => b.id === blockId);

  if (!block) return <div>Bloc no trobat</div>;

  const lines = block.theory.content.trim().split("\n");

  return (
    <div style={{
      background: "#0a0e1a",
      minHeight: "100vh",
      fontFamily: "'Rajdhani', sans-serif",
      color: "#c8d8f0",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Grid de fons */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(0,255,180,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,180,0.03) 1px,transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      {/* Header */}
      <header style={{
        background: "rgba(0,20,40,0.95)",
        borderBottom: "1px solid rgba(0,255,180,0.2)",
        padding: "14px 28px",
        display: "flex", alignItems: "center", gap: 14,
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <button onClick={() => navigate("/")} style={{
          color: "#00ffb4", fontFamily: "'Share Tech Mono',monospace",
          fontSize: 13, background: "none", border: "none", cursor: "pointer",
          opacity: 0.7, letterSpacing: "0.05em"
        }}>← INICI</button>
        <span style={{ color: "rgba(0,255,180,0.3)" }}>|</span>
        <span style={{
          fontFamily: "'Orbitron',monospace", fontSize: 13,
          color: "#00ffb4", letterSpacing: "0.1em", textTransform: "uppercase"
        }}>{block.icon} {block.title}</span>
        <span style={{
          marginLeft: "auto", fontFamily: "'Share Tech Mono',monospace",
          fontSize: 11, color: "rgba(0,255,180,0.5)", letterSpacing: "0.08em"
        }}>TEORIA · BLOC {BLOCKS.findIndex(b => b.id === blockId) + 1} / {BLOCKS.length}</span>
      </header>

      {/* Contingut */}
      <main style={{ maxWidth: 700, margin: "0 auto", padding: "36px 28px 48px" }}>

        {/* Tag */}
        <div style={{
          display: "inline-block",
          border: "1px solid rgba(0,255,180,0.4)",
          color: "#00ffb4", fontFamily: "'Share Tech Mono',monospace",
          fontSize: 10, letterSpacing: "0.15em", padding: "3px 10px",
          marginBottom: 14, textTransform: "uppercase"
        }}>BRIEFING DE MISSIÓ</div>

        {/* Títol */}
        <h1 style={{
          fontFamily: "'Orbitron',monospace", fontSize: 26, fontWeight: 700,
          color: "#e8f4ff", margin: "0 0 24px", letterSpacing: "0.03em", lineHeight: 1.2
        }}>{block.title}</h1>

        {/* Indicadors de reptes */}
        <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
          {block.challenges.map((_, i) => (
            <div key={i} style={{
              width: 28, height: 4, borderRadius: 2,
              background: "rgba(0,255,180,0.15)"
            }} />
          ))}
        </div>

        {/* Card de teoria */}
        <div style={{
          background: "rgba(5,15,35,0.85)",
          border: "1px solid rgba(0,255,180,0.15)",
          borderRadius: 4, padding: "24px 26px", marginBottom: 20,
          position: "relative"
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 1,
            background: "linear-gradient(90deg,#00ffb4,transparent)", opacity: 0.4
          }} />
          <TheoryContent content={block.theory.content} />
        </div>

        {/* Objectiu */}
        <div style={{
          background: "rgba(0,255,180,0.04)",
          border: "1px solid rgba(0,255,180,0.25)",
          borderLeft: "3px solid #00ffb4",
          borderRadius: 2, padding: "16px 20px", marginBottom: 28
        }}>
          <div style={{
            fontFamily: "'Orbitron',monospace", fontSize: 10,
            color: "#00ffb4", letterSpacing: "0.18em", marginBottom: 8
          }}>OBJECTIU:</div>
          <p style={{ fontSize: 15, color: "#c8d8f0", lineHeight: 1.6, margin: 0 }}>
            {block.challenges[0].description.split("\n")[0]}
          </p>
        </div>

        {/* Botó */}
        <button
          onClick={() => navigate(`/challenge/${blockId}/0`)}
          style={{
            display: "block", width: "100%",
            background: "#00ffb4", color: "#020c1b",
            fontFamily: "'Orbitron',monospace", fontSize: 13, fontWeight: 700,
            letterSpacing: "0.18em", textTransform: "uppercase",
            padding: 16, border: "none", cursor: "pointer",
            borderRadius: 2
          }}>
          INICIAR REPROGRAMACIÓ →
        </button>
      </main>

      {/* Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700&family=Rajdhani:wght@400;600&display=swap" rel="stylesheet" />
    </div>
  );
}

// Component per renderitzar el markdown de teoria
function TheoryContent({ content }) {
  const lines = content.trim().split("\n");
  const elements = [];
  let inCode = false;
  let codeLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("```")) {
      if (inCode) {
        elements.push(
          <div key={i} style={{
            background: "rgba(0,5,15,0.9)",
            border: "1px solid rgba(0,255,180,0.2)",
            borderLeft: "3px solid #00ffb4",
            borderRadius: 2, padding: "14px 16px", margin: "14px 0",
            fontFamily: "'Share Tech Mono',monospace", fontSize: 13,
            lineHeight: 1.8, color: "#7dffd0", overflowX: "auto"
          }}>
            {codeLines.map((l, j) => <div key={j}>{l || " "}</div>)}
          </div>
        );
        codeLines = [];
        inCode = false;
      } else { inCode = true; }
    } else if (inCode) {
      codeLines.push(line);
    } else if (line.startsWith("## ")) {
      elements.push(
        <div key={i} style={{
          fontFamily: "'Share Tech Mono',monospace", fontSize: 11,
          letterSpacing: "0.12em", color: "rgba(0,255,180,0.5)",
          textTransform: "uppercase", margin: "20px 0 10px"
        }}>// {line.replace("## ", "")}</div>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <div key={i} style={{
          fontFamily: "'Share Tech Mono',monospace", fontSize: 11,
          color: "rgba(0,255,180,0.4)", margin: "14px 0 6px", letterSpacing: "0.1em"
        }}>› {line.replace("### ", "")}</div>
      );
    } else if (line.startsWith("- ")) {
      elements.push(
        <div key={i} style={{ fontSize: 15, color: "#a0b8d8", lineHeight: 1.7, paddingLeft: 12, margin: "2px 0" }}>
          <span style={{ color: "#00ffb4", marginRight: 8 }}>›</span>
          {line.replace("- ", "").replace(/\*\*(.*?)\*\*/g, "$1")}
        </div>
      );
    } else if (line.trim()) {
      elements.push(
        <p key={i} style={{ fontSize: 15, lineHeight: 1.7, color: "#a0b8d8", margin: "6px 0" }}>
          {line}
        </p>
      );
    }
  }
  return <>{elements}</>;
}