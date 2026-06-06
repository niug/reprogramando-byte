import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BLOCKS, GLOBAL_HIDDEN_CODE } from "../data/curriculum";
import { useProgress } from "../hooks/useProgress";
import Editor from "@monaco-editor/react";
import RobotGrid from "../components/RobotGrid";
import LoadingScreen from "../components/LoadingScreen";

const GRID_COLS = 8;
const GRID_ROWS = 8;

export default function Challenge({ user, userData }) {
  const { blockId, challengeIndex } = useParams();
  const navigate = useNavigate();
  const { saveExecution, completeChallenge } = useProgress(user?.uid);

  const block = BLOCKS.find((b) => b.id === blockId);
  const blockIdx = BLOCKS.findIndex((b) => b.id === blockId);
  const challenge = block?.challenges[parseInt(challengeIndex)];
  const totalChallenges = BLOCKS.reduce((a, b) => a + b.challenges.length, 0);
  const doneCount = blockIdx * 3 + parseInt(challengeIndex);
  const pct = Math.round((doneCount / totalChallenges) * 100);

  const [code, setCode] = useState(challenge?.starterCode || "");
  const [termOutput, setTermOutput] = useState(
    "Sistema operativo ByteOS v11.4. Esperando órdenes...",
  );

  const [robotActions, setRobotActions] = useState();
  const [termError, setTermError] = useState(false);
  const [robotPos, setRobotPos] = useState({ r: 0, c: 0 });
  const [robotTrail, setRobotTrail] = useState([]);
  const [running, setRunning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      if (window.loadPyodide) {
        pyodideRef.current = await window.loadPyodide();
        setPyodideReady(true);
      }
    };
    load();
  }, []);

  useEffect(() => {
    setCode(challenge?.starterCode || "");
    setTermOutput("Sistema operativo ByteOS v11.4. Esperando órdenes...");
    setTermError(false);
    setRobotPos({ r: 0, c: 0 });
    setRobotTrail([]);
    setSuccess(false);
  }, [blockId, challengeIndex]);

  const DIR_MAP = {
    nord: { r: -1, c: 0 },
    endavant: { r: -1, c: 0 },
    sud: { r: 1, c: 0 },
    est: { r: 0, c: 1 },
    obrir: { r: 0, c: 1 },
    oest: { r: 0, c: -1 },
    ballar: { r: 0, c: 0 },
    default: { r: 0, c: 1 },
  };

  const runCode = async () => {
    if (!pyodideReady || running) return;
    setRunning(true);
    setTermOutput("Inyectando script a ByteOS...");
    setTermError(false);

    const collectedActions = [];

    const doorPython = challenge.grid.door
    ? JSON.stringify(challenge.grid.door)
    : "None";
    // API del robot accessible des de Python
    const robotAPI = `
class _Robot:
    def __init__(self, rocks, rows, cols, door):
        self._rocks = rocks
        self._rows = rows
        self._cols = cols
        self.door = door
        self._r = ${challenge.grid.robotStart[0]}
        self._c = ${challenge.grid.robotStart[1]}

    def _move(self, dr, dc, dir_name):
        nr = self._r + dr
        nc = self._c + dc
        if 0 <= nr < self._rows and 0 <= nc < self._cols:
            if [nr, nc] not in self._rocks:
                self._r = nr
                self._c = nc
                print(f"[ROBOT_MOVE]{dir_name}[/ROBOT_MOVE]")
            else:
                print(f"[ROBOT_BLOCKED]{nr},{nc}[/ROBOT_BLOCKED]")
        else:
            print(f"[ROBOT_WALL][/ROBOT_WALL]")

    def derecha(self):     self._move(0, 1, "derecha")
    def izquierda(self):  self._move(0, -1, "izquierda")
    def arriba(self):     self._move(-1, 0, "arriba")
    def abajo(self):     self._move(1, 0, "abajo")

    def print_robot(self, text):
        print(f"[ROBOT_SAY]{text}[/ROBOT_SAY]")

    def pedra_davant(self):
        nr, nc = self._r, self._c + 1
        return [nr, nc] in self._rocks or nc >= self._cols

    def pedra_esquerra(self):
        nr, nc = self._r, self._c - 1
        return [nr, nc] in self._rocks or nc < 0

    def pedra_amunt(self):
        nr, nc = self._r - 1, self._c
        return [nr, nc] in self._rocks or nr < 0

    def pedra_avall(self):
        nr, nc = self._r + 1, self._c
        return [nr, nc] in self._rocks or nr >= self._rows

    def porta_davant(self):
        nr, nc = self._r, self._c + 1
        return self._door is not None and [nr, nc] == self._door

robot = _Robot(${JSON.stringify(challenge.grid.rocks)}, ${challenge.grid.rows}, ${challenge.grid.cols}, ${doorPython})
`;
    try {
      pyodideRef.current.runPython(
        `import sys, io\nsys.stdout = io.StringIO()`,
      );
      pyodideRef.current.runPython(
        robotAPI +
        GLOBAL_HIDDEN_CODE +
        (challenge.hiddenCode || "") +
        code + 
        (challenge.endCode || ""));


      const stdout = pyodideRef.current.runPython("sys.stdout.getvalue()");
      pyodideRef.current.runPython("sys.stdout = sys.__stdout__");

      const outputLines = [];
      for (const line of stdout.split("\n")) {
        const sayM = line.match(/\[ROBOT_SAY\](.*)\[\/ROBOT_SAY\]/);
        const moveM = line.match(/\[ROBOT_MOVE\](.*)\[\/ROBOT_MOVE\]/);
        const blockM = line.match(/\[ROBOT_BLOCKED\](.*)\[\/ROBOT_BLOCKED\]/);
        const wallM = line.match(/\[ROBOT_WALL\]/);

        if (sayM) collectedActions.push({ type: "say", text: sayM[1] });
        else if (moveM) collectedActions.push({ type: "move", dir: moveM[1] });
        else if (blockM)
          collectedActions.push({ type: "blocked", pos: blockM[1] });
        else if (wallM) collectedActions.push({ type: "wall" });
        else if (line.trim()) outputLines.push(line);
      }

      // Comprova si el robot ha arribat a la porta
      if (challenge.grid.door) {
        const door = challenge.grid.door;
        let pos = { r: challenge.grid.robotStart[0], c: challenge.grid.robotStart[1] };
        const DR = { arriba: -1, abajo: 1, derecha: 0, izquierda: 0 };
        const DC = { arriba: 0, abajo: 0, derecha: 1, izquierda: -1 };
        for (const action of collectedActions) {
          if (action.type === "move") {
            pos = { r: pos.r + (DR[action.dir] ?? 0), c: pos.c + (DC[action.dir] ?? 0) };
            if (pos.r === door[0] && pos.c === door[1]) {
              collectedActions.push({ type: "door" });
              break;
            }
          }
        }
      }
      
      setRobotActions(collectedActions);

      console.log(`🚀 ~ runCode ~ outputLines.join("\n"):`, outputLines.join("\n"))
      console.log("🚀 ~ runCode ~ collectedActions:", collectedActions)
      const passed = challenge.solution(
        outputLines.join("\n"),
        collectedActions,
        code
      );
      const termMsg =
        outputLines.join("\n") ||
        (collectedActions.length > 0
          ? "Script ejecutado correctamente."
          : "Ninguna acción detectada.");
      setTermOutput(termMsg);

      setTimeout(
        async () => {
          if (passed) {
            setSuccess(true);
            await completeChallenge(blockId, challenge.id);
            setTermOutput("✓ PROTOCOLO COMPLETADO — Objectivo alcanzado!");
          } else {
            setTermOutput("CÓDIGO INCORRECTO — Objetivo NO alcanzado!");
          }
          setRunning(false);
        },
        collectedActions.length * 600 + 500,
      );

      await saveExecution(challenge.id, code, passed, stdout);
    } catch (e) {
      setTermOutput(e.message);
      setTermError(true);
      setRunning(false);
      await saveExecution(challenge.id, code, false, e.message);
    }
  };

  if (!block || !challenge) return null;

  const S = styles;

  if (!pyodideReady) return (
    <LoadingScreen />
  );
  return (
    <div style={S.root}>
      {/* Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600&display=swap"
        rel="stylesheet"
      />

      {/* Grid de fons */}
      <div style={S.bgGrid} />

      {/* HEADER */}
      <div style={S.header}>
        <div style={{ flex: 1 }}>
          <div style={S.subtitle}>REPROGRAMANDO</div>
          <div style={S.title}>
            BYTE
          </div>
        </div>
        <div style={{ flex: 2 }}>
          <div style={S.progressRow}>
            <span style={S.progLabel}>MÓDULO {blockIdx + 1}</span>
            <span style={S.progSep}>|</span>
            <span style={S.progLabel}>
              PRUEBA {parseInt(challengeIndex) + 1}
            </span>
            <div style={S.progBarOuter}>
              <div style={{ ...S.progBarFill, width: `${pct}%` }} />
            </div>
            <span style={S.progPct}>{pct}%</span>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={S.main}>
        {/* ESQUERRA — Editor */}
        <div style={S.left}>
          <div style={S.editorHeader}>
            <span style={S.panelLabel}>TERMINAL DE INYECCIÓN</span>
            <button
              onClick={() => navigate(`/theory/${blockId}`)}
              style={S.theoryBtn}
            >
              TEORÍA
            </button>
          </div>
          <div style={{ flex: 1 }}>
            <Editor
              height="100%"
              defaultLanguage="python"
              value={code}
              onChange={(v) => setCode(v || "")}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: "'Share Tech Mono', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                automaticLayout: true,
                tabSize: 4,
                padding: { top: 12 },
                lineDecorationsWidth: 0,
              }}
            />
          </div>
          <button
            onClick={runCode}
            disabled={running || !pyodideReady}
            style={{
              ...S.runBtn,
              opacity: running || !pyodideReady ? 0.5 : 1,
              cursor: running || !pyodideReady ? "not-allowed" : "pointer",
            }}
          >
            {running
              ? "EJECUTANDO..."
              : !pyodideReady
                ? "CARGANDO PYTHON..."
                : "EJECUTAR SCRIPT"}
          </button>
        </div>

        {/* DRETA — Mapa robot */}
        <div style={S.right}>
          <div style={S.mapHeader}>
            MAPA DEL SECTOR — VISUALIZACIÓN EN TIEMPO REAL
          </div>

          {/* Graella */}
          <RobotGrid
            gridConfig={challenge.grid}
            actions={robotActions}
            onActionsDone={() => {}}
          />

          {/* Objectiu */}
          <div style={S.objective}>
            {success ? (
              <div style={{ ...S.objText, color: "#00ffb4" }}>
                ✓ PROTOCOLO COMPLETADO —{" "}
                <span
                  onClick={() => {
                    const next = parseInt(challengeIndex) + 1;
                    if (next < block.challenges.length)
                      navigate(`/challenge/${blockId}/${next}`);
                    else navigate("/");
                  }}
                  style={{
                    color: "#e8f4ff",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  {parseInt(challengeIndex) + 1 < block.challenges.length
                    ? "ACCEDER AL PROXIMO RETO →"
                    : "VOLVER AL HUB →"}
                </span>
              </div>
            ) : (
              <div style={S.objText}>
                <span style={{ color: "#e8f4ff" }}>OBJETIVO:</span>{" "}
                {challenge.description.split("\n")[0]}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TERMINAL */}
      <div style={S.terminal}>
        <div style={S.termLabel}>SALIDA DEL SISTEMA</div>
        <div
          style={{ ...S.termLine, color: termError ? "#ff6b6b" : "#00ffb4" }}
        >
          <span style={{ color: "rgba(0,255,180,0.4)" }}>/&gt; </span>
          {termOutput}
        </div>
      </div>
    </div>
  );
}

const C = "#00ffb4";
const BG = "#050d1a";
const BG2 = "#020810";
const BORDER = "rgba(0,255,180,0.18)";
const MONO = "'Share Tech Mono', monospace";
const ORB = "'Orbitron', monospace";

const styles = {
  root: {
    background: BG,
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Rajdhani',sans-serif",
    color: C,
    overflow: "hidden",
    position: "relative",
  },
  bgGrid: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    backgroundImage: `linear-gradient(rgba(0,255,180,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,180,0.025) 1px,transparent 1px)`,
    backgroundSize: "40px 40px",
    zIndex: 0,
  },
  header: {
    background: BG2,
    borderBottom: `1px solid ${BORDER}`,
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
    gap: 20,
    position: "relative",
    zIndex: 1,
  },
  subtitle: {
    fontFamily: ORB,
    fontSize: 10,
    fontWeight: 700,
    color: C,
    letterSpacing: ".18em",
  },
  title: {
    fontFamily: ORB,
    fontSize: 18,
    fontWeight: 900,
    color: "#e8f4ff",
    letterSpacing: ".06em",
  },
  progressRow: { display: "flex", alignItems: "center", gap: 10 },
  progLabel: {
    fontFamily: MONO,
    fontSize: 10,
    color: "rgba(0,255,180,0.5)",
    letterSpacing: ".1em",
    whiteSpace: "nowrap",
  },
  progSep: { color: "rgba(0,255,180,0.3)", fontFamily: MONO, fontSize: 10 },
  progBarOuter: { flex: 1, height: 3, background: "rgba(0,255,180,0.1)" },
  progBarFill: { height: "100%", background: C, transition: "width .4s" },
  progPct: { fontFamily: MONO, fontSize: 10, color: C },
  main: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
    position: "relative",
    zIndex: 1,
  },
  left: {
    width: "42%",
    display: "flex",
    flexDirection: "column",
    borderRight: `1px solid ${BORDER}`,
  },
  editorHeader: {
    background: BG2,
    borderBottom: `1px solid ${BORDER}`,
    padding: "6px 14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0,
  },
  panelLabel: {
    fontFamily: MONO,
    fontSize: 10,
    color: "rgba(0,255,180,0.45)",
    letterSpacing: ".12em",
  },
  theoryBtn: {
    fontFamily: MONO,
    fontSize: 10,
    color: C,
    background: "none",
    border: `1px solid rgba(0,255,180,0.3)`,
    padding: "2px 10px",
    cursor: "pointer",
    letterSpacing: ".08em",
  },
  runBtn: {
    background: C,
    color: "#020c1b",
    fontFamily: ORB,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: ".18em",
    border: "none",
    padding: "13px 0",
    margin: "10px 14px",
    textTransform: "uppercase",
  },
  right: { flex: 1, display: "flex", flexDirection: "column" },
  mapHeader: {
    background: BG2,
    borderBottom: `1px solid ${BORDER}`,
    padding: "6px 14px",
    fontFamily: MONO,
    fontSize: 10,
    color: "rgba(0,255,180,0.45)",
    letterSpacing: ".1em",
    flexShrink: 0,
  },
  gridWrap: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: `repeat(${GRID_COLS},1fr)`,
    gap: 1,
    background: "rgba(0,255,180,0.07)",
    border: `1px solid rgba(0,255,180,0.2)`,
    width: "100%",
    maxWidth: 340,
    aspectRatio: "1",
  },
  cell: { aspectRatio: "1" },
  objective: {
    background: "rgba(0,255,180,0.04)",
    borderTop: `1px solid rgba(0,255,180,0.2)`,
    padding: "10px 14px",
    flexShrink: 0,
  },
  objText: {
    fontFamily: MONO,
    fontSize: 11,
    color: "rgba(0,255,180,0.8)",
    lineHeight: 1.6,
  },
  terminal: {
    background: BG2,
    borderTop: `1px solid ${BORDER}`,
    padding: "8px 18px",
    flexShrink: 0,
    position: "relative",
    zIndex: 1,
    minHeight: 120,
    maxHeight: 120,
    overflowY: 'auto',
  },
  termLabel: {
    fontFamily: MONO,
    fontSize: 10,
    color: "rgba(0,255,180,0.4)",
    letterSpacing: ".12em",
    marginBottom: 4,
  },
  termLine: { 
    fontFamily: MONO, 
    fontSize: 12,
    lineHeight: 1.6,
    lineHeight: 1.8,       
    whiteSpace: "pre-wrap",
  }
};
