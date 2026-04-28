"use client";

import { useEffect, useState } from "react";

const Background = () => {
  const [points, setPoints] = useState<{ left: string; top: string; animation: string }[]>([]);

  useEffect(() => {
    setPoints(
      Array.from({ length: 20 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
      })),
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute inset-0 opacity-[0.03] app-background" />
      {points.map((style, i) => (
        <div key={i} className="absolute w-1 h-1 bg-accent/30 rounded-full" style={style} />
      ))}
    </div>
  );
};

export default Background;
