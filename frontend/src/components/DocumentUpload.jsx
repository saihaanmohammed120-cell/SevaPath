import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Upload, FileText, Image as ImageIcon, X, Camera, Replace } from 'lucide-react';
import { Button } from '@astryxdesign/core/Button';
import { useLang } from '../context/LanguageContext';
import { TIDS } from '../lib/testids';
import { loadDocument } from '../lib/db';

const ACCEPT = 'application/pdf,image/jpeg,image/png,image/jpg';
const ACCEPT_LIST = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
const MAX_BYTES = 10 * 1024 * 1024;

function humanSize(bytes) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Document upload widget — session-only, held on device.
 * Never sent to AI automatically. No permanent storage.
 */
export default function DocumentUpload({
  docId,
  upload,       // { name, size, type, dbKey }
  onUpload,     // (meta, file) => void
  onRemove,     // () => void
}) {
  const { t } = useLang();
  const inputRef = useRef(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    let url = '';
    let cancelled = false;
    async function fetchBlob() {
      if (upload?.dbKey) {
        try {
          const blob = await loadDocument(upload.dbKey);
          if (blob && !cancelled) {
            url = URL.createObjectURL(blob);
            setPreviewUrl(url);
          }
        } catch (e) {
          console.error("IDB load failed", e);
        }
      }
    }
    fetchBlob();
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [upload?.dbKey]);

  const handleFile = useCallback(
    async (file) => {
      setError('');
      if (!file) return;
      if (!ACCEPT_LIST.includes(file.type)) {
        setError(t.documents.invalidType);
        return;
      }
      if (file.size > MAX_BYTES) {
        setError(t.documents.tooLarge);
        return;
      }
      setLoading(true);
      try {
        await onUpload?.(
          { name: file.name, size: file.size, type: file.type },
          file
        );
      } catch (err) {
        setError('Could not save file. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [onUpload, t.documents.invalidType, t.documents.tooLarge]
  );

  const onInput = (e) => handleFile(e.target.files?.[0]);
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  if (upload) {
    const isImage = (upload.type || '').startsWith('image/');
    return (
      <div
        data-testid={TIDS.documentPreview(docId)}
        className="mt-3 rounded-lg border border-border bg-muted/40 p-3 flex gap-3 items-start"
      >
        <div className="w-14 h-14 rounded-md overflow-hidden bg-background border border-border flex items-center justify-center shrink-0">
          {isImage && previewUrl ? (
            <img
              src={previewUrl}
              alt={`Preview of ${upload.name}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <FileText className="w-6 h-6 text-stone-500" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium truncate text-stone-900 dark:text-stone-100">
            {upload.name}
          </div>
          <div className="text-xs text-stone-500 mt-0.5">
            {humanSize(upload.size)} · Held on this device only
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            onChange={onInput}
            className="hidden"
            data-testid={TIDS.documentUploadInput(docId)}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            icon={<Replace className="w-4 h-4" aria-hidden="true" />}
            label={t.documents.replace}
            onClick={() => inputRef.current?.click()}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            icon={<X className="w-4 h-4" aria-hidden="true" />}
            label={t.documents.remove}
            onClick={onRemove}
            data-testid={TIDS.documentRemove(docId)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <label
        htmlFor={`file-${docId}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        data-testid={TIDS.documentUploadZone(docId)}
        className={`block cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          dragOver
            ? 'border-primary bg-accent/50'
            : 'border-stone-300 dark:border-stone-600 bg-muted/30 hover:bg-muted/60'
        }`}
      >
        <input
          ref={inputRef}
          id={`file-${docId}`}
          type="file"
          accept={ACCEPT}
          capture="environment"
          onChange={onInput}
          className="hidden"
          data-testid={TIDS.documentUploadInput(docId)}
        />
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-background border border-border inline-flex items-center justify-center text-primary">
            <Upload className="w-5 h-5" aria-hidden="true" />
          </div>
          <p className="text-sm text-stone-700 dark:text-stone-300 font-medium">
            {t.documents.dropHere}
          </p>
          <p className="text-xs text-stone-500">{t.documents.accept}</p>
          <div className="flex items-center gap-2 text-xs text-stone-500 pt-1">
            <Camera className="w-3.5 h-3.5" aria-hidden="true" />
            Camera works on supported mobile devices
          </div>
        </div>
      </label>
      {loading && (
        <p className="text-xs text-stone-500 mt-2" role="status">
          Reading file…
        </p>
      )}
      {error && (
        <p className="text-xs text-destructive mt-2" role="alert">
          {error}
        </p>
      )}
      <p className="text-[11px] text-stone-500 mt-3 leading-relaxed">
        {t.documents.privacyNotice}
      </p>
    </div>
  );
}
