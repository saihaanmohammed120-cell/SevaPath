// Central data-testid registry (kebab-case, role-based).
export const TIDS = {
  // Header
  headerBrand: 'header-brand',
  headerNavHome: 'header-nav-home',
  headerNavMy: 'header-nav-my',
  headerNavSettings: 'header-nav-settings',
  langSwitcher: 'lang-switcher',
  langOptionEn: 'lang-option-en',
  langOptionHi: 'lang-option-hi',
  langOptionTa: 'lang-option-ta',
  skipLink: 'skip-to-content',

  // Home
  goalInput: 'goal-input',
  goalSubmit: 'goal-submit-btn',
  voiceBtn: 'voice-input-btn',
  notSureBtn: 'not-sure-btn',
  suggestionChip: (i) => `suggestion-chip-${i}`,
  lifeSituationCard: (id) => `life-situation-${id}`,

  // Journey
  journeyTracker: 'journey-tracker',
  stageBadge: (key) => `stage-${key}`,
  primaryNextAction: 'primary-next-action',
  serviceTitle: 'service-title',
  testOnlyBanner: 'test-only-banner',

  // Copilot
  copilotToggle: 'copilot-toggle',
  copilotPanel: 'copilot-panel',
  copilotInput: 'copilot-input',
  copilotSend: 'copilot-send',
  copilotMessage: (i) => `copilot-msg-${i}`,

  // Eligibility
  eligibilityQuestion: (id) => `eligibility-q-${id}`,
  eligibilityYes: (id) => `eligibility-yes-${id}`,
  eligibilityNo: (id) => `eligibility-no-${id}`,
  eligibilityVerdict: 'eligibility-verdict',

  // Documents
  documentRow: (id) => `document-${id}`,
  documentYes: (id) => `document-yes-${id}`,
  documentNo: (id) => `document-no-${id}`,
  documentUploadZone: (id) => `document-upload-${id}`,
  documentUploadInput: (id) => `document-upload-input-${id}`,
  documentPreview: (id) => `document-preview-${id}`,
  documentRemove: (id) => `document-remove-${id}`,

  // Procedure & Application
  procedureStep: (i) => `procedure-step-${i}`,
  applicationBadge: 'application-mode-badge',
  applicationCta: 'application-cta',

  // My SevaPath
  mySavedRow: (id) => `saved-journey-${id}`,
  mySavedResume: (id) => `saved-resume-${id}`,
  mySavedDelete: (id) => `saved-delete-${id}`,
  myClearAll: 'my-clear-all',

  // Settings
  settingsTheme: (v) => `settings-theme-${v}`,
  settingsTextSize: (v) => `settings-text-${v}`,
  settingsReduceMotion: 'settings-reduce-motion',
  settingsClearData: 'settings-clear-data',
};
