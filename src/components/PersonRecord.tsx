import { useState } from 'react'
import type { Character, StateEntry } from '../types'
import { QUALITIES, STATE_MENAGERIE, TABLE_MOVES } from '../data'
import { uid } from '../storage'
import { formatMod } from './QualityAllocator'

interface Props {
  character: Character
  onChange: (c: Character) => void
  onEdit: () => void
  onBack: () => void
}

const MAX_STATES = 4 // a fifth is the turning point — Out

export default function PersonRecord({ character, onChange, onEdit, onBack }: Props) {
  const c = character
  const [newState, setNewState] = useState('')

  function patch(p: Partial<Character>) {
    onChange({ ...c, ...p })
  }

  function addState(description: string, interferes = '') {
    const desc = description.trim()
    if (!desc) return
    const entry: StateEntry = { id: uid(), description: desc, interferes }
    patch({ states: [...c.states, entry] })
    setNewState('')
  }
  function clearState(id: string) {
    patch({ states: c.states.filter((s) => s.id !== id) })
  }

  function setExperience(n: number) {
    patch({ experience: n === c.experience ? n - 1 : n })
  }
  function cashAdvance() {
    if (c.experience < 5) return
    patch({ experience: c.experience - 5, advances: [...c.advances, ''] })
  }
  function updateAdvance(i: number, text: string) {
    patch({ advances: c.advances.map((a, idx) => (idx === i ? text : a)) })
  }
  function removeAdvance(i: number) {
    patch({ advances: c.advances.filter((_, idx) => idx !== i) })
  }

  const isOut = c.states.length > MAX_STATES

  return (
    <div className="record">
      <div className="record-toolbar no-print">
        <button type="button" className="ghost-btn" onClick={onBack}>
          ← Roster
        </button>
        <div className="record-toolbar-right">
          <button type="button" className="ghost-btn" onClick={() => window.print()}>
            Print
          </button>
          <button type="button" className="primary-btn" onClick={onEdit}>
            Edit
          </button>
        </div>
      </div>

      <article className="sheet record-sheet">
        <header className="record-masthead">
          <div className="masthead-meta">
            <span>FORM GIB-2 (REV. 7)</span>
            <span>PERSON RECORD</span>
            <span>QUALITY: INDETERMINATE</span>
          </div>
          <h1 className="sheet-title">Person Record</h1>
          <p className="sheet-subtitle">
            For the documentation of one (1) Person of Indeterminate Quality
          </p>
        </header>

        {/* §1 Identification */}
        <Section n="1" title="Identification" sub="Particulars">
          <div className="record-id">
            <IdField label="Designation — the name they answer to" value={c.designation} />
            <IdField label="Borne by — player" value={c.borneBy} />
            <IdField label="Bearing — how the room reads them" value={c.bearing} />
            <IdField label="Origin / Provenance" value={c.origin} />
          </div>
        </Section>

        {/* §2 The Six Qualities */}
        <Section n="2" title="The Six Qualities" sub="Schedule A · +2, +1, +1, 0, 0, −1">
          <div className="record-qualities">
            {QUALITIES.map((q) => (
              <div className="record-q" key={q.key}>
                <div className="record-q-text">
                  <span className="record-q-name">{q.name}</span>
                  <span className="record-q-tag">{q.tagline}</span>
                </div>
                <span className="record-q-move">{q.move}</span>
                <span className="record-q-val">{formatMod(c.qualities[q.key])}</span>
              </div>
            ))}
          </div>
        </Section>

        <div className="record-columns">
          {/* §3 States */}
          <Section n="3" title="States" sub="Sch. C · Conditions of Wear">
            <p className="micro">
              Each marked State: −1 to rolls it would plausibly interfere with. Carry
              four. The fifth is a turning point — <strong>Out</strong>.
            </p>
            <ul className="state-list">
              {c.states.map((s, i) => (
                <li
                  key={s.id}
                  className={`state-item${i >= MAX_STATES ? ' is-out' : ''}`}
                >
                  <span className="state-pip">{i >= MAX_STATES ? '✕' : '■'}</span>
                  <span className="state-text">
                    <strong>{s.description}</strong>
                    {s.interferes && (
                      <em className="state-interferes"> — interferes with {s.interferes}</em>
                    )}
                  </span>
                  <button
                    type="button"
                    className="icon-btn no-print"
                    aria-label="Clear state"
                    onClick={() => clearState(s.id)}
                  >
                    ✕
                  </button>
                </li>
              ))}
              {c.states.length === 0 && (
                <li className="empty-note">Whole, for now.</li>
              )}
            </ul>
            {isOut && (
              <p className="warn">
                Five States marked. This Person is <strong>Out</strong> — taken, broken,
                fled, transformed, undone, or finally dead. The table decides.
              </p>
            )}
            <div className="state-add no-print">
              <div className="state-menagerie">
                {STATE_MENAGERIE.map((m) => (
                  <button
                    key={m.description}
                    type="button"
                    className="chip"
                    onClick={() => addState(m.description, m.interferes)}
                  >
                    + {m.description}
                  </button>
                ))}
              </div>
              <div className="state-custom">
                <input
                  className="field-input"
                  placeholder="Mark a State — a short true description…"
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addState(newState)
                  }}
                />
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={() => addState(newState)}
                >
                  Mark
                </button>
              </div>
            </div>
          </Section>

          {/* §4 Experience */}
          <Section n="4" title="Experience" sub="5 = Advance">
            <p className="micro">
              Mark on a 6−, on acting out your drive at a cost, or on learning one true
              thing per session. Five buys one Advance.
            </p>
            <div className="xp-pips no-print">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`xp-pip${c.experience >= n ? ' is-filled' : ''}`}
                  aria-label={`Experience ${n}`}
                  onClick={() => setExperience(n)}
                >
                  {c.experience >= n ? '■' : ''}
                </button>
              ))}
              <button
                type="button"
                className="ghost-btn xp-cash"
                disabled={c.experience < 5}
                onClick={cashAdvance}
              >
                Take Advance
              </button>
            </div>
            <div className="advances">
              <span className="field-label">Advances taken</span>
              {c.advances.length === 0 && (
                <p className="empty-note">None yet. Getting there is the chapter you’re in.</p>
              )}
              {c.advances.map((a, i) => (
                <div className="advance-row" key={i}>
                  <input
                    className="field-input"
                    placeholder="What the world made available…"
                    value={a}
                    onChange={(e) => updateAdvance(i, e.target.value)}
                  />
                  <button
                    type="button"
                    className="icon-btn no-print"
                    aria-label="Remove advance"
                    onClick={() => removeAdvance(i)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* §5 Drives & Bonds */}
        <Section n="5" title="Drives & Bonds" sub="First Sitting">
          <div className="record-drives">
            <IdField label="One thing this person wants" value={c.wants} />
            <IdField label="One thing this person fears" value={c.fears} />
          </div>
          <div className="record-bonds">
            <span className="field-label">Bonds — how you know the others at the table</span>
            {c.bonds.length === 0 && <p className="empty-note">No bonds recorded.</p>}
            <ul className="bond-list">
              {c.bonds.map((b) => (
                <li key={b.id}>
                  {b.who ? <strong>{b.who}</strong> : <em>someone</em>}
                  {' — '}
                  {b.how || <em>—</em>}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* §6 Carried & Kept */}
        <Section n="6" title="Carried & Kept" sub="Inventory · Notes">
          <p className="record-inventory">{c.inventory || <em>Nothing recorded.</em>}</p>
        </Section>
      </article>

      {/* At-table reference */}
      <article className="sheet reference-sheet">
        <header className="reference-head">
          <h2 className="sheet-title">At-Table Reference</h2>
          <p className="sheet-subtitle">Roll 2d6 + the relevant Quality. Keep this side up while playing.</p>
        </header>
        <div className="reference-grid">
          {QUALITIES.map((q) => (
            <div className="reference-move" key={q.key}>
              <div className="reference-move-head">
                <span className="reference-move-name">
                  {q.move} — {q.name}
                </span>
                <span className="reference-move-val">{formatMod(c.qualities[q.key])}</span>
              </div>
              <p className="reference-trigger">{q.trigger}</p>
              <ul className="reference-results">
                <li><b>10+</b> {q.results.strong}</li>
                <li><b>7–9</b> {q.results.weak}</li>
                <li><b>6−</b> {q.results.miss}</li>
              </ul>
            </div>
          ))}
          {TABLE_MOVES.map((m) => (
            <div className="reference-move" key={m.name}>
              <div className="reference-move-head">
                <span className="reference-move-name">{m.name}</span>
              </div>
              <p className="reference-trigger">{m.trigger}</p>
              {m.results && (
                <ul className="reference-results">
                  <li><b>10+</b> {m.results.strong}</li>
                  <li><b>7–9</b> {m.results.weak}</li>
                  <li><b>6−</b> {m.results.miss}</li>
                </ul>
              )}
            </div>
          ))}
        </div>
        <p className="reference-footer">
          The Surveyor is on your side the way a coastline is on the side of a shipwreck.
          Play to find out what happens.
        </p>
      </article>
    </div>
  )
}

function Section({
  n,
  title,
  sub,
  children,
}: {
  n: string
  title: string
  sub: string
  children: React.ReactNode
}) {
  return (
    <section className="section">
      <div className="section-bar">
        <span className="section-bar-title">
          <span className="section-n">§{n}</span> {title}
        </span>
        <span className="section-bar-sub">{sub}</span>
      </div>
      <div className="section-body">{children}</div>
    </section>
  )
}

function IdField({ label, value }: { label: string; value: string }) {
  return (
    <div className="id-field">
      <span className="field-label">{label}</span>
      <span className="id-value">{value || ' '}</span>
    </div>
  )
}
