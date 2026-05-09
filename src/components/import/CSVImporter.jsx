import { useState, useRef } from 'react'
import { X, Upload, FileText, CheckCircle, Download, AlertCircle } from 'lucide-react'
import { useImport } from '../../hooks/useImport'
import ImportPreview from './ImportPreview'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const STEPS = { UPLOAD: 1, PREVIEW: 2, SUCCESS: 3 }

export default function CSVImporter({ onClose, onSuccess }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(STEPS.UPLOAD)
  const [dragOver, setDragOver] = useState(false)
  const [showPaste, setShowPaste] = useState(false)
  const [pasteText, setPasteText] = useState('')
  const [fileName, setFileName] = useState('')
  const [result, setResult] = useState(null)
  const [importedProps, setImportedProps] = useState([])
  const [analysing, setAnalysing] = useState(false)
  const [analyseError, setAnalyseError] = useState('')
  const fileInputRef = useRef()

  const { parseCSV, importProperties, saveImportedProperties, loading: saving } = useImport()

  async function handleFile(file) {
    if (!file) return
    setFileName(file.name)
    setAnalyseError('')
    setAnalysing(true)
    try {
      const csvText = await parseCSV(file)
      const parsed = await importProperties(csvText)
      setResult(parsed)
      setStep(STEPS.PREVIEW)
    } catch (err) {
      setAnalyseError(err.message || 'Failed to analyse file. Please check the format.')
    } finally {
      setAnalysing(false)
    }
  }

  async function handlePasteAnalyse() {
    if (!pasteText.trim()) { setAnalyseError('Please paste some CSV content first.'); return }
    setAnalyseError('')
    setAnalysing(true)
    try {
      const parsed = await importProperties(pasteText)
      setResult(parsed)
      setStep(STEPS.PREVIEW)
    } catch (err) {
      setAnalyseError(err.message || 'Failed to analyse CSV.')
    } finally {
      setAnalysing(false)
    }
  }

  async function handleImport(selectedProps) {
    try {
      const saved = await saveImportedProperties(selectedProps)
      setImportedProps(saved)
      setStep(STEPS.SUCCESS)
    } catch (err) {
      toast.error(err.message)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const stepTitle = {
    [STEPS.UPLOAD]:  'Import properties from CSV',
    [STEPS.PREVIEW]: 'Review properties',
    [STEPS.SUCCESS]: 'Import complete',
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 50, padding: '16px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        backgroundColor: 'var(--color-background-primary)',
        borderRadius: 'var(--border-radius-lg)',
        width: '100%',
        maxWidth: step === STEPS.PREVIEW ? '820px' : '520px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'max-width 0.2s',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px', borderBottom: '1px solid var(--color-border-primary)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '30px', height: '30px',
              backgroundColor: 'var(--color-success-light)',
              borderRadius: 'var(--border-radius-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Upload size={15} color="var(--color-success)" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                {stepTitle[step]}
              </h2>
              <div style={{ display: 'flex', gap: '6px', marginTop: '3px' }}>
                {[1,2,3].map(s => (
                  <span key={s} style={{
                    width: '20px', height: '3px', borderRadius: '2px',
                    backgroundColor: s <= step ? 'var(--color-accent)' : 'var(--color-border-primary)',
                    transition: 'background-color 0.2s',
                  }} />
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: '4px', display: 'flex', alignItems: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Step 1 — Upload */}
        {step === STEPS.UPLOAD && (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? 'var(--color-accent)' : 'var(--color-border-secondary)'}`,
                borderRadius: 'var(--border-radius-lg)',
                padding: '40px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: dragOver ? 'var(--color-accent-light)' : 'var(--color-background-secondary)',
                transition: 'border-color 0.15s, background-color 0.15s',
              }}
            >
              <div style={{
                width: '44px', height: '44px',
                backgroundColor: 'var(--color-accent-light)',
                borderRadius: 'var(--border-radius-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px',
              }}>
                <Upload size={20} color="var(--color-accent)" />
              </div>
              <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)' }}>
                {fileName || 'Drop your CSV file here'}
              </p>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                {fileName ? 'Click Analyse to continue' : 'or click to browse — accepts .csv files'}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx"
                style={{ display: 'none' }}
                onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
              />
            </div>

            {/* Paste toggle */}
            <div>
              <button
                onClick={() => setShowPaste(v => !v)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '13px', fontFamily: 'var(--font-sans)',
                  color: 'var(--color-accent)', padding: '0',
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}
              >
                <FileText size={13} />
                {showPaste ? 'Hide paste area' : 'Or paste your CSV directly'}
              </button>
              {showPaste && (
                <textarea
                  value={pasteText}
                  onChange={e => setPasteText(e.target.value)}
                  placeholder="Paste CSV content here…"
                  rows={6}
                  style={{
                    marginTop: '10px', width: '100%',
                    padding: '10px 12px', fontSize: '12px',
                    fontFamily: 'monospace',
                    color: 'var(--color-text-primary)',
                    backgroundColor: 'var(--color-background-secondary)',
                    border: '1px solid var(--color-border-secondary)',
                    borderRadius: 'var(--border-radius-md)',
                    outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'var(--color-accent)' }}
                  onBlur={e => { e.target.style.borderColor = 'var(--color-border-secondary)' }}
                />
              )}
            </div>

            {/* Error */}
            {analyseError && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '8px',
                padding: '10px 12px', backgroundColor: 'var(--color-danger-light)',
                border: '1px solid var(--color-danger)',
                borderRadius: 'var(--border-radius-sm)',
                fontSize: '13px', color: 'var(--color-danger)',
              }}>
                <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
                {analyseError}
              </div>
            )}

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <a
                href="/sample.csv"
                download="propmemory_sample.csv"
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  fontSize: '13px', color: 'var(--color-text-secondary)',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
              >
                <Download size={13} />
                Download sample CSV
              </a>
              <button
                onClick={showPaste ? handlePasteAnalyse : undefined}
                disabled={analysing || (!showPaste && !fileName)}
                style={{
                  padding: '9px 20px', fontSize: '14px', fontWeight: '500',
                  fontFamily: 'var(--font-sans)', color: '#fff',
                  backgroundColor: analysing || (!showPaste && !fileName)
                    ? 'var(--color-border-secondary)'
                    : 'var(--color-accent)',
                  border: 'none', borderRadius: 'var(--border-radius-md)',
                  cursor: analysing || (!showPaste && !fileName) ? 'not-allowed' : 'pointer',
                }}
              >
                {analysing ? 'Analysing…' : 'Analyse'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Preview */}
        {step === STEPS.PREVIEW && result && (
          <ImportPreview
            result={result}
            onBack={() => setStep(STEPS.UPLOAD)}
            onImport={handleImport}
            importing={saving}
          />
        )}

        {/* Step 3 — Success */}
        {step === STEPS.SUCCESS && (
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <div style={{
              width: '56px', height: '56px',
              backgroundColor: 'var(--color-success-light)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <CheckCircle size={28} color="var(--color-success)" />
            </div>
            <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
              {importedProps.length} {importedProps.length === 1 ? 'property' : 'properties'} imported
            </h2>
            <p style={{ margin: '0 0 20px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
              All properties are now in your portfolio.
            </p>
            <div style={{ textAlign: 'left', marginBottom: '24px', maxHeight: '200px', overflowY: 'auto' }}>
              {importedProps.map(p => (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '7px 0', borderBottom: '1px solid var(--color-border-primary)',
                  fontSize: '13px', color: 'var(--color-text-primary)',
                }}>
                  <CheckCircle size={12} color="var(--color-success)" />
                  {p.address}{p.unit_identifier ? `, ${p.unit_identifier}` : ''}
                </div>
              ))}
            </div>
            <button
              onClick={() => { onSuccess?.(); navigate('/dashboard') }}
              style={{
                padding: '10px 24px', fontSize: '14px', fontWeight: '500',
                fontFamily: 'var(--font-sans)', color: '#fff',
                backgroundColor: 'var(--color-accent)',
                border: 'none', borderRadius: 'var(--border-radius-md)', cursor: 'pointer',
              }}
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
