import { useRef } from 'react'
import type { Character } from '../types'
import { QUALITIES } from '../data'
import { exportAll, parseImport } from '../io'
import { formatMod } from './QualityAllocator'

interface Props {
  characters: Character[]
  onOpen: (id: string) => void
  onNew: () => void
  onConjure: () => void
  onImport: (incoming: Character[]) => void
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

export default function Roster({
  characters,
  onOpen,
  onNew,
  onConjure,
  onImport,
  onDelete,
}: Props) {
  const fileInput = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-importing the same file
    if (!file) return
    try {
      const incoming = parseImport(await file.text())
      if (incoming.length === 0) {
        alert('No valid Person Records found in that file.')
        return
      }
      onImport(incoming)
    } catch {
      alert('That file could not be read as a GIB record (invalid JSON).')
    }
  }

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
        <div className="roster-actions">
          <button type="button" className="primary-btn new-btn" onClick={onNew}>
            + New Person Record
          </button>
          <button type="button" className="ghost-btn" onClick={onConjure}>
            ⚄ Conjure a stranger
          </button>
          <button type="button" className="ghost-btn" onClick={() => fileInput.current?.click()}>
            Import
          </button>
          {characters.length > 0 && (
            <button type="button" className="ghost-btn" onClick={() => exportAll(characters)}>
              Export all
            </button>
          )}
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            className="visually-hidden"
            onChange={handleFile}
          />
        </div>
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
