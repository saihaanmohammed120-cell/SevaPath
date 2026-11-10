import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@astryxdesign/core/Button';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { Card } from '@astryxdesign/core/Card';
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
    <Card aria-label={t.journey.nextStepTitle}>
      <div className="relative">
        <Text type="label" color="accent" className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          {t.journey.nextStepTitle}
        </Text>
        <Heading level={3} className="mt-2">
          {t.journey.stages[stage]}
        </Heading>
        <Text type="body" as="p" className="mt-1.5">
          {step.body}
        </Text>
        {step.target && (
          <div className="mt-4">
            <Button
              label={step.cta}
              variant="primary"
              icon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
              onClick={() => onAdvance(step.target)}
              data-testid="next-step-cta"
            />
          </div>
        )}
      </div>
    </Card>
  );
}
