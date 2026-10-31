import React from 'react';
import { Button } from '../components/ui/button';

import { useLang } from '../context/LanguageContext';
import { TIDS } from '../lib/testids';

export default function UnderstandStage({ service, onConfirm, onReject }) {
  const { t } = useLang();
  return (
    <section aria-labelledby="stage-understand">
      <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-4">
        Step 1 · {t.journey.stages.understand}
      </p>
      <p className="text-stone-800 dark:text-stone-200 text-lg sm:text-xl leading-relaxed max-w-2xl font-medium">
        {service.description}
      </p>



      <div className="flex flex-wrap gap-3 mt-8">
        <Button
          onClick={onConfirm}
          size="lg"
          className="min-h-[48px] h-auto py-2 text-wrap leading-tight"
          data-testid={TIDS.primaryNextAction}
        >
          {t.journey.understandCta}
        </Button>
        <Button variant="outline" size="lg" onClick={onReject} className="min-h-[48px] h-auto py-2 text-wrap leading-tight">
          {t.journey.understandWrong}
        </Button>
      </div>
    </section>
  );
}
