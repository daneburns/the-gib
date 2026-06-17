export type QualityKey =
  | 'gumption'
  | 'chutzpah'
  | 'moxy'
  | 'wonder'
  | 'cut'
  | 'jenesaisquoi'

export type QualityValues = Record<QualityKey, number | null>

export interface StateEntry {
  id: string
  description: string
  /** What rolls this State plausibly interferes with (free text, optional). */
  interferes: string
}

export interface Bond {
  id: string
  /** Who the bond is with (another Person at the table). */
  who: string
  /** How you know each other — no strangers at the first table. */
  how: string
}

export interface Character {
  id: string
  // §1 Identification
  designation: string // the name they answer to
  borneBy: string // player
  bearing: string // how the room reads them at a glance
  origin: string // origin / provenance
  portrait: string // a likeness, stored as a (downscaled) data URL — '' if none
  // §2 The Six Qualities
  qualities: QualityValues
  // §5 Drives & Bonds
  wants: string
  fears: string
  bonds: Bond[]
  // §3 States
  states: StateEntry[]
  // §4 Experience
  experience: number // 0..5 marks toward an Advance
  advances: string[]
  // §6 Carried & Kept
  inventory: string
  createdAt: string
  updatedAt: string
}
