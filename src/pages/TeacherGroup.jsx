import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useParams, useNavigate } from "react-router-dom";
import { BLOCKS } from "../data/curriculum";

const C = "#00ffb4"; const BG2 = "#020810";
const MONO = "'Share Tech Mono', monospace"; const ORB = "'Orbitron', monospace";

export default function TeacherGroup() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [alumnes, setAlumnes] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalChallenges = BLOCKS.reduce((a, b) => a + b.challenges.length, 0);

  useEffect(() => {
    const load = async () => {
      const gSnap = await getDoc(doc(db, "groups", groupId));
      if (!gSnap.exists()) return;
      const grp = { id: gSnap.id, ...gSnap.data() };
      setGroup(grp);

      const aq = query(collection(db, "users"),
        where("rol", "==", "alumne"),
        where("grup", "==", grp.nom));
      const aSnap = await getDocs(aq);
      setAlumnes(aSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    load();
  }, [groupId]);

  const getChallengeStatus = (alumne, blockId, challengeId) => {
    return alumne.progress?.[blockId]?.[challengeId] || false;
  };

  const getExecCount = (alumne, challengeId) => {
    return alumne.executionCount?.[challengeId] || 0;
  };

  const getTotalProgress = (alumne) => {
    let done = 0;
    for (const b of BLOCKS) for (const ch of b.challenges)
      if (alumne.progress?.[b.id]?.[ch.id]) done++;
    return { done, pct: Math.round((done / totalChallenges) * 100) };
  };

  if (loading) return (
    <div style={{ background: "#050d1a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: ORB, color: C, fontSize: 14, letterSpacing: ".1em" }}>CARREGANT DADES...</div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600&display=swap');
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        .cy-cursor{display:inline-block;width:6px;height:12px;background:#00ffb4;animation:blink 1s step-end infinite;vertical-align:middle;margin-left:2px}
        .tg-table{width:100%;border-collapse:collapse}
        .tg-table th{font-family:'Share Tech Mono',monospace;font-size:9px;color:rgba(0,255,180,.45);letter-spacing:.12em;padding:8px 10px;border-bottom:1px solid rgba(0,255,180,.15);text-align:center;white-space:nowrap;text-transform:uppercase}
        .tg-table th.col-agent{text-align:left}
        .tg-table td{padding:7px 10px;border-bottom:1px solid rgba(0,255,180,.07);text-align:center;vertical-align:middle}
        .tg-table tr:hover td{background:rgba(0,255,180,.03)}
        .tg-done{color:#00ffb4;font-size:12px}
        .tg-pend{color:rgba(0,255,180,.2);font-size:12px}
        .tg-execs{font-family:'Share Tech Mono',monospace;font-size:10px;color:rgba(0,255,180,.4)}
        .tg-block-header th{background:rgba(0,255,180,.05);font-family:'Orbitron',monospace!important;font-size:9px!important;color:rgba(0,255,180,.6)!important;letter-spacing:.1em!important;border-bottom:1px solid rgba(0,255,180,.2)!important}
      `}</style>

      <div style={{ background: "#050d1a", minHeight: "100vh", fontFamily: "'Rajdhani',sans-serif", color: C, position: "relative" }}>
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", backgroundImage: `linear-gradient(rgba(0,255,180,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,180,.025) 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />

        {/* HEADER */}
        <header style={{ background: BG2, borderBottom: `1px solid rgba(0,255,180,.2)`, padding: "12px 28px", display: "flex", alignItems: "center", gap: 16, position: "relative", zIndex: 1 }}>
          <button onClick={() => navigate("/teacher")} style={{ fontFamily: MONO, fontSize: 10, color: "rgba(0,255,180,.5)", background: "none", border: `1px solid rgba(0,255,180,.15)`, padding: "4px 10px", cursor: "pointer", letterSpacing: ".08em" }}>
            ← VOLVER
          </button>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: ORB,
              fontSize: 10,
              fontWeight: 700,
              color: C,
              letterSpacing: ".18em",
            }}>REPROGRAMANDO</div>
            <div style={{
              fontFamily: ORB,
              fontSize: 18,
              fontWeight: 900,
              color: "#e8f4ff",
              letterSpacing: ".06em",
            }}>
              BYTE
            </div>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: "rgba(0,255,180,.4)", border: `1px solid rgba(0,255,180,.15)`, padding: "4px 10px" }}>
            {alumnes.length} AGENTES · {group?.curs}
          </div>
        </header>

        <main style={{ position: "relative", zIndex: 1, padding: "24px 28px" }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: "rgba(0,255,180,.4)", letterSpacing: ".18em", marginBottom: 4 }}>// VISIÓN DETALLADA DEL GRUPO</div>
          <div style={{ fontFamily: ORB, fontSize: 22, fontWeight: 700, color: "#e8f4ff", marginBottom: 18 }}>
            CONTROL DEL GRUPO  ::  {group?.nom} <span className="cy-cursor" />
          </div>
          {/* Stats del grup */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 24 }}>
            {(() => {
              const totalDone = alumnes.reduce((a, al) => a + getTotalProgress(al).done, 0);
              const avgPct = alumnes.length > 0
                ? Math.round(alumnes.reduce((a, al) => a + getTotalProgress(al).pct, 0) / alumnes.length) : 0;
              const totalExecs = alumnes.reduce((a, al) =>
                a + Object.values(al.executionCount || {}).reduce((s, n) => s + n, 0), 0);
              const completed100 = alumnes.filter(al => getTotalProgress(al).pct === 100).length;
              return [
                { v: alumnes.length, l: "AGENTES" },
                { v: `${avgPct}%`, l: "AVANCE MEDIANO" },
                { v: totalExecs, l: "EJECUCIONES TOTALES" },
                { v: completed100, l: "AGENTES AL 100%" },
              ].map(({ v, l }) => (
                <div key={l} style={{ background: "rgba(2,8,16,.9)", border: `1px solid rgba(0,255,180,.15)`, padding: "12px 16px", position: "relative" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,#00ffb4,transparent)", opacity: .5 }} />
                  <div style={{ fontFamily: ORB, fontSize: 22, fontWeight: 900, color: C }}>{v}</div>
                  <div style={{ fontFamily: MONO, fontSize: 9, color: "rgba(0,255,180,.4)", letterSpacing: ".1em", marginTop: 2 }}>{l}</div>
                </div>
              ));
            })()}
          </div>

          {/* Taula */}
          <div style={{ background: "rgba(2,8,16,.92)", border: `1px solid rgba(0,255,180,.18)`, overflow: "auto", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${C},transparent)` }} />
            <table className="tg-table">
              <thead>
                {/* Capçalera blocs */}
                <tr className="tg-block-header">
                  <th style={{ textAlign: "left", padding: "10px 14px", minWidth: 160 }}>AGENTE</th>
                  <th style={{ textAlign: "center" }}>%</th>
                  {BLOCKS.map(b => (
                    <th key={b.id} colSpan={b.challenges.length + 1} style={{ padding: "8px 0" }}>
                      {b.icon} {b.title.toUpperCase()}
                    </th>
                  ))}
                </tr>
                {/* Capçalera activitats */}
                <tr>
                  <th className="col-agent" style={{ textAlign: "left", minWidth: 160 }}>NOMBRE</th>
                  <th>GLOBAL</th>
                  {BLOCKS.map(b => (
                    <>
                      {b.challenges.map((ch, ci) => (
                        <th key={ch.id}>P{ci + 1}<br />
                          <span style={{ fontSize: 8, opacity: .6, letterSpacing: 0 }}>ejec</span>
                        </th>
                      ))}
                      <th key={`${b.id}-pct`} style={{ color: "rgba(0,255,180,.6)" }}>%</th>
                    </>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alumnes.length === 0 ? (
                  <tr>
                    <td colSpan={2 + BLOCKS.reduce((a, b) => a + b.challenges.length + 1, 0)}
                      style={{ fontFamily: MONO, fontSize: 11, color: "rgba(0,255,180,.3)", padding: "28px", textAlign: "center" }}>
                      Cap agent registrat en aquest grup
                    </td>
                  </tr>
                ) : alumnes.map(al => {
                  const { done, pct } = getTotalProgress(al);
                  return (
                    <tr key={al.id}>
                      {/* Nom agent */}
                      <td style={{ textAlign: "left" }}>
                        <div style={{ fontFamily: ORB, fontSize: 11, color: "#e8f4ff", letterSpacing: ".06em" }}>
                          {al.nom?.toUpperCase().replace(" ", "_")}
                        </div>
                        <div style={{ fontFamily: MONO, fontSize: 9, color: "rgba(0,255,180,.35)" }}>{al.email}</div>
                      </td>
                      {/* % Global */}
                      <td>
                        <div style={{ fontFamily: ORB, fontSize: 13, color: pct === 100 ? C : pct > 50 ? "#e8f4ff" : "rgba(0,255,180,.5)", fontWeight: 700 }}>{pct}%</div>
                        <div style={{ height: 2, background: "rgba(0,255,180,.1)", marginTop: 3, width: 40, margin: "3px auto 0" }}>
                          <div style={{ height: "100%", background: C, width: `${pct}%` }} />
                        </div>
                      </td>
                      {/* Per bloc i repte */}
                      {BLOCKS.map(b => {
                        const blockDone = b.challenges.filter(ch => getChallengeStatus(al, b.id, ch.id)).length;
                        const blockPct = Math.round((blockDone / b.challenges.length) * 100);
                        return (
                          <>
                            {b.challenges.map(ch => {
                              const done = getChallengeStatus(al, b.id, ch.id);
                              const execs = getExecCount(al, ch.id);
                              return (
                                <td key={ch.id} title={ch.title}>
                                  <div className={done ? "tg-done" : "tg-pend"}>
                                    {done ? "✓" : "-"}
                                  </div>
                                  <div className="tg-execs">{execs > 0 ? execs : ""}</div>
                                </td>
                              );
                            })}
                            <td key={`${b.id}-pct`}>
                              <span style={{ fontFamily: MONO, fontSize: 10, color: blockPct === 100 ? C : "rgba(0,255,180,.4)" }}>
                                {blockPct}%
                              </span>
                            </td>
                          </>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Llegenda */}
          <div style={{ marginTop: 12, display: "flex", gap: 20 }}>
            {[["✓", "Reto completado"], ["-", "Pendiente"], ["12", "Nº de ejecuciones"]].map(([sym, label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: MONO, fontSize: 10, color: "rgba(0,255,180,.35)" }}>
                <span style={{ color: sym === "✓" ? C : "rgba(0,255,180,.3)" }}>{sym}</span> {label}
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}