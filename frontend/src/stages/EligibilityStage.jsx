import React, { useMemo, useState } from 'react';
import { Button } from '../components/ui/button';
import { useLang } from '../context/LanguageContext';
import { TIDS } from '../lib/testids';
import { checkEligibility } from '../lib/api';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

export default function EligibilityStage({ service, journey, onAnswer, onResult, onContinue }) {
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const answers = useMemo(() => journey.eligibilityAnswers || {}, [journey.eligibilityAnswers]);
  const rules = useMemo(() => service.eligibility_rules || [], [service.eligibility_rules]);

  const complete = useMemo(
    () => rules.every((r) => answers[r.id] === true || answers[r.id] === false),
    [rules, answers]
  );

  async function check() {
    setLoading(true);
    try {
      const verdict = await checkEligibility(service.id, answers);
      onResult(verdict);
    } finally {
      setLoading(false);
    }
  }

  const verdict = journey.eligibilityResult;

  return (
    <section aria-labelledby="stage-eligibility">
      <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-2">
        Step 3 · {t.journey.stages.eligibility}
      </p>
      <h2 id="stage-eligibility" className="font-display text-2xl sm:text-3xl font-bold mb-2">
        Let's check the requirements
      </h2>
      <p className="text-stone-700 dark:text-stone-300 mb-6">
        {t.journey.eligibilityIntro}
      </p>

      <ul className="space-y-3">
        {rules.map((rule) => (
          <li key={rule.id} className="rounded-lg border border-border bg-card p-4">
            <p
              className="font-medium text-stone-900 dark:text-stone-100"
              data-testid={TIDS.eligibilityQuestion(rule.id)}
            >
              {rule.question}
            </p>
            <p className="text-xs text-stone-500 mt-1">{rule.explanation}</p>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                variant={answers[rule.id] === true ? 'default' : 'outline'}
                onClick={() => onAnswer(rule.id, true)}
                data-testid={TIDS.eligibilityYes(rule.id)}
                className="min-h-[44px] min-w-[80px]"
              >
                {t.common.yes}
              </Button>
              <Button
                size="sm"
                variant={answers[rule.id] === false ? 'default' : 'outline'}
                onClick={() => onAnswer(rule.id, false)}
                data-testid={TIDS.eligibilityNo(rule.id)}
                className="min-h-[44px] min-w-[80px]"
              >
                {t.common.no}
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-3 mt-6">
        <Button
          onClick={check}
          disabled={!complete || loading}
          size="lg"
          className="min-h-[48px]"
        >
          {loading ? 'Checking…' : 'Check my eligibility'}
        </Button>
      </div>

      {verdict && (
        <div
          className={`mt-6 rounded-lg border p-5 ${
            verdict.eligible
              ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-800'
              : 'border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800'
          }`}
          data-testid={TIDS.eligibilityVerdict}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2 font-display font-semibold">
            {verdict.eligible ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-green-700 dark:text-green-400" aria-hidden="true" />
                <span className="text-green-900 dark:text-green-200">Looks like you're eligible.</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" />
                <span className="text-amber-900 dark:text-amber-200">
                  Based on your answers, this may not apply right now.
                </span>
              </>
            )}
          </div>
          <ul className="mt-3 space-y-1 text-sm">
            {verdict.results.map((r) => (
              <li key={r.id} className="flex gap-2">
                {r.passed ? (
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-700 dark:text-green-400" aria-hidden="true" />
                ) : (
                  <HelpCircle className="w-4 h-4 mt-0.5 text-amber-700 dark:text-amber-400" aria-hidden="true" />
                )}
                <span className="text-stone-700 dark:text-stone-300">
                  {r.question} — <span className="text-stone-500">{r.explanation}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-stone-500 mt-3">
            This result is computed by SevaPath's deterministic rules engine — not by AI.
          </p>
          <Button
            onClick={onContinue}
            size="lg"
            className="mt-4 min-h-[48px]"
            data-testid={TIDS.primaryNextAction}
          >
            {t.journey.eligibilityContinue}
          </Button>
        </div>
      )}
    </section>
  );
}
