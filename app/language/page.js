"use client";

import { useLanguage } from "../../components/LanguageContext";
import { useRouter } from "next/navigation";

export default function LanguagePage() {
  const { setLanguage } = useLanguage();
  const router = useRouter();

  const chooseLang = (lang) => {
    setLanguage(lang);
    router.push("/"); // go back to landing page
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
      <h1 className="text-3xl font-bold mb-6">🌐 Choose Your Language</h1>

      <p className="text-gray-400 mb-8">
        Select a language for the Veer<span className="text-indigo-400">आकलान</span> experience
      </p>

      <div className="flex gap-6">
        <button
          onClick={() => chooseLang("en")}
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-lg text-lg font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
        >
          English
        </button>
        <button
          onClick={() => chooseLang("hi")}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-lg font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
        >
          हिंदी
        </button>
      </div>
    </main>
  );
}
