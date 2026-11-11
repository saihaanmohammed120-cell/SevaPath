import React, { useState, useEffect } from 'react';
import { Send, Loader2, Compass, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Drawer } from '@astryxdesign/core/Drawer';
import { Button } from '@astryxdesign/core/Button';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { TextArea } from '@astryxdesign/core/TextArea';
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

      <Drawer
        isOpen={guideOpen}
        onOpenChange={handleOpenChange}
        label="SevaPath Guide"
        width={400}
        purpose="form"
        // Below 640px the drawer keeps a 56px page reveal, leaving a
        // ~330px panel where the header title wraps mid-phrase and the
        // subtitle is squeezed. Full-width on mobile is the documented
        // fix for chat-style drawers. NOTE: experimental prop — it may
        // change in a future Astryx patch; re-check after any upgrade.
        experimental={{ isFullWidthOnMobile: true }}
        data-testid={TIDS.copilotPanel}
      >
        <div className="flex flex-col h-full">
          <div className="px-5 py-4 border-b border-border bg-card shrink-0">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground shadow-sm shrink-0"
                aria-hidden="true"
              >
                <Compass className="w-5 h-5" />
              </span>
              {/* Same Astryx Text quirk as the footer/tracker: both Texts
                  are display:inline, so without flex-col the subtitle
                  runs onto the title line and collides with the badge. */}
              <div className="text-left leading-tight flex flex-col">
                <Text weight="bold" className="text-base">
                  SevaPath Guide
                </Text>
                <Text type="supporting" as="p">
                  {t.copilot.subtitle}
                </Text>
              </div>
              <span className="ml-auto">
                <TrustBadge variant="ai-guidance" />
              </span>
              {/* Astryx Drawer renders no close button of its own, and with
                  purpose="form" an outside tap does not close it — on phones
                  the full-width drawer had no way to close at all (Escape
                  only). Give it an explicit close button. */}
              <Button
                variant="ghost"
                size="sm"
                icon={<X className="w-4 h-4" aria-hidden="true" />}
                onClick={() => handleOpenChange(false)}
                aria-label={t.common.close}
                className="shrink-0"
              />
            </div>
          </div>

          <div
            className="flex-1 overflow-y-auto px-4 py-5 space-y-4"
            role="log"
            aria-live="polite"
          >
            {messages.length === 0 && (
              <div className="text-sm space-y-4">
                <div>
                  <Heading level={3} className="mb-1">
                    {contextualTitle}
                  </Heading>
                  <Text type="body" as="p">{t.copilot.emptyBody}</Text>
                </div>
                <div>
                  <Text type="label" className="mb-2">
                    Try one of these
                  </Text>
                  <div className="flex flex-wrap gap-2">
                    {contextualSuggestions.map((s, i) => (
                      <Button
                        key={i}
                        label={s}
                        variant="secondary"
                        size="sm"
                        onClick={() => sendText(s)}
                        data-testid={`copilot-suggestion-${i}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-xs border border-border rounded-md p-3 bg-muted/40 leading-relaxed">
                  <Text type="supporting" as="p">{t.copilot.safety}</Text>
                </div>
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
            className="border-t border-border p-3 flex gap-2 items-end bg-background shrink-0"
          >
            <div
              className="flex-1 min-w-0"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
            >
              <TextArea
                label={t.copilot.placeholder}
                isLabelHidden
                value={input}
                onChange={(v) => setInput(v)}
                placeholder={t.copilot.placeholder}
                rows={2}
                data-testid={TIDS.copilotInput}
                width="100%"
              />
            </div>
            <Button
              type="submit"
              label="Send"
              isIconOnly
              icon={<Send className="w-4 h-4" aria-hidden="true" />}
              isDisabled={!input.trim() || sending}
              data-testid={TIDS.copilotSend}
            />
          </form>
          <div className="px-4 pb-3 text-[11px] text-stone-500 leading-relaxed shrink-0">
            {t.copilot.safety}
          </div>
        </div>
      </Drawer>
    </>
  );
}
