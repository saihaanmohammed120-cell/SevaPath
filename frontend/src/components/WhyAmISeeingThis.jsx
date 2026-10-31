import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { HelpCircle } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

export default function WhyAmISeeingThis({ body }) {
  const { t } = useLang();
  return (
    <Popover>
      <PopoverTrigger
        className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-primary transition-colors underline underline-offset-2 min-h-[32px]"
        aria-label={t.trust.whySeeing}
      >
        <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
        {t.trust.whySeeing}
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-popover text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
        {body || t.trust.whyBody}
      </PopoverContent>
    </Popover>
  );
}
