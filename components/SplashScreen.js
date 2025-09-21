"use client";

import { useEffect, useState } from "react";

export default function SplashScreen({ onFinish }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 2500); // 2.5 sec splash
    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900 via-black to-purple-900 z-50">
      <div className="flex flex-col items-center animate-fadeIn">
        <img
          src="/logo.png"
          alt="Veerआकलान Logo"
          className="w-28 h-28 animate-bounce drop-shadow-2xl"
        />
        <h1 className="mt-6 text-4xl font-extrabold text-white tracking-wide">
          Veerआकलान
        </h1>
        <p className="mt-2 text-gray-300 text-sm">Democratizing Sports</p>
      </div>
    </div>
  );
}
