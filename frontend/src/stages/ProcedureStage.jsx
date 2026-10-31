import React from 'react';
import { Button } from '../components/ui/button';
import { useLang } from '../context/LanguageContext';
import { TIDS } from '../lib/testids';

export default function ProcedureStage({ service, onContinue }) {
  const { t } = useLang();
  const steps = service.procedure || [];
  return (
    <section aria-labelledby="stage-procedure">
      <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-2">
        Step 5 · {t.journey.stages.procedure}
      </p>
      <h2 id="stage-procedure" className="font-display text-2xl sm:text-3xl font-bold mb-2">
        How the process works
      </h2>
      <p className="text-stone-700 dark:text-stone-300 mb-6">{t.journey.procedureIntro}</p>

      <ol className="space-y-4">
        {steps.map((s, i) => (
          <li
            key={s.step}
            className="flex gap-4"
            data-testid={TIDS.procedureStep(i)}
          >
            <span className="shrink-0 w-9 h-9 rounded-full bg-accent text-primary inline-flex items-center justify-center font-display font-bold">
              {s.step}
            </span>
            <div>
              <h3 className="font-semibold text-stone-900 dark:text-stone-100">{s.title}</h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{s.description}</p>
            </div>
          </li>
        ))}
      </ol>

      {service.fees && (
        <p className="mt-6 text-sm text-stone-600 dark:text-stone-400">
          <span className="font-medium text-stone-800 dark:text-stone-200">Fees:</span> {service.fees}
        </p>
      )}
      {service.deadlines && (
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
          <span className="font-medium text-stone-800 dark:text-stone-200">Deadlines:</span>{' '}
          {service.deadlines}
        </p>
      )}

      <Button
        onClick={onContinue}
        size="lg"
        className="mt-8 min-h-[48px]"
        data-testid={TIDS.primaryNextAction}
      >
        {t.journey.procedureContinue}
      </Button>
    </section>
  );
}
