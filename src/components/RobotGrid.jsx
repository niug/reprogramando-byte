import { useEffect, useRef, useState } from "react";

const ROBOT_SVG = (
  <svg
    viewBox="0 0 40 40"
    style={{
      width: "100%",
      height: "100%",
      filter: "drop-shadow(0 0 5px rgba(0,255,180,.7))",
    }}
  >
    {/* Cap */}
    <rect x="13" y="8" width="14" height="10" rx="3" fill="#00ffb4" />
    {/* Antena */}
    <rect x="18" y="3" width="4" height="6" rx="1" fill="#00d4a0" />
    <circle cx="20" cy="2.5" r="2" fill="#00ffb4" />
    {/* Cos */}
    <rect
      x="9"
      y="17"
      width="22"
      height="14"
      rx="3"
      fill="#00ffb4"
      opacity=".9"
    />
    {/* Ulls */}
    <circle cx="16" cy="14" r="3" fill="#020c1b" />
    <circle cx="24" cy="14" r="3" fill="#020c1b" />
    <circle cx="17" cy="13" r="1.2" fill="#00ffb4" />
    <circle cx="25" cy="13" r="1.2" fill="#00ffb4" />
    {/* Boca */}
    <rect
      x="14"
      y="26"
      width="12"
      height="2"
      rx="1"
      fill="#020c1b"
      opacity=".4"
    />
    {/* Braços */}
    <rect x="4" y="18" width="6" height="9" rx="3" fill="#00d4a0" />
    <rect x="30" y="18" width="6" height="9" rx="3" fill="#00d4a0" />
    {/* Cames */}
    <rect x="12" y="30" width="6" height="8" rx="2" fill="#00d4a0" />
    <rect x="22" y="30" width="6" height="8" rx="2" fill="#00d4a0" />
    {/* Panell pit */}
    <rect
      x="15"
      y="19"
      width="10"
      height="7"
      rx="1"
      fill="#020c1b"
      opacity=".3"
    />
    <circle cx="18" cy="22.5" r="1.5" fill="#00ffb4" opacity=".8" />
    <circle cx="22" cy="22.5" r="1.5" fill="#00ffb4" opacity=".8" />
  </svg>
);

