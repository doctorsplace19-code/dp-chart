'use client'

import { useEffect, useState } from 'react'

type SubmissionStatus = 'PENDING' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED' | 'ERROR'

interface Submission {
  id: string
  status: SubmissionStatus
  fmcsaExaminationId: string | null
  submittedAt: string | null
  acceptedAt: string | null
  rejectedAt: string | null
  rejectionReason: string | null
  attempts: number
  lastAttemptAt: string | null
  errorMessage: string | null
  transmissionLogs: Array<{
    event: string
    status: string | null
    message: string | null
    createdAt: string
    httpStatus: number | null
  }>
}

const STATUS_CONFIG: Record<SubmissionStatus, { bg: string; border: string; text: string; label: string; icon: string }> = {
  PENDING:   { bg: '#fffbeb', border: '#fde68a', text: '#92400e', label: 'Pending Submission', icon: '⏳' },
  SUBMITTED: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', label: 'Submitted', icon: '📤' },
  ACCEPTED:  { bg: '#f0fdf4', border: '#bbf7d0', text: '#14532d', label: 'Accepted by FMCSA', icon: '✅' },
  REJECTED:  { bg: '#fef2f2', border: '#fecaca', text: '#7f1d1d', label: 'Rejected by FMCSA', icon: '❌' },
  ERROR:     { bg: '#fef2f2', border: '#fecaca', text: '#7f1d1d', label: 'Submission Error', icon: '⚠️' },
}

