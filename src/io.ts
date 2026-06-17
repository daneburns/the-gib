import type { Bond, Character, StateEntry } from './types'
import { newCharacter, uid } from './storage'

function str(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback
}
function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback
}

export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'person'
  )
}

function downloadText(filename: string, text: string): void {
  const blob = new Blob([text], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function exportCharacter(c: Character): void {
  downloadText(`gib-${slugify(c.designation)}.json`, JSON.stringify(c, null, 2))
}

export function exportAll(list: Character[]): void {
  downloadText(`gib-records-${list.length}.json`, JSON.stringify(list, null, 2))
}

function coerceBond(raw: unknown): Bond {
  const r = (raw ?? {}) as Record<string, unknown>
  return { id: str(r.id) || uid(), who: str(r.who), how: str(r.how) }
}

function coerceState(raw: unknown): StateEntry {
  const r = (raw ?? {}) as Record<string, unknown>
  return {
    id: str(r.id) || uid(),
    description: str(r.description),
    interferes: str(r.interferes),
  }
}

/** Build a valid Character from arbitrary parsed JSON, filling defaults. */
function coerceCharacter(raw: unknown): Character | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  const base = newCharacter()
  const q = (r.qualities ?? {}) as Record<string, unknown>
  const qualities = { ...base.qualities }
  for (const key of Object.keys(base.qualities) as (keyof typeof qualities)[]) {
    qualities[key] = typeof q[key] === 'number' ? (q[key] as number) : null
  }
  return {
    id: str(r.id) || uid(),
    designation: str(r.designation),
    borneBy: str(r.borneBy),
    bearing: str(r.bearing),
    origin: str(r.origin),
    portrait: str(r.portrait),
    qualities,
    wants: str(r.wants),
    fears: str(r.fears),
    bonds: Array.isArray(r.bonds) ? r.bonds.map(coerceBond) : [],
    states: Array.isArray(r.states) ? r.states.map(coerceState) : [],
    experience: Math.max(0, Math.min(5, Math.round(num(r.experience)))),
    advances: Array.isArray(r.advances)
      ? r.advances.filter((s): s is string => typeof s === 'string')
      : [],
    inventory: str(r.inventory),
    createdAt: str(r.createdAt) || base.createdAt,
    updatedAt: str(r.updatedAt) || base.updatedAt,
  }
}

/** Parse an uploaded file's text into one or more characters. Throws on bad JSON. */
export function parseImport(text: string): Character[] {
  const data: unknown = JSON.parse(text)
  const arr = Array.isArray(data) ? data : [data]
  return arr.map(coerceCharacter).filter((c): c is Character => c !== null)
}
