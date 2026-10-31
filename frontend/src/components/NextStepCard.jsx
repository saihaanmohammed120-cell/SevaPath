import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { STAGES } from '../context/JourneyContext';
import { useLang } from '../context/LanguageContext';

/**
 * "Your next step" — a prominent, always-visible next-action card
 * synthesised from the deterministic journey state.
 */
export default function NextStepCard({ journey, service, onAdvance }) {
  const { t } = useLang();
  const stage = journey.stage;
  const idx = STAGES.indexOf(stage);
  const nextIdx = idx + 1;
  const nextStage = nextIdx < STAGES.length ? STAGES[nextIdx] : null;

  const map = {
    understand: {
      body: `Read who ${service.identity?.short_label || 'this service'} is for and confirm it matches your goal.`,
      cta: t.journey.understandCta,
      target: 'confirm',
    },
    confirm: {
      body: `Review the details of ${service.identity?.short_label || 'the service'} and continue to check the requirements.`,
      cta: t.journey.confirmContinue,
      target: 'eligibility',
    },
    eligibility: {
      body: 'Answer a few short questions so SevaPath can check if this service applies to you.',
      cta: t.journey.eligibilityContinue,
      target: journey.eligibilityResult ? 'documents' : null,
    },
    documents: {
      body: 'Tell SevaPath which required documents you already have. Uploading is optional.',
      cta: t.journey.documentsContinue,
      target: 'procedure',
    },
    procedure: {
      body: 'Review the process end to end, then move on to how to apply.',
      cta: t.journey.procedureContinue,
      target: 'application',
    },
    application: {
      body: (service.application?.mode || 'unavailable') === 'unavailable'
        ? "SevaPath doesn't have a verified application route for this record yet."
        : 'Continue to the official application on the verified portal.',
      cta: 'Open how to apply',
      target: null,
    },
  };

  const step = map[stage] || map.understand;

  return (
    <aside
      aria-label={t.journey.nextStepTitle}
      className="rounded-xl border border-border bg-card p-5 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-70"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle at 100% 0%, hsl(var(--sp-terracotta) / 0.10), transparent 55%)',
        }}
      />
      <div className="relative">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-primary font-semibold">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          {t.journey.nextStepTitle}
        </div>
        <p className="mt-2 font-display text-lg font-bold text-stone-900 dark:text-stone-100">
          {t.journey.stages[stage]}
        </p>
        <p className="mt-1.5 text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
          {step.body}
        </p>
        {step.target && (
          <Button
            className="mt-4 min-h-[44px] h-auto py-2 text-wrap leading-tight"
            onClick={() => onAdvance(step.target)}
            data-testid="next-step-cta"
          >
            {step.cta}
            <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
          </Button>
        )}
      </div>
    </aside>
  );
}
