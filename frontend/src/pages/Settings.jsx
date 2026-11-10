import React from 'react';
import { Sun, Moon, Monitor, Type, MousePointer2, ShieldCheck, Info, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@astryxdesign/core/Button';
import { Switch } from '@astryxdesign/core/Switch';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { Card } from '@astryxdesign/core/Card';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
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
      <Heading level={1} className="mb-8">{t.settings.title}</Heading>

      <Section title={t.settings.theme}>
        <SegmentedControl
          label="Theme"
          value={settings.theme}
          onChange={(v) => update({ theme: v })}
        >
          {THEMES.map(({ v, Icon }) => (
            <SegmentedControlItem
              key={v}
              value={v}
              label={v === 'light' ? t.settings.themeLight : v === 'dark' ? t.settings.themeDark : t.settings.themeSystem}
              icon={<Icon className="w-4 h-4" aria-hidden="true" />}
              data-testid={TIDS.settingsTheme(v)}
            />
          ))}
        </SegmentedControl>
      </Section>

      <Section title={t.settings.textSize} icon={Type}>
        <SegmentedControl
          label="Text size"
          value={settings.textSize}
          onChange={(v) => update({ textSize: v })}
        >
          {SIZES.map((s) => (
            <SegmentedControlItem
              key={s}
              value={s}
              label={s === 'default' ? t.settings.textDefault : s === 'large' ? t.settings.textLarge : t.settings.textXL}
              data-testid={TIDS.settingsTextSize(s)}
            />
          ))}
        </SegmentedControl>
      </Section>

      <Section title={t.settings.reduceMotion} icon={MousePointer2}>
        <Switch
          label={t.settings.reduceMotion}
          value={settings.reduceMotion}
          onChange={(checked) => update({ reduceMotion: !!checked })}
          description="Turn off non-essential animations"
          data-testid={TIDS.settingsReduceMotion}
        />
      </Section>

      <Section title={t.settings.privacy} icon={ShieldCheck}>
        <Text type="body" as="p" className="mb-4">
          {t.settings.savedOnDevice}
        </Text>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="destructive"
            label={t.settings.clearAll}
            icon={<Trash2 className="w-4 h-4" aria-hidden="true" />}
            onClick={() => {
              if (window.confirm(t.my.clearConfirm)) clearAll();
            }}
            data-testid={TIDS.settingsClearData}
          />
          <Button
            variant="ghost"
            label={t.settings.reset}
            icon={<RotateCcw className="w-4 h-4" aria-hidden="true" />}
            onClick={() => {
              if (window.confirm('Reset SevaPath preferences to defaults?')) reset();
            }}
          />
        </div>
      </Section>

      <Section title={t.settings.about} icon={Info}>
        <Text type="body" as="p">
          {t.settings.aboutBody}
        </Text>

      </Section>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <section className="mb-8">
      <Heading level={2} className="mb-4">
        <span className="inline-flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-primary" aria-hidden="true" />}
          {title}
        </span>
      </Heading>
      <Card>{children}</Card>
    </section>
  );
}
