import React, { useMemo, useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { Card } from '@astryxdesign/core/Card';
import { Banner } from '@astryxdesign/core/Banner';
import { useLang } from '../context/LanguageContext';
import { TIDS } from '../lib/testids';
import { checkEligibility } from '../lib/api';
import { CheckCircle2, HelpCircle } from 'lucide-react';

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
      <Text type="label" color="accent" className="mb-2">
        Step 3 · {t.journey.stages.eligibility}
      </Text>
      <Heading level={2} id="stage-eligibility" className="mb-2">
        Let's check the requirements
      </Heading>
      <Text type="body" as="p" className="mb-6">
        {t.journey.eligibilityIntro}
      </Text>

      <ul className="space-y-3">
        {rules.map((rule) => (
          <li key={rule.id}>
            <Card>
              <Text
                type="body"
                as="p"
                weight="semibold"
                data-testid={TIDS.eligibilityQuestion(rule.id)}
              >
                {rule.question}
              </Text>
              <Text type="supporting" as="p" className="mt-1">{rule.explanation}</Text>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  label={t.common.yes}
                  variant={answers[rule.id] === true ? 'primary' : 'secondary'}
                  onClick={() => onAnswer(rule.id, true)}
                  data-testid={TIDS.eligibilityYes(rule.id)}
                />
                <Button
                  size="sm"
                  label={t.common.no}
                  variant={answers[rule.id] === false ? 'primary' : 'secondary'}
                  onClick={() => onAnswer(rule.id, false)}
                  data-testid={TIDS.eligibilityNo(rule.id)}
                />
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-3 mt-6">
        <Button
          label={loading ? 'Checking…' : 'Check my eligibility'}
          onClick={check}
          isDisabled={!complete || loading}
          size="lg"
          variant="primary"
        />
      </div>

      {verdict && (
        <div className="mt-6">
          <Banner
            status={verdict.eligible ? 'success' : 'warning'}
            title={verdict.eligible ? "Looks like you're eligible." : 'Based on your answers, this may not apply right now.'}
            collapsible={false}
            data-testid={TIDS.eligibilityVerdict}
            role="status"
          >
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
            <Text type="supporting" as="p" className="mt-3">
              This result is computed by SevaPath's deterministic rules engine — not by AI.
            </Text>
            <div className="mt-4">
              <Button
                label={t.journey.eligibilityContinue}
                onClick={onContinue}
                size="lg"
                variant="primary"
                data-testid={TIDS.primaryNextAction}
              />
            </div>
          </Banner>
        </div>
      )}
    </section>
  );
}
