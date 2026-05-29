export default function Terminal({ output, error }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm h-full overflow-auto">
      <div className="text-gray-400 text-xs mb-2 flex items-center gap-2">
        <span>▶ Terminal</span>
      </div>
      {output && (
        <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
      )}
      {error && (
        <pre className="text-red-400 whitespace-pre-wrap">⚠ {error}</pre>
      )}
      {!output && !error && (
        <span className="text-gray-600">Executa el codi per veure la sortida...</span>
      )}
    </div>
  );
}