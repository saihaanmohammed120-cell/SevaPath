import React, { useState, useMemo } from 'react';
import { MessageCircle, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Button } from '@astryxdesign/core/Button';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { Collapsible, CollapsibleGroup } from '@astryxdesign/core/Collapsible';
import { useJourney } from '../context/JourneyContext';

export default function CitizenQuestions({ faqs = [], category = null }) {
  const [showAll, setShowAll] = useState(false);
  const { setGuideOpen, setGuideContext } = useJourney();

  const relevantFaqs = useMemo(() => {
    let filtered = category ? faqs.filter(f => f.category === category) : faqs;
    return filtered.sort((a, b) => (a.priority || 5) - (b.priority || 5));
  }, [faqs, category]);

  if (relevantFaqs.length === 0) return null;

  const displayFaqs = showAll ? relevantFaqs : relevantFaqs.slice(0, 5);

  const askGuide = (faq) => {
    setGuideContext({
      question: faq.question,
      answer: faq.answer,
      sourceName: faq.source_name,
      sourceUrl: faq.source_url,
      verificationStatus: faq.verification_status,
    });
    setGuideOpen(true);
  };

  return (
    <div className="mt-8 border border-border rounded-xl bg-card overflow-hidden">
      <div className="bg-muted/40 px-5 py-4 border-b border-border">
        <Heading level={3}>
          Questions people usually ask
        </Heading>
      </div>

      <CollapsibleGroup
        type="single"
        hasDividers
        density="balanced"
      >
        {displayFaqs.map((faq) => (
          <Collapsible
            key={faq.id}
            value={faq.id}
            trigger={
              <span className="font-medium">
                {faq.question}
              </span>
            }
          >
            <div className="px-5 pb-5 pt-1 space-y-4 text-sm">
              <Text type="body" as="p">{faq.answer}</Text>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/50">
                <div className="flex items-start gap-2 text-xs">
                  {faq.verification_status === 'verified' ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="text-stone-500">
                        <span className="text-emerald-700 dark:text-emerald-500 font-medium mr-2">
                          ✓ Verified
                        </span>
                        Source: {faq.source_name || 'Official'}
                        {faq.verified_at && <span className="ml-2">Checked: {faq.verified_at}</span>}
                      </div>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                      <div className="text-stone-500">
                        <span className="text-amber-600 dark:text-amber-500 font-medium mr-2">
                          Needs verification
                        </span>
                        Official source: {faq.source_name || 'Unknown'}
                      </div>
                    </>
                  )}
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  icon={<MessageCircle className="w-4 h-4" aria-hidden="true" />}
                  label="Ask SevaPath Guide about this"
                  onClick={() => askGuide(faq)}
                />
              </div>
            </div>
          </Collapsible>
        ))}
      </CollapsibleGroup>

      {relevantFaqs.length > 5 && (
        <div className="p-3 border-t border-border text-center bg-muted/20">
          <Button
            variant="ghost"
            size="sm"
            label={showAll ? "Show fewer questions" : "View all questions"}
            onClick={() => setShowAll(!showAll)}
          />
        </div>
      )}
    </div>
  );
}
