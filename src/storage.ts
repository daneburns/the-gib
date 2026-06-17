import type { Character, QualityValues } from './types'

const KEY = 'the-gib:persons:v1'

export function emptyQualities(): QualityValues {
  return {
    gumption: null,
    chutzpah: null,
    moxy: null,
    wonder: null,
    cut: null,
    jenesaisquoi: null,
  }
}

export function uid(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  )
}

export function newCharacter(): Character {
  const now = new Date().toISOString()
  return {
    id: uid(),
    designation: '',
    borneBy: '',
    bearing: '',
    origin: '',
    qualities: emptyQualities(),
    wants: '',
    fears: '',
    bonds: [],
    states: [],
    experience: 0,
    advances: [],
    inventory: '',
    createdAt: now,
    updatedAt: now,
  }
}

export function loadAll(): Character[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Character[]
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

function saveAll(list: Character[]): void {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function upsert(character: Character): Character[] {
  const list = loadAll()
  const stamped = { ...character, updatedAt: new Date().toISOString() }
  const idx = list.findIndex((c) => c.id === stamped.id)
  if (idx >= 0) list[idx] = stamped
  else list.unshift(stamped)
  saveAll(list)
  return list
}

export function remove(id: string): Character[] {
  const list = loadAll().filter((c) => c.id !== id)
  saveAll(list)
  return list
}

/** Merge imported characters in, reassigning ids that would collide. */
export function importCharacters(incoming: Character[]): {
  list: Character[]
  added: number
} {
  const list = loadAll()
  const ids = new Set(list.map((c) => c.id))
  let added = 0
  for (const c of incoming) {
    const char = ids.has(c.id) ? { ...c, id: uid() } : c
    ids.add(char.id)
    list.unshift(char)
    added++
  }
  saveAll(list)
  return { list, added }
}
