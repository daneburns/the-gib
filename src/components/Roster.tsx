import type { Character } from '../types'
import { QUALITIES } from '../data'
import { formatMod } from './QualityAllocator'

interface Props {
  characters: Character[]
  onOpen: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
}

function topQuality(c: Character) {
  let best: { name: string; v: number } | null = null
  for (const q of QUALITIES) {
    const v = c.qualities[q.key]
    if (v === null) continue
    if (!best || v > best.v) best = { name: q.name, v }
  }
  return best
}

export default function Roster({ characters, onOpen, onNew, onDelete }: Props) {
  return (
    <div className="roster">
      <header className="roster-head">
        <div className="masthead-meta">
          <span>OFFICE OF UNQUANTIFIABLE MEASURES</span>
          <span>OPEN / DIAGNOSTIC</span>
        </div>
        <h1 className="roster-title">THE GIB</h1>
        <p className="roster-subtitle">
          Field Manual for Persons of Indeterminate Quality — Records Room
        </p>
        <button type="button" className="primary-btn new-btn" onClick={onNew}>
          + New Person Record
        </button>
      </header>

      {characters.length === 0 ? (
        <div className="roster-empty">
          <p>No Persons on file.</p>
          <p className="micro">
            Every person possesses all six qualities. The numbers differ. The
            difference is the entire matter.
          </p>
        </div>
      ) : (
        <ul className="dossier-list">
          {characters.map((c) => {
            const top = topQuality(c)
            return (
              <li key={c.id} className="dossier">
                <button
                  type="button"
                  className="dossier-open"
                  onClick={() => onOpen(c.id)}
                >
                  <div className="dossier-tab">GIB-2</div>
                  <div className="dossier-body">
                    <span className="dossier-name">
                      {c.designation || 'Unnamed Person'}
                    </span>
                    <span className="dossier-bearing">
                      {c.bearing || 'Bearing not recorded'}
                    </span>
                    <div className="dossier-meta">
                      {top && (
                        <span className="dossier-top">
                          {top.name} {formatMod(top.v)}
                        </span>
                      )}
                      {c.states.length > 0 && (
                        <span className="dossier-states">
                          {c.states.length} State{c.states.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  className="icon-btn dossier-delete"
                  aria-label="Discard record"
                  onClick={() => {
                    if (
                      confirm(
                        `Discard the record for ${c.designation || 'this Person'}? The Office accepts no liability.`,
                      )
                    )
                      onDelete(c.id)
                  }}
                >
                  ✕
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
