import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Login() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [rol, setRol] = useState("alumne");
  const [grup, setGrup] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    try {
      if (mode === "register") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", cred.user.uid), {
          nom, email, rol, grup,
          progress: {},
          executionCount: {},
          createdAt: new Date().toISOString()
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-2">🤖</div>
          <h1 className="text-3xl font-bold text-gray-800">CodeQuest</h1>
          <p className="text-gray-500">Aprèn Python amb el robot!</p>
        </div>

        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          {["login", "register"].map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${mode === m ? "bg-white shadow text-blue-600" : "text-gray-500"}`}>
              {m === "login" ? "Iniciar sessió" : "Registrar-se"}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {mode === "register" && (
            <>
              <input className="w-full border rounded-lg px-4 py-3" placeholder="Nom complet"
                value={nom} onChange={e => setNom(e.target.value)} />
              <select className="w-full border rounded-lg px-4 py-3"
                value={rol} onChange={e => setRol(e.target.value)}>
                <option value="alumne">Alumne</option>
                <option value="professor">Professor</option>
              </select>
              {rol === "alumne" && (
                <input className="w-full border rounded-lg px-4 py-3" placeholder="Grup (ex: DAW1A)"
                  value={grup} onChange={e => setGrup(e.target.value)} />
              )}
            </>
          )}
          <input className="w-full border rounded-lg px-4 py-3" placeholder="Correu electrònic"
            type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="w-full border rounded-lg px-4 py-3" placeholder="Contrasenya"
            type="password" value={password} onChange={e => setPassword(e.target.value)} />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            {mode === "login" ? "Entrar" : "Crear compte"}
          </button>
        </div>
      </div>
    </div>
  );
}