import { useState } from 'react'
import type { Bond, Character } from '../types'
import { QUALITIES } from '../data'
import { uid } from '../storage'
import QualityAllocator, { formatMod } from './QualityAllocator'

interface Props {
  initial: Character
  onSave: (c: Character) => void
  onCancel: () => void
}

const STEPS = [
  { n: 1, title: 'Identification', sub: '§1 · Particulars' },
  { n: 2, title: 'The Six Qualities', sub: '§2 · Schedule A' },
  { n: 3, title: 'Drives', sub: '§5 · What you want, what you fear' },
  { n: 4, title: 'Bonds', sub: '§5 · No strangers at the first table' },
  { n: 5, title: 'Carried & File', sub: '§6 · Inventory & notes' },
]

export default function Creator({ initial, onSave, onCancel }: Props) {
  const [draft, setDraft] = useState<Character>(initial)
  const [step, setStep] = useState(1)

  function set<K extends keyof Character>(key: K, value: Character[K]) {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  const qualitiesComplete = QUALITIES.every((q) => draft.qualities[q.key] !== null)
  const canFinish = draft.designation.trim().length > 0 && qualitiesComplete

  function addBond() {
    const b: Bond = { id: uid(), who: '', how: '' }
    set('bonds', [...draft.bonds, b])
  }
  function updateBond(id: string, patch: Partial<Bond>) {
    set(
      'bonds',
      draft.bonds.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    )
  }
  function removeBond(id: string) {
    set(
      'bonds',
      draft.bonds.filter((b) => b.id !== id),
    )
  }

  const cur = STEPS[step - 1]

  return (
    <div className="creator sheet">
      <header className="sheet-masthead">
        <div className="masthead-meta">
          <span>FORM GIB-2 · REV. 7</span>
          <span>THE FIRST SITTING</span>
        </div>
        <h1 className="sheet-title">Build a Person</h1>
        <p className="sheet-subtitle">
          of Indeterminate Quality — distribute the difference and find out what happens
        </p>
      </header>

      <ol className="stepper" aria-label="Progress">
        {STEPS.map((s) => (
          <li
            key={s.n}
            className={`stepper-item${s.n === step ? ' is-current' : ''}${
              s.n < step ? ' is-done' : ''
            }`}
          >
            <button type="button" onClick={() => setStep(s.n)}>
              <span className="stepper-n">{s.n}</span>
              <span className="stepper-title">{s.title}</span>
            </button>
          </li>
        ))}
      </ol>

      <section className="section">
        <div className="section-bar">
          <span className="section-bar-title">{cur.title}</span>
          <span className="section-bar-sub">{cur.sub}</span>
        </div>

        <div className="section-body">
          {step === 1 && (
            <div className="field-grid">
              <Field
                label="Designation — the name they answer to"
                value={draft.designation}
                onChange={(v) => set('designation', v)}
                autoFocus
              />
              <Field
                label="Borne by — player"
                value={draft.borneBy}
                onChange={(v) => set('borneBy', v)}
              />
              <Field
                label="Bearing — how the room reads them at a glance"
                value={draft.bearing}
                onChange={(v) => set('bearing', v)}
                wide
              />
              <Field
                label="Origin / Provenance"
                value={draft.origin}
                onChange={(v) => set('origin', v)}
                wide
              />
            </div>
          )}

          {step === 2 && (
            <QualityAllocator
              values={draft.qualities}
              onChange={(v) => set('qualities', v)}
            />
          )}

          {step === 3 && (
            <div className="field-grid">
              <p className="prose wide">
                Each Person names one thing they want and one thing they’re afraid
                of. Write both down — you’ll use both.
              </p>
              <Field
                label="One thing this person wants"
                value={draft.wants}
                onChange={(v) => set('wants', v)}
                wide
              />
              <Field
                label="One thing this person fears"
                value={draft.fears}
                onChange={(v) => set('fears', v)}
                wide
              />
            </div>
          )}

          {step === 4 && (
            <div className="bonds">
              <p className="prose">
                Draw a line between every pair of Persons:{' '}
                <em>how do you know each other?</em> No strangers at the first table.
              </p>
              {draft.bonds.length === 0 && (
                <p className="empty-note">No bonds recorded yet.</p>
              )}
              {draft.bonds.map((b) => (
                <div className="bond-row" key={b.id}>
                  <input
                    className="field-input bond-who"
                    placeholder="With…"
                    value={b.who}
                    onChange={(e) => updateBond(b.id, { who: e.target.value })}
                  />
                  <input
                    className="field-input bond-how"
                    placeholder="…is how you know each other"
                    value={b.how}
                    onChange={(e) => updateBond(b.id, { how: e.target.value })}
                  />
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label="Remove bond"
                    onClick={() => removeBond(b.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button type="button" className="ghost-btn" onClick={addBond}>
                + Add a bond
              </button>
            </div>
          )}

          {step === 5 && (
            <div className="field-grid">
              <label className="field wide">
                <span className="field-label">Carried &amp; Kept — inventory · notes</span>
                <textarea
                  className="field-input field-textarea"
                  rows={4}
                  value={draft.inventory}
                  onChange={(e) => set('inventory', e.target.value)}
                />
              </label>

              <div className="review wide">
                <h3 className="review-title">Before you file</h3>
                <dl className="review-list">
                  <div>
                    <dt>Designation</dt>
                    <dd>{draft.designation || <em>unnamed</em>}</dd>
                  </div>
                  <div>
                    <dt>Bearing</dt>
                    <dd>{draft.bearing || <em>—</em>}</dd>
                  </div>
                  <div className="review-qualities">
                    <dt>Qualities</dt>
                    <dd>
                      {QUALITIES.map((q) => (
                        <span className="review-q" key={q.key}>
                          {q.move} {formatMod(draft.qualities[q.key])}
                        </span>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt>Wants</dt>
                    <dd>{draft.wants || <em>—</em>}</dd>
                  </div>
                  <div>
                    <dt>Fears</dt>
                    <dd>{draft.fears || <em>—</em>}</dd>
                  </div>
                </dl>
                {!canFinish && (
                  <p className="warn">
                    Needs a designation and all six qualities assigned before filing.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="creator-nav">
        <button type="button" className="ghost-btn" onClick={onCancel}>
          Cancel
        </button>
        <div className="creator-nav-right">
          {step > 1 && (
            <button
              type="button"
              className="ghost-btn"
              onClick={() => setStep((s) => s - 1)}
            >
              Back
            </button>
          )}
          {step < STEPS.length && (
            <button
              type="button"
              className="primary-btn"
              onClick={() => setStep((s) => s + 1)}
            >
              Next
            </button>
          )}
          {step === STEPS.length && (
            <button
              type="button"
              className="primary-btn stamp-btn"
              disabled={!canFinish}
              onClick={() => onSave(draft)}
            >
              Stamp &amp; File
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}

interface FieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  wide?: boolean
  autoFocus?: boolean
}

function Field({ label, value, onChange, wide, autoFocus }: FieldProps) {
  return (
    <label className={`field${wide ? ' wide' : ''}`}>
      <span className="field-label">{label}</span>
      <input
        className="field-input"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}
