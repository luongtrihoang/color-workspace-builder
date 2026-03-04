import type { WorkspaceTheme, ThemeRole } from '../types'

export const DARK_FALLBACK_ROLES: Record<ThemeRole, string> = {
  background: '#1e1e1e',
  foreground: '#d4d4d4',
  keyword: '#569cd6',
  string: '#ce9178',
  comment: '#6a9955',
  function: '#dcdcaa',
}

export const LIGHT_FALLBACK_ROLES: Record<ThemeRole, string> = {
  background: '#ffffff',
  foreground: '#1e1e1e',
  keyword: '#0000ff',
  string: '#a31515',
  comment: '#008000',
  function: '#795e26',
}

export const BUILT_IN_THEMES: WorkspaceTheme[] = [
  {
    id: 'dracula',
    name: 'Dracula',
    isBuiltIn: true,
    roles: {
      background: '#282a36',
      foreground: '#f8f8f2',
      keyword: '#ff79c6',
      string: '#f1fa8c',
      comment: '#6272a4',
      function: '#50fa7b',
    },
  },
  {
    id: 'one-dark',
    name: 'One Dark',
    isBuiltIn: true,
    roles: {
      background: '#282c34',
      foreground: '#abb2bf',
      keyword: '#c678dd',
      string: '#98c379',
      comment: '#5c6370',
      function: '#61afef',
    },
  },
  {
    id: 'vscode',
    name: 'VSCode Dark',
    isBuiltIn: true,
    roles: { ...DARK_FALLBACK_ROLES },
  },
]
