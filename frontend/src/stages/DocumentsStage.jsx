import React from 'react';
import { Button } from '../components/ui/button';
import DocumentUpload from '../components/DocumentUpload';
import { useLang } from '../context/LanguageContext';
import { TIDS } from '../lib/testids';
import { Check } from 'lucide-react';

export default function DocumentsStage({ service, journey, onSetStatus, onUpload, onRemoveUpload, onContinue }) {
  const { t } = useLang();
  const docs = service.required_documents || [];
  const status = journey.documentStatus || {};
  const uploads = journey.documentUploads || {};

  return (
    <section aria-labelledby="stage-documents">
      <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-2">
        Step 4 · {t.journey.stages.documents}
      </p>
      <h2 id="stage-documents" className="font-display text-2xl sm:text-3xl font-bold mb-2">
        What you may need
      </h2>
      <p className="text-stone-700 dark:text-stone-300 mb-6 max-w-2xl">
        {t.journey.documentsIntro}
      </p>

      <ul className="space-y-4">
        {docs.map((d) => {
          const s = status[d.id] || 'UNANSWERED';
          return (
            <li
              key={d.id}
              className="rounded-lg border border-border bg-card p-4"
              data-testid={TIDS.documentRow(d.id)}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-stone-900 dark:text-stone-100">
                      {d.name}
                    </h3>
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                        d.required
                          ? 'text-red-800 bg-red-50 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
                          : 'text-stone-700 bg-muted border-border'
                      }`}
                    >
                      {d.required ? t.documents.required : t.documents.optional}
                    </span>
                    {s === 'YES' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                        <Check className="w-3 h-3" aria-hidden="true" /> Available
                      </span>
                    )}
                    {s === 'NO' && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800">
                        Not added
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                    {d.description}
                  </p>
                  {d.alternatives?.length > 0 && (
                    <p className="text-xs text-stone-500 mt-1">
                      Alternatives: {d.alternatives.join(', ')}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={s === 'YES' ? 'default' : 'outline'}
                    onClick={() => onSetStatus(d.id, s === 'YES' ? 'UNANSWERED' : 'YES')}
                    data-testid={TIDS.documentYes(d.id)}
                    className="min-h-[40px]"
                  >
                    {t.documents.haveIt}
                  </Button>
                  <Button
                    size="sm"
                    variant={s === 'NO' ? 'default' : 'outline'}
                    onClick={() => onSetStatus(d.id, s === 'NO' ? 'UNANSWERED' : 'NO')}
                    data-testid={TIDS.documentNo(d.id)}
                    className="min-h-[40px]"
                  >
                    {t.documents.dontHaveIt}
                  </Button>
                </div>
              </div>
              <DocumentUpload
                docId={d.id}
                upload={uploads[d.id]}
                onUpload={(meta, file) => onUpload(d.id, meta, file)}
                onRemove={() => onRemoveUpload(d.id)}
              />
            </li>
          );
        })}
      </ul>

      <Button
        onClick={onContinue}
        size="lg"
        className="mt-8 min-h-[48px]"
        data-testid={TIDS.primaryNextAction}
      >
        {t.journey.documentsContinue}
      </Button>
    </section>
  );
}
