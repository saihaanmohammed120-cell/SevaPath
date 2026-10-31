import React from 'react';
import { ShieldCheck, Sparkles, AlertTriangle, HelpCircle } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

/**
 * TrustBadge — strictly data-driven based on verification state
 */
export default function TrustBadge({ variant = 'not_verified', className = '', size = 'sm' }) {
  const { t } = useLang();
  
  const map = {
    verified: {
      cls: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
      icon: ShieldCheck,
      label: t.trust?.verified || 'VERIFIED SOURCE',
    },
    needs_verification: {
      cls: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
      icon: HelpCircle,
      label: t.trust?.needsVerification || 'NEEDS VERIFICATION',
    },
    'ai-guidance': {
      cls: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700',
      icon: Sparkles,
      label: t.trust?.aiGuidance || 'AI GUIDANCE',
    },
    not_verified: {
      cls: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
      icon: AlertTriangle,
      label: t.trust?.notVerified || 'NOT VERIFIED',
    },
    'not-verified': { // fallback for any older code
      cls: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
      icon: AlertTriangle,
      label: t.trust?.notVerified || 'NOT VERIFIED',
    }
  };
  
  const item = map[variant] || map['not_verified'];
  const Icon = item.icon;
  const pad = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-[10px] uppercase tracking-wider';
  
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-bold ${pad} ${item.cls} ${className}`}
      role="status"
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      {item.label}
    </span>
  );
}
