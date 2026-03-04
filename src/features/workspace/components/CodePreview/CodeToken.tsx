import type { ThemeRole } from '../../types'

interface CodeTokenProps {
  type: ThemeRole
  children: React.ReactNode
}

const CSS_VAR_MAP: Record<ThemeRole, string> = {
  background: 'var(--color-bg)',
  foreground: 'var(--color-fg)',
  keyword: 'var(--color-keyword)',
  string: 'var(--color-string)',
  comment: 'var(--color-comment)',
  function: 'var(--color-function)',
}

export default function CodeToken({ type, children }: CodeTokenProps) {
  return (
    <span style={{ color: CSS_VAR_MAP[type] }}>
      {children}
    </span>
  )
}
