import React from 'react';
import { Globe, Check } from 'lucide-react';
import { DropdownMenu, DropdownMenuItem } from '@astryxdesign/core/DropdownMenu';
import { useLang } from '../context/LanguageContext';
import { LOCALE_LABELS } from '../lib/i18n';
import { TIDS } from '../lib/testids';

const OPTIONS = [
  { code: 'en', label: 'EN', tid: TIDS.langOptionEn },
  { code: 'hi', label: 'HI', tid: TIDS.langOptionHi },
  { code: 'ta', label: 'TA', tid: TIDS.langOptionTa },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  const current = OPTIONS.find((o) => o.code === lang) || OPTIONS[0];

  return (
    <DropdownMenu
      renderTrigger={(triggerProps) => (
        <button
          type="button"
          {...triggerProps}
          className="inline-flex items-center gap-1.5 h-11 px-3 rounded-md border border-border bg-background text-sm text-stone-700 dark:text-stone-300 hover:bg-accent transition-colors"
          data-testid={TIDS.langSwitcher}
          aria-label={`Change language, current: ${LOCALE_LABELS[lang]}`}
        >
          <Globe className="w-4 h-4" aria-hidden="true" />
          <span className="font-medium">{current.label}</span>
        </button>
      )}
      placement="below"
      alignment="end"
    >
      {OPTIONS.map((o) => (
        <DropdownMenuItem
          key={o.code}
          label={LOCALE_LABELS[o.code]}
          onClick={() => setLang(o.code)}
          endContent={
            lang === o.code ? (
              <Check className="w-4 h-4" aria-hidden="true" />
            ) : undefined
          }
          data-testid={o.tid}
        />
      ))}
    </DropdownMenu>
  );
}
