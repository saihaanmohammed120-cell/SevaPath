import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, MapPin, FileText, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@astryxdesign/core/Button';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { TextArea } from '@astryxdesign/core/TextArea';
import VoiceInput from '../components/VoiceInput';
import LifeSituationCards from '../components/LifeSituationCards';
import HowItWorks from '../components/HowItWorks';
import CinematicBackground from '../components/CinematicBackground';
import { useLang } from '../context/LanguageContext';
import { useJourney } from '../context/JourneyContext';
import { getService } from '../lib/api';
import { TIDS } from '../lib/testids';

export default function Home() {
  const { t } = useLang();
  const nav = useNavigate();
  const { startJourney } = useJourney();
  const [goal, setGoal] = useState('');

  function submit(e) {
    e?.preventDefault?.();
    const q = goal.trim();
    if (!q) return;
    nav(`/discover?q=${encodeURIComponent(q)}`);
  }

  async function pickSuggestion(index, text) {
    const mapping = {
      0: "IN-CENTRAL-UIDAI-AADHAAR-ADDRESS-UPDATE",
      1: "IN-CENTRAL-MEA-PASSPORT-APPLICATION",
      2: "IN-CENTRAL-ECI-VOTER-REGISTRATION",
      3: "IN-CENTRAL-MEITY-DIGILOCKER"
    };

    const targetId = mapping[index];
    if (targetId) {
      try {
        const full = await getService(targetId);
        const jid = startJourney(full);
        nav(`/journey/${jid}`);
        return;
      } catch (e) {
        console.error("Failed to route directly:", e);
      }
    }
    
    setGoal(text);
    nav(`/discover?q=${encodeURIComponent(text)}`);
  }

  function pickLifeSituation(id) {
    if (id === 'not-sure') {
      nav('/discover?open=1');
      return;
    }
    nav(`/discover?life=${encodeURIComponent(id)}`);
  }

  const getExampleIcon = (ex) => {
    if (ex.includes('Aadhaar') || ex.includes('आधार') || ex.includes('ஆதார்')) return MapPin;
    if (ex.includes('passport') || ex.includes('पासपोर्ट') || ex.includes('பாஸ்போர்ட்டுக்கு')) return FileText;
    if (ex.includes('vote') || ex.includes('वोट') || ex.includes('வாக்களிக்க')) return CheckSquare;
    if (ex.includes('DigiLocker') || ex.includes('डिजीलॉकर') || ex.includes('டிஜிலாக்கரை')) return ShieldCheck;
    return Sparkles;
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <CinematicBackground />
      <div className="relative z-10 flex-1 flex flex-col max-w-6xl mx-auto w-full px-4 sm:px-6 pt-12 sm:pt-20 pb-24">
      <section className="max-w-3xl mx-auto w-full text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Text type="label" color="accent" className="mb-3">
            {t.home.heroKicker}
          </Text>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        >
          <Heading level={1} justify="center">
            {t.home.heroTitle}
          </Heading>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className="mt-4 max-w-xl"
        >
          <Text type="large" as="p" justify="center">
            {t.home.heroSubtitle}
          </Text>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
          onSubmit={submit}
          className="mt-6 rounded-2xl border border-border bg-card shadow-sm p-1.5 sm:p-2 flex flex-col sm:flex-row gap-2 relative focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/5 transition-all group max-w-2xl mx-auto w-full items-end sm:items-center"
        >
          <div
            className="flex-1 w-full min-w-0"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
          >
            <TextArea
              label={t.home.heroTitle}
              isLabelHidden
              value={goal}
              onChange={(v) => setGoal(v)}
              placeholder={t.home.inputPlaceholder}
              rows={2}
              data-testid={TIDS.goalInput}
              width="100%"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end px-2 pb-1 sm:px-0 sm:pb-0">
            <VoiceInput onTranscript={(t) => setGoal((cur) => (cur ? `${cur} ${t}` : t))} />
            <Button
              type="submit"
              size="lg"
              label={t.home.submit}
              variant="primary"
              icon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
              isDisabled={!goal.trim()}
              data-testid={TIDS.goalSubmit}
            />
          </div>
        </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-3"
          >
            <Button
              variant="ghost"
              label={`${t.home.notSure} \u2192`}
              onClick={() => nav('/discover?open=1')}
              data-testid={TIDS.notSureBtn}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8"
          >
            <p className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-4 text-center">
              {t.home.examplesTitle}
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 justify-center max-w-3xl mx-auto">
              {t.home.examples.map((ex, i) => {
                const Icon = getExampleIcon(ex);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => pickSuggestion(i, ex)}
                    data-testid={TIDS.suggestionChip(i)}
                    className="group flex items-center gap-3 text-left w-full sm:w-auto px-4 py-3 rounded-xl border border-border bg-card/40 hover:bg-card hover:shadow-sm hover:border-stone-300 dark:hover:border-stone-700 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 active:scale-[0.98]"
                  >
                    <div className="text-stone-400 group-hover:text-primary transition-colors duration-200">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-medium text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors pr-2">
                      {ex}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
      </section>

      <section className="mt-24 border-t border-border pt-24 mb-16">
        <HowItWorks />
      </section>



      <section className="mt-16">
        <Heading level={2} className="mb-6">
          {t.home.lifeTitle}
        </Heading>
        <LifeSituationCards onPick={pickLifeSituation} />
      </section>
      </div>
    </div>
  );
}
