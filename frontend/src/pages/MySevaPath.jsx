import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Play, Info, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import { Progress } from '../components/ui/progress';
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
  const rows = listJourneys();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-20">
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold">{t.my.title}</h1>
        <p className="text-stone-600 dark:text-stone-400 mt-2">{t.my.subtitle}</p>
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
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-10 text-center text-stone-600 dark:text-stone-400">
          <Info className="w-6 h-6 mx-auto mb-2 text-stone-400" aria-hidden="true" />
          {t.my.empty}
          <div className="mt-4">
            <Button onClick={() => nav('/')}>Start a journey</Button>
          </div>
        </div>
      ) : (
        <ul className="space-y-4">
          {rows.map((j) => {
            const docs = documentsSummary(j);
            return (
              <li
                key={j.id}
                data-testid={TIDS.mySavedRow(j.id)}
                className="rounded-lg border border-border bg-card p-5"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-display font-semibold text-lg text-stone-900 dark:text-stone-100">
                        {j.serviceLabel}
                      </h2>
                      {j.isTestFixture && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                          {t.common.testOnly}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Updated {new Date(j.updatedAt).toLocaleString()}
                    </p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                        <span>Currently on: <strong className="text-stone-700 dark:text-stone-300 font-medium">{t.journey.stages[j.stage]}</strong></span>
                        <span>{stageProgress(j)}%</span>
                      </div>
                      <Progress value={stageProgress(j)} className="h-1.5" />
                    </div>
                    {docs && (
                      <div className="mt-3 text-xs text-stone-600 dark:text-stone-400">
                        Documents: <strong>{docs.yes}</strong> available · <strong>{docs.no}</strong> missing · <strong>{docs.unanswered}</strong> unanswered
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      onClick={() => nav(`/journey/${j.id}`)}
                      data-testid={TIDS.mySavedResume(j.id)}
                      className="min-h-[40px]"
                    >
                      <Play className="w-4 h-4 mr-1" aria-hidden="true" />
                      {t.my.resume}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteJourney(j.id)}
                      data-testid={TIDS.mySavedDelete(j.id)}
                      className="min-h-[40px] text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-1" aria-hidden="true" />
                      {t.my.delete}
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {rows.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" data-testid={TIDS.myClearAll} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-1" aria-hidden="true" />
                {t.my.clearAll}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-popover">
              <AlertDialogHeader>
                <AlertDialogTitle>{t.my.clearAll}</AlertDialogTitle>
                <AlertDialogDescription>{t.my.clearConfirm}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={clearAll}>{t.common.ok}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
