import React from 'react';
import { Button } from '../components/ui/button';
import { useLang } from '../context/LanguageContext';
import { TIDS } from '../lib/testids';
import { Building2 } from 'lucide-react';

export default function ConfirmStage({ service, onContinue }) {
  const { t } = useLang();
  return (
    <section aria-labelledby="stage-confirm">
      <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-2">
        Step 2 · {t.journey.stages.confirm}
      </p>
      <h2 id="stage-confirm" className="font-display text-2xl sm:text-3xl font-bold mb-4">
        {t.journey.confirmTitle}
      </h2>
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-accent text-primary shrink-0">
            <Building2 className="w-5 h-5" aria-hidden="true" />
          </span>
          <div>
            <div className="font-display font-semibold text-lg">
              {service.identity?.canonical_name}
            </div>
            <div className="text-sm text-stone-600 dark:text-stone-400 mt-0.5">
              {service.authority?.name}
              {service.jurisdiction?.state ? ` · ${service.jurisdiction.state}` : ''}
              {service.jurisdiction?.level ? ` · ${service.jurisdiction.level}` : ''}
            </div>
            <div className="text-sm text-stone-600 dark:text-stone-400 mt-3 leading-relaxed">
              {service.description}
            </div>
          </div>
        </div>
      </div>
      <Button
        onClick={onContinue}
        size="lg"
        className="mt-8 min-h-[48px]"
        data-testid={TIDS.primaryNextAction}
      >
        {t.journey.confirmContinue}
      </Button>
    </section>
  );
}
