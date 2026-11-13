import React from 'react';
import { Link } from '@astryxdesign/core/Link';
import { Text } from '@astryxdesign/core/Text';
import { useLang } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="mt-16 border-t border-border bg-background" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid gap-4 md:grid-cols-2 items-start">
        <div>
          <div>
            <Text weight="semibold">SevaPath</Text>
          </div>
          <Text type="body" as="p" className="mt-1 max-w-md">
            {t.disclaimer}
          </Text>
        </div>
        <div className="flex gap-4 text-sm md:justify-end">
          <Link href="/about" isStandalone>
            {t.nav.about}
          </Link>
          <Link href="/settings" isStandalone>
            {t.nav.settings}
          </Link>
        </div>
      </div>
    </footer>
  );
}
