import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Mic, MicOff, Loader2, Check, X, Edit2 } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { TIDS } from '../lib/testids';


/**
 * Voice input with mandatory transcript preview.
 *
 * Flow: idle → listening → processing → preview (edit) → confirm → send
 * Never silently submits speech. If Web Speech is unavailable, renders
 * a disabled control and text remains fully usable elsewhere.
 */
const LANG_MAP = { en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN' };

export default function VoiceInput({ onTranscript, size = 'md' }) {
  const { lang, t } = useLang();
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  const [editing, setEditing] = useState(false);
  const recRef = useRef(null);
  const genRef = useRef(0); // generation counter to invalidate stale handlers
  const supported =
    typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const stop = useCallback(() => {
    genRef.current += 1; // invalidate any in-flight handlers
    const rec = recRef.current;
    recRef.current = null;
    if (rec) {
      try { rec.onresult = null; rec.onerror = null; rec.onend = null; } catch (_) { /* ignore */ }
      try { rec.abort(); } catch (_) { /* ignore */ }
    }
  }, []);

  const start = useCallback(() => {
    if (!supported) { setState('unsupported'); return; }
    // Abort any prior recognition cleanly before starting a new one
    stop();
    setError('');
    setPreview('');
    setState('listening');
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new Ctor();
    rec.lang = LANG_MAP[lang] || 'en-IN';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.continuous = false;

    // Capture the generation at the time this instance was created.
    // If genRef has moved on by the time a handler fires, it means
    // stop() was called and this instance is stale — ignore events.
    const gen = genRef.current;

    rec.onresult = (ev) => {
      if (genRef.current !== gen) return; // stale instance
      const transcript = (ev.results?.[0]?.[0]?.transcript || '').trim();
      if (transcript) {
        setState('preview');
        setPreview(transcript);
      } else {
        setError("I didn't catch that — try again.");
        setState('error');
        setTimeout(() => setState('idle'), 3500);
      }
    };
    rec.onerror = (ev) => {
      if (genRef.current !== gen) return; // stale instance
      const code = ev.error || 'unknown';
      // 'aborted' fires when we intentionally call rec.abort() — not a user-facing error
      if (code === 'aborted') return;
      const msg =
        code === 'not-allowed' || code === 'permission-denied'
          ? 'Microphone access was denied. You can enable it in your browser settings.'
          : code === 'no-speech'
          ? "I didn't catch that — try again."
          : `Voice input failed (${code}).`;
      setError(msg);
      setState('error');
      setTimeout(() => setState('idle'), 3500);
    };
    rec.onend = () => {
      if (genRef.current !== gen) return; // stale instance
      setState((s) => (s === 'listening' ? 'idle' : s));
      recRef.current = null;
    };

    recRef.current = rec;
    try { 
      rec.start(); 
    } catch (err) { 
      console.warn('[SevaPath] Voice initialization failed:', err);
      recRef.current = null;
      setError('Could not start the microphone. Another app might be using it.');
      setState('error');
      setTimeout(() => setState('idle'), 3500);
    }
  }, [lang, supported, stop]);

  useEffect(() => () => stop(), [stop]);

  const confirmSend = () => {
    if (preview.trim()) onTranscript?.(preview.trim());
    setPreview('');
    setEditing(false);
    setState('idle');
  };

  const discard = () => {
    setPreview('');
    setEditing(false);
    setState('idle');
  };

  const isListening = state === 'listening';
  const isProcessing = state === 'processing';
  const isPreview = state === 'preview';
  const isError = state === 'error';
  const isUnsupported = state === 'unsupported' || !supported;

  const dims = size === 'lg' ? 'w-14 h-14' : 'w-12 h-12';
  const iconDim = size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <div className="flex flex-col items-stretch gap-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            if (isUnsupported) {
              setState('show-unsupported');
              setTimeout(() => setState('idle'), 4000);
              return;
            }
            if (isListening) { stop(); setState('idle'); }
            else if (isPreview) discard();
            else start();
          }}
          aria-disabled={isUnsupported}
          aria-label={
            isUnsupported
              ? 'Voice not supported in this browser'
              : isListening
              ? 'Stop listening'
              : isPreview
              ? 'Discard voice preview'
              : t.home.voice
          }
          title={isUnsupported ? 'Voice not supported in this browser' : t.home.voice}
          data-testid={TIDS.voiceBtn}
          className={`${dims} shrink-0 inline-flex items-center justify-center rounded-full border transition-colors ${
            isListening
              ? 'bg-primary text-primary-foreground border-primary sp-listening'
              : isError
              ? 'bg-destructive/10 text-destructive border-destructive/30'
              : isUnsupported
              ? 'bg-muted text-muted-foreground border-border cursor-not-allowed'
              : 'bg-background text-stone-700 dark:text-stone-300 border-border hover:bg-accent hover:text-primary'
          }`}
        >
          {isProcessing ? (
            <Loader2 className={`${iconDim} animate-spin`} aria-hidden="true" />
          ) : isUnsupported ? (
            <MicOff className={iconDim} aria-hidden="true" />
          ) : (
            <Mic className={iconDim} aria-hidden="true" />
          )}
        </button>
        {!isUnsupported && !isError && !isPreview && isListening && (
          <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-primary animate-pulse bg-background/80 px-2 py-1 rounded shadow-sm border border-border">
            Listening…
          </span>
        )}
      </div>

      {isPreview && (
        <div
          className="absolute top-full right-0 mt-3 z-50 rounded-lg border border-border bg-background shadow-lg p-3 min-w-[280px]"
          role="dialog"
          aria-label={t.voice.preview}
          data-testid="voice-preview"
        >
          <p className="text-[11px] uppercase tracking-widest text-primary font-semibold mb-1.5">
            {t.voice.heardYou}
          </p>
          {editing ? (
            <textarea
              autoFocus
              rows={2}
              value={preview}
              onChange={(e) => setPreview(e.target.value)}
              className="w-full resize-none rounded-md border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              data-testid="voice-preview-edit"
            />
          ) : (
            <p className="text-sm text-stone-800 dark:text-stone-200 break-words">
              {preview || '…'}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              type="button"
              onClick={confirmSend}
              disabled={!preview.trim()}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium disabled:opacity-50 hover:bg-[hsl(var(--sp-terracotta-deep))]"
              data-testid="voice-preview-confirm"
            >
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
              {t.voice.confirmSend}
            </button>
            <button
              type="button"
              onClick={() => setEditing((e) => !e)}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border bg-background text-xs font-medium hover:bg-accent"
              data-testid="voice-preview-edit-toggle"
            >
              <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
              {t.voice.edit}
            </button>
            <button
              type="button"
              onClick={discard}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border bg-background text-xs font-medium text-destructive hover:bg-destructive/10"
              data-testid="voice-preview-discard"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              {t.voice.discard}
            </button>
          </div>
        </div>
      )}

      {isError && (
        <div role="alert" className="absolute top-full right-0 mt-2 z-40 bg-background border border-destructive/20 p-2 rounded shadow-md text-[11px] text-destructive max-w-[16rem]">
          {error}
        </div>
      )}
      {state === 'show-unsupported' && (
        <div role="alert" className="absolute top-full right-0 mt-2 z-40 bg-stone-800 text-stone-100 dark:bg-stone-200 dark:text-stone-900 px-3 py-2 rounded text-[11px] shadow-md w-[200px]">
          Voice isn't available here. You can continue by typing.
        </div>
      )}
    </div>
  );
}
