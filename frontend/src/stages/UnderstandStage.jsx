import React from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Text } from '@astryxdesign/core/Text';

import { useLang } from '../context/LanguageContext';
import { TIDS } from '../lib/testids';

export default function UnderstandStage({ service, onConfirm, onReject }) {
  const { t } = useLang();
  return (
    <section aria-labelledby="stage-understand">
      <Text type="label" color="accent" className="mb-4">
        {`Step 1 · ${t.journey.stages.understand}`}
      </Text>
      <Text type="large" as="p" display="block" className="max-w-2xl" weight="medium">
        {service.description}
      </Text>



      <div className="flex flex-wrap gap-3 mt-8">
        <Button
          label={t.journey.understandCta}
          onClick={onConfirm}
          size="lg"
          variant="primary"
          data-testid={TIDS.primaryNextAction}
        />
        <Button
          label={t.journey.understandWrong}
          variant="secondary"
          size="lg"
          onClick={onReject}
        />
      </div>
    </section>
  );
}
