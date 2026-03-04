import combinationsData from '@/data/combinations.json'
import type { CombinationGroup, PaletteColor } from '../types'

interface RawColor {
  slug: string
  hex: string
  name: string
}

interface RawCombination {
  combination: {
    id: number
    slug: string
    name: string
    likes: number
    liked: boolean
    colors: RawColor[]
  }
}

function normalizeHex(hex: string): string {
  return '#' + hex.replace(/^#+/, '')
}

export function loadCombinationGroups(): CombinationGroup[] {
  const data = combinationsData as { combinations: RawCombination[] }

  return data.combinations.map(({ combination }) => ({
    id: combination.id,
    name: combination.name,
    slug: combination.slug,
    likes: combination.likes,
    liked: combination.liked,
    colors: combination.colors.map((c): PaletteColor => ({
      id: `${combination.slug}-${c.slug}-${normalizeHex(c.hex).slice(1)}`,
      hex: normalizeHex(c.hex),
      name: c.name,
      slug: c.slug,
      combinationId: combination.id,
      combinationName: combination.name,
    })),
  }))
}
