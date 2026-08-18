"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, TranslationDict, translations } from "./translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDict;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cockpit_ia_lang") as Language;
      if (stored === "fr" || stored === "en") {
        setLanguageState(stored);
      }
    } catch (e) {
      // ignore
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("cockpit_ia_lang", lang);
    } catch (e) {
      // ignore
    }
  };

  const value = {
    language,
    setLanguage,
    t: translations[language] || translations.en,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
