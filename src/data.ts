import type { QualityKey } from './types'

/** Schedule A — distribute these six numbers among the six qualities, one each. */
export const QUALITY_POOL = [2, 1, 1, 0, 0, -1] as const

export interface QualityDef {
  key: QualityKey
  name: string
  move: string // the move name, e.g. "GO"
  /** The room-reads-you-at-a-glance line, from the Person Record. */
  tagline: string
  /** When you do this, you roll. */
  trigger: string
  results: {
    strong: string // 10+
    weak: string // 7-9
    miss: string // 6-
  }
}

export const QUALITIES: QualityDef[] = [
  {
    key: 'gumption',
    name: 'Gumption',
    move: 'GO',
    tagline: 'Going. Acting before the cautious part finishes its sentence.',
    trigger:
      'When you act first, fast, or before the part of you that knows better can finish its sentence.',
    results: {
      strong: 'You are moving and the world is reacting to you. The Surveyor tells you the opening you’ve torn in the moment.',
      weak: 'You’re moving, but committed — past where stopping is a thing you can still do.',
      miss: 'You leapt. The looking, which you skipped, would have been the useful part.',
    },
  },
  {
    key: 'chutzpah',
    name: 'Chutzpah',
    move: 'INSIST',
    tagline: 'Nerve where you have no right to it. The rules, embarrassed, agree.',
    trigger:
      'When you bluff, demand, threaten, or simply state a falsehood with such structural confidence that people start building on it.',
    results: {
      strong: 'They buy it, fold, or blink first. The situation is now yours.',
      weak: 'It holds, but they want something for it, or a small doubt has lodged for later.',
      miss: 'Called. The confidence curdles. You are now the subject of the conversation.',
    },
  },
  {
    key: 'moxy',
    name: 'Moxy',
    move: 'REMAIN',
    tagline: 'Remaining. Still here after the parts that quit have quit.',
    trigger:
      'When you endure something designed to end you — a blow, a betrayal, a question repeated at the ninth hour, a winter, a truth.',
    results: {
      strong: 'You take it whole and you are still here, unmarked.',
      weak: 'You’re still here, but it took its toll: mark a State, or give ground back.',
      miss: 'It got in. The Surveyor decides how far, and you will be living with the answer.',
    },
  },
  {
    key: 'wonder',
    name: 'Childlike Wonder',
    move: 'LOOK',
    tagline: 'Seeing what the jaded miss. Asking the un-asked question.',
    trigger:
      'When you study the strange thing, search the place, or open yourself to what is genuinely going on underneath what is apparently going on.',
    results: {
      strong: 'Ask three questions, answered truthfully. Acting on what you learn grants +1 to your next relevant roll.',
      weak: 'Ask one question, answered truthfully. Acting on it grants +1 forward.',
      miss: 'You see it. You cannot un-see it. The Surveyor tells you what the looking has done to you.',
    },
  },
  {
    key: 'cut',
    name: 'The Cut of Your Gib',
    move: 'READ',
    tagline: "How you land before you've earned it. Your silhouette.",
    trigger:
      'When you meet someone and want to know how you’ve landed on them — or you want to choose, deliberately, how you land.',
    results: {
      strong: 'You read them clean and you set how they read you. Hold 2.',
      weak: 'One or the other, not both. Hold 1.',
      miss: 'They’ve read you better than you’ve read them. Hold 0, and the conclusion is wrong in a way about to be expensive.',
    },
  },
  {
    key: 'jenesaisquoi',
    name: 'A Certain Je Ne Sais Quoi',
    move: 'TEMPT IT',
    tagline: "The unnameable. Luck, fate, the part the other five don't cover.",
    trigger:
      'When none of the others fit, and the outcome rests genuinely in the hands of a universe that has no obligation to you. Once per scene only.',
    results: {
      strong: 'It tilts your way, and hard, and you will never know exactly why.',
      weak: 'Something happens — useful — but it opens onto a thing you’ll now have to walk through.',
      miss: 'The dice gave, once, and have remembered. The Surveyor makes a hard move; it has the quality of a debt being collected.',
    },
  },
]

export const QUALITY_BY_KEY: Record<QualityKey, QualityDef> = Object.fromEntries(
  QUALITIES.map((q) => [q.key, q]),
) as Record<QualityKey, QualityDef>

/** Moves available to everyone, no quality of their own. */
export const TABLE_MOVES = [
  {
    name: 'LEND A HAND / GET IN THE WAY',
    trigger:
      'When you help or hinder another person’s roll, roll the quality that matches the manner of your interference.',
    results: {
      strong: 'They get +2 (helping) or −2 (hindering).',
      weak: '±1, and you are now standing in the same blast radius they are.',
      miss: 'You’ve made it worse, and you’re in it now too.',
    },
  },
  {
    name: 'NAME WHAT YOU WANT',
    trigger:
      'At any honest pause, say aloud one thing your person wants. No roll. The Surveyor will place it within reach — with a complication beside it. This is how you steer.',
    results: null,
  },
]

/** The starting menagerie of States (§6). Invent more freely. */
export const STATE_MENAGERIE = [
  { description: 'Shaken', interferes: 'Insist, Read' },
  { description: 'Hurt', interferes: 'Go, Remain' },
  { description: 'Lost', interferes: 'Read, Insist' },
  { description: 'Disgraced', interferes: 'Read, Insist' },
  { description: 'Hollow', interferes: 'Read, Insist' },
]

/** The roll ladder, for the at-table reference. */
export const ROLL_LADDER = [
  { band: '10+', text: 'It works, cleanly. Enjoy this; it is rationed.' },
  {
    band: '7–9',
    text: 'It works, and — a cost, a complication, a hard little choice. Success is a transaction.',
  },
  {
    band: '6−',
    text: 'It does not work, and the Surveyor moves against you. Mark experience — failure is the only reliable teacher.',
  },
]
