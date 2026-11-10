import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { ProgressBar } from '@astryxdesign/core/ProgressBar';
import { STAGES } from '../context/JourneyContext';
import { useLang } from '../context/LanguageContext';
import { TIDS } from '../lib/testids';

/**
 * Deterministic journey tracker. The active stage is passed in
 * explicitly — this component NEVER derives state from scroll or
 * IntersectionObserver.
 */
export default function JourneyTracker({ currentStage, completedStages = [], onStageClick }) {
  const { t } = useLang();
  const stageLabels = t.journey.stages;

  const stateOf = (stage) => {
    if (completedStages.includes(stage)) return 'completed';
    if (stage === currentStage) return 'active';
    return 'upcoming';
  };
  const currentIndex = STAGES.indexOf(currentStage);

  return (
    <div className="space-y-4">
      {/* Mobile compact view */}
      <div className="md:hidden mb-4" data-testid="mobile-journey-tracker">
        <Card>
          {/* Astryx Text renders display:inline, so the two labels need
              the original flex-col wrapper or they run together on one
              line ("Step 4 of 6Documents"). */}
          <div className="flex flex-col">
            <Text type="label" color="accent" className="mb-0.5">
              Step {currentIndex + 1} of {STAGES.length}
            </Text>
            <Text weight="semibold" className="text-sm">
              {stageLabels[currentStage]}
            </Text>
          </div>
          <div className="mt-2">
            <ProgressBar
              label="Journey progress"
              value={currentIndex + 1}
              max={STAGES.length}
              isLabelHidden
              hasValueLabel={false}
              variant="accent"
            />
          </div>
        </Card>
      </div>

      {/* Desktop detailed view */}
      <ol
        className="hidden md:block relative"
        data-testid={TIDS.journeyTracker}
        aria-label="Journey progress"
      >
        {STAGES.map((stage, idx) => {
          const state = stateOf(stage);
          const isCompleted = state === 'completed';
          const isActive = state === 'active';
          const canJump = isCompleted;
          return (
            <li key={stage} className="flex gap-3 pb-3 last:pb-0 relative group">
              {idx < STAGES.length - 1 && (
                <div className="absolute left-[15px] top-8 bottom-1 w-[2px] bg-border/50" aria-hidden="true">
                  <motion.div 
                    className="w-full bg-primary"
                    initial={{ height: 0 }}
                    animate={{ height: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              )}
              <button
                type="button"
                disabled={!canJump}
                onClick={() => canJump && onStageClick?.(stage)}
                data-testid={TIDS.stageBadge(stage)}
                aria-current={isActive ? 'step' : undefined}
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative z-10 ${
                  isCompleted
                    ? 'bg-primary border-primary text-primary-foreground cursor-pointer hover:shadow-md'
                    : isActive
                    ? 'bg-background border-primary text-primary scale-110 shadow-sm'
                    : 'bg-background border-border text-stone-300 dark:text-stone-700'
                }`}
                aria-label={`${stageLabels[stage]} — ${state}`}
              >
                {isCompleted ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                    <Check className="w-4 h-4" aria-hidden="true" />
                  </motion.div>
                ) : isActive ? (
                  <motion.span 
                    layoutId="activeStageDot"
                    className="w-2 h-2 rounded-full bg-primary absolute" 
                    aria-hidden="true" 
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                ) : null}
              </button>
              <div className="pt-1 min-w-0">
                <div
                  className={`text-sm transition-colors ${
                    isActive
                      ? 'text-stone-900 dark:text-stone-100 font-bold'
                      : isCompleted
                      ? 'text-stone-600 dark:text-stone-400 font-medium cursor-pointer group-hover:text-primary'
                      : 'text-stone-400 dark:text-stone-600 font-medium'
                  }`}
                >
                  {stageLabels[stage]}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
