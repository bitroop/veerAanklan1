"use client";
import { createContext, useState, useContext, useEffect } from "react";
import english from "../locales/english";
import hindi from "../locales/hindi";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");
  const [strings, setStrings] = useState(english);

  useEffect(() => {
    const storedLang = localStorage.getItem("lang");
    if (storedLang) changeLanguage(storedLang);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("lang", lang);
    setStrings(lang === "hi" ? hindi : english);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t: strings }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
