import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Play, Info, ShieldCheck } from 'lucide-react';
import { Button } from '@astryxdesign/core/Button';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { Card } from '@astryxdesign/core/Card';
import { Badge } from '@astryxdesign/core/Badge';
import { ProgressBar } from '@astryxdesign/core/ProgressBar';
import { AlertDialog } from '@astryxdesign/core/AlertDialog';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { useJourney, STAGES } from '../context/JourneyContext';
import { useLang } from '../context/LanguageContext';
import { TIDS } from '../lib/testids';

function stageProgress(j) {
  const idx = STAGES.indexOf(j.stage);
  return Math.round(((idx + 1) / STAGES.length) * 100);
}

function documentsSummary(j) {
  const s = j.documentStatus || {};
  const ids = Object.keys(s);
  if (ids.length === 0) return null;
  const yes = ids.filter((k) => s[k] === 'YES').length;
  const no = ids.filter((k) => s[k] === 'NO').length;
  return { total: ids.length, yes, no, unanswered: ids.length - yes - no };
}

export default function MySevaPath() {
  const { t } = useLang();
  const nav = useNavigate();
  const { listJourneys, deleteJourney, clearAll } = useJourney();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const rows = listJourneys();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-20">
      <div className="mb-8">
        <Heading level={1}>{t.my.title}</Heading>
        <Text type="body" as="p" className="mt-2">{t.my.subtitle}</Text>
      </div>

      <div className="rounded-md border border-border bg-card p-4 flex items-start gap-3 mb-6">
        <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
        <div className="text-sm text-stone-700 dark:text-stone-300">
          <p className="font-medium">{t.my.storageNote}</p>
          <p className="text-xs text-stone-500 mt-1">
            SevaPath does not upload your journey to any server in this version.
            Everything you see below is stored on this device only.
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title={t.my.empty}
          icon={<Info className="w-6 h-6 text-stone-400" aria-hidden="true" />}
          actions={<Button label="Start a journey" variant="primary" onClick={() => nav('/')} />}
        />
      ) : (
        <ul className="space-y-4">
          {rows.map((j) => {
            const docs = documentsSummary(j);
            return (
              <li
                key={j.id}
                data-testid={TIDS.mySavedRow(j.id)}
              >
                <Card>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Heading level={3}>
                          {j.serviceLabel}
                        </Heading>
                        {j.isTestFixture && (
                          <Badge label={t.common.testOnly} variant="warning" />
                        )}
                      </div>
                      <Text type="supporting" as="p" className="mt-1">
                        Updated {new Date(j.updatedAt).toLocaleString()}
                      </Text>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                          <span>Currently on: <strong className="text-stone-700 dark:text-stone-300 font-medium">{t.journey.stages[j.stage]}</strong></span>
                          <span>{stageProgress(j)}%</span>
                        </div>
                        <ProgressBar
                          label="Journey progress"
                          value={stageProgress(j)}
                          max={100}
                          isLabelHidden
                          hasValueLabel={false}
                        />
                      </div>
                      {docs && (
                        <Text type="supporting" as="p" className="mt-3">
                          Documents: <strong>{docs.yes}</strong> available · <strong>{docs.no}</strong> missing · <strong>{docs.unanswered}</strong> unanswered
                        </Text>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        label={t.my.resume}
                        variant="primary"
                        icon={<Play className="w-4 h-4" aria-hidden="true" />}
                        onClick={() => nav(`/journey/${j.id}`)}
                        data-testid={TIDS.mySavedResume(j.id)}
                      />
                      <Button
                        size="sm"
                        label={t.my.delete}
                        variant="secondary"
                        icon={<Trash2 className="w-4 h-4" aria-hidden="true" />}
                        onClick={() => deleteJourney(j.id)}
                        data-testid={TIDS.mySavedDelete(j.id)}
                      />
                    </div>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      {rows.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border">
          <Button
            variant="secondary"
            label={t.my.clearAll}
            icon={<Trash2 className="w-4 h-4" aria-hidden="true" />}
            onClick={() => setConfirmOpen(true)}
            data-testid={TIDS.myClearAll}
          />
          <AlertDialog
            isOpen={confirmOpen}
            onOpenChange={setConfirmOpen}
            title={t.my.clearAll}
            description={t.my.clearConfirm}
            actionLabel={t.common.ok}
            onAction={() => { clearAll(); setConfirmOpen(false); }}
            cancelLabel={t.common.cancel}
            actionVariant="destructive"
          />
        </div>
      )}
    </div>
  );
}
