import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const SettingsCtx = createContext(null);
const KEY = 'sevapath.settings';

const DEFAULTS = {
  theme: 'system',       // 'light' | 'dark' | 'system'
  textSize: 'default',   // 'default' | 'large' | 'xl'
  reduceMotion: false,
};

const TEXT_SCALES = { default: 1, large: 1.125, xl: 1.25 };

function applyTheme(theme) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const dark = theme === 'dark' || (theme === 'system' && prefersDark);
  root.classList.toggle('dark', dark);
  root.dataset.theme = dark ? 'dark' : 'light';
}

function applyTextSize(size) {
  document.documentElement.style.setProperty('--sp-font-scale', String(TEXT_SCALES[size] || 1));
}

function applyReduceMotion(on) {
  document.documentElement.classList.toggle('sp-reduce-motion', !!on);
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch (err) {
      console.warn('[SevaPath] Could not read saved settings, using defaults:', err);
    }
    return DEFAULTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch (err) {
      // localStorage may be unavailable (private mode, quota exceeded,
      // or SecurityError). Log and continue with in-memory state.
      console.warn('[SevaPath] Could not persist settings:', err);
    }
    applyTheme(settings.theme);
    applyTextSize(settings.textSize);
    applyReduceMotion(settings.reduceMotion);
  }, [settings]);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return;
    const handler = () => { if (settings.theme === 'system') applyTheme('system'); };
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, [settings.theme]);

  const update = useCallback((patch) => setSettings((s) => ({ ...s, ...patch })), []);
  const reset = useCallback(() => setSettings(DEFAULTS), []);

  const value = useMemo(() => ({ settings, update, reset }), [settings, update, reset]);
  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsCtx);
  if (!ctx) throw new Error('useSettings must be inside SettingsProvider');
  return ctx;
}
