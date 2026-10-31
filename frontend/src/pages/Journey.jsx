import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, ArrowLeft, BookmarkCheck, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import JourneyTracker from '../components/JourneyTracker';
import NextStepCard from '../components/NextStepCard';
import UnderstandStage from '../stages/UnderstandStage';
import ConfirmStage from '../stages/ConfirmStage';
import EligibilityStage from '../stages/EligibilityStage';
import DocumentsStage from '../stages/DocumentsStage';
import ProcedureStage from '../stages/ProcedureStage';
import ApplicationStage from '../stages/ApplicationStage';
import CitizenQuestions from '../components/CitizenQuestions';
import { useJourney, STAGES } from '../context/JourneyContext';
import { useLang } from '../context/LanguageContext';
import { toast } from '../components/ui/sonner';
import { saveDocument, deleteDocument } from '../lib/db';
import { getService } from '../lib/api';
import { TIDS } from '../lib/testids';

export default function Journey() {
  const { t, lang } = useLang();
  const nav = useNavigate();
  const { id } = useParams();
  const { getJourney, patchJourney, advanceStage } = useJourney();
  const journey = getJourney(id);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  const serviceId = journey?.serviceId;
  useEffect(() => {
    if (!serviceId) return;
    let cancelled = false;
    async function run() {
      try {
        const svc = await getService(serviceId);
        if (!cancelled) setService(svc);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [serviceId, lang]);

  const setStage = useCallback((s) => advanceStage(id, s), [advanceStage, id]);

  const missingRequiredDocs = useMemo(() => {
    if (!service || !journey) return 0;
    const requiredIds = (service.required_documents || [])
      .filter((d) => d.required)
      .map((d) => d.id);
    const s = journey.documentStatus || {};
    return requiredIds.filter((d) => s[d] === 'NO').length;
  }, [service, journey]);

  if (!journey) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-stone-600">Journey not found on this device.</p>
        <Button onClick={() => nav('/')} className="mt-4">
          {t.common.back}
        </Button>
      </div>
    );
  }

  if (loading || !service) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <Loader2 className="w-6 h-6 mx-auto animate-spin text-primary" aria-hidden="true" />
        <p className="text-sm text-stone-500 mt-3">Loading…</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-20">
      <button
        onClick={() => nav(-1)}
        className="inline-flex items-center gap-1 text-sm text-stone-600 dark:text-stone-400 hover:text-primary mb-4 min-h-[44px]"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        {t.common.back}
      </button>

      {service.is_test_fixture && (
        <div
          role="alert"
          data-testid={TIDS.testOnlyBanner}
          className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 p-4 mb-6 flex items-start gap-3"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 shrink-0">
            {t.common.testOnly}
          </span>
          <p className="text-sm text-amber-900 dark:text-amber-200">
            {t.journey.testOnly}
          </p>
        </div>
      )}



      {service._fallback_fields && (
        <div
          role="status"
          className="flex items-center gap-2 mb-4 px-2"
        >
          <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
            EN
          </span>
          <span className="text-xs text-stone-500">Some details are only available in English.</span>
        </div>
      )}

      {journey.stage === 'procedure' && missingRequiredDocs > 0 && (
        <div
          role="alert"
          data-testid="docs-readiness-warning"
          className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 p-4 mb-6 flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0" aria-hidden="true" />
          <p className="text-sm text-amber-900 dark:text-amber-200">
            {t.journey.documentsMissingWarn(missingRequiredDocs)}
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        <aside className="md:sticky md:top-24 md:self-start space-y-4">
          <JourneyTracker
            currentStage={journey.stage}
            completedStages={journey.completedStages}
            onStageClick={setStage}
          />
          <NextStepCard journey={journey} service={service} onAdvance={setStage} />
          <div className="rounded-md border border-border bg-card p-3 text-xs text-stone-600 dark:text-stone-400 flex items-center gap-2">
            <BookmarkCheck className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
            {t.journey.saved}
          </div>
        </aside>

        <main className="md:pt-0">
          <div className="mb-8">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-2">
              {service.identity?.short_label}
            </h1>
            <p className="text-sm text-stone-500">Provided by {service.provider?.name}</p>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={journey.stage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {journey.stage === 'understand' && (
                <>
                  <UnderstandStage
                    service={service}
                    onConfirm={() => setStage('confirm')}
                    onReject={() => nav('/')}
                  />
                  <CitizenQuestions faqs={service.faqs} category="general" />
                </>
              )}
              {journey.stage === 'confirm' && (
                <ConfirmStage
                  service={service}
                  onContinue={() => setStage('eligibility')}
                />
              )}
              {journey.stage === 'eligibility' && (
                <>
                  <EligibilityStage
                    service={service}
                    journey={journey}
                    onAnswer={(rid, v) =>
                      patchJourney(id, {
                        eligibilityAnswers: { ...journey.eligibilityAnswers, [rid]: v },
                        eligibilityResult: null,
                      })
                    }
                    onResult={(verdict) => patchJourney(id, { eligibilityResult: verdict })}
                    onContinue={() => setStage('documents')}
                  />
                  <CitizenQuestions faqs={service.faqs} category="eligibility" />
                </>
              )}
              {journey.stage === 'documents' && (
                <>
                  <DocumentsStage
                    service={service}
                    journey={journey}
                    onSetStatus={(docId, status) =>
                      patchJourney(id, {
                        documentStatus: { ...journey.documentStatus, [docId]: status },
                      })
                    }
                    onUpload={async (docId, meta, file) => {
                      const dbKey = `${id}::${docId}::${Date.now()}`;
                      try {
                        await saveDocument(dbKey, file);
                        patchJourney(id, {
                          documentUploads: {
                            ...journey.documentUploads,
                            [docId]: { ...meta, dbKey },
                          },
                          documentStatus: {
                            ...journey.documentStatus,
                            [docId]:
                              journey.documentStatus[docId] === 'UNANSWERED'
                                ? 'YES'
                                : journey.documentStatus[docId],
                          },
                        });
                      } catch (e) {
                        console.error('Failed to save document blob', e);
                        toast.error("Could not save the document locally.");
                        throw e;
                      }
                    }}
                    onRemoveUpload={async (docId) => {
                      const current = journey.documentUploads[docId];
                      if (current?.dbKey) {
                        await deleteDocument(current.dbKey).catch(e => {
                          console.error("IDB delete failed", e);
                          toast.warning("Could not completely remove document from local storage.");
                        });
                      }
                      const next = { ...journey.documentUploads };
                      delete next[docId];
                      patchJourney(id, { documentUploads: next });
                    }}
                    onContinue={() => setStage('procedure')}
                  />
                  <CitizenQuestions faqs={service.faqs} category="documents" />
                </>
              )}
              {journey.stage === 'procedure' && (
                <>
                  <ProcedureStage
                    service={service}
                    onContinue={() => setStage('application')}
                  />
                  <CitizenQuestions faqs={service.faqs} category="procedure" />
                </>
              )}
              {journey.stage === 'application' && (
                <>
                  <ApplicationStage service={service} />
                  <CitizenQuestions faqs={service.faqs} category="application" />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
