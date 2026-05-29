import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const C = "#00ffb4";
const BG = "#050d1a";
const BG2 = "#020810";
const MONO = "'Share Tech Mono', monospace";
const ORB = "'Orbitron', monospace";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [rol, setRol] = useState("alumne");
  const [grup, setGrup] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email || !password || (mode === "register" && !nom)) {
      setError("ERROR: Tots els camps obligatoris han d'estar plens.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "register") {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await setDoc(doc(db, "users", cred.user.uid), {
          nom,
          email,
          rol,
          grup,
          progress: {},
          executionCount: {},
          executions: {},
          createdAt: new Date().toISOString(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (e) {
      const msgs = {
        "auth/user-not-found": "ERROR: Agent no trobat al registre.",
        "auth/wrong-password": "ERROR: Clau d'accés incorrecta.",
        "auth/email-already-in-use": "ERROR: Identificador ja registrat.",
        "auth/weak-password":
          "ERROR: La clau d'accés és massa feble (mínim 6 caràcters).",
        "auth/invalid-email": "ERROR: Format d'identificador invàlid.",
      };
      setError(msgs[e.code] || `ERROR: ${e.message}`);
    }
    setLoading(false);
  };

  const S = {
    root: {
      minHeight: "100vh",
      background: BG,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Rajdhani', sans-serif",
      position: "relative",
      overflow: "hidden",
    },
    bgGrid: {
      position: "fixed",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: `linear-gradient(rgba(0,255,180,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,180,0.025) 1px,transparent 1px)`,
      backgroundSize: "40px 40px",
    },
    scanLine: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: 2,
      background: "rgba(0,255,180,0.12)",
      animation: "scan 4s linear infinite",
    },
    box: {
      position: "relative",
      width: 420,
      border: "1px solid rgba(0,255,180,0.25)",
      background: "rgba(2,8,16,0.97)",
      padding: "36px 36px 32px",
      zIndex: 1,
    },
    topLine: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 2,
      background: "linear-gradient(90deg,#00ffb4,transparent)",
    },
    bottomLine: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 1,
      background: "linear-gradient(90deg,transparent,rgba(0,255,180,0.3))",
    },
    tag: {
      fontFamily: MONO,
      fontSize: 10,
      color: "rgba(0,255,180,0.45)",
      letterSpacing: ".18em",
      marginBottom: 10,
      textTransform: "uppercase",
    },
    title: {
      fontFamily: ORB,
      fontSize: 28,
      fontWeight: 900,
      color: "#e8f4ff",
      letterSpacing: ".06em",
      marginBottom: 2,
    },
    sub: {
      fontFamily: MONO,
      fontSize: 11,
      color: "rgba(0,255,180,0.4)",
      letterSpacing: ".1em",
      marginBottom: 28,
    },
    tabs: {
      display: "flex",
      marginBottom: 24,
      border: "1px solid rgba(0,255,180,0.2)",
    },
    tab: (active) => ({
      flex: 1,
      padding: "9px 0",
      fontFamily: ORB,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: ".12em",
      textAlign: "center",
      cursor: "pointer",
      background: "none",
      border: "none",
      color: active ? C : "rgba(0,255,180,0.35)",
      backgroundColor: active ? "rgba(0,255,180,0.08)" : "transparent",
      borderBottom: active ? `2px solid ${C}` : "2px solid transparent",
      textTransform: "uppercase",
      transition: "all .15s",
    }),
    field: { marginBottom: 14 },
    label: {
      fontFamily: MONO,
      fontSize: 10,
      color: "rgba(0,255,180,0.45)",
      letterSpacing: ".12em",
      marginBottom: 5,
      display: "block",
    },
    input: {
      width: "100%",
      background: "rgba(0,255,180,0.04)",
      border: "1px solid rgba(0,255,180,0.2)",
      color: "#e8f4ff",
      fontFamily: MONO,
      fontSize: 13,
      padding: "10px 12px",
      outline: "none",
    },
    select: {
      width: "100%",
      background: BG2,
      border: "1px solid rgba(0,255,180,0.2)",
      color: "#e8f4ff",
      fontFamily: MONO,
      fontSize: 13,
      padding: "10px 12px",
      outline: "none",
      appearance: "none",
    },
    errorBox: {
      fontFamily: MONO,
      fontSize: 11,
      color: "#ff6b6b",
      marginBottom: 12,
      padding: "8px 10px",
      border: "1px solid rgba(255,107,107,0.3)",
      background: "rgba(255,107,107,0.05)",
    },
    btn: {
      width: "100%",
      background: loading ? "rgba(0,255,180,0.5)" : C,
      color: "#020c1b",
      fontFamily: ORB,
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: ".2em",
      border: "none",
      padding: 14,
      cursor: loading ? "not-allowed" : "pointer",
      textTransform: "uppercase",
      marginTop: 6,
    },
    status: {
      fontFamily: MONO,
      fontSize: 10,
      color: "rgba(0,255,180,0.3)",
      textAlign: "center",
      marginTop: 18,
      letterSpacing: ".08em",
    },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600&display=swap');
        @keyframes scan { 0%{top:0} 100%{top:100%} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .cy-input:focus { border-color: #00ffb4 !important; background: rgba(0,255,180,0.07) !important; }
        .cy-input::placeholder { color: rgba(0,255,180,0.2); }
        .cy-cursor { display:inline-block; width:7px; height:13px; background:#00ffb4; animation:blink 1s step-end infinite; vertical-align:middle; margin-left:2px; }
        .cy-corner { position:absolute; width:10px; height:10px; border-color:#00ffb4; border-style:solid; }
        .cy-corner.tl { top:-1px;left:-1px;border-width:2px 0 0 2px; }
        .cy-corner.tr { top:-1px;right:-1px;border-width:2px 2px 0 0; }
        .cy-corner.bl { bottom:-1px;left:-1px;border-width:0 0 2px 2px; }
        .cy-corner.br { bottom:-1px;right:-1px;border-width:0 2px 2px 0; }
      `}</style>

      <div style={S.root}>
        <div style={S.bgGrid} />
        <div style={S.scanLine} />

        <div style={S.box}>
          <div style={S.topLine} />
          <div style={S.bottomLine} />
          <div className="cy-corner tl" />
          <div className="cy-corner tr" />
          <div className="cy-corner bl" />
          <div className="cy-corner br" />

          <div style={S.tag}>// SISTEMA DE AUTENTICACIÓN ByteOS</div>
          <div style={S.title}>
            REPROGRAMANDO<span style={{ color: C }}>BYTE</span>
          </div>
          <div style={S.sub}>
            PROTOCOLO DE ACCESO v2.4 <span className="cy-cursor" />
          </div>

          {/* Tabs */}
          <div style={S.tabs}>
            <button
              style={S.tab(mode === "login")}
              onClick={() => setMode("login")}
            >
              ACCEDER
            </button>
            <button
              style={S.tab(mode === "register")}
              onClick={() => setMode("register")}
            >
              UNIRSE
            </button>
          </div>

          {/* Camps de registre */}
          {mode === "register" && (
            <>
              <div style={S.field}>
                <label style={S.label}>// NOMBRE COMPLETO</label>
                <input
                  className="cy-input"
                  style={S.input}
                  type="text"
                  placeholder="nombre_agente"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                />
              </div>
              <div style={S.field}>
                <label style={S.label}>// ROL DEL SISTEMA</label>
                <select
                  style={S.select}
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                >
                  <option value="alumne">AGENTE (alumno)</option>
                  <option value="professor">COMANDANTE (profesor)</option>
                </select>
              </div>
              {rol === "alumne" && (
                <div style={S.field}>
                  <label style={S.label}>// UNIDAD / GRUPO</label>
                  <input
                    className="cy-input"
                    style={S.input}
                    type="text"
                    placeholder="DAW1A"
                    value={grup}
                    onChange={(e) => setGrup(e.target.value)}
                  />
                </div>
              )}
            </>
          )}

          {/* Camps comuns */}
          <div style={S.field}>
            <label style={S.label}>// IDENTIFICADOR</label>
            <input
              className="cy-input"
              style={S.input}
              type="email"
              placeholder="agent@byteOS.net"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <div style={S.field}>
            <label style={S.label}>// CLAVE DE ACCESO</label>
            <input
              className="cy-input"
              style={S.input}
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {error && <div style={S.errorBox}>{error}</div>}

          <button style={S.btn} onClick={handleSubmit} disabled={loading}>
            {loading
              ? "AUTENTICANDO..."
              : mode === "login"
                ? "INICIAR SESSIÓN"
                : "CREAR CUENTA"}
          </button>

          <div style={S.status}>
            CONNEXIÓN SEGURA · ByteOS v11.4 ·{" "}
            <span style={{ color: C }}>EN LÍNEA</span>
          </div>
        </div>
      </div>
    </>
  );
}
