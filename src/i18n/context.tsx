import React, { useState } from "react";
import type { ReactNode } from "react";
import type { Language } from "./translations";
import { translations } from "./translations";
import { I18nContext, type I18nContextType } from "./context-definition";

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  // Try to get saved language from localStorage, default to browser language or 'en'
  const getInitialLanguage = (): Language => {
    const saved = localStorage.getItem("kalca-language") as Language | null;
    if (saved && translations[saved]) return saved;

    // Try to detect browser language
    const browserLang = navigator.language.split("-")[0] as Language;
    if (translations[browserLang]) return browserLang;

    return "en";
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("kalca-language", lang);
  };

  // Merge current language translations with English fallback
  // This ensures missing keys in other languages fall back to English
  const getTranslations = (): Record<string, string> => {
    const current = translations[language];
    const english = translations.en;
    return { ...english, ...current };
  };

  const value: I18nContextType = {
    language,
    setLanguage,
    t: getTranslations(),
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};