export default function RobotGrid({ gridConfig, actions, onActionsDone }) {
  const {
    cols = 6,
    rows = 5,
    robotStart = [0, 0],
    rocks = [],
    goal,
    door,
  } = gridConfig || {};
  const CELL = 56;

  const [doorOpen, setDoorOpen] = useState(false);
  const [robotPos, setRobotPos] = useState({
    r: robotStart[0],
    c: robotStart[1],
  });
  const [bubble, setBubble] = useState(null);
  const [blockedCell, setBlockedCell] = useState(null);
  const [goalReached, setGoalReached] = useState(false);
  const animRef = useRef(null);

  // Reset quan canvien les accions
  useEffect(() => {
    setRobotPos({ r: robotStart[0], c: robotStart[1] });
    setBubble(null);
    setBlockedCell(null);
    setGoalReached(false);
    setDoorOpen(false);
  }, [gridConfig]);

  // Anima les accions
  useEffect(() => {
    if (!actions || actions.length === 0) return;
    if (animRef.current) clearTimeout(animRef.current);

    setRobotPos({ r: robotStart[0], c: robotStart[1] });
    setBubble(null);
    setBlockedCell(null);
    setGoalReached(false);

    let pos = { r: robotStart[0], c: robotStart[1] };
    let i = 0;

    const step = () => {
      if (i >= actions.length) {
        onActionsDone?.();
        return;
      }
      const action = actions[i++];

      if (action.type === "move") {
        const DR = { amunt: -1, avall: 1, dreta: 0, esquerra: 0 };
        const DC = { amunt: 0, avall: 0, dreta: 1, esquerra: -1 };
        const dr = DR[action.dir] ?? 0;
        const dc = DC[action.dir] ?? 0;
        const nr = pos.r + dr,
          nc = pos.c + dc;

        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
          // Fora de límits — no mou
        } else if (rocks.some(([rr, cc]) => rr === nr && cc === nc)) {
          setBlockedCell(`${nr}_${nc}`);
          setTimeout(() => setBlockedCell(null), 400);
        } else {
          pos = { r: nr, c: nc };
          setRobotPos({ ...pos });
          // Comprova porta
          if (door && nr === door[0] && nc === door[1]) {
            setDoorOpen(true);
          }
          // Comprova meta
          if (goal && nr === goal[0] && nc === goal[1]) {
            setGoalReached(true);
          }
        }
      } else if (action.type === "say") {
        setBubble(action.text);
        setTimeout(() => setBubble(null), 1800);
      }

      animRef.current = setTimeout(step, 600);
    };

    animRef.current = setTimeout(step, 300);
    return () => {
      if (animRef.current) clearTimeout(animRef.current);
    };
  }, [actions]);

  const isRock = (r, c) => rocks.some(([rr, cc]) => rr === r && cc === c);
  const isGoal = (r, c) => goal && goal[0] === r && goal[1] === c;
  const isRobot = (r, c) => robotPos.r === r && robotPos.c === c;
  const isDoor = (r, c) => door && door[0] === r && door[1] === c;


  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        background: "rgba(3,11,23,.8)",
        padding: 12,
      }}
    >
      {/* Graella */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${CELL}px)`,
          gap: 2,
          background: "rgba(0,255,180,.07)",
          border: "1px solid rgba(0,255,180,.2)",
          padding: 2,
          position: "relative",
        }}
      >
        {Array.from({ length: rows * cols }).map((_, idx) => {
          const r = Math.floor(idx / cols);
          const c = idx % cols;
          const rock = isRock(r, c);
          const goalCell = isGoal(r, c);
          const door_c  = isDoor(r, c);
          const robotHere = isRobot(r, c);
          const blocked = blockedCell === `${r}_${c}`;

          return (
            <div
              key={idx}
              style={{
                width: CELL,
                height: CELL,
                background: 
                    blocked ? "rgba(255,80,80,.18)" : 
                    rock ? "rgba(80,50,20,.5)" : 
                    goalCell ? "rgba(255,220,0,.08)" : 
                    robotHere ? "rgba(0,255,180,.06)" : 
                    door_c    ? (doorOpen ? "rgba(0,255,180,.15)" : "rgba(0,100,255,.1)") :
                    "#030b17",
                border: `1px solid ${
                  rock ? "rgba(180,120,50,.35)" : 
                  goalCell ? "rgba(255,220,0,.4)" : 
                  door_c  ? (doorOpen ? "rgba(0,255,180,.6)" : "rgba(80,140,255,.5)") :
                  "rgba(0,255,180,.07)"
                }`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                position: "relative",
                transition: "background .3s, border-color .3s",
                boxShadow: 
                  blocked ? "inset 0 0 8px rgba(255,80,80,.3)" : 
                  door_c && !doorOpen ? "inset 0 0 10px rgba(80,140,255,.2)" :
                  door_c && doorOpen  ? "inset 0 0 12px rgba(0,255,180,.3)" :
                  "none",
              }}
            >
              {rock && <span style={{ fontSize: 26 }}>🪨</span>}
              {goalCell && !robotHere && (
                <span
                  style={{
                    fontSize: 22,
                    filter: "drop-shadow(0 0 6px rgba(255,220,0,.8))",
                  }}
                >
                  {goalReached ? "✅" : "⭐"}
                </span>
              )}

              {/* PORTA */}
              {door_c && !robotHere && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <span style={{ fontSize: 20, filter: doorOpen ? "drop-shadow(0 0 6px rgba(0,255,180,.9))" : "none" }}>
                    {doorOpen ? "🚪" : "🔒"}
                </span>
                <div style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: 8,
                    color: doorOpen ? "#00ffb4" : "rgba(80,140,255,.8)",
                    letterSpacing: ".05em"
                }}>
                    {doorOpen ? "ABIERTA" : "CERRADA"}
                </div>
                </div>
              )}
              {robotHere && (
                <div
                  style={{
                    width: CELL - 8,
                    height: CELL - 8,
                    position: "relative",
                  }}
                >
                  {ROBOT_SVG}
                  {/* Globus de còmic */}
                  {bubble && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "calc(100% + 8px)",
                        left: "50%",
                        transform: "translateX(-40%)",
                        background: "#e8f4ff",
                        border: "2px solid #00ffb4",
                        borderRadius: 10,
                        padding: "5px 10px",
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: 11,
                        color: "#020c1b",
                        whiteSpace: "nowrap",
                        zIndex: 30,
                        filter: "drop-shadow(0 0 4px rgba(0,255,180,.5))",
                        pointerEvents: "none",
                      }}
                    >
                      {bubble}
                      {/* Cua del globus */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: -10,
                          left: 14,
                          width: 0,
                          height: 0,
                          borderLeft: "6px solid transparent",
                          borderRight: "6px solid transparent",
                          borderTop: "10px solid #00ffb4",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: -7,
                          left: 16,
                          width: 0,
                          height: 0,
                          borderLeft: "4px solid transparent",
                          borderRight: "4px solid transparent",
                          borderTop: "8px solid #e8f4ff",
                          zIndex: 1,
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Llegenda */}
      <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
        {[
          ["🤖", "Robot"],
          ["🪨", "Pedra"],
          goal ? ["⭐", "Meta"] : null,
          door
            ? [
                doorOpen ? "🚪" : "🔒",
                doorOpen ? "Puerta abierta" : "Puerta cerrada",
              ]
            : null,
        ]
          .filter(Boolean)
          .map(([icon, label]) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontFamily: "'Share Tech Mono',monospace",
                fontSize: 10,
                color: "rgba(0,255,180,.4)",
              }}
            >
              <span>{icon}</span> {label}
            </div>
          ))}
      </div>
    </div>
  );
}
