import { createContext } from "react";
import type { Language } from "./translations";

export interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Record<string, string>;
}

export const I18nContext = createContext<I18nContextType | undefined>(
  undefined
);
