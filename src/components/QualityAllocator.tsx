import { useMemo, useState } from 'react'
import type { QualityKey, QualityValues } from '../types'
import { QUALITIES, QUALITY_POOL } from '../data'

export function formatMod(n: number | null): string {
  if (n === null) return '—'
  if (n > 0) return `+${n}`
  if (n < 0) return `−${Math.abs(n)}`
  return '0'
}

interface Props {
  values: QualityValues
  onChange: (next: QualityValues) => void
}

/** A token in the tray, identified by position so duplicates stay distinct. */
interface Token {
  tid: number
  value: number
}

export default function QualityAllocator({ values, onChange }: Props) {
  const [selected, setSelected] = useState<number | null>(null)

  const tokens: Token[] = useMemo(
    () => QUALITY_POOL.map((value, tid) => ({ tid, value })),
    [],
  )

  // Which token ids have been consumed by current assignments.
  const consumed = useMemo(() => {
    const used = new Set<number>()
    const remaining = [...tokens]
    for (const q of QUALITIES) {
      const v = values[q.key]
      if (v === null) continue
      const idx = remaining.findIndex((t) => t.value === v)
      if (idx >= 0) {
        used.add(remaining[idx].tid)
        remaining.splice(idx, 1)
      }
    }
    return used
  }, [tokens, values])

  const assignedCount = QUALITIES.filter((q) => values[q.key] !== null).length
  const complete = assignedCount === QUALITIES.length

  function assign(key: QualityKey, value: number) {
    onChange({ ...values, [key]: value })
  }
  function clear(key: QualityKey) {
    onChange({ ...values, [key]: null })
  }

  function handleSlotClick(key: QualityKey) {
    const current = values[key]
    if (selected !== null) {
      const token = tokens.find((t) => t.tid === selected)
      if (token) assign(key, token.value)
      setSelected(null)
    } else if (current !== null) {
      clear(key)
    }
  }

  function handleTokenClick(token: Token) {
    if (consumed.has(token.tid)) return
    setSelected((s) => (s === token.tid ? null : token.tid))
  }

  function randomize() {
    const shuffled = [...QUALITY_POOL]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    const next = {} as QualityValues
    QUALITIES.forEach((q, i) => {
      next[q.key] = shuffled[i]
    })
    onChange(next)
    setSelected(null)
  }

  function clearAll() {
    const next = {} as QualityValues
    QUALITIES.forEach((q) => {
      next[q.key] = null
    })
    onChange(next)
    setSelected(null)
  }

  return (
    <div className="allocator">
      <div className="tray" role="group" aria-label="Available quantities">
        <span className="tray-label">Schedule A</span>
        <div className="tray-tokens">
          {tokens.map((t) => {
            const isConsumed = consumed.has(t.tid)
            const isSelected = selected === t.tid
            return (
              <button
                key={t.tid}
                type="button"
                className={`token${isConsumed ? ' is-consumed' : ''}${
                  isSelected ? ' is-selected' : ''
                }`}
                onClick={() => handleTokenClick(t)}
                disabled={isConsumed}
                aria-pressed={isSelected}
              >
                {formatMod(t.value)}
              </button>
            )
          })}
        </div>
        <div className="tray-actions">
          <button type="button" className="link-btn" onClick={randomize}>
            Roll for me
          </button>
          <button type="button" className="link-btn" onClick={clearAll}>
            Clear
          </button>
        </div>
      </div>

      <p className="allocator-hint">
        {selected !== null
          ? 'Now choose a quality to record it against.'
          : complete
            ? 'That is who you are. The −1 is also who you are; do not pretend otherwise.'
            : 'Select a quantity above, then a quality below. Click a filled box to return it.'}
      </p>

      <div className="quality-grid">
        {QUALITIES.map((q) => {
          const v = values[q.key]
          return (
            <div className="quality-row" key={q.key}>
              <div className="quality-id">
                <span className="quality-name">{q.name}</span>
                <span className="quality-move">{q.move}</span>
                <span className="quality-tagline">{q.tagline}</span>
              </div>
              <button
                type="button"
                className={`quality-slot${v !== null ? ' is-filled' : ''}${
                  selected !== null && v === null ? ' is-target' : ''
                }`}
                onClick={() => handleSlotClick(q.key)}
                aria-label={`${q.name}: ${v === null ? 'unassigned' : formatMod(v)}`}
              >
                {formatMod(v)}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
