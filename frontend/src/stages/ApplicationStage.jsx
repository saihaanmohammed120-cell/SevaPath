import React from 'react';
import { Button } from '../components/ui/button';
import { useLang } from '../context/LanguageContext';
import { TIDS } from '../lib/testids';
import { ExternalLink, Globe, MapPin, Ban } from 'lucide-react';

const MODE_META = {
  online: {
    label: 'Online',
    cls: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
    Icon: Globe,
  },
  offline: {
    label: 'Offline',
    cls: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
    Icon: MapPin,
  },
  hybrid: {
    label: 'Online + Offline',
    cls: 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800',
    Icon: Globe,
  },
  unavailable: {
    label: 'No verified route',
    cls: 'bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700',
    Icon: Ban,
  },
};

/**
 * Validate a URL is safe to render as an external government link.
 * Rejects javascript:, data:, and non-HTTPS URLs.
 */
function isSafeUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function ApplicationStage({ service }) {
  const { t } = useLang();
  const app = service.application || {};
  const mode = app.mode || 'unavailable';
  const meta = MODE_META[mode] || MODE_META.unavailable;
  const Icon = meta.Icon;

  const hasValidUrl = isSafeUrl(app.official_url);

  return (
    <section aria-labelledby="stage-application">
      <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-2">
        Step 6 · {t.journey.stages.application}
      </p>
      <h2 id="stage-application" className="font-display text-2xl sm:text-3xl font-bold mb-2">
        Ready to act
      </h2>
      <p className="text-stone-700 dark:text-stone-300 mb-6">{t.journey.applicationIntro}</p>

      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${meta.cls}`}
            data-testid={TIDS.applicationBadge}
          >
            <Icon className="w-3.5 h-3.5" aria-hidden="true" />
            {meta.label}
          </span>
        </div>

        {mode === 'online' && hasValidUrl && (
          <a
            href={app.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2.5 min-h-[48px] font-medium hover:bg-[hsl(var(--sp-terracotta-deep))] transition-colors"
            data-testid={TIDS.applicationCta}
          >
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
            Go to official portal &rarr;
          </a>
        )}

        {mode === 'online' && !hasValidUrl && (
          <div
            className="rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 text-sm text-amber-900 dark:text-amber-200"
            role="status"
          >
            <p className="font-medium">{t.journey.unavailable}</p>
            <p className="mt-2 text-xs">
              The application URL for this service could not be verified. Please check the official sources below.
            </p>
          </div>
        )}

        {(mode === 'offline' || mode === 'hybrid') && (
          <div className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-line">
            {app.offline_instructions}
            {mode === 'hybrid' && hasValidUrl && (
              <div className="mt-3">
                <a
                  href={app.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  Official online portal
                </a>
              </div>
            )}
          </div>
        )}

        {mode === 'unavailable' && (
          <div
            className="rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 text-sm text-amber-900 dark:text-amber-200"
            role="status"
          >
            <p className="font-medium">{t.journey.unavailable}</p>
            {app.offline_instructions && (
              <p className="mt-2 text-amber-900/80 dark:text-amber-200/80">
                {app.offline_instructions}
              </p>
            )}
            <p className="mt-3 text-xs">
              SevaPath does not generate government URLs. When a verified route is added
              to the catalogue, it will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Official sources — rendered as clickable verified links */}
      <div className="mt-6 text-xs text-stone-500 leading-relaxed">
        <strong>{t.common.sources}:</strong>{' '}
        {service.official_sources?.length ? (
          <ul className="inline">
            {service.official_sources.map((s, i) => (
              <li key={i} className="inline">
                {isSafeUrl(s.url) ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {s.label}
                  </a>
                ) : (
                  <span>{s.label}</span>
                )}
                {s.accessed && <span className="text-stone-400"> (accessed {s.accessed})</span>}
                {i < service.official_sources.length - 1 && <span> · </span>}
              </li>
            ))}
          </ul>
        ) : (
          'No official sources recorded for this record yet.'
        )}
      </div>
    </section>
  );
}
