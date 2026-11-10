import React from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { Card } from '@astryxdesign/core/Card';
import { Badge } from '@astryxdesign/core/Badge';
import { Link } from '@astryxdesign/core/Link';
import { Banner } from '@astryxdesign/core/Banner';
import { useLang } from '../context/LanguageContext';
import { TIDS } from '../lib/testids';
import { ExternalLink, Globe, MapPin, Ban } from 'lucide-react';

const MODE_META = {
  online: {
    label: 'Online',
    variant: 'success',
    Icon: Globe,
  },
  offline: {
    label: 'Offline',
    variant: 'info',
    Icon: MapPin,
  },
  hybrid: {
    label: 'Online + Offline',
    variant: 'neutral',
    Icon: Globe,
  },
  unavailable: {
    label: 'No verified route',
    variant: 'warning',
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
      <Text type="label" color="accent" className="mb-2">
        Step 6 · {t.journey.stages.application}
      </Text>
      <Heading level={2} id="stage-application" className="mb-2">
        Ready to act
      </Heading>
      <Text type="body" as="p" className="mb-6">{t.journey.applicationIntro}</Text>

      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Badge
            label={meta.label}
            variant={meta.variant}
            icon={<Icon className="w-3.5 h-3.5" aria-hidden="true" />}
            data-testid={TIDS.applicationBadge}
          />
        </div>

        {mode === 'online' && hasValidUrl && (
          <Button
            label="Go to official portal \u2192"
            variant="primary"
            icon={<ExternalLink className="w-4 h-4" aria-hidden="true" />}
            href={app.official_url}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={TIDS.applicationCta}
          />
        )}

        {mode === 'online' && !hasValidUrl && (
          <Banner
            status="warning"
            title={t.journey.unavailable}
            description="The application URL for this service could not be verified. Please check the official sources below."
            collapsible={false}
            role="status"
          />
        )}

        {(mode === 'offline' || mode === 'hybrid') && (
          <Text type="body" as="div" className="whitespace-pre-line">
            {app.offline_instructions}
            {mode === 'hybrid' && hasValidUrl && (
              <div className="mt-3">
                <Link href={app.official_url} isExternalLink isStandalone>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  {' '}
                  Official online portal
                </Link>
              </div>
            )}
          </Text>
        )}

        {mode === 'unavailable' && (
          <Banner
            status="warning"
            title={t.journey.unavailable}
            description={app.offline_instructions ? `${app.offline_instructions}\n\nSevaPath does not generate government URLs. When a verified route is added to the catalogue, it will appear here.` : 'SevaPath does not generate government URLs. When a verified route is added to the catalogue, it will appear here.'}
            collapsible={false}
            role="status"
          />
        )}
      </Card>

      {/* Official sources — rendered as clickable verified links */}
      <div className="mt-6 text-xs text-stone-500 leading-relaxed">
        <strong>{t.common.sources}:</strong>{' '}
        {service.official_sources?.length ? (
          <ul className="inline">
            {service.official_sources.map((s, i) => (
              <li key={i} className="inline">
                {isSafeUrl(s.url) ? (
                  <Link href={s.url} isExternalLink>
                    {s.label}
                  </Link>
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
