import { useWorkspace } from '../../hooks/useWorkspace'
import { THEME_ROLES } from '../../types'
import ThemeSelector from './ThemeSelector'
import ThemeRoleSlot from './ThemeRoleSlot'

export default function WorkspacePanel() {
  const { activeTheme } = useWorkspace()

  if (!activeTheme) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Workspace</h2>
        <ThemeSelector />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {THEME_ROLES.map((role) => (
          <ThemeRoleSlot
            key={role}
            role={role}
            hex={activeTheme.roles[role]}
            backgroundHex={activeTheme.roles.background}
          />
        ))}
      </div>
    </div>
  )
}
