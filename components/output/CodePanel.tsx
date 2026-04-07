'use client'
// ─────────────────────────────────────────────────────────────────────────────
// digifridge · components/output/CodePanel.tsx
// Slide-in panel showing live generated code and run output.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useFridgeStore } from '@/store/fridge'
import { executeCode } from '@/lib/code-generator'
import { OutputMagnet } from '@/types'

function buildOutputMagnets(lines: string[]): OutputMagnet[] {
  return lines.map((text, i) => ({
    id: `out_${i}`,
    text,
    x: 300 + Math.round((Math.random() * 24) - 12),
    y: 20 + i * 42 + Math.round((Math.random() * 6) - 3),
    rotation: parseFloat(((Math.random() * 6) - 3).toFixed(1)),
  }))
}

export function CodePanel() {
  const { generatedCode, ui, setCodePanelOpen, clearAll, outputMagnets, setOutputMagnets } = useFridgeStore()
  const { codePanelOpen } = ui
  const [runError, setRunError] = useState<string | null>(null)

  function handleRun() {
    if (!generatedCode) return
    const result = executeCode(generatedCode.raw)
    setRunError(result.error ?? null)
    if (!result.error && result.output.length > 0) {
      setOutputMagnets(buildOutputMagnets(result.output))
    } else {
      setOutputMagnets([])
    }
  }

  const runOutput = outputMagnets.length > 0 ? outputMagnets.map(m => m.text) : null

  const hasCode = !!generatedCode && generatedCode.lines.length > 0
  const hasErrors = generatedCode?.hasErrors ?? false

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setCodePanelOpen(!codePanelOpen)}
        className="absolute top-3 right-3 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all"
        style={{
          fontFamily: 'var(--font-mono)',
          background: 'rgba(10,12,16,0.85)',
          border: '0.5px solid #2a2e36',
          color: '#64748b',
          backdropFilter: 'blur(6px)',
          letterSpacing: '0.08em',
        }}
      >
        <span style={{ color: !hasCode ? '#4b5563' : hasErrors ? '#f87171' : '#22c55e' }}>
          ●
        </span>
        {codePanelOpen ? 'hide code' : 'view code'}
      </button>

      {/* Slide-in panel */}
      <AnimatePresence>
        {codePanelOpen && (
          <motion.div
            className="code-panel absolute top-0 right-0 bottom-0 flex flex-col"
            style={{ width: 'var(--panel-width)', zIndex: 40, borderLeft: '0.5px solid #1e2130' }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 shrink-0"
              style={{ borderBottom: '0.5px solid #1e2130' }}
            >
              <span
                className="text-xs uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-mono)', color: '#4b5563', fontSize: 9 }}
              >
                generated code
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearAll}
                  className="text-xs px-2 py-1 rounded transition-colors"
                  style={{ fontFamily: 'var(--font-mono)', color: '#374151', fontSize: 10 }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#374151')}
                >
                  clear
                </button>
                <button
                  onClick={handleRun}
                  disabled={!hasCode || hasErrors}
                  className="text-xs px-3 py-1 rounded font-medium transition-all"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    background: '#22c55e',
                    color: '#071207',
                    opacity: hasCode && !hasErrors ? 1 : 0.3,
                    fontSize: 10,
                  }}
                >
                  ▶ run
                </button>
              </div>
            </div>

            {/* Code lines */}
            <div className="flex-1 overflow-y-auto px-4 py-4" style={{ fontFamily: 'var(--font-mono)' }}>
              {hasCode ? (
                <pre className="text-xs leading-relaxed">
                  {generatedCode!.lines.map((line, i) => (
                    <div key={i} className="flex gap-3" style={{ paddingLeft: line.indent * 14 }}>
                      <span style={{ color: '#1f2937', userSelect: 'none', minWidth: 18, textAlign: 'right' }}>
                        {i + 1}
                      </span>
                      <span className={tokenClass(line.text)}>
                        {line.text}
                      </span>
                    </div>
                  ))}
                </pre>
              ) : (
                <div className="text-center mt-8" style={{ color: '#374151', fontSize: 10, fontFamily: 'var(--font-mono)' }}>
                  place magnets on the fridge<br />to generate code
                </div>
              )}

              {/* Validation errors */}
              {hasErrors && generatedCode?.errors.map((err, i) => (
                <div
                  key={i}
                  className="mt-3 px-3 py-2 rounded text-xs"
                  style={{ background: 'rgba(239,68,68,.08)', border: '0.5px solid rgba(239,68,68,.25)', color: '#f87171', fontFamily: 'var(--font-mono)' }}
                >
                  ⚠ {err}
                </div>
              ))}
            </div>

            {/* Run output */}
            {(runOutput !== null || runError) && (
              <div
                className="shrink-0 px-4 py-3"
                style={{ borderTop: '0.5px solid #1e2130', maxHeight: 160, overflowY: 'auto' }}
              >
                <div className="text-xs uppercase tracking-widest mb-2" style={{ color: '#4b5563', fontFamily: 'var(--font-mono)', fontSize: 9 }}>
                  output
                </div>
                {runOutput?.map((line, i) => (
                  <div key={i} className="text-xs" style={{ color: '#86efac', fontFamily: 'var(--font-mono)' }}>
                    {line}
                  </div>
                ))}
                {runError && (
                  <div className="text-xs" style={{ color: '#f87171', fontFamily: 'var(--font-mono)' }}>
                    ✗ {runError}
                  </div>
                )}
                {runOutput?.length === 0 && !runError && (
                  <div className="text-xs" style={{ color: '#4b5563', fontFamily: 'var(--font-mono)' }}>
                    (no output)
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function tokenClass(line: string): string {
  const t = line.trim()
  if (t.startsWith('//')) return 'token-comment'
  if (/^(for|while|if|else|function|let|const|return)\b/.test(t)) return 'token-keyword'
  if (t.startsWith('print(')) return 'token-output'
  return 'token-default'
}
