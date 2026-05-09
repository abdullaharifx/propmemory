export const TONE_LABELS = {
  friendly_reminder: 'Friendly reminder',
  firm_professional: 'Firm & professional',
  urgent_formal: 'Urgent & formal',
  warm_informative: 'Warm & informative',
  neutral_factual: 'Neutral & factual',
  pre_legal_notice: 'Pre-legal notice'
}

export const TONE_COLORS = {
  friendly_reminder: 'success',
  firm_professional: 'warning',
  urgent_formal: 'danger',
  warm_informative: 'success',
  neutral_factual: 'secondary',
  pre_legal_notice: 'danger'
}

export const PROPERTY_STATUS = {
  active: { label: 'Active', color: 'success' },
  vacant: { label: 'Vacant', color: 'warning' },
  archived: { label: 'Archived', color: 'secondary' }
}

export const MAINTENANCE_TYPES = [
  { value: 'issue', label: 'Issue reported' },
  { value: 'repair', label: 'Repair completed' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'other', label: 'Other' }
]

export const QUICK_PROMPTS = [
  'Draft a rent reminder',
  'Summarise this tenant\'s history',
  'When does the lease end?',
  'Log a maintenance issue',
  'Draft a lease renewal message',
  'What are my legal obligations for repairs?'
]
