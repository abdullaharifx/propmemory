export function buildInsightsPrompt(property) {
  const {
    tenant_name, lease_end, payment_history = [],
    maintenance_log = [], landlord_notes
  } = property

  const lateCount = payment_history.filter(p => p.status === 'late').length
  const missedCount = payment_history.filter(p => p.status === 'missed').length
  const openIssues = maintenance_log.filter(m => m.status === 'open')

  return `You are PropMemory. Analyse this property's data and return 1-3 insights the landlord needs to know TODAY. Be specific, not generic. Reference actual data.

PROPERTY DATA:
Tenant: ${tenant_name}
Lease end: ${lease_end}
Late payments in history: ${lateCount}
Missed payments: ${missedCount}
Open maintenance issues: ${openIssues.map(i => i.title).join(', ') || 'None'}
Landlord notes: ${landlord_notes || 'None'}

INSIGHT RULES:
- Only surface genuinely actionable insights — not observations
- Lease expiring within 60 days → always flag
- Lease already expired → always flag as critical
- 2+ late payments → flag payment pattern
- Any open maintenance issue → flag with urgency context
- Maximum 3 insights — prioritise by urgency
- Each insight must be 1 sentence, specific, and tell the landlord what to DO

RESPOND ONLY WITH VALID JSON:
{
  "insights": [
    {
      "type": "lease | payment | maintenance | legal | general",
      "urgency": "critical | warning | info",
      "text": "One sentence. Specific. Actionable.",
      "action": "Suggested next step under 6 words"
    }
  ]
}`
}
