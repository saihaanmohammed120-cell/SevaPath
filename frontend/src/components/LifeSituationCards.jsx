import React from 'react';
import {
  Plane, Cake, Home, Briefcase, HeartPulse,
  ShieldCheck, HelpCircle,
} from 'lucide-react';
import { Card } from '@astryxdesign/core/Card';
import { Grid } from '@astryxdesign/core/Grid';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
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
    <Grid columns={{ minWidth: 280, max: 4 }} gap={4}>
      {t.home.lifeSituations.map((s) => {
        const Icon = ICONS[s.id] || HelpCircle;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onPick?.(s.id)}
            data-testid={TIDS.lifeSituationCard(s.id)}
            className="group text-left h-full transition-all duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
          >
            <Card>
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-4 transition-transform group-hover:scale-110">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </span>
              <Heading level={3} className="mb-2">
                {s.label}
              </Heading>
              {s.desc && (
                <Text type="body" as="p" className="mt-auto">
                  {s.desc}
                </Text>
              )}
            </Card>
          </button>
        );
      })}
    </Grid>
  );
}
