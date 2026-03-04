export type ThemeRole =
  | 'background'
  | 'foreground'
  | 'keyword'
  | 'string'
  | 'comment'
  | 'function'

export const THEME_ROLES: ThemeRole[] = [
  'background',
  'foreground',
  'keyword',
  'string',
  'comment',
  'function',
]

export interface PaletteColor {
  id: string
  hex: string
  name: string
  slug: string
  combinationId: number
  combinationName: string
}

export interface CombinationGroup {
  id: number
  name: string
  slug: string
  likes: number
  liked: boolean
  colors: PaletteColor[]
}

export interface WorkspaceTheme {
  id: string
  name: string
  isBuiltIn: boolean
  roles: Record<ThemeRole, string | null>
}
