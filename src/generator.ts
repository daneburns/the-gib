import type { QualityValues } from './types'
import { QUALITIES, QUALITY_POOL } from './data'

/*
 * Voice notes — content here channels the author (Jangus / Dane Burns), drawn
 * from the reference works in docs/reference:
 *   - THE GIB: noir-bureaucratic, the Office of Unquantifiable Measures.
 *   - The Ash Communion: short declarative fragments; the pause/aftermath;
 *     consequence over capability; questions that imply guilt, loss, and
 *     inevitability; wounds and debts that follow you; mundane specificity
 *     married to dread. (The dominant key for the lines below.)
 *   - Goblin Wrestling Federation: the love of the epithet and the theatrical
 *     moniker — folded into names only, without the bombast.
 * When adding lines: write fragments, not sentences. Imply a wound, a debt,
 * or a decision that hasn't finished happening yet. Be specific and weary.
 */

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ---- Designation (the name they answer to) ----
const FIRST_NAMES = [
  'Augustus', 'Marlowe', 'Ines', 'Dell', 'Cordelia', 'Sol', 'Verity', 'Ambrose',
  'Halloway', 'Pruitt', 'Constance', 'Reno', 'Sable', 'Magnus', 'Ottilie', 'Bram',
  'Clementine', 'Thaddeus', 'Wren', 'Lazlo', 'Della', 'Crane', 'Iris', 'Mortimer',
  'Kael', 'Mara', 'Gorman', 'Edran', 'Sten', 'Halric', 'Yara', 'Dov',
]
const LAST_NAMES = [
  'Veil', 'Quist', 'Sarn', 'Halloway', 'Crane', 'Voss', 'Marsh', 'Pell', 'Drury',
  'Sallow', 'Ainsley', 'Greaves', 'Mott', 'Vane', 'Thorne', 'Quill', 'Ashby',
  'Crowe', 'Brandt', 'Sykes', 'Calloway', 'Renner', 'Frost', 'Dimas',
]
const MONIKERS = [
  'the man they call Tuesday',
  'No-Questions Nadia',
  'the one who came up the stairs',
  'Mister As-Found',
  'the woman with the wrong watch',
  'Quiet then Sudden',
  'the last honest accountant',
  'whoever is left',
  'the name on the second form',
  'somebody else’s emergency contact',
  'the one the others desert to',
  'Mister Past-Tense',
  'the question nobody wanted answered',
  'Kael, if that’s still the name',
  'the name said first when decisions need making',
  'the soldier’s kid, and it shows',
  'Last-One-Standing, and not proud of it',
]

