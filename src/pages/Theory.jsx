import { useParams, useNavigate } from "react-router-dom";
import { BLOCKS } from "../data/curriculum";
import ReactMarkdown from "react-markdown";

export default function Theory() {
  const { blockId } = useParams();
  const navigate = useNavigate();
  const block = BLOCKS.find(b => b.id === blockId);

  if (!block) return <div>Bloc no trobat</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate("/")} className="text-gray-500 hover:text-gray-800">← Tornar</button>
        <span className="text-2xl">{block.icon}</span>
        <h1 className="font-bold text-gray-800">{block.title} — Teoria</h1>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-md p-8 prose prose-slate max-w-none">
          <ReactMarkdown>{block.theory.content}</ReactMarkdown>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(`/challenge/${blockId}/0`)}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg">
            Començar els reptes 🚀
          </button>
        </div>
      </main>
    </div>
  );
}