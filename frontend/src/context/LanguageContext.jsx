import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DICTS, LOCALES } from '../lib/i18n';

const LangCtx = createContext(null);
const KEY = 'sevapath.lang';

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const url = new URLSearchParams(window.location.search).get('lang');
    if (url && LOCALES.includes(url)) return url;
    const saved = localStorage.getItem(KEY);
    if (saved && LOCALES.includes(saved)) return saved;
    const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return LOCALES.includes(nav) ? nav : 'en';
  });

  useEffect(() => {
    localStorage.setItem(KEY, lang);
    document.documentElement.lang = lang;
    // Update URL param non-destructively
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url);
  }, [lang]);

  const value = useMemo(
    () => ({ lang, setLang, t: DICTS[lang] || DICTS.en }),
    [lang]
  );
  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider');
  return ctx;
}