function fmt(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function FmcsaSubmitPanel({ examId, examStatus }: { examId: string; examStatus?: string }) {
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [dbReady, setDbReady] = useState(true)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchStatus() {
    try {
      const res = await fetch(`/api/fmcsa/status?examId=${encodeURIComponent(examId)}`)
      const data = await res.json()
      setDbReady(data.dbReady ?? true)
      setSubmission(data.submission ?? null)
    } catch {
      setError('Could not load submission status.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStatus() }, [examId])

  async function handleSubmit() {
    setSubmitting(true)
    setShowConfirm(false)
    setError(null)
    try {
      const res = await fetch('/api/fmcsa/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Submission failed.')
      }
      await fetchStatus()
    } catch {
      setError('Network error — please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const rowStyle: React.CSSProperties = {
    display: 'flex', gap: 8, padding: '5px 0',
    borderBottom: '1px solid var(--border)',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: 11, color: 'var(--ink3)', width: 160, flexShrink: 0,
  }
  const valStyle: React.CSSProperties = {
    fontSize: 12, color: 'var(--ink)', fontWeight: 500,
  }

  if (loading) {
    return (
      <div style={{ padding: '10px 14px', fontSize: 12, color: 'var(--ink3)' }}>
        Loading FMCSA status…
      </div>
    )
  }

  if (!dbReady) {
    return (
      <div style={{ padding: '10px 14px', fontSize: 12, color: '#92400e' }}>
        Database not connected — FMCSA submission requires a configured database.
      </div>
    )
  }

  const cfg = submission ? STATUS_CONFIG[submission.status] : null
  const canSubmit = !submission || submission.status === 'ERROR' || submission.status === 'REJECTED'
  const examCertified = !examStatus || examStatus === 'CERTIFIED' || examStatus === 'COMPLETED'

  return (
    <div>
      {/* Confirmation overlay */}
      {showConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
        }}>
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 12, padding: 24, maxWidth: 420, width: '90%', boxShadow: '0 8px 32px rgba(0,0,0,.18)',
          }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Submit to FMCSA National Registry?</div>
            <div style={{ fontSize: 13, color: 'var(--ink3)', marginBottom: 16, lineHeight: 1.5 }}>
              This will transmit the exam results to the FMCSA National Registry of Certified Medical Examiners.
              Per 49 CFR 391.43(g), results must be submitted within 24 hours of completion.
            </div>
            <div style={{ fontSize: 12, color: '#92400e', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, padding: '8px 12px', marginBottom: 16 }}>
              Note: Submission is queued and will be transmitted once FMCSA API credentials are active.
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--card)', cursor: 'pointer', fontSize: 13 }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
              >
                Confirm Submission
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '10px 14px' }}>
        {/* Status badge */}
        {cfg && (
          <div style={{
            background: cfg.bg, border: `1px solid ${cfg.border}`,
            borderRadius: 8, padding: '8px 12px', marginBottom: 10,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>{cfg.icon}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: cfg.text }}>{cfg.label}</div>
              {submission?.fmcsaExaminationId && (
                <div style={{ fontSize: 11, color: cfg.text, opacity: 0.8 }}>
                  FMCSA ID: {submission.fmcsaExaminationId}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Not yet submitted */}
        {!submission && (
          <div style={{ fontSize: 12, color: 'var(--ink3)', marginBottom: 10 }}>
            No submission on record for this exam.
          </div>
        )}

        {/* Detail rows */}
        {submission && (
          <>
            <div style={rowStyle}>
              <span style={labelStyle}>Status</span>
              <span style={valStyle}>{submission.status}</span>
            </div>
            <div style={rowStyle}>
              <span style={labelStyle}>Attempts</span>
              <span style={valStyle}>{submission.attempts}</span>
            </div>
            {submission.submittedAt && (
              <div style={rowStyle}>
                <span style={labelStyle}>Submitted At</span>
                <span style={valStyle}>{fmt(submission.submittedAt)}</span>
              </div>
            )}
            {submission.acceptedAt && (
              <div style={rowStyle}>
                <span style={labelStyle}>Accepted At</span>
                <span style={valStyle}>{fmt(submission.acceptedAt)}</span>
              </div>
            )}
            {submission.rejectionReason && (
              <div style={rowStyle}>
                <span style={labelStyle}>Rejection Reason</span>
                <span style={{ ...valStyle, color: '#7f1d1d' }}>{submission.rejectionReason}</span>
              </div>
            )}
            {submission.errorMessage && (
              <div style={rowStyle}>
                <span style={labelStyle}>Error</span>
                <span style={{ ...valStyle, color: '#7f1d1d', fontSize: 11 }}>{submission.errorMessage}</span>
              </div>
            )}
          </>
        )}

        {/* Transmission log */}
        {submission?.transmissionLogs && submission.transmissionLogs.length > 0 && (
          <details style={{ marginTop: 8 }}>
            <summary style={{ fontSize: 11, color: 'var(--ink3)', cursor: 'pointer', userSelect: 'none' }}>
              Transmission log ({submission.transmissionLogs.length} events)
            </summary>
            <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {submission.transmissionLogs.map((log, i) => (
                <div key={i} style={{ fontSize: 11, color: 'var(--ink3)', background: 'var(--bg)', borderRadius: 4, padding: '4px 8px' }}>
                  <span style={{ fontWeight: 600 }}>{log.event}</span>
                  {log.httpStatus && <span style={{ marginLeft: 6, color: 'var(--ink2)' }}>HTTP {log.httpStatus}</span>}
                  {log.message && <span style={{ marginLeft: 6 }}>{log.message}</span>}
                  <span style={{ marginLeft: 6, color: 'var(--ink4)' }}>{fmt(log.createdAt)}</span>
                </div>
              ))}
            </div>
          </details>
        )}

        {/* Error banner */}
        {error && (
          <div style={{ marginTop: 8, padding: '8px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, fontSize: 12, color: '#7f1d1d' }}>
            {error}
          </div>
        )}

        {/* Submit button */}
        {canSubmit && examCertified && (
          <button
            onClick={() => setShowConfirm(true)}
            disabled={submitting}
            style={{
              marginTop: 10, width: '100%', padding: '10px 0',
              background: submitting ? '#94a3b8' : 'var(--accent)',
              color: '#fff', border: 'none', borderRadius: 7,
              fontWeight: 700, fontSize: 13, cursor: submitting ? 'not-allowed' : 'pointer',
              letterSpacing: '.02em',
            }}
          >
            {submitting ? '⏳ Submitting…' : submission?.status === 'REJECTED' || submission?.status === 'ERROR' ? '↻ Resubmit to FMCSA' : '🏛️ Submit to FMCSA National Registry'}
          </button>
        )}
      </div>
    </div>
  )
}
