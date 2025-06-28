
import React from "react";

// Minimal avatar generator based on initials
const MemberAvatar = ({ name }: { name: string }) => {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-xl font-semibold text-emerald-700 border-4 border-white shadow-md">
      {initials}
    </div>
  );
};

export default MemberAvatar;
