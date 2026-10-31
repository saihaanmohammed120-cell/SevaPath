import React from 'react';
import {
  Plane, Cake, Home, Briefcase, HeartPulse,
  ShieldCheck, HelpCircle,
} from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { TIDS } from '../lib/testids';

const ICONS = {
  'travelling-abroad': Plane,
  'turning-18': Cake,
  'moving-house': Home,
  'starting-work': Briefcase,
  'healthcare': HeartPulse,
  'safekeeping-documents': ShieldCheck,
  'not-sure': HelpCircle,
};

export default function LifeSituationCards({ onPick }) {
  const { t } = useLang();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {t.home.lifeSituations.map((s) => {
        const Icon = ICONS[s.id] || HelpCircle;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onPick?.(s.id)}
            data-testid={TIDS.lifeSituationCard(s.id)}
            className="group text-left rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:-translate-y-1 hover:shadow-md hover:bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300 flex flex-col h-full"
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-4 transition-transform group-hover:scale-110">
              <Icon className="w-5 h-5" aria-hidden="true" />
            </span>
            <div className="text-base font-semibold text-stone-900 dark:text-stone-100 group-hover:text-primary transition-colors mb-2">
              {s.label}
            </div>
            {s.desc && (
              <div className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mt-auto">
                {s.desc}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
