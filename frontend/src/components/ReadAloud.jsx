import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

/**
 * Opt-in text-to-speech using window.speechSynthesis.
 * Never autoplays. Cancels cleanly on unmount / language change.
 *
 * Voice selection:
 *  1. Try exact BCP-47 locale match (e.g. hi-IN).
 *  2. Try language-prefix match (e.g. hi).
 *  3. Fall back to whatever the browser uses for the requested lang tag.
 *  4. If no voice is available at all for the language, show a
 *     non-blocking indicator instead of silently failing.
 */
const LANG_MAP = { en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN' };

function pickVoice(langTag) {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const tag = (langTag || 'en-IN').toLowerCase();
  const prefix = tag.split('-')[0];

  // 1. Exact locale match
  let voice = voices.find((v) => v.lang.toLowerCase() === tag);
  if (voice) return voice;

  // 2. Language-prefix match
  voice = voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
  if (voice) return voice;

  // 3. No match — return null so caller can decide
  return null;
}

export default function ReadAloud({ text, className = '' }) {
  const { lang, t } = useLang();
  const [speaking, setSpeaking] = useState(false);
  const [voicesReady, setVoicesReady] = useState(false);
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const utterRef = useRef(null);

  // Listen for voiceschanged — many browsers load voices async
  useEffect(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    // Voices may already be loaded
    if (synth.getVoices().length > 0) setVoicesReady(true);
    const onChanged = () => setVoicesReady(true);
    synth.addEventListener('voiceschanged', onChanged);
    return () => synth.removeEventListener('voiceschanged', onChanged);
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    utterRef.current = null;
    setSpeaking(false);
  }, [supported]);

  // Cancel on unmount
  useEffect(() => () => stop(), [stop]);
  // Cancel when text or language changes
  useEffect(() => stop(), [text, lang, stop]);

  if (!supported) return null;

  const langTag = LANG_MAP[lang] || 'en-IN';

  const toggle = () => {
    if (speaking) {
      stop();
      return;
    }
    if (!text) return;

    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = langTag;
    utter.rate = 1;
    utter.pitch = 1;

    // Try to explicitly set a matching voice
    const voice = pickVoice(langTag);
    if (voice) {
      utter.voice = voice;
    }
    // If no matching voice and non-English, the browser will try its
    // default — which often results in silence or English pronunciation.
    // We still let it attempt; the user sees the button state change.

    utter.onend = () => { utterRef.current = null; setSpeaking(false); };
    utter.onerror = (e) => {
      // 'interrupted' and 'canceled' are normal when cancel() is called
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('[SevaPath] TTS error:', e.error);
      }
      utterRef.current = null;
      setSpeaking(false);
    };

    // Always cancel previous speech before starting new
    window.speechSynthesis.cancel();
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  };

  const label = speaking ? t.readAloud.stop : t.readAloud.play;
  const Icon = speaking ? VolumeX : Volume2;

  // Check if a voice exists for the requested language
  const hasVoice = !voicesReady || pickVoice(langTag) !== null;
  const fallbackHint = voicesReady && !hasVoice && lang !== 'en';

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        title={label}
        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-border bg-background text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-primary hover:border-primary/50 transition-colors"
        data-testid="read-aloud-btn"
      >
        <Icon className="w-3.5 h-3.5" aria-hidden="true" />
        {label}
      </button>
      {fallbackHint && (
        <span className="text-[10px] text-stone-500" title="Your browser may not have a voice for this language">
          (English voice)
        </span>
      )}
    </span>
  );
}
