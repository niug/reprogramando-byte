import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { BLOCKS } from "../data/curriculum";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Teacher({ userData }) {
  const [alumnes, setAlumnes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filterGrup, setFilterGrup] = useState("");

  useEffect(() => {
    const load = async () => {
      const q = query(collection(db, "users"), where("rol", "==", "alumne"));
      const snap = await getDocs(q);
      setAlumnes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    load();
  }, []);

  const grups = [...new Set(alumnes.map(a => a.grup).filter(Boolean))];

  const filtrats = filterGrup ? alumnes.filter(a => a.grup === filterGrup) : alumnes;

  const getTotalProgress = (alumne) => {
    let total = 0, completed = 0;
    for (const block of BLOCKS) {
      for (const ch of block.challenges) {
        total++;
        if (alumne.progress?.[block.id]?.[ch.id]) completed++;
      }
    }
    return { completed, total };
  };

  const getTotalExecutions = (alumne) => {
    return Object.values(alumne.executionCount || {}).reduce((a, b) => a + b, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-3xl">👨‍🏫</span>
          <div>
            <h1 className="font-bold text-gray-800">Panel del Professor</h1>
            <p className="text-sm text-gray-500">{userData?.nom}</p>
          </div>
        </div>
        <button onClick={() => signOut(auth)} className="text-gray-500 hover:text-red-500 text-sm">Sortir</button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Filtres */}
        <div className="flex gap-4 mb-6">
          <select className="border rounded-lg px-4 py-2 bg-white"
            value={filterGrup} onChange={e => setFilterGrup(e.target.value)}>
            <option value="">Tots els grups</option>
            {grups.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
            {filtrats.length} alumnes
          </div>
        </div>

        <div className="flex gap-6">
          {/* Llista alumnes */}
          <div className="w-1/3 space-y-3">
            {filtrats.map(alumne => {
              const { completed, total } = getTotalProgress(alumne);
              const execs = getTotalExecutions(alumne);
              return (
                <div key={alumne.id}
                  onClick={() => setSelected(alumne)}
                  className={`bg-white rounded-xl p-4 shadow-sm cursor-pointer border-2 transition ${selected?.id === alumne.id ? "border-blue-500" : "border-transparent hover:border-gray-200"}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">{alumne.nom}</p>
                      <p className="text-xs text-gray-500">{alumne.grup} · {alumne.email}</p>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{execs} exec.</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progrés</span>
                      <span>{completed}/{total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(completed / total) * 100}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detall alumne */}
          {selected ? (
            <div className="flex-1 bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-1">{selected.nom}</h2>
              <p className="text-gray-500 text-sm mb-6">{selected.email} · {selected.grup}</p>

              {BLOCKS.map(block => (
                <div key={block.id} className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3">{block.icon} {block.title}</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {block.challenges.map(ch => {
                      const done = selected.progress?.[block.id]?.[ch.id];
                      const execs = selected.executionCount?.[ch.id] || 0;
                      const history = selected.executions?.[ch.id] || [];
                      const lastExec = history[history.length - 1];
                      return (
                        <div key={ch.id} className={`rounded-lg p-3 border ${done ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
                          <p className="text-sm font-medium text-gray-700">{ch.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{execs} execucions</p>
                          {done && <span className="text-xs text-green-600 font-medium">✅ Completat</span>}
                          {lastExec && (
                            <details className="mt-2">
                              <summary className="text-xs text-blue-500 cursor-pointer">Veure últim intent</summary>
                              <pre className="text-xs bg-gray-800 text-green-400 p-2 rounded mt-1 overflow-auto max-h-24">
                                {lastExec.code}
                              </pre>
                            </details>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Selecciona un alumne per veure el detall
            </div>
          )}
        </div>
      </main>
    </div>
  );
}