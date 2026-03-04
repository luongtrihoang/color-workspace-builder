import { describe, it, expect, beforeEach } from 'vitest'
import { useWorkspaceStore } from './workspaceStore'

describe('workspaceStore', () => {
  beforeEach(() => {
    const { themes } = useWorkspaceStore.getState()
    // Reset to initial state
    useWorkspaceStore.setState({
      activeThemeId: 'dracula',
      themes: themes.filter((t) => t.isBuiltIn),
      isDarkMode: true,
    })
  })

  it('has default built-in themes', () => {
    const { themes } = useWorkspaceStore.getState()
    expect(themes.length).toBe(3)
    expect(themes.every((t) => t.isBuiltIn)).toBe(true)
  })

  it('sets active theme', () => {
    useWorkspaceStore.getState().setActiveTheme('one-dark')
    expect(useWorkspaceStore.getState().activeThemeId).toBe('one-dark')
  })

  it('adds a custom theme', () => {
    useWorkspaceStore.getState().addCustomTheme('My Theme')
    const { themes, activeThemeId } = useWorkspaceStore.getState()
    expect(themes.length).toBe(4)
    const custom = themes.find((t) => t.id === activeThemeId)
    expect(custom?.name).toBe('My Theme')
    expect(custom?.isBuiltIn).toBe(false)
    expect(Object.values(custom!.roles).every((v) => v === null)).toBe(true)
  })

  it('deletes a custom theme', () => {
    useWorkspaceStore.getState().addCustomTheme('Temp')
    const { activeThemeId } = useWorkspaceStore.getState()
    useWorkspaceStore.getState().deleteTheme(activeThemeId)
    const { themes } = useWorkspaceStore.getState()
    expect(themes.find((t) => t.id === activeThemeId)).toBeUndefined()
  })

  it('cannot delete built-in theme', () => {
    useWorkspaceStore.getState().deleteTheme('dracula')
    const { themes } = useWorkspaceStore.getState()
    expect(themes.find((t) => t.id === 'dracula')).toBeDefined()
  })

  it('assigns color to role', () => {
    useWorkspaceStore.getState().assignColorToRole('keyword', '#ff0000')
    const { themes, activeThemeId } = useWorkspaceStore.getState()
    const active = themes.find((t) => t.id === activeThemeId)
    expect(active?.roles.keyword).toBe('#ff0000')
  })

  it('clears role', () => {
    useWorkspaceStore.getState().clearRole('keyword')
    const { themes, activeThemeId } = useWorkspaceStore.getState()
    const active = themes.find((t) => t.id === activeThemeId)
    expect(active?.roles.keyword).toBeNull()
  })

  it('toggles dark mode', () => {
    expect(useWorkspaceStore.getState().isDarkMode).toBe(true)
    useWorkspaceStore.getState().toggleDarkMode()
    expect(useWorkspaceStore.getState().isDarkMode).toBe(false)
  })

  it('imports a theme', () => {
    useWorkspaceStore.getState().importTheme({
      id: 'external',
      name: 'External Theme',
      isBuiltIn: false,
      roles: {
        background: '#111',
        foreground: '#eee',
        keyword: '#f00',
        string: '#0f0',
        comment: '#888',
        function: '#00f',
      },
    })
    const { themes, activeThemeId } = useWorkspaceStore.getState()
    const imported = themes.find((t) => t.id === activeThemeId)
    expect(imported?.name).toBe('External Theme')
    expect(imported?.isBuiltIn).toBe(false)
  })
})
