import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { toast } from '../components/ui/sonner';
import { deleteDocument, clearAllDocuments } from '../lib/db';

/**
 * MySevaPath — local-device persistence for citizen journeys.
 *
 * A journey record shape:
 * {
 *   id, serviceId, serviceLabel, isTestFixture, createdAt, updatedAt,
 *   stage: 'understand'|'confirm'|'eligibility'|'documents'|'procedure'|'application',
 *   completedStages: string[],
 *   eligibilityAnswers: { [ruleId]: any },
 *   eligibilityResult: {...} | null,
 *   documentStatus: { [docId]: 'UNANSWERED'|'YES'|'NO' },
 *   documentUploads: { [docId]: { name, size, type, dbKey } }
 * }
 */
const JourneyCtx = createContext(null);
const KEY = 'sevapath.journeys';

export const STAGES = ['understand', 'confirm', 'eligibility', 'documents', 'procedure', 'application'];

function newJourney(service) {
  const now = new Date().toISOString();
  const docStatus = {};
  (service.required_documents || []).forEach((d) => { docStatus[d.id] = 'UNANSWERED'; });
  return {
    id: `${service.id}::${Date.now()}`,
    serviceId: service.id,
    serviceSlug: service.slug,
    serviceLabel: service.identity?.short_label || service.identity?.canonical_name || service.id,
    isTestFixture: !!service.is_test_fixture,
    createdAt: now,
    updatedAt: now,
    stage: 'understand',
    completedStages: [],
    eligibilityAnswers: {},
    eligibilityResult: null,
    documentStatus: docStatus,
    documentUploads: {},
  };
}

export function JourneyProvider({ children }) {
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideContext, setGuideContext] = useState(null);

  const [journeys, setJourneys] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.warn('[SevaPath] Saved journeys were unreadable — starting fresh:', err);
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(journeys));
    } catch (err) {
      // Quota exceeded is the realistic failure here. Warn once per
      // change so users can free space via Settings → Clear data.
      console.warn('[SevaPath] Could not save journeys locally:', err);
      toast.error("Unable to save progress on this device. Please free up some space.");
    }
  }, [journeys]);

  const startJourney = useCallback((service) => {
    // Reuse existing journey for this service if it exists, else create new
    const existing = Object.values(journeys).find(j => j.serviceId === service.id);
    if (existing) return existing.id;
    const j = newJourney(service);
    setJourneys((all) => ({ ...all, [j.id]: j }));
    return j.id;
  }, [journeys]);

  const getJourney = useCallback((id) => journeys[id] || null, [journeys]);
  const listJourneys = useCallback(
    () => Object.values(journeys).sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')),
    [journeys]
  );

  const patchJourney = useCallback((id, patch) => {
    setJourneys((all) => {
      const cur = all[id];
      if (!cur) return all;
      return { ...all, [id]: { ...cur, ...patch, updatedAt: new Date().toISOString() } };
    });
  }, []);

  const advanceStage = useCallback((id, toStage) => {
    setJourneys((all) => {
      const cur = all[id];
      if (!cur) return all;
      const completed = new Set(cur.completedStages);
      // Mark all stages before `toStage` as complete
      for (const s of STAGES) {
        if (s === toStage) break;
        completed.add(s);
      }
      return {
        ...all,
        [id]: {
          ...cur,
          stage: toStage,
          completedStages: Array.from(completed),
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }, []);

  const deleteJourney = useCallback((id) => {
    setJourneys((all) => {
      const cur = all[id];
      if (cur?.documentUploads) {
        Object.values(cur.documentUploads).forEach(up => {
          if (up.dbKey) deleteDocument(up.dbKey).catch(e => console.error("IDB delete failed", e));
        });
      }
      const copy = { ...all };
      delete copy[id];
      return copy;
    });
  }, []);

  const resetJourney = useCallback((id) => {
    setJourneys((all) => {
      const cur = all[id];
      if (!cur) return all;
      if (cur.documentUploads) {
        Object.values(cur.documentUploads).forEach(up => {
          if (up.dbKey) deleteDocument(up.dbKey).catch(e => console.error("IDB delete failed", e));
        });
      }
      const cleared = { ...cur, stage: 'understand', completedStages: [], eligibilityAnswers: {}, eligibilityResult: null, documentUploads: {}, updatedAt: new Date().toISOString() };
      const docStatus = {};
      Object.keys(cur.documentStatus || {}).forEach((k) => { docStatus[k] = 'UNANSWERED'; });
      cleared.documentStatus = docStatus;
      return { ...all, [id]: cleared };
    });
  }, []);

  const clearAll = useCallback(() => {
    clearAllDocuments().catch(e => console.error("IDB clear failed", e));
    setJourneys({});
  }, []);

  const value = useMemo(() => ({
    journeys,
    startJourney,
    getJourney,
    listJourneys,
    patchJourney,
    advanceStage,
    deleteJourney,
    resetJourney,
    clearAll,
    guideOpen,
    setGuideOpen,
    guideContext,
    setGuideContext,
  }), [journeys, startJourney, getJourney, listJourneys, patchJourney, advanceStage, deleteJourney, resetJourney, clearAll, guideOpen, guideContext]);

  return <JourneyCtx.Provider value={value}>{children}</JourneyCtx.Provider>;
}

export function useJourney() {
  const ctx = useContext(JourneyCtx);
  if (!ctx) throw new Error('useJourney must be inside JourneyProvider');
  return ctx;
}
