import { useCallback } from 'react'
import { toast } from 'sonner'
import { useWorkspaceStore } from '../stores/workspaceStore'
import { THEME_ROLES } from '../types'
import type { ThemeRole } from '../types'
import {
  getContrastRatio,
  isWcagAaPass,
  formatContrastRatio,
  WCAG_AA_THRESHOLD,
} from '@/lib/colorUtils'

export function useWorkspace() {
  const { themes, activeThemeId, assignColorToRole, clearRole } =
    useWorkspaceStore()
  const activeTheme = themes.find((t) => t.id === activeThemeId) ?? themes[0]

  const checkAndWarnContrast = useCallback(
    (role: ThemeRole, hex: string) => {
      // Read fresh state directly from store to avoid stale closures
      const { themes: currentThemes, activeThemeId: currentId } =
        useWorkspaceStore.getState()
      const currentTheme = currentThemes.find((t) => t.id === currentId)
      const bgHex = currentTheme?.roles.background

      if (role !== 'background' && bgHex) {
        const ratio = getContrastRatio(hex, bgHex)
        if (ratio !== null && !isWcagAaPass(ratio)) {
          toast.warning(
            `Low contrast: ${role} vs background is ${formatContrastRatio(ratio)} (WCAG AA requires ${WCAG_AA_THRESHOLD}:1)`
          )
        }
      }
    },
    []
  )

  const assignToFirstEmptyRole = useCallback(
    (hex: string) => {
      // Read fresh state directly from store to avoid stale closures
      const { themes: currentThemes, activeThemeId: currentId } =
        useWorkspaceStore.getState()
      const currentTheme = currentThemes.find((t) => t.id === currentId)
      if (!currentTheme) return false

      const emptyRole = THEME_ROLES.find((r) => currentTheme.roles[r] === null)
      if (!emptyRole) {
        toast.info('All role slots are filled. Drag to replace a specific role.')
        return false
      }

      assignColorToRole(emptyRole, hex)
      checkAndWarnContrast(emptyRole, hex)

      return true
    },
    [assignColorToRole, checkAndWarnContrast]
  )

  return {
    activeTheme,
    assignColorToRole,
    clearRole,
    assignToFirstEmptyRole,
    checkAndWarnContrast,
  }
}
