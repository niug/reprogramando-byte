import { useEffect, useState } from "react";

const ANIMATIONS = {
  idle: { emoji: "🤖", label: "esperant" },
  ballar: { emoji: "🕺", label: "ballant" },
  nord: { emoji: "⬆️🤖", label: "movent-se al nord" },
  sud: { emoji: "⬇️🤖", label: "movent-se al sud" },
  est: { emoji: "➡️🤖", label: "movent-se a l'est" },
  oest: { emoji: "⬅️🤖", label: "movent-se a l'oest" },
  endavant: { emoji: "⬆️🤖", label: "avançant" },
  obrir: { emoji: "🚪🤖", label: "obrint" },
  default: { emoji: "🤖", label: "movent-se" }
};

export default function Robot({ actions }) {
  const [current, setCurrent] = useState(0);
  const [bubble, setBubble] = useState(null);
  const [animation, setAnimation] = useState("idle");

  useEffect(() => {
    if (!actions || actions.length === 0) return;
    setCurrent(0);
    setBubble(null);
    setAnimation("idle");
  }, [actions]);

  useEffect(() => {
    if (!actions || current >= actions.length) return;
    const action = actions[current];
    const timer = setTimeout(() => {
      if (action.type === "say") {
        setBubble(action.text);
        setAnimation("idle");
      } else if (action.type === "move") {
        setAnimation(action.direction || "default");
        setBubble(null);
        setTimeout(() => setAnimation("idle"), 800);
      }
      setCurrent(c => c + 1);
    }, current === 0 ? 300 : 1000);
    return () => clearTimeout(timer);
  }, [current, actions]);

  const anim = ANIMATIONS[animation] || ANIMATIONS.default;

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-sky-100 to-sky-200 rounded-xl p-4 relative">
      <div className="text-sm text-gray-500 mb-2 font-mono">Robot</div>

      {/* Bombolla de text */}
      {bubble && (
        <div className="absolute top-4 left-2 right-2 bg-white border-2 border-blue-400 rounded-xl p-3 text-sm text-center shadow-md animate-bounce-once z-10">
          💬 {bubble}
          <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
        </div>
      )}

      {/* Robot */}
      <div className={`text-8xl transition-all duration-300 ${animation !== "idle" ? "scale-110" : "scale-100"}`}>
        {anim.emoji}
      </div>

      <div className="mt-2 text-xs text-gray-500 italic">
        {anim.label}
      </div>

      {/* Terra */}
      <div className="absolute bottom-4 w-3/4 h-2 bg-gray-300 rounded-full opacity-50" />
    </div>
  );
}