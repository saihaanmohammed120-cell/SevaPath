import React from 'react';
import { Sun, Moon, Monitor, Type, MousePointer2, ShieldCheck, Info, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { useSettings } from '../context/SettingsContext';
import { useJourney } from '../context/JourneyContext';
import { useLang } from '../context/LanguageContext';
import { TIDS } from '../lib/testids';

const THEMES = [
  { v: 'light', Icon: Sun },
  { v: 'dark', Icon: Moon },
  { v: 'system', Icon: Monitor },
];
const SIZES = ['default', 'large', 'xl'];

export default function Settings() {
  const { t } = useLang();
  const { settings, update, reset } = useSettings();
  const { clearAll } = useJourney();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-20">
      <h1 className="font-display text-3xl sm:text-4xl font-bold mb-8">{t.settings.title}</h1>

      <Section title={t.settings.theme}>
        <div className="flex gap-2 flex-wrap">
          {THEMES.map(({ v, Icon }) => (
            <button
              key={v}
              type="button"
              onClick={() => update({ theme: v })}
              data-testid={TIDS.settingsTheme(v)}
              className={`min-h-[48px] px-4 rounded-md border inline-flex items-center gap-2 text-sm font-medium transition-colors ${
                settings.theme === v
                  ? 'border-primary bg-accent text-primary'
                  : 'border-border bg-card text-stone-700 dark:text-stone-300 hover:border-primary/40'
              }`}
              aria-pressed={settings.theme === v}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              {v === 'light' ? t.settings.themeLight : v === 'dark' ? t.settings.themeDark : t.settings.themeSystem}
            </button>
          ))}
        </div>
      </Section>

      <Section title={t.settings.textSize} icon={Type}>
        <div className="flex gap-2 flex-wrap">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => update({ textSize: s })}
              data-testid={TIDS.settingsTextSize(s)}
              className={`min-h-[48px] px-4 rounded-md border text-sm font-medium transition-colors ${
                settings.textSize === s
                  ? 'border-primary bg-accent text-primary'
                  : 'border-border bg-card text-stone-700 dark:text-stone-300 hover:border-primary/40'
              }`}
              aria-pressed={settings.textSize === s}
            >
              {s === 'default' ? t.settings.textDefault : s === 'large' ? t.settings.textLarge : t.settings.textXL}
            </button>
          ))}
        </div>
      </Section>

      <Section title={t.settings.reduceMotion} icon={MousePointer2}>
        <div className="flex items-center gap-3">
          <Switch
            checked={settings.reduceMotion}
            onCheckedChange={(v) => update({ reduceMotion: !!v })}
            data-testid={TIDS.settingsReduceMotion}
            aria-label={t.settings.reduceMotion}
          />
          <span className="text-sm text-stone-600 dark:text-stone-400">
            Turn off non-essential animations
          </span>
        </div>
      </Section>

      <Section title={t.settings.privacy} icon={ShieldCheck}>
        <p className="text-sm text-stone-700 dark:text-stone-300 mb-4">
          {t.settings.savedOnDevice}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => {
              if (window.confirm(t.my.clearConfirm)) clearAll();
            }}
            data-testid={TIDS.settingsClearData}
            className="min-h-[44px]"
          >
            <Trash2 className="w-4 h-4 mr-1" aria-hidden="true" />
            {t.settings.clearAll}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (window.confirm('Reset SevaPath preferences to defaults?')) reset();
            }}
            className="min-h-[44px]"
          >
            <RotateCcw className="w-4 h-4 mr-1" aria-hidden="true" />
            {t.settings.reset}
          </Button>
        </div>
      </Section>

      <Section title={t.settings.about} icon={Info}>
        <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
          {t.settings.aboutBody}
        </p>

      </Section>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <section className="mb-8">
      <h2 className="font-display text-lg font-semibold flex items-center gap-2 mb-4">
        {Icon && <Icon className="w-4 h-4 text-primary" aria-hidden="true" />}
        {title}
      </h2>
      <div className="rounded-lg border border-border bg-card p-5">{children}</div>
    </section>
  );
}
