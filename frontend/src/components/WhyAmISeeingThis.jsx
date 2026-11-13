import React from 'react';
import { Popover } from '@astryxdesign/core/Popover';
import { Text } from '@astryxdesign/core/Text';
import { HelpCircle } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

export default function WhyAmISeeingThis({ body }) {
  const { t } = useLang();
  return (
    <Popover
      content={<Text type="body">{body || t.trust.whyBody}</Text>}
      placement="below"
      width={320}
    >
      <button
        type="button"
        className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-primary transition-colors underline underline-offset-2 min-h-[32px]"
        aria-label={t.trust.whySeeing}
      >
        <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
        {t.trust.whySeeing}
      </button>
    </Popover>
  );
}
