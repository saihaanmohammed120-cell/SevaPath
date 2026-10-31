import React from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

function useMediaQuery(query) {
  const [matches, setMatches] = React.useState(false);
  React.useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  return matches;
}

export default function CinematicBackground() {
  const { scrollY } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Disable expensive parallax if reduced motion is requested or on small screens
  const disableParallax = shouldReduceMotion || isMobile;

  // Parallax calculations
  const farY = useTransform(scrollY, [0, 1000], [0, 30]);
  const midY = useTransform(scrollY, [0, 1000], [0, 60]);
  const ribbonY = useTransform(scrollY, [0, 1000], [0, 120]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none select-none z-[-1]" aria-hidden="true">
      {/* 1. Atmospheric Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50/70 via-stone-50 to-stone-100 dark:from-[hsl(var(--sp-terracotta)_/_0.08)] dark:via-stone-900 dark:to-stone-950 transition-colors duration-1000" />
      
      {/* 2. Soft Atmospheric Horizon (Restrained, no geometric noise) */}
      <motion.div 
        style={disableParallax ? {} : { y: farY }}
        className="absolute bottom-0 left-0 right-0 h-[50vh] opacity-30 dark:opacity-20"
      >
        <div className="absolute bottom-0 inset-x-0 h-full bg-gradient-to-t from-[hsl(var(--sp-terracotta)_/_0.2)] dark:from-[hsl(var(--sp-terracotta-deep)_/_0.3)] to-transparent" />
      </motion.div>

      {/* 3. The Path / Ribbon Motif (Understated, elegant, indicating progress) */}
      <motion.div 
        style={disableParallax ? {} : { y: ribbonY }}
        className="absolute top-0 left-[-10%] w-[120%] h-full opacity-20 dark:opacity-10"
      >
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-full h-full">
          <path d="M -100,1200 C 300,1000 500,500 1100,450" fill="none" stroke="url(#bg-ribbon-grad)" strokeWidth="80" strokeLinecap="round" />
          <defs>
            <linearGradient id="bg-ribbon-grad" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(var(--sp-terracotta))" stopOpacity="0.4" />
              <stop offset="100%" stopColor="hsl(var(--sp-terracotta-deep))" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
      
      {/* 4. Mid Landscape / Atmospheric glow */}
      <motion.div 
        style={disableParallax ? {} : { y: midY }}
        className="absolute bottom-0 w-full h-[30vh] opacity-40 dark:opacity-20"
      >
        <div className="w-full h-full bg-gradient-to-t from-[hsl(var(--sp-terracotta))] to-transparent blur-3xl opacity-30" />
      </motion.div>

      {/* 5. Subtle grain overlay */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] mix-blend-overlay" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
    </div>
  );
}