export function genDesignation(): string {
  if (Math.random() < 0.28) return pick(MONIKERS)
  return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`
}

// ---- Bearing (how the room reads them at a glance) ----
const BEARINGS = [
  'Dressed for a funeral that hasn’t happened yet.',
  'Looks like an apology somebody is about to make.',
  'Carries the weather in with them.',
  'The kind of calm that has cost something.',
  'Reads as harmless, which is the first thing wrong.',
  'Looks recently important and not yet aware it’s over.',
  'Tired in a way sleep won’t fix.',
  'Holds eye contact one second too long, on purpose.',
  'Stands like the floor owes them money.',
  'Smells faintly of somewhere you’ve been warned about.',
  'Smiles before deciding whether to.',
  'Dressed expensively and a season too late.',
  'Takes up less room than they should.',
  'Already halfway down the stairs.',
  'Has the posture of a closed door.',
  'Looks like someone who stopped counting.',
  'The stillness of a person waiting for a sound they’ve heard before.',
  'Has the face of someone who has started fires in worse places than this.',
  'Sits closest to the door without seeming to choose it.',
  'Learned, somewhere, to be quiet after lights out.',
  'Holds a thing they aren’t using.',
  'The kind of still that means a decision already happened.',
  'Looks at you the way you look at someone before asking what you don’t want answered.',
  'Carries the room’s silence in with them.',
  'A defeated movement to one shoulder. The kind that means what can you do.',
]

// ---- Origin / Provenance ----
const ORIGINS = [
  'Last seen leaving a town that no longer answers the phone.',
  'Came up the stairs and never explained from where.',
  'Filed under “as found.”',
  'Raised by an institution that has since denied it.',
  'Provenance disputed; both claimants are lying.',
  'Walked out of a war nobody admits was one.',
  'Arrived with the rain and a forwarding address that wasn’t.',
  'Three names ago, things were different.',
  'Inherited a debt and a coat. Kept the coat.',
  'Released for reasons the paperwork rounds down.',
  'Born somewhere with a different word for weather.',
  'Worked an honest job once, briefly, and it’s a sore subject.',
  'No fixed origin. The Office finds this itself diagnostic.',
  'Came back from a place you’re not supposed to come back from.',
  'Lost someone once. Past tense, and not discussed.',
  'Father was a soldier. Hated.',
  'Stopped counting the years after the fourth one.',
  'Owes a debt to a name the paperwork won’t print.',
  'There was a person they were supposed to protect. There isn’t now.',
  'Left a city that learned to be quiet about certain rooms.',
  'Buried something in the woods, thinking distance would fix it. It didn’t.',
  'Doesn’t trust healers. Won’t say why.',
  'Whatever was said back then has been following ever since.',
  'Thought the woods would fix it. The woods are not in that business.',
]

// ---- One thing this person wants ----
const WANTS = [
  'To be believed, just once, by someone who matters.',
  'The last word in an argument that ended years ago.',
  'Out — and to take exactly one person with them.',
  'To find the door the adults agreed not to see.',
  'To put something right that everyone else has filed away.',
  'A clean exit, for once, with no debt collected after.',
  'To matter to the one person who decided they didn’t.',
  'To stop being measured and start being trusted.',
  'The truth, even the part that costs them.',
  'To win, just to know what it feels like.',
  'Their name, cleared, in front of the people who said it wrong.',
  'One quiet day where nothing is owed.',
  'To be the one setting the terms, for a change.',
  'To not become the thing they promised they wouldn’t.',
  'One apology delivered before it stops mattering.',
  'To protect one person all the way through, this time.',
  'To stop performing and just answer the question.',
  'To fail someone better than they failed the last one.',
  'To hear their own name said the way it used to be said.',
  'To owe no one by morning.',
  'To learn the one true thing and survive knowing it.',
  'To be remembered as the version they meant to be.',
]

// ---- One thing this person fears ----
const FEARS = [
  'Being measured accurately.',
  'The sound their own name makes in a stranger’s mouth.',
  'That the looking was the useful part, and they skipped it.',
  'A debt they’ve forgotten coming back collected.',
  'Becoming the thing they came here to stop.',
  'Being seen clearly for one full second.',
  'The ninth-hour question, asked by someone kind.',
  'That they were right to quit, and stayed anyway.',
  'The room agreeing with the wrong conclusion about them.',
  'Owing the universe a favor it remembers.',
  'Stairs. The going-down kind.',
  'That there was never a seventh quality, and they are it.',
  'Being the only one left to decide.',
  'The question asked gently, by someone who already knows.',
  'That “supposed to protect” has a past tense, and it’s the answer.',
  'Being the one the others desert to when it counts.',
  'That what was said by the fire will follow them.',
  'The silence that gets treated as an answer.',
  'That the woods were never going to fix it.',
  'The version of them everyone already believes.',
  'Being handed a weapon they volunteered.',
  'That distance fixes nothing, and they spent years proving it.',
]

// ---- Carried & Kept (inventory · notes) ----
const INVENTORY = [
  'A coat that has outlived three owners.',
  'A key to a door that’s been bricked over.',
  'Forty-one cents and a grudge.',
  'A photograph, folded so one face is gone.',
  'A pen that only writes when it’s a bad idea.',
  'Someone else’s wedding ring, returned to no one.',
  'A train ticket to a station that closed.',
  'A list of names, half crossed out.',
  'A lighter, no cigarettes; the smoking is for thinking.',
  'A form, half-filled, that they refuse to finish.',
  'A debt marker signed in a hand they don’t recognize.',
  'A second watch, stopped at a meaningful hour.',
  'A bottle that had the good sense of being available.',
  'Matches, and the habit of starting fires in bad places.',
  'A small bell they will not ring.',
  'A child’s thing, kept long past the point of letting go.',
  'Something that glows, that nobody has looked into.',
  'A flask, half full; there are other questions if anyone wants to answer them.',
  'A letter, never sent, soft at the folds.',
  'A scar they describe as an accident.',
]

export function randomQualities(): QualityValues {
  const shuffled = [...QUALITY_POOL]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  const next = {} as QualityValues
  QUALITIES.forEach((q, i) => {
    next[q.key] = shuffled[i]
  })
  return next
}

export const genBearing = () => pick(BEARINGS)
export const genOrigin = () => pick(ORIGINS)
export const genWants = () => pick(WANTS)
export const genFears = () => pick(FEARS)
export const genInventory = () => pick(INVENTORY)

export interface GeneratedPerson {
  designation: string
  bearing: string
  origin: string
  wants: string
  fears: string
  inventory: string
  qualities: QualityValues
}

/** A whole Person of Indeterminate Quality, conjured at random. */
export function generatePerson(): GeneratedPerson {
  return {
    designation: genDesignation(),
    bearing: genBearing(),
    origin: genOrigin(),
    wants: genWants(),
    fears: genFears(),
    inventory: genInventory(),
    qualities: randomQualities(),
  }
}
