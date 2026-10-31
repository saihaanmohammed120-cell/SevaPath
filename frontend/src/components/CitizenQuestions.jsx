import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Button } from './ui/button';
import { useJourney } from '../context/JourneyContext';

export default function CitizenQuestions({ faqs = [], category = null }) {
  const [expandedId, setExpandedId] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const { setGuideOpen, setGuideContext } = useJourney();

  const relevantFaqs = useMemo(() => {
    let filtered = category ? faqs.filter(f => f.category === category) : faqs;
    return filtered.sort((a, b) => (a.priority || 5) - (b.priority || 5));
  }, [faqs, category]);

  if (relevantFaqs.length === 0) return null;

  const displayFaqs = showAll ? relevantFaqs : relevantFaqs.slice(0, 5);

  const toggleAccordion = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

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
        <h3 className="font-display font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          Questions people usually ask
        </h3>
      </div>
      
      <div className="divide-y divide-border">
        {displayFaqs.map((faq) => {
          const isExpanded = expandedId === faq.id;
          return (
            <div key={faq.id} className="group">
              <button
                type="button"
                onClick={() => toggleAccordion(faq.id)}
                aria-expanded={isExpanded}
                className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 hover:bg-muted/20 transition-colors"
              >
                <span className="font-medium text-stone-800 dark:text-stone-200 group-hover:text-primary transition-colors">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>
              
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 space-y-4 text-stone-600 dark:text-stone-400 text-sm">
                      <p className="leading-relaxed">{faq.answer}</p>
                      
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
                          variant="outline" 
                          size="sm" 
                          className="shrink-0 gap-2 text-primary hover:text-primary hover:bg-primary/5 border-primary/20"
                          onClick={() => askGuide(faq)}
                        >
                          <MessageCircle className="w-4 h-4" />
                          Ask SevaPath Guide about this
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      
      {relevantFaqs.length > 5 && (
        <div className="p-3 border-t border-border text-center bg-muted/20">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowAll(!showAll)}
            className="text-stone-500"
          >
            {showAll ? "Show fewer questions" : "View all questions"}
          </Button>
        </div>
      )}
    </div>
  );
}
