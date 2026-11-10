import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Settings, User } from 'lucide-react';
import { TopNav } from '@astryxdesign/core/TopNav';
import LanguageSwitcher from './LanguageSwitcher';
import { useLang } from '../context/LanguageContext';
import { TIDS } from '../lib/testids';

import Logo from './Logo';

export default function Header() {
  const { t } = useLang();

  const linkCls = ({ isActive }) =>
    `min-h-[44px] inline-flex items-center px-3 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'text-primary bg-accent'
        : 'text-stone-700 dark:text-stone-300 hover:text-primary hover:bg-accent/60'
    }`;

  return (
    <div
      className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border"
      role="banner"
    >
      <TopNav
        heading={
          <Link
            to="/"
            className="flex items-center gap-3.5 min-h-[44px] group"
            data-testid={TIDS.headerBrand}
            aria-label="SevaPath home"
          >
            <Logo className="w-9 h-9 drop-shadow-md group-hover:opacity-90 transition-opacity shrink-0" />
            <span className="font-display text-[1.5rem] font-extrabold tracking-[-0.02em] text-stone-900 dark:text-stone-50">
              SevaPath
            </span>
          </Link>
        }
        centerContent={
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            <NavLink to="/" end className={linkCls} data-testid={TIDS.headerNavHome}>
              {t.nav.home}
            </NavLink>
            <NavLink to="/my" className={linkCls} data-testid={TIDS.headerNavMy}>
              <User className="w-4 h-4 mr-1.5" aria-hidden="true" />
              {t.nav.mySevaPath}
            </NavLink>
            <NavLink to="/settings" className={linkCls} data-testid={TIDS.headerNavSettings}>
              <Settings className="w-4 h-4 mr-1.5" aria-hidden="true" />
              {t.nav.settings}
            </NavLink>
          </nav>
        }
        endContent={
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <NavLink
              to="/settings"
              className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-md text-stone-700 dark:text-stone-300 hover:bg-accent"
              aria-label={t.nav.settings}
              data-testid={`${TIDS.headerNavSettings}-mobile`}
            >
              <Settings className="w-5 h-5" />
            </NavLink>
          </div>
        }
      />
    </div>
  );
}
