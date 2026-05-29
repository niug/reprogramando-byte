import Editor from "@monaco-editor/react";

export default function CodeEditor({ value, onChange }) {
  return (
    <div className="h-full border border-gray-300 rounded-xl overflow-hidden">
      <div className="bg-gray-800 text-gray-300 text-xs px-4 py-2 flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-500" />
        <span className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2">editor.py</span>
      </div>
      <Editor
        height="calc(100% - 32px)"
        defaultLanguage="python"
        value={value}
        onChange={onChange}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          roundedSelection: true,
          automaticLayout: true,
          tabSize: 4,
          insertSpaces: true,
        }}
      />
    </div>
  );
}