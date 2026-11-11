import React from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { Card } from '@astryxdesign/core/Card';
import { useLang } from '../context/LanguageContext';
import { TIDS } from '../lib/testids';
import { Building2 } from 'lucide-react';

export default function ConfirmStage({ service, onContinue }) {
  const { t } = useLang();
  return (
    <section aria-labelledby="stage-confirm">
      <Text type="label" color="accent" className="mb-2">
        Step 2 · {t.journey.stages.confirm}
      </Text>
      <Heading level={2} id="stage-confirm" className="mb-4">
        {t.journey.confirmTitle}
      </Heading>
      <Card>
        <div className="flex items-start gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-accent text-primary shrink-0">
            <Building2 className="w-5 h-5" aria-hidden="true" />
          </span>
          <div>
            <Heading level={3}>
              {service.identity?.canonical_name}
            </Heading>
            <Text type="body" as="p" className="mt-0.5">
              {service.authority?.name}
              {service.jurisdiction?.state ? ` · ${service.jurisdiction.state}` : ''}
              {service.jurisdiction?.level ? ` · ${service.jurisdiction.level}` : ''}
            </Text>
            <Text type="body" as="p" display="block" className="mt-3">
              {service.description}
            </Text>
          </div>
        </div>
      </Card>
      <Button
        label={t.journey.confirmContinue}
        onClick={onContinue}
        size="lg"
        variant="primary"
        className="mt-8"
        data-testid={TIDS.primaryNextAction}
      />
    </section>
  );
}
