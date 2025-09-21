"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageContext";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="w-full flex justify-between items-center px-8 py-4 bg-black/60 backdrop-blur-md fixed top-0 left-0 z-40">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Logo" className="w-10 h-10" />
        <span className="text-xl font-bold text-white">
          Veer<span className="text-indigo-400">आकलान</span>
        </span>
      </div>

      <nav className="flex gap-6 items-center">
        <Link href="/" className="text-gray-300 hover:text-white">
          {t.header.home}
        </Link>
        <Link href="/auth?role=athlete" className="text-gray-300 hover:text-white">
          {t.header.athlete}
        </Link>
        <Link href="/auth?role=coach" className="text-gray-300 hover:text-white">
          {t.header.coach}
        </Link>

        {/* 🌐 Language switch button */}
        <button
          onClick={() => setLanguage(language === "hi" ? "en" : "hi")}
          className="ml-6 px-4 py-1 bg-gray-700 text-sm rounded hover:bg-gray-600 transition"
        >
          {language === "hi" ? "EN" : "हिंदी"}
        </button>
      </nav>
    </header>
  );
}
