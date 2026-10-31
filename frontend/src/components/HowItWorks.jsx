import React, { useRef } from 'react';
import { useLang } from '../context/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const { t } = useLang();
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const visualRef = useRef(null);

  const stages = [
    { id: 'understand', label: 'Understand', desc: 'Describe your goal in plain words.' },
    { id: 'confirm', label: 'Confirm', desc: 'SevaPath finds the right service and confirms with you.' },
    { id: 'eligibility', label: 'Eligibility', desc: 'Answer a few simple questions to see if you qualify.' },
    { id: 'documents', label: 'Documents', desc: 'Gather the right paperwork before you apply.' },
    { id: 'procedure', label: 'Procedure', desc: 'Know exactly what steps to take, in what order.' },
    { id: 'application', label: 'Application', desc: 'Apply securely at the official government portal.' },
  ];

  useGSAP(() => {
    // Only apply ScrollTrigger on desktop/tablet to avoid trapping mobile users
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const panels = gsap.utils.toArray('.stage-panel');
      const indicators = gsap.utils.toArray('.visual-indicator');

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: visualRef.current,
        anticipatePin: 1,
      });

      panels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => activateStage(i),
          onEnterBack: () => activateStage(i),
        });
      });

      function activateStage(index) {
        indicators.forEach((ind, i) => {
          gsap.to(ind, {
            opacity: i === index ? 1 : 0.3,
            scale: i === index ? 1.05 : 1,
            x: i === index ? 10 : 0,
            duration: 0.4,
            ease: 'power2.out',
          });
        });
      }

    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="grid md:grid-cols-[1fr_1fr] gap-10 items-start">
        
        {/* Left Side: Scrolling Text Panels */}
        <div ref={textRef} className="space-y-[50vh] pt-[30vh] pb-[30vh] hidden md:block">
          {stages.map((stage, i) => (
            <div key={stage.id} className="stage-panel min-h-[30vh] flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-4">
                <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                  {i + 1}
                </span>
                <h3 className="text-3xl font-display font-bold text-stone-900 dark:text-stone-100">
                  {stage.label}
                </h3>
              </div>
              <p className="text-xl text-stone-600 dark:text-stone-400 max-w-sm">
                {stage.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile View: Standard List */}
        <div className="md:hidden space-y-8 py-10">
          <h2 className="text-2xl font-display font-bold mb-6">How SevaPath Works</h2>
          {stages.map((stage, i) => (
            <div key={stage.id} className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">{stage.label}</h3>
                <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">{stage.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Pinned Visual Container */}
        <div ref={visualRef} className="hidden md:flex flex-col justify-center h-screen sticky top-0">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm relative overflow-hidden">
             <div
                className="absolute inset-0 pointer-events-none opacity-40"
                aria-hidden="true"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 20% 0%, hsl(var(--sp-terracotta) / 0.14), transparent 55%), radial-gradient(circle at 90% 100%, hsl(var(--sp-sand) / 0.7), transparent 60%)',
                }}
              />
            <h4 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-8">Journey Progress</h4>
            <div className="space-y-6 relative z-10">
              {stages.map((stage, i) => (
                <div key={`vis-${stage.id}`} className="visual-indicator flex items-center gap-4 opacity-30">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-xl font-medium font-display text-stone-900 dark:text-stone-100">{stage.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
