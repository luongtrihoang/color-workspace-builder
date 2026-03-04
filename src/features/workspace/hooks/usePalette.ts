import { useMemo } from 'react'
import { loadCombinationGroups } from '../services/paletteService'

export function usePalette() {
  const groups = useMemo(() => loadCombinationGroups(), [])
  const allColors = useMemo(
    () => groups.flatMap((g) => g.colors),
    [groups]
  )
  return { groups, allColors }
}
