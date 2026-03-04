import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { BUILT_IN_THEMES } from '../services/themePresets'
import type { WorkspaceTheme, ThemeRole } from '../types'

interface WorkspaceStore {
  activeThemeId: string
  themes: WorkspaceTheme[]
  isDarkMode: boolean

  setActiveTheme: (id: string) => void
  addCustomTheme: (name: string) => void
  deleteTheme: (id: string) => void
  assignColorToRole: (role: ThemeRole, hex: string) => void
  clearRole: (role: ThemeRole) => void
  resetTheme: (id: string) => void
  importTheme: (theme: WorkspaceTheme) => void
  toggleDarkMode: () => void
}

function mergeWithBuiltInDefaults(themes: WorkspaceTheme[]): WorkspaceTheme[] {
  const builtInMap = new Map(BUILT_IN_THEMES.map((t) => [t.id, t]))

  // Ensure all built-in themes exist
  const mergedIds = new Set(themes.map((t) => t.id))
  const missingBuiltIns = BUILT_IN_THEMES.filter((t) => !mergedIds.has(t.id))

  return [...themes, ...missingBuiltIns].map((theme) => {
    const preset = builtInMap.get(theme.id)
    if (!preset) return theme
    // Keep built-in flag and name synced with presets
    return { ...theme, isBuiltIn: true, name: preset.name }
  })
}

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set, get) => ({
      activeThemeId: 'dracula',
      themes: [...BUILT_IN_THEMES],
      isDarkMode: true,

      setActiveTheme: (id) => set({ activeThemeId: id }),

      addCustomTheme: (name) => {
        const id = `custom-${Date.now()}`
        const blank: WorkspaceTheme = {
          id,
          name,
          isBuiltIn: false,
          roles: {
            background: null,
            foreground: null,
            keyword: null,
            string: null,
            comment: null,
            function: null,
          },
        }
        set((s) => ({ themes: [...s.themes, blank], activeThemeId: id }))
      },

      deleteTheme: (id) => {
        const { themes, activeThemeId } = get()
        const theme = themes.find((t) => t.id === id)
        if (theme?.isBuiltIn) return

        const filtered = themes.filter((t) => t.id !== id)
        const nextActive =
          activeThemeId === id
            ? filtered[0]?.id ?? 'dracula'
            : activeThemeId
        set({ themes: filtered, activeThemeId: nextActive })
      },

      assignColorToRole: (role, hex) => {
        const { activeThemeId } = get()
        set((s) => ({
          themes: s.themes.map((t) =>
            t.id === activeThemeId
              ? { ...t, roles: { ...t.roles, [role]: hex } }
              : t
          ),
        }))
      },

      clearRole: (role) => {
        const { activeThemeId } = get()
        set((s) => ({
          themes: s.themes.map((t) =>
            t.id === activeThemeId
              ? { ...t, roles: { ...t.roles, [role]: null } }
              : t
          ),
        }))
      },

      resetTheme: (id) => {
        const preset = BUILT_IN_THEMES.find((t) => t.id === id)
        if (!preset) return
        set((s) => ({
          themes: s.themes.map((t) =>
            t.id === id ? { ...preset } : t
          ),
        }))
      },

      importTheme: (theme) => {
        const imported: WorkspaceTheme = {
          ...theme,
          id: `imported-${Date.now()}`,
          isBuiltIn: false,
        }
        set((s) => ({
          themes: [...s.themes, imported],
          activeThemeId: imported.id,
        }))
      },

      toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
    }),
    {
      name: 'color-workspace-v1',
      partialize: (s) => ({
        activeThemeId: s.activeThemeId,
        themes: s.themes,
        isDarkMode: s.isDarkMode,
      }),
      merge: (persisted, current) => {
        const persistedState = persisted as Partial<WorkspaceStore>
        return {
          ...current,
          ...persistedState,
          themes: mergeWithBuiltInDefaults(
            persistedState.themes ?? current.themes
          ),
        }
      },
    }
  )
)
