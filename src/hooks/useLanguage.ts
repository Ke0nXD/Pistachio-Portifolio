'use client';
import { useState, useEffect, createContext, useContext } from 'react';
import { translations, type Language } from '@/data/translations';

type Translation = (typeof translations)[Language];

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translation;
}

export const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
});

export function useLanguage() {
  return useContext(LanguageContext);
}

function readLanguageCookie(): Language | null {
  if (typeof document === 'undefined') return null;

  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith('pistachio-lang='))
    ?.split('=')[1];

  return cookie === 'en' || cookie === 'pt' ? cookie : null;
}

function writeLanguageCookie(lang: Language) {
  document.cookie = `pistachio-lang=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function useLanguageProvider() {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const saved = readLanguageCookie();
    if (saved) setLangState(saved);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    writeLanguageCookie(newLang);
  };

  const t = translations[lang];

  return { lang, setLang, t };
}
