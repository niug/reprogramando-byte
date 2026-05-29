import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BLOCKS } from "../data/curriculum";
import CodeEditor from "../components/CodeEditor";
import Robot from "../components/Robot";
import Terminal from "../components/Terminal";
import { useProgress } from "../hooks/useProgress";

export default function Challenge({ user, userData }) {
  const { blockId, challengeIndex } = useParams();
  const navigate = useNavigate();
  const { saveExecution, completeChallenge } = useProgress(user?.uid);

  const block = BLOCKS.find(b => b.id === blockId);
  const challenge = block?.challenges[parseInt(challengeIndex)];

  const [code, setCode] = useState(challenge?.starterCode || "");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [robotActions, setRobotActions] = useState([]);
  const [running, setRunning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);

  // Carrega Pyodide
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
    setOutput("");
    setError("");
    setRobotActions([]);
    setSuccess(false);
  }, [blockId, challengeIndex]);

  const runCode = async () => {
    if (!pyodideReady) return;
    setRunning(true);
    setOutput("");
    setError("");
    setRobotActions([]);

    const actions = [];
    let outputLines = [];

    // API del robot que l'alumne pot cridar
    const robotAPI = `
class Robot:
    def say(self, text):
        import sys
        print(f"[ROBOT_SAY]{text}[/ROBOT_SAY]")
    def move(self, direction):
        import sys
        print(f"[ROBOT_MOVE]{direction}[/ROBOT_MOVE]")

robot = Robot()
`;

    try {
      // Redirigeix stdout
      pyodideRef.current.runPython(`
import sys, io
sys.stdout = io.StringIO()
`);
      pyodideRef.current.runPython(robotAPI + code);
      const stdout = pyodideRef.current.runPython("sys.stdout.getvalue()");
      pyodideRef.current.runPython("sys.stdout = sys.__stdout__");

      // Parseja les accions del robot
      const lines = stdout.split("\n");
      for (const line of lines) {
        const sayMatch = line.match(/\[ROBOT_SAY\](.*)\[\/ROBOT_SAY\]/);
        const moveMatch = line.match(/\[ROBOT_MOVE\](.*)\[\/ROBOT_MOVE\]/);
        if (sayMatch) actions.push({ type: "say", text: sayMatch[1] });
        else if (moveMatch) actions.push({ type: "move", direction: moveMatch[1] });
        else if (line.trim()) outputLines.push(line);
      }

      setRobotActions(actions);
      setOutput(outputLines.join("\n"));

      // Comprova si ha superat el repte
      const passed = challenge.solution(outputLines.join("\n"), actions);
      if (passed) {
        setSuccess(true);
        await completeChallenge(blockId, challenge.id);
      }
      await saveExecution(challenge.id, code, passed, stdout);
    } catch (e) {
      setError(e.message);
      await saveExecution(challenge.id, code, false, e.message);
    }
    setRunning(false);
  };

  const nextChallenge = () => {
    const nextIdx = parseInt(challengeIndex) + 1;
    if (nextIdx < block.challenges.length) {
      navigate(`/challenge/${blockId}/${nextIdx}`);
    } else {
      navigate("/");
    }
  };

  if (!block || !challenge) return <div>Repte no trobat</div>;

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="text-gray-400 hover:text-white text-sm">← Inici</button>
          <span className="text-gray-600">|</span>
          <span className="text-sm">{block.icon} {block.title}</span>
          <span className="text-gray-600">›</span>
          <span className="text-sm font-medium text-blue-400">{challenge.title}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          Repte {parseInt(challengeIndex) + 1} de {block.challenges.length}
        </div>
      </header>

      {/* Enunciat */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
        <div className="max-w-4xl">
          <h2 className="font-bold text-lg text-white mb-1">{challenge.title}</h2>
          <p className="text-gray-300 text-sm whitespace-pre-line">{challenge.description}</p>
          <p className="text-yellow-400 text-xs mt-1">💡 Pista: {challenge.hint}</p>
        </div>
      </div>

      {/* Àrea principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <CodeEditor value={code} onChange={setCode} />
          </div>
          {/* Terminal */}
          <div className="h-36 border-t border-gray-700">
            <Terminal output={output} error={error} />
          </div>
        </div>

        {/* Robot */}
        <div className="w-72 flex flex-col border-l border-gray-700">
          <div className="flex-1">
            <Robot actions={robotActions} />
          </div>

          {/* Botons */}
          <div className="p-4 border-t border-gray-700 space-y-2">
            {success ? (
              <div className="space-y-2">
                <div className="bg-green-600 text-white text-center py-2 rounded-lg font-bold">
                  ✅ Repte superat!
                </div>
                <button onClick={nextChallenge}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
                  {parseInt(challengeIndex) + 1 < block.challenges.length
                    ? "Següent repte →"
                    : "🏆 Finalitzar bloc"}
                </button>
              </div>
            ) : (
              <button onClick={runCode} disabled={running || !pyodideReady}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 transition">
                {running ? "⏳ Executant..." : !pyodideReady ? "⏳ Carregant Python..." : "▶ Executar"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}