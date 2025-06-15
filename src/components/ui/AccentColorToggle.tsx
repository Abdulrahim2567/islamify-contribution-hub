
import React from "react";
import { useTheme } from "./ThemeProvider";

const ACCENTS = [
  { name: "Emerald", val: "emerald", color: "bg-emerald-500" },
  { name: "Blue", val: "blue", color: "bg-blue-500" },
  { name: "Indigo", val: "indigo", color: "bg-indigo-500" },
  { name: "Violet", val: "violet", color: "bg-violet-500" },
] as const;

export const AccentColorToggle: React.FC = () => {
  const { accent, setAccent } = useTheme();
  return (
    <div className="flex gap-2 items-center mt-2">
      {ACCENTS.map((a) => (
        <button
          key={a.val}
          aria-label={a.name}
          title={a.name}
          className={`w-7 h-7 rounded-full border-2 ${a.color} border-gray-300 ${accent === a.val ? "ring-2 ring-emerald-400" : ""}`}
          onClick={() => setAccent(a.val as any)}
          type="button"
        />
      ))}
      <div className="text-xs ml-4 text-gray-500">Accent color</div>
    </div>
  );
};
