import React from 'react';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { useLang } from '../context/LanguageContext';

export default function About() {
  const { t } = useLang();
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-20">
      <Heading level={1} className="mb-4">About SevaPath</Heading>
      <Text type="body" as="p">
        {t.settings.aboutBody}
      </Text>
      <ul className="mt-6 space-y-3 text-sm text-stone-700 dark:text-stone-300 list-disc pl-5">
        <li>SevaPath is a <strong>guide</strong>, not a government entity.</li>
        <li>Eligibility is decided by a <strong>deterministic rules engine</strong>, not by AI.</li>
        <li>Application URLs come only from <strong>verified service data</strong>. SevaPath never generates them.</li>
        <li>Uploaded documents are <strong>never</strong> automatically sent to any AI provider.</li>
        <li>All journeys in this version are <strong>stored only on this device</strong>.</li>
      </ul>
    </div>
  );
}
