import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { BLOCKS } from "../data/curriculum";

export default function Dashboard({ userData, user }) {
  const navigate = useNavigate();

  const getBlockProgress = (blockId) => {
    const blockProgress = userData?.progress?.[blockId] || {};
    const block = BLOCKS.find(b => b.id === blockId);
    const completed = block.challenges.filter(c => blockProgress[c.id]).length;
    return { completed, total: block.challenges.length };
  };

  const colorMap = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🤖</span>
          <div>
            <h1 className="font-bold text-gray-800">CodeQuest</h1>
            <p className="text-sm text-gray-500">Hola, {userData?.nom}! 👋</p>
          </div>
        </div>
        <button onClick={() => signOut(auth)} className="text-gray-500 hover:text-red-500 text-sm">
          Sortir
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Els teus blocs</h2>
        <p className="text-gray-500 mb-8">Completa els reptes per desbloquejar el següent bloc</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BLOCKS.map((block, idx) => {
            const { completed, total } = getBlockProgress(block.id);
            const prevBlock = idx > 0 ? BLOCKS[idx - 1] : null;
            const prevCompleted = prevBlock
              ? getBlockProgress(prevBlock.id).completed === getBlockProgress(prevBlock.id).total
              : true;
            const isLocked = !prevCompleted && idx > 0;

            return (
              <div key={block.id}
                className={`bg-white rounded-2xl shadow-md overflow-hidden ${isLocked ? "opacity-60" : "hover:shadow-lg transition"}`}>
                <div className={`bg-gradient-to-r ${colorMap[block.color]} p-6 text-white`}>
                  <div className="text-4xl mb-2">{block.icon}</div>
                  <h3 className="text-xl font-bold">{block.title}</h3>
                  <p className="text-sm opacity-80">{completed}/{total} reptes completats</p>
                </div>
                <div className="p-4">
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className={`bg-gradient-to-r ${colorMap[block.color]} h-2 rounded-full transition-all`}
                      style={{ width: `${(completed / total) * 100}%` }} />
                  </div>
                  {isLocked ? (
                    <div className="text-center text-gray-400 py-2">🔒 Completa el bloc anterior</div>
                  ) : (
                    <button
                      onClick={() => navigate(`/theory/${block.id}`)}
                      className={`w-full py-2 rounded-lg text-white font-medium bg-gradient-to-r ${colorMap[block.color]} hover:opacity-90 transition`}>
                      {completed === 0 ? "Començar" : completed === total ? "✅ Completat" : "Continuar"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}