import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="mt-16 border-t border-border bg-background" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid gap-4 md:grid-cols-2 items-start">
        <div>
          <p className="font-display font-semibold text-stone-900 dark:text-stone-100">
            SevaPath
          </p>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-md">
            {t.disclaimer}
          </p>
        </div>
        <div className="flex gap-4 text-sm md:justify-end">
          <Link to="/about" className="text-stone-600 dark:text-stone-400 hover:text-primary">
            {t.nav.about}
          </Link>
          <Link to="/settings" className="text-stone-600 dark:text-stone-400 hover:text-primary">
            {t.nav.settings}
          </Link>
        </div>
      </div>
    </footer>
  );
}
