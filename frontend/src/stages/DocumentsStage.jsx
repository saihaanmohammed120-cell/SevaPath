import React from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { Card } from '@astryxdesign/core/Card';
import { Badge } from '@astryxdesign/core/Badge';
import DocumentUpload from '../components/DocumentUpload';
import { useLang } from '../context/LanguageContext';
import { TIDS } from '../lib/testids';
import { Check } from 'lucide-react';

export default function DocumentsStage({ service, journey, onSetStatus, onUpload, onRemoveUpload, onContinue }) {
  const { t } = useLang();
  const docs = service.required_documents || [];
  const status = journey.documentStatus || {};
  const uploads = journey.documentUploads || {};

  return (
    <section aria-labelledby="stage-documents">
      <Text type="label" color="accent" className="mb-2">
        Step 4 · {t.journey.stages.documents}
      </Text>
      <Heading level={2} id="stage-documents" className="mb-2">
        What you may need
      </Heading>
      <Text type="body" as="p" className="mb-6 max-w-2xl">
        {t.journey.documentsIntro}
      </Text>

      <ul className="space-y-4">
        {docs.map((d) => {
          const s = status[d.id] || 'UNANSWERED';
          return (
            <li
              key={d.id}
              data-testid={TIDS.documentRow(d.id)}
            >
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Heading level={3}>
                        {d.name}
                      </Heading>
                      <Badge
                        label={d.required ? t.documents.required : t.documents.optional}
                        variant={d.required ? 'error' : 'neutral'}
                      />
                      {s === 'YES' && (
                        <Badge
                          label="Available"
                          variant="success"
                          icon={<Check className="w-3 h-3" aria-hidden="true" />}
                        />
                      )}
                      {s === 'NO' && (
                        <Badge label="Not added" variant="warning" />
                      )}
                    </div>
                    <Text type="body" as="p" className="mt-1">
                      {d.description}
                    </Text>
                    {d.alternatives?.length > 0 && (
                      <Text type="supporting" as="p" className="mt-1">
                        Alternatives: {d.alternatives.join(', ')}
                      </Text>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      label={t.documents.haveIt}
                      variant={s === 'YES' ? 'primary' : 'secondary'}
                      onClick={() => onSetStatus(d.id, s === 'YES' ? 'UNANSWERED' : 'YES')}
                      data-testid={TIDS.documentYes(d.id)}
                    />
                    <Button
                      size="sm"
                      label={t.documents.dontHaveIt}
                      variant={s === 'NO' ? 'primary' : 'secondary'}
                      onClick={() => onSetStatus(d.id, s === 'NO' ? 'UNANSWERED' : 'NO')}
                      data-testid={TIDS.documentNo(d.id)}
                    />
                  </div>
                </div>
                <DocumentUpload
                  docId={d.id}
                  upload={uploads[d.id]}
                  onUpload={(meta, file) => onUpload(d.id, meta, file)}
                  onRemove={() => onRemoveUpload(d.id)}
                />
              </Card>
            </li>
          );
        })}
      </ul>

      <Button
        label={t.journey.documentsContinue}
        onClick={onContinue}
        size="lg"
        variant="primary"
        className="mt-8"
        data-testid={TIDS.primaryNextAction}
      />
    </section>
  );
}
