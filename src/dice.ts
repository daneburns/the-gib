export type Band = '10+' | '7–9' | '6−'

export interface Roll {
  id: number // increments per roll, for re-triggering animation
  d1: number
  d2: number
  modifier: number // the relevant Quality
  adjust: number // situational ± (States, help/hinder, forward)
  total: number
  band: Band
  moveKey: string // which quality/move was rolled
  moveName: string
  qualityName: string
}

export const DIE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'] as const

export function dieFace(n: number): string {
  return DIE_FACES[Math.min(Math.max(n, 1), 6) - 1]
}

export function bandFor(total: number): Band {
  if (total >= 10) return '10+'
  if (total >= 7) return '7–9'
  return '6−'
}

let counter = 0

export function rollMove(opts: {
  modifier: number
  adjust?: number
  moveKey: string
  moveName: string
  qualityName: string
}): Roll {
  const d1 = 1 + Math.floor(Math.random() * 6)
  const d2 = 1 + Math.floor(Math.random() * 6)
  const adjust = opts.adjust ?? 0
  const total = d1 + d2 + opts.modifier + adjust
  counter += 1
  return {
    id: counter,
    d1,
    d2,
    modifier: opts.modifier,
    adjust,
    total,
    band: bandFor(total),
    moveKey: opts.moveKey,
    moveName: opts.moveName,
    qualityName: opts.qualityName,
  }
}
