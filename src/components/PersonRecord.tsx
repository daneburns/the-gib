import { useEffect, useState } from 'react'
import type { Bond, Character, StateEntry } from '../types'
import { QUALITIES, QUALITY_BY_KEY, STATE_MENAGERIE, TABLE_MOVES } from '../data'
import { uid } from '../storage'
import { dieFace, rollMove, type Roll } from '../dice'
import { exportCharacter } from '../io'
import { genBearing, genDesignation, genFears, genOrigin, genWants } from '../generator'
import { DiceButton } from './Creator'
import { formatMod } from './QualityAllocator'
import Portrait from './Portrait'

function signed(n: number): string {
  return n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : '+0'
}

interface Props {
  character: Character
  onChange: (c: Character) => void
  justFiled: boolean
  onBack: () => void
}

const MAX_STATES = 4 // a fifth is the turning point — Out

export default function PersonRecord({ character, onChange, justFiled, onBack }: Props) {
  const c = character
  const [newState, setNewState] = useState('')
  const [roll, setRoll] = useState<Roll | null>(null)
  const [adjust, setAdjust] = useState(0)
  const [showStamp, setShowStamp] = useState(justFiled)

  useEffect(() => {
    if (!showStamp) return
    const t = setTimeout(() => setShowStamp(false), 1900)
    return () => clearTimeout(t)
  }, [showStamp])

  function patch(p: Partial<Character>) {
    onChange({ ...c, ...p })
  }

  function doRoll(key: string, move: string, qualityName: string, modifier: number) {
    setRoll(rollMove({ modifier, adjust, moveKey: key, moveName: move, qualityName }))
  }

  function markExperience() {
    patch({ experience: Math.min(5, c.experience + 1) })
  }

  function addBond() {
    patch({ bonds: [...c.bonds, { id: uid(), who: '', how: '' }] })
  }
  function updateBond(id: string, p: Partial<Bond>) {
    patch({ bonds: c.bonds.map((b) => (b.id === id ? { ...b, ...p } : b)) })
  }
  function removeBond(id: string) {
    patch({ bonds: c.bonds.filter((b) => b.id !== id) })
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
      {showStamp && (
        <div className="filed-stamp" aria-hidden="true">
          <div className="filed-stamp-ink">
            <span className="filed-stamp-word">FILED</span>
            <span className="filed-stamp-sub">GIB-2 · REV. 7 · OFFICE OF UNQUANTIFIABLE MEASURES</span>
          </div>
        </div>
      )}

      <div className="record-toolbar no-print">
        <button type="button" className="ghost-btn" onClick={onBack}>
          ← Roster
        </button>
        <div className="record-toolbar-right">
          <button type="button" className="ghost-btn" onClick={() => exportCharacter(c)}>
            Export
          </button>
          <button type="button" className="ghost-btn" onClick={() => window.print()}>
            Print
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
          <div className="record-id record-id-portrait">
            <div className="record-portrait-cell">
              <span className="field-label">Likeness</span>
              <Portrait
                value={c.portrait}
                onChange={(v) => patch({ portrait: v })}
              />
            </div>
            <EditField
              label="Designation — the name they answer to"
              value={c.designation}
              onChange={(v) => patch({ designation: v })}
              onGenerate={() => patch({ designation: genDesignation() })}
            />
            <EditField
              label="Borne by — player"
              value={c.borneBy}
              onChange={(v) => patch({ borneBy: v })}
            />
            <EditField
              label="Bearing — how the room reads them"
              value={c.bearing}
              onChange={(v) => patch({ bearing: v })}
              onGenerate={() => patch({ bearing: genBearing() })}
            />
            <EditField
              label="Origin / Provenance"
              value={c.origin}
              onChange={(v) => patch({ origin: v })}
              onGenerate={() => patch({ origin: genOrigin() })}
            />
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
            <EditField
              label="One thing this person wants"
              value={c.wants}
              onChange={(v) => patch({ wants: v })}
              onGenerate={() => patch({ wants: genWants() })}
            />
            <EditField
              label="One thing this person fears"
              value={c.fears}
              onChange={(v) => patch({ fears: v })}
              onGenerate={() => patch({ fears: genFears() })}
            />
          </div>
          <div className="record-bonds">
            <span className="field-label">Bonds — how you know the others at the table</span>
            {c.bonds.length === 0 && <p className="empty-note">No bonds recorded.</p>}
            {/* Print-friendly read-only view */}
            <ul className="bond-list print-only">
              {c.bonds.map((b) => (
                <li key={b.id}>
                  {b.who ? <strong>{b.who}</strong> : <em>someone</em>}
                  {' — '}
                  {b.how || <em>—</em>}
                </li>
              ))}
            </ul>
            {/* Editable view */}
            <div className="no-print">
              {c.bonds.map((b) => (
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
          </div>
        </Section>

        {/* §6 Carried & Kept */}
        <Section n="6" title="Carried & Kept" sub="Inventory · Notes">
          <p className="record-inventory print-only">{c.inventory || <em>Nothing recorded.</em>}</p>
          <textarea
            className="field-input field-textarea record-inventory-input no-print"
            rows={4}
            placeholder="Nothing recorded — a coat, a key, forty-one cents and a grudge…"
            value={c.inventory}
            onChange={(e) => patch({ inventory: e.target.value })}
          />
        </Section>
      </article>

      {/* At-table reference */}
      <article className="sheet reference-sheet">
        <header className="reference-head">
          <h2 className="sheet-title">At-Table Reference</h2>
          <p className="sheet-subtitle">Roll 2d6 + the relevant Quality. Keep this side up while playing.</p>
        </header>

        <DiceConsole
          roll={roll}
          adjust={adjust}
          setAdjust={setAdjust}
          onMarkExperience={markExperience}
          canMark={c.experience < 5}
        />

        <div className="reference-grid">
          {QUALITIES.map((q) => {
            const mod = c.qualities[q.key] ?? 0
            const hit = roll?.moveKey === q.key ? roll.band : null
            return (
              <div className="reference-move" key={q.key}>
                <div className="reference-move-head">
                  <span className="reference-move-name">
                    {q.move} — {q.name}
                  </span>
                  <span className="reference-move-roll">
                    <span className="reference-move-val">{formatMod(c.qualities[q.key])}</span>
                    <button
                      type="button"
                      className="roll-btn no-print"
                      onClick={() => doRoll(q.key, `${q.move} — ${q.name}`, q.name, mod)}
                    >
                      ⚄ Roll
                    </button>
                  </span>
                </div>
                <p className="reference-trigger">{q.trigger}</p>
                <ul className="reference-results">
                  <li className={hit === '10+' ? 'is-hit' : ''}><b>10+</b> {q.results.strong}</li>
                  <li className={hit === '7–9' ? 'is-hit' : ''}><b>7–9</b> {q.results.weak}</li>
                  <li className={hit === '6−' ? 'is-hit' : ''}><b>6−</b> {q.results.miss}</li>
                </ul>
              </div>
            )
          })}
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

const ADJUST_CHIPS = [
  { label: '−1 State', delta: -1 },
  { label: '+1 forward', delta: 1 },
  { label: '+2 help', delta: 2 },
  { label: '−2 hinder', delta: -2 },
]

function resultText(moveKey: string, band: Roll['band']): string {
  const q = QUALITY_BY_KEY[moveKey as keyof typeof QUALITY_BY_KEY]
  if (!q) return ''
  if (band === '10+') return q.results.strong
  if (band === '7–9') return q.results.weak
  return q.results.miss
}

interface DiceConsoleProps {
  roll: Roll | null
  adjust: number
  setAdjust: (fn: (a: number) => number) => void
  onMarkExperience: () => void
  canMark: boolean
}

function DiceConsole({ roll, adjust, setAdjust, onMarkExperience, canMark }: DiceConsoleProps) {
  return (
    <div className="dice-console no-print">
      <div className="dice-adjust">
        <span className="field-label">Situational modifier</span>
        <div className="dice-stepper">
          <button type="button" className="ghost-btn" onClick={() => setAdjust((a) => a - 1)}>
            −
          </button>
          <span className="dice-adjust-val">{signed(adjust)}</span>
          <button type="button" className="ghost-btn" onClick={() => setAdjust((a) => a + 1)}>
            +
          </button>
        </div>
        <div className="dice-chips">
          {ADJUST_CHIPS.map((ch) => (
            <button
              key={ch.label}
              type="button"
              className="chip"
              onClick={() => setAdjust((a) => a + ch.delta)}
            >
              {ch.label}
            </button>
          ))}
          <button type="button" className="chip" onClick={() => setAdjust(() => 0)}>
            reset
          </button>
        </div>
      </div>

      {roll ? (
        <div className="dice-result" key={roll.id} data-band={roll.band}>
          <div className="dice-faces">
            <span className="die">{dieFace(roll.d1)}</span>
            <span className="die">{dieFace(roll.d2)}</span>
          </div>
          <div className="dice-readout">
            <div className="dice-math">
              <span className="dice-move">{roll.moveName}</span>
              <span className="dice-equation">
                {roll.d1} + {roll.d2}
                {roll.modifier !== 0 && ` ${signed(roll.modifier)} (${roll.qualityName})`}
                {roll.adjust !== 0 && ` ${signed(roll.adjust)}`} ={' '}
                <strong className="dice-total">{roll.total}</strong>
                <span className="dice-band">{roll.band}</span>
              </span>
            </div>
            <p className="dice-outcome">{resultText(roll.moveKey, roll.band)}</p>
            {roll.band === '6−' && (
              <button
                type="button"
                className="ghost-btn dice-xp"
                onClick={onMarkExperience}
                disabled={!canMark}
              >
                {canMark ? '+ Mark experience' : 'Experience full — take an Advance'}
              </button>
            )}
          </div>
        </div>
      ) : (
        <p className="dice-idle">
          Choose a move below and roll. 2d6 + the relevant Quality. The dice are
          rationed; spend them at the worst possible moments.
        </p>
      )}
    </div>
  )
}

interface EditFieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  onGenerate?: () => void
}

function EditField({ label, value, onChange, onGenerate }: EditFieldProps) {
  return (
    <label className="id-field">
      <span className="field-label">
        <span>{label}</span>
        {onGenerate && <DiceButton onClick={onGenerate} />}
      </span>
      {/* Read-only value for print; editable input on screen */}
      <span className="id-value print-only">{value || " "}</span>
      <input
        className="field-input no-print"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}
