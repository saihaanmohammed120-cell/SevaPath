import React from 'react';
import { Globe, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
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
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center gap-1.5 h-11 px-3 rounded-md border border-border bg-background text-sm text-stone-700 dark:text-stone-300 hover:bg-accent transition-colors"
        data-testid={TIDS.langSwitcher}
        aria-label={`Change language, current: ${LOCALE_LABELS[lang]}`}
      >
        <Globe className="w-4 h-4" aria-hidden="true" />
        <span className="font-medium">{current.label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px] bg-popover">
        {OPTIONS.map((o) => (
          <DropdownMenuItem
            key={o.code}
            onSelect={() => setLang(o.code)}
            data-testid={o.tid}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>{LOCALE_LABELS[o.code]}</span>
            {lang === o.code && <Check className="w-4 h-4 text-primary" aria-hidden="true" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
