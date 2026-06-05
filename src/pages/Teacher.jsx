import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, query, where, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { BLOCKS } from "../data/curriculum";

const C = "#00ffb4"; const BG2 = "#020810";
const MONO = "'Share Tech Mono', monospace"; const ORB = "'Orbitron', monospace";

export default function Teacher({ userData, user }) {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [groupStats, setGroupStats] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newGrup, setNewGrup] = useState("");
  const [newCurs, setNewCurs] = useState("");
  const [loading, setLoading] = useState(false);

  const totalChallenges = BLOCKS.reduce((a, b) => a + b.challenges.length, 0);

  const loadGroups = async () => {
    // Carrega grups creats per aquest professor
    const q = query(collection(db, "groups"), where("teacherId", "==", user.uid));
    const snap = await getDocs(q);
    const grps = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    setGroups(grps);

    // Per cada grup, carrega alumnes i calcula estadístiques
    const stats = {};
    for (const grp of grps) {
      const aq = query(collection(db, "users"),
        where("rol", "==", "alumne"),
        where("grup", "==", grp.nom));
      const aSnap = await getDocs(aq);
      const alumnes = aSnap.docs.map(d => d.data());

      const totalExecs = alumnes.reduce((acc, a) =>
        acc + Object.values(a.executionCount || {}).reduce((s, n) => s + n, 0), 0);

      const totalDone = alumnes.reduce((acc, a) => {
        let done = 0;
        for (const b of BLOCKS)
          for (const ch of b.challenges)
            if (a.progress?.[b.id]?.[ch.id]) done++;
        return acc + done;
      }, 0);

      const pct = alumnes.length > 0
        ? Math.round((totalDone / (alumnes.length * totalChallenges)) * 100) : 0;

      stats[grp.id] = { alumnes: alumnes.length, pct, executions: totalExecs };
    }
    setGroupStats(stats);
  };

  useEffect(() => { loadGroups(); }, []);

  const createGroup = async () => {
    if (!newGrup.trim()) return;
    setLoading(true);
    await addDoc(collection(db, "groups"), {
      nom: newGrup.trim().toUpperCase(),
      curs: newCurs.trim(),
      teacherId: user.uid,
      teacherNom: userData.nom,
      createdAt: serverTimestamp()
    });
    setNewGrup(""); setNewCurs("");
    setShowModal(false);
    await loadGroups();
    setLoading(false);
  };

  const globalPct = groups.length > 0
    ? Math.round(Object.values(groupStats).reduce((a, s) => a + s.pct, 0) / groups.length) : 0;
  const totalAlumnes = Object.values(groupStats).reduce((a, s) => a + s.alumnes, 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600&display=swap');
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        .cy-cursor{display:inline-block;width:6px;height:12px;background:#00ffb4;animation:blink 1s step-end infinite;vertical-align:middle;margin-left:2px}
        .t-group-card{background:rgba(2,8,16,.92);border:1px solid rgba(0,255,180,.18);position:relative;overflow:hidden;transition:border-color .2s;cursor:pointer}
        .t-group-card:hover{border-color:rgba(0,255,180,.5)!important}
        .t-modal-input:focus{border-color:#00ffb4!important;background:rgba(0,255,180,.07)!important}
        .t-modal-input::placeholder{color:rgba(0,255,180,.2)}
      `}</style>

      <div style={{ background: "#050d1a", minHeight: "100vh", fontFamily: "'Rajdhani',sans-serif", color: C, position: "relative" }}>
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", backgroundImage: `linear-gradient(rgba(0,255,180,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,180,.025) 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />

        {/* HEADER */}
        <header style={{ background: BG2, borderBottom: `1px solid rgba(0,255,180,.2)`, padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 9, color: "rgba(0,255,180,.4)", letterSpacing: ".18em" }}>// PANEL DE COMANDAMENT</div>
            <div style={{ fontFamily: ORB, fontSize: 20, fontWeight: 900, color: "#e8f4ff" }}>CODE<span style={{ color: C }}>QUEST</span></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: "rgba(0,255,180,.4)", letterSpacing: ".1em", border: `1px solid rgba(0,255,180,.2)`, padding: "4px 10px" }}>
              👨‍🏫 COMANDANT · {userData?.nom?.toUpperCase()}
            </div>
            <button onClick={() => signOut(auth)} style={{ fontFamily: MONO, fontSize: 10, color: "rgba(0,255,180,.35)", background: "none", border: `1px solid rgba(0,255,180,.15)`, padding: "4px 10px", cursor: "pointer", letterSpacing: ".08em" }}>
              DESCONNECTAR
            </button>
          </div>
        </header>

        <main style={{ position: "relative", zIndex: 1, padding: "28px" }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: "rgba(0,255,180,.4)", letterSpacing: ".18em", marginBottom: 4 }}>// VISIÓ GLOBAL DEL SISTEMA</div>
          <div style={{ fontFamily: ORB, fontSize: 22, fontWeight: 700, color: "#e8f4ff", marginBottom: 18 }}>
            CENTRE DE CONTROL <span className="cy-cursor" />
          </div>

          {/* Stats globals */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 28 }}>
            {[
              { val: groups.length, label: "GRUPS ACTIUS" },
              { val: totalAlumnes, label: "AGENTS TOTALS" },
              { val: `${globalPct}%`, label: "ASSOLIMENT GLOBAL" },
            ].map(({ val, label }) => (
              <div key={label} style={{ background: "rgba(2,8,16,.9)", border: `1px solid rgba(0,255,180,.15)`, padding: "14px 18px", position: "relative" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,#00ffb4,transparent)", opacity: .5 }} />
                <div style={{ fontFamily: ORB, fontSize: 26, fontWeight: 900, color: C }}>{val}</div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: "rgba(0,255,180,.4)", letterSpacing: ".1em", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Capçalera grups */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontFamily: ORB, fontSize: 13, color: "#e8f4ff", letterSpacing: ".08em" }}>// GRUPS D'AGENTS</div>
            <button onClick={() => setShowModal(true)} style={{ background: C, color: "#020c1b", fontFamily: ORB, fontSize: 10, fontWeight: 700, letterSpacing: ".14em", border: "none", padding: "9px 16px", cursor: "pointer" }}>
              + CREAR NOU GRUP
            </button>
          </div>

          {/* Grid de grups */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
            {groups.map(grp => {
              const st = groupStats[grp.id] || { alumnes: 0, pct: 0, executions: 0 };
              return (
                <div key={grp.id} className="t-group-card" onClick={() => navigate(`/teacher/group/${grp.id}`)}>
                  <div style={{ height: 2, background: `linear-gradient(90deg,${C},transparent)` }} />
                  <div style={{ padding: "16px 18px" }}>
                    <div style={{ fontFamily: MONO, fontSize: 9, color: "rgba(0,255,180,.4)", letterSpacing: ".15em", marginBottom: 6 }}>
                      // GRUP ACTIU · {grp.curs || "2025-26"}
                    </div>
                    <div style={{ fontFamily: ORB, fontSize: 18, fontWeight: 700, color: "#e8f4ff", letterSpacing: ".06em", marginBottom: 12 }}>
                      {grp.nom}
                    </div>
                    <div style={{ display: "flex", gap: 20, marginBottom: 12 }}>
                      {[
                        { v: st.alumnes, l: "AGENTS" },
                        { v: `${st.pct}%`, l: "ASSOLIMENT" },
                        { v: st.executions, l: "EXECUCIONS" },
                      ].map(({ v, l }) => (
                        <div key={l}>
                          <div style={{ fontFamily: ORB, fontSize: 18, fontWeight: 700, color: C }}>{v}</div>
                          <div style={{ fontFamily: MONO, fontSize: 9, color: "rgba(0,255,180,.35)", letterSpacing: ".1em" }}>{l}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ height: 3, background: "rgba(0,255,180,.1)", marginBottom: 10 }}>
                      <div style={{ height: "100%", background: C, width: `${st.pct}%`, transition: "width .6s" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: MONO, fontSize: 10, color: C, border: `1px solid rgba(0,255,180,.3)`, padding: "3px 10px" }}>
                        VEURE DETALL →
                      </span>
                      <span style={{ fontFamily: MONO, fontSize: 10, color: "rgba(0,255,180,.4)" }}>
                        {st.alumnes} agents registrats
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Card placeholder */}
            <div onClick={() => setShowModal(true)} style={{
              background: "rgba(2,8,16,.5)", border: `1px dashed rgba(0,255,180,.15)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              minHeight: 160, cursor: "pointer", transition: "border-color .2s"
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,255,180,.35)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(0,255,180,.15)"}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: ORB, fontSize: 32, color: "rgba(0,255,180,.25)", marginBottom: 8 }}>+</div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: "rgba(0,255,180,.3)", letterSpacing: ".12em" }}>CREAR NOU GRUP</div>
              </div>
            </div>
          </div>
        </main>

        {/* MODAL crear grup */}
        {showModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(2,8,16,.92)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 380, background: BG2, border: `1px solid rgba(0,255,180,.3)`, padding: 28, position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: C }} />
              <div style={{ fontFamily: ORB, fontSize: 14, fontWeight: 700, color: "#e8f4ff", letterSpacing: ".08em", marginBottom: 20 }}>
                // CREAR NOU GRUP D'AGENTS
              </div>
              <label style={{ fontFamily: MONO, fontSize: 10, color: "rgba(0,255,180,.45)", letterSpacing: ".12em", display: "block", marginBottom: 5 }}>NOM DEL GRUP</label>
              <input className="t-modal-input"
                value={newGrup} onChange={e => setNewGrup(e.target.value)}
                placeholder="ex: DAW2A"
                style={{ width: "100%", background: "rgba(0,255,180,.04)", border: `1px solid rgba(0,255,180,.2)`, color: "#e8f4ff", fontFamily: MONO, fontSize: 13, padding: "10px 12px", outline: "none", marginBottom: 14 }} />
              <label style={{ fontFamily: MONO, fontSize: 10, color: "rgba(0,255,180,.45)", letterSpacing: ".12em", display: "block", marginBottom: 5 }}>CURS / DESCRIPCIÓ</label>
              <input className="t-modal-input"
                value={newCurs} onChange={e => setNewCurs(e.target.value)}
                placeholder="ex: 2025-26"
                style={{ width: "100%", background: "rgba(0,255,180,.04)", border: `1px solid rgba(0,255,180,.2)`, color: "#e8f4ff", fontFamily: MONO, fontSize: 13, padding: "10px 12px", outline: "none", marginBottom: 20 }} />
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, background: "none", border: `1px solid rgba(0,255,180,.2)`, color: "rgba(0,255,180,.5)", fontFamily: MONO, fontSize: 10, padding: 11, cursor: "pointer", letterSpacing: ".08em" }}>
                  CANCEL·LAR
                </button>
                <button onClick={createGroup} disabled={loading} style={{ flex: 1, background: C, color: "#020c1b", fontFamily: ORB, fontSize: 10, fontWeight: 700, letterSpacing: ".14em", border: "none", padding: 11, cursor: "pointer" }}>
                  {loading ? "CREANT..." : "CREAR GRUP →"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}