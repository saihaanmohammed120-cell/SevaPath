import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Loader2, Compass } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { useLang } from '../context/LanguageContext';
import { useJourney } from '../context/JourneyContext';
import { askCopilot } from '../lib/api';
import { TIDS } from '../lib/testids';
import TrustBadge from './TrustBadge';
import ReadAloud from './ReadAloud';

export default function CopilotDock() {
  const { t, lang } = useLang();
  const location = useLocation();
  const { getJourney, guideOpen, setGuideOpen, guideContext, setGuideContext } = useJourney();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // Initialize with context if provided
  useEffect(() => {
    if (guideContext && guideOpen && messages.length === 0) {
      setMessages([{
        role: 'user',
        content: `I have a question about this: ${guideContext.question}`
      }, {
        role: 'assistant',
        content: `I see you are looking at the verified information from **${guideContext.sourceName}**:\n\n"${guideContext.answer}"\n\nHow can I help you understand or apply this information?`,
        isFaqContext: true
      }]);
    }
  }, [guideContext, guideOpen, messages.length]);

  // Contextual guide
  const isJourneyRoute = location.pathname.startsWith('/journey/');
  const journeyId = isJourneyRoute ? location.pathname.split('/')[2] : null;
  const journey = journeyId ? getJourney(journeyId) : null;
  const stage = journey?.stage;

  let contextualSuggestions = t.copilot.suggestions;
  let contextualTitle = t.copilot.emptyTitle;
  
  if (isJourneyRoute && stage) {
    if (stage === 'eligibility') {
      contextualSuggestions = ["Explain this eligibility rule", "What if I don't meet one condition?"];
      contextualTitle = "Need help with eligibility?";
    } else if (stage === 'documents') {
      contextualSuggestions = ["What exactly is this document?", "Can I use an alternative document?"];
      contextualTitle = "Need help with documents?";
    } else if (stage === 'procedure') {
      contextualSuggestions = ["What happens in the next step?", "How long does this take?"];
      contextualTitle = "Need help with the process?";
    } else if (stage === 'application') {
      contextualSuggestions = ["How does the official handoff work?", "Is this link safe?"];
      contextualTitle = "Ready to apply?";
    }
  }

  async function sendText(text) {
    if (!text || sending) return;
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setSending(true);
    try {
      const r = await askCopilot({ message: text, session_id: sessionId, language: lang });
      if (!sessionId && r.session_id) setSessionId(r.session_id);
      
      let error = false;
      let replyContent = r.reply;
      
      if (r.reason === 'rate_limit') {
        error = true;
        replyContent = 'SevaPath Guide is experiencing high traffic. Please try again in a moment.';
      } else if (r.reason === 'network_error') {
        error = true;
        replyContent = 'Network error. Please check your connection and try again.';
      } else if (r.reason === 'not_configured') {
        error = true;
        replyContent = 'SevaPath Guide is temporarily unavailable. You can still continue using verified service information.';
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: replyContent, error, meta: r }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "SevaPath Guide is temporarily unavailable. You can still continue using verified service information.",
          error: true,
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  const handleOpenChange = (isOpen) => {
    setGuideOpen(isOpen);
    if (!isOpen) {
      // Clear context when closed if we only have the context messages
      if (messages.length <= 2 && guideContext) {
        setGuideContext(null);
        setMessages([]);
      }
    }
  };

  async function submit(e) {
    e?.preventDefault?.();
    const text = input.trim();
    if (!text) return;
    setInput('');
    await sendText(text);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setGuideOpen(true)}
        data-testid={TIDS.copilotToggle}
        aria-label="Open SevaPath Guide"
        className="fixed bottom-6 right-6 z-30 h-11 pl-4 pr-5 rounded-full bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 shadow-sm hover:shadow hover:bg-card hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-2 transition-all group"
      >
        <Compass className="w-4 h-4 text-stone-400 group-hover:text-primary transition-colors" aria-hidden="true" />
        <span className="font-medium text-sm">SevaPath Guide</span>
      </button>

      <Sheet open={guideOpen} onOpenChange={handleOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md p-0 flex flex-col bg-background text-foreground"
          data-testid={TIDS.copilotPanel}
        >
          <SheetHeader className="px-5 py-4 border-b border-border bg-card">
            <SheetTitle className="flex items-center gap-2 font-display">
              <span
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground shadow-sm shrink-0"
                aria-hidden="true"
              >
                <Compass className="w-5 h-5" />
              </span>
              <div className="text-left leading-tight">
                <div className="text-base font-bold text-stone-900 dark:text-stone-100">
                  SevaPath Guide
                </div>
                <div className="text-[11px] font-normal text-stone-500 dark:text-stone-400">
                  {t.copilot.subtitle}
                </div>
              </div>
              <TrustBadge variant="ai-guidance" className="ml-auto" />
            </SheetTitle>
          </SheetHeader>

          <div
            className="flex-1 overflow-y-auto px-4 py-5 space-y-4"
            role="log"
            aria-live="polite"
          >
            {messages.length === 0 && (
              <div className="text-sm text-stone-600 dark:text-stone-400 space-y-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-stone-900 dark:text-stone-100 mb-1">
                    {contextualTitle}
                  </h3>
                  <p className="leading-relaxed">{t.copilot.emptyBody}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold mb-2">
                    Try one of these
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {contextualSuggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => sendText(s)}
                        data-testid={`copilot-suggestion-${i}`}
                        className="min-h-[40px] px-3 rounded-full border border-border bg-card text-sm text-stone-700 dark:text-stone-300 hover:border-primary/40 hover:text-primary transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-stone-500 border border-border rounded-md p-3 bg-muted/40 leading-relaxed">
                  {t.copilot.safety}
                </p>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                data-testid={TIDS.copilotMessage(i)}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : m.error
                      ? 'bg-destructive/10 text-destructive border border-destructive/30 rounded-tl-sm'
                      : 'bg-muted text-stone-800 dark:text-stone-200 border border-border rounded-tl-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.content}</p>
                  {m.role === 'assistant' && !m.error && (
                    <div className="mt-2 -ml-1">
                      <ReadAloud text={m.content} />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-4 py-2.5 text-sm bg-muted border border-border inline-flex items-center gap-2 text-stone-600">
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  Thinking…
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={submit}
            className="border-t border-border p-3 flex gap-2 items-end bg-background"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder={t.copilot.placeholder}
              rows={2}
              data-testid={TIDS.copilotInput}
              aria-label={t.copilot.placeholder}
              className="flex-1 resize-none min-h-[44px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button
              type="submit"
              disabled={!input.trim() || sending}
              data-testid={TIDS.copilotSend}
              className="h-11"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </Button>
          </form>
          <div className="px-4 pb-3 text-[11px] text-stone-500 leading-relaxed">
            {t.copilot.safety}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
