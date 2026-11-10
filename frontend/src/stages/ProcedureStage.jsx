import React from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { useLang } from '../context/LanguageContext';
import { TIDS } from '../lib/testids';

export default function ProcedureStage({ service, onContinue }) {
  const { t } = useLang();
  const steps = service.procedure || [];
  return (
    <section aria-labelledby="stage-procedure">
      <Text type="label" color="accent" className="mb-2">
        Step 5 · {t.journey.stages.procedure}
      </Text>
      <Heading level={2} id="stage-procedure" className="mb-2">
        How the process works
      </Heading>
      <Text type="body" as="p" className="mb-6">{t.journey.procedureIntro}</Text>

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
              <Heading level={3}>{s.title}</Heading>
              <Text type="body" as="p" className="mt-1">{s.description}</Text>
            </div>
          </li>
        ))}
      </ol>

      {service.fees && (
        <Text type="body" as="p" className="mt-6">
          <strong>Fees:</strong> {service.fees}
        </Text>
      )}
      {service.deadlines && (
        <Text type="body" as="p" className="mt-1">
          <strong>Deadlines:</strong> {service.deadlines}
        </Text>
      )}

      <Button
        label={t.journey.procedureContinue}
        onClick={onContinue}
        size="lg"
        variant="primary"
        className="mt-8"
        data-testid={TIDS.primaryNextAction}
      />
    </section>
  );
}
