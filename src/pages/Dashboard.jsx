import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { BLOCKS } from "../data/curriculum";

const C = "#00ffb4";
const BG = "#050d1a";
const BG2 = "#020810";
const MONO = "'Share Tech Mono', monospace";
const ORB = "'Orbitron', monospace";

export default function Dashboard({ userData, user }) {
  const navigate = useNavigate();

  const getBlockProgress = (blockId) => {
    const bp = userData?.progress?.[blockId] || {};
    const block = BLOCKS.find(b => b.id === blockId);
    const completed = block.challenges.filter(c => bp[c.id]).length;
    return { completed, total: block.challenges.length };
  };

  const totalCompleted = BLOCKS.reduce((acc, b) => acc + getBlockProgress(b.id).completed, 0);
  const totalChallenges = BLOCKS.reduce((acc, b) => acc + b.challenges.length, 0);
  const globalPct = Math.round((totalCompleted / totalChallenges) * 100);

  const isPrevComplete = (idx) => {
    if (idx === 0) return true;
    const prev = BLOCKS[idx - 1];
    const { completed, total } = getBlockProgress(prev.id);
    return completed === total;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .cy-cursor { display:inline-block; width:6px; height:12px; background:#00ffb4; animation:blink 1s step-end infinite; vertical-align:middle; margin-left:2px; }
        .db-card { transition: border-color .2s; }
        .db-card:hover:not(.db-locked) { border-color: rgba(0,255,180,0.5) !important; }
        .db-btn-main:hover { opacity: .88; }
        .db-logout:hover { color:#00ffb4 !important; border-color:rgba(0,255,180,0.4) !important; }
      `}</style>

      <div style={{ background: BG, minHeight: "100vh", fontFamily: "'Rajdhani',sans-serif", color: C, position: "relative", overflow: "hidden" }}>

        {/* Fons graella */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", backgroundImage: `linear-gradient(rgba(0,255,180,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,180,0.025) 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />

        {/* HEADER */}
        <header style={{ background: BG2, borderBottom: `1px solid rgba(0,255,180,0.2)`, padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 9, color: "rgba(0,255,180,0.4)", letterSpacing: ".18em" }}>// HUB D'OPERACIONS</div>
            <div style={{ fontFamily: ORB, fontSize: 20, fontWeight: 900, color: "#e8f4ff", letterSpacing: ".06em" }}>
              CODE<span style={{ color: C }}>QUEST</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: MONO, fontSize: 9, color: "rgba(0,255,180,0.35)", letterSpacing: ".12em" }}>AGENT ACTIU</div>
              <div style={{ fontFamily: ORB, fontSize: 12, color: C, letterSpacing: ".1em" }}>
                {(userData?.nom || "AGENT").toUpperCase().replace(" ", "_")}
              </div>
              {userData?.grup && (
                <div style={{ fontFamily: MONO, fontSize: 10, color: "rgba(0,255,180,0.4)" }}>UNITAT: {userData.grup}</div>
              )}
            </div>
            <button
              className="db-logout"
              onClick={() => signOut(auth)}
              style={{ fontFamily: MONO, fontSize: 10, color: "rgba(0,255,180,0.35)", background: "none", border: `1px solid rgba(0,255,180,0.15)`, padding: "5px 12px", cursor: "pointer", letterSpacing: ".08em" }}>
              DESCONNECTAR
            </button>
          </div>
        </header>

        {/* MAIN */}
        <main style={{ position: "relative", zIndex: 1, padding: "28px 28px 40px" }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: "rgba(0,255,180,0.4)", letterSpacing: ".18em", marginBottom: 4 }}>// PANELL DE MISSIONS</div>
          <div style={{ fontFamily: ORB, fontSize: 22, fontWeight: 700, color: "#e8f4ff", letterSpacing: ".04em", marginBottom: 4 }}>SELECCIONA EL TEU MÒDUL</div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: "rgba(0,255,180,0.35)", letterSpacing: ".08em", marginBottom: 24 }}>
            COMPLETA ELS REPTES PER DESBLOQUEJAR EL SEGÜENT MÒDUL <span className="cy-cursor" />
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 28 }}>
            {[
              { val: totalCompleted, label: "REPTES COMPLETATS" },
              { val: totalChallenges, label: "TOTAL DE REPTES" },
              { val: `${globalPct}%`, label: "PROGRÉS GLOBAL" },
            ].map(({ val, label }) => (
              <div key={label} style={{ background: "rgba(2,8,16,0.9)", border: `1px solid rgba(0,255,180,0.15)`, padding: "14px 18px", position: "relative" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,#00ffb4,transparent)", opacity: .5 }} />
                <div style={{ fontFamily: ORB, fontSize: 26, fontWeight: 900, color: C }}>{val}</div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: "rgba(0,255,180,0.4)", letterSpacing: ".1em", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Cards de blocs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
            {BLOCKS.map((block, idx) => {
              const { completed, total } = getBlockProgress(block.id);
              const unlocked = isPrevComplete(idx);
              const isDone = completed === total;
              const pct = Math.round((completed / total) * 100);

              return (
                <div key={block.id} className={`db-card ${!unlocked ? "db-locked" : ""}`} style={{
                  background: "rgba(2,8,16,0.92)",
                  border: `1px solid ${unlocked ? "rgba(0,255,180,0.2)" : "rgba(0,255,180,0.08)"}`,
                  position: "relative", overflow: "hidden",
                  opacity: !unlocked ? 0.45 : 1
                }}>
                  {/* Línia de color superior */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: isDone ? C : unlocked ? "rgba(0,255,180,0.4)" : "rgba(0,255,180,0.1)" }} />

                  {/* Header */}
                  <div style={{ padding: "18px 20px 14px", borderBottom: `1px solid rgba(0,255,180,0.1)` }}>
                    <div style={{ fontFamily: MONO, fontSize: 9, color: "rgba(0,255,180,0.4)", letterSpacing: ".15em", marginBottom: 6 }}>
                      // MÒDUL {String(idx + 1).padStart(2, "0")} · {isDone ? "COMPLETAT" : unlocked ? "DISPONIBLE" : "BLOQUEJAT"}
                    </div>
                    <div style={{ fontFamily: ORB, fontSize: 13, fontWeight: 700, color: "#e8f4ff", letterSpacing: ".05em" }}>
                      {block.icon} {block.title.toUpperCase()}
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: "14px 20px 18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                      <span style={{ fontFamily: MONO, fontSize: 10, color: "rgba(0,255,180,0.4)", letterSpacing: ".08em" }}>PROGRÉS</span>
                      <span style={{ fontFamily: MONO, fontSize: 11, color: C }}>{completed} / {total}</span>
                    </div>
                    <div style={{ height: 3, background: "rgba(0,255,180,0.1)", marginBottom: 14 }}>
                      <div style={{ height: "100%", background: C, width: `${pct}%`, transition: "width .6s" }} />
                    </div>

                    {/* Indicadors de proves */}
                    <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                      {block.challenges.map((ch, ci) => {
                        const done = userData?.progress?.[block.id]?.[ch.id];
                        return (
                          <div key={ci} style={{
                            flex: 1, height: 28,
                            border: `1px solid ${done ? C : unlocked ? "rgba(0,255,180,0.2)" : "rgba(0,255,180,0.1)"}`,
                            borderStyle: unlocked ? "solid" : "dashed",
                            background: done ? "rgba(0,255,180,0.12)" : "transparent",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: MONO, fontSize: 10,
                            color: done ? C : "rgba(0,255,180,0.3)"
                          }}>
                            {done ? `P${ci + 1} ✓` : `P${ci + 1}`}
                          </div>
                        );
                      })}
                    </div>

                    {/* Botó */}
                    {!unlocked ? (
                      <button style={{ width: "100%", background: "transparent", border: `1px dashed rgba(0,255,180,0.15)`, color: "rgba(0,255,180,0.25)", fontFamily: ORB, fontSize: 10, fontWeight: 700, letterSpacing: ".14em", padding: 10, cursor: "not-allowed" }}>
                        🔒 COMPLETA EL MÒDUL ANTERIOR
                      </button>
                    ) : isDone ? (
                      <button style={{ width: "100%", background: "transparent", border: `1px solid rgba(0,255,180,0.3)`, color: "rgba(0,255,180,0.5)", fontFamily: ORB, fontSize: 10, fontWeight: 700, letterSpacing: ".14em", padding: 10, cursor: "default" }}>
                        ✓ MÒDUL COMPLETAT
                      </button>
                    ) : (
                      <button
                        className="db-btn-main"
                        onClick={() => navigate(`/theory/${block.id}`)}
                        style={{ width: "100%", background: C, color: "#020c1b", fontFamily: ORB, fontSize: 10, fontWeight: 700, letterSpacing: ".16em", border: "none", padding: 10, cursor: "pointer" }}>
                        {completed === 0 ? "INICIAR MÒDUL →" : "CONTINUAR MÒDUL →"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* FOOTER */}
        <footer style={{ position: "relative", zIndex: 1, borderTop: `1px solid rgba(0,255,180,0.1)`, padding: "10px 28px", fontFamily: MONO, fontSize: 10, color: "rgba(0,255,180,0.25)", letterSpacing: ".08em", display: "flex", justifyContent: "space-between" }}>
          <span>ByteOS v11.4 · SISTEMA OPERATIU EN LÍNIA</span>
          <span>AGENT CONNECTAT · <span style={{ color: C }}>SESSIÓ ACTIVA</span></span>
        </footer>
      </div>
    </>
  );
}