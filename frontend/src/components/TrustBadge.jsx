import React from 'react';
import { ShieldCheck, Sparkles, AlertTriangle, HelpCircle } from 'lucide-react';
import { Badge } from '@astryxdesign/core/Badge';
import { useLang } from '../context/LanguageContext';

/**
 * TrustBadge — strictly data-driven based on verification state
 */
export default function TrustBadge({ variant = 'not_verified', className = '', size = 'sm' }) {
  const { t } = useLang();
  
  const map = {
    verified: {
      variant: 'success',
      icon: ShieldCheck,
      label: t.trust?.verified || 'VERIFIED SOURCE',
    },
    needs_verification: {
      variant: 'warning',
      icon: HelpCircle,
      label: t.trust?.needsVerification || 'NEEDS VERIFICATION',
    },
    'ai-guidance': {
      variant: 'neutral',
      icon: Sparkles,
      label: t.trust?.aiGuidance || 'AI GUIDANCE',
    },
    not_verified: {
      variant: 'error',
      icon: AlertTriangle,
      label: t.trust?.notVerified || 'NOT VERIFIED',
    },
    'not-verified': { // fallback for any older code
      variant: 'error',
      icon: AlertTriangle,
      label: t.trust?.notVerified || 'NOT VERIFIED',
    }
  };
  
  const item = map[variant] || map['not_verified'];
  const Icon = item.icon;
  
  return (
    <Badge
      label={size === 'lg' ? <span className="text-sm">{item.label}</span> : item.label}
      variant={item.variant}
      icon={<Icon className="w-3.5 h-3.5" aria-hidden="true" />}
      className={className}
      role="status"
    />
  );
}
