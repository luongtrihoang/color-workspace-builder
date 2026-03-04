import { useWorkspace } from '../../hooks/useWorkspace'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import { DARK_FALLBACK_ROLES, LIGHT_FALLBACK_ROLES } from '../../services/themePresets'
import CodeToken from './CodeToken'

export default function CodePreview() {
  const { activeTheme } = useWorkspace()
  const isDarkMode = useWorkspaceStore((s) => s.isDarkMode)
  if (!activeTheme) return null

  const r = activeTheme.roles
  const fallback = isDarkMode ? DARK_FALLBACK_ROLES : LIGHT_FALLBACK_ROLES
  const bg = r.background ?? fallback.background
  const fg = r.foreground ?? fallback.foreground

  const cssVars = {
    '--color-bg': bg,
    '--color-fg': fg,
    '--color-keyword': r.keyword ?? fallback.keyword,
    '--color-string': r.string ?? fallback.string,
    '--color-comment': r.comment ?? fallback.comment,
    '--color-function': r.function ?? fallback.function,
  } as React.CSSProperties

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Live Preview</h2>
      <div className="overflow-hidden rounded-lg border">
        <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-muted-foreground">
            {activeTheme.name} — Counter.tsx
          </span>
        </div>
        <pre
          className="overflow-x-auto p-4 font-mono text-sm leading-relaxed"
          style={{
            ...cssVars,
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-fg)',
          }}
        >
          <CodeToken type="comment">{'// A simple React component'}</CodeToken>
          {'\n'}
          <CodeToken type="keyword">import</CodeToken>
          {' { '}
          <CodeToken type="function">useState</CodeToken>
          {' } '}
          <CodeToken type="keyword">from</CodeToken>
          {' '}
          <CodeToken type="string">{'"react"'}</CodeToken>
          {';'}
          {'\n\n'}
          <CodeToken type="keyword">function</CodeToken>
          {' '}
          <CodeToken type="function">Counter</CodeToken>
          {'({ '}
          <CodeToken type="foreground">label</CodeToken>
          {' }: { '}
          <CodeToken type="foreground">label</CodeToken>
          {': '}
          <CodeToken type="keyword">string</CodeToken>
          {' }) {'}
          {'\n  '}
          <CodeToken type="keyword">const</CodeToken>
          {' [count, setCount] = '}
          <CodeToken type="function">useState</CodeToken>
          {'('}
          <CodeToken type="string">0</CodeToken>
          {');'}
          {'\n\n  '}
          <CodeToken type="keyword">return</CodeToken>
          {' ('}
          {'\n    '}
          {'<'}
          <CodeToken type="keyword">button</CodeToken>
          {' '}
          <CodeToken type="foreground">onClick</CodeToken>
          {'={() => '}
          <CodeToken type="function">setCount</CodeToken>
          {'(count + 1)}>'}
          {'\n      '}
          {'{'}<CodeToken type="foreground">label</CodeToken>{'}: {'}<CodeToken type="foreground">count</CodeToken>{'}'}
          {'\n    '}
          {'</'}
          <CodeToken type="keyword">button</CodeToken>
          {'>'}
          {'\n  );'}
          {'\n}'}
          {'\n\n'}
          <CodeToken type="keyword">export default</CodeToken>
          {' '}
          <CodeToken type="function">Counter</CodeToken>
          {';'}
        </pre>
      </div>
    </div>
  )
}
