import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import AppHeader from './AppHeader'
import PalettePanel from '@/features/workspace/components/PalettePanel/PalettePanel'
import WorkspacePanel from '@/features/workspace/components/WorkspacePanel/WorkspacePanel'
import CodePreview from '@/features/workspace/components/CodePreview/CodePreview'
import { useWorkspace } from '@/features/workspace/hooks/useWorkspace'
import { useWorkspaceStore } from '@/features/workspace/stores/workspaceStore'
import { THEME_ROLES } from '@/features/workspace/types'
import type { PaletteColor, ThemeRole } from '@/features/workspace/types'
import {
  getContrastRatio,
  isWcagAaPass,
  formatContrastRatio,
  WCAG_AA_THRESHOLD,
} from '@/lib/colorUtils'
import { toast } from 'sonner'

export default function AppLayout() {
  const { assignColorToRole } = useWorkspace()
  const [draggedColor, setDraggedColor] = useState<PaletteColor | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  )

  function handleDragStart(event: DragStartEvent) {
    const color = event.active.data.current?.color as PaletteColor | undefined
    if (color) setDraggedColor(color)
  }

  function handleDragEnd(event: DragEndEvent) {
    setDraggedColor(null)
    const { active, over } = event
    if (!over) return

    const color = active.data.current?.color as PaletteColor | undefined
    const role = over.id as ThemeRole
    if (!color || !THEME_ROLES.includes(role)) return

    assignColorToRole(role, color.hex)

    // Read fresh state from store after assignment
    const { themes, activeThemeId } = useWorkspaceStore.getState()
    const currentTheme = themes.find((t) => t.id === activeThemeId)
    const bgHex = currentTheme?.roles.background

    // Check contrast against background
    if (role !== 'background' && bgHex) {
      const ratio = getContrastRatio(color.hex, bgHex)
      if (ratio !== null && !isWcagAaPass(ratio)) {
        toast.warning(
          `Low contrast: ${role} vs background is ${formatContrastRatio(ratio)} (WCAG AA requires ${WCAG_AA_THRESHOLD}:1)`
        )
      }
    }

    // If setting background, check all existing role colors
    if (role === 'background' && currentTheme) {
      THEME_ROLES.filter((r) => r !== 'background').forEach((r) => {
        const roleHex = currentTheme.roles[r]
        if (!roleHex) return
        const ratio = getContrastRatio(color.hex, roleHex)
        if (ratio !== null && !isWcagAaPass(ratio)) {
          toast.warning(
            `Low contrast: ${r} vs new background is ${formatContrastRatio(ratio)} (WCAG AA requires ${WCAG_AA_THRESHOLD}:1)`
          )
        }
      })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        <AppHeader />
        <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
          <PalettePanel />
          <main id="main-content" className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
            <WorkspacePanel />
            <CodePreview />
          </main>
        </div>
      </div>

      <DragOverlay>
        {draggedColor && (
          <div
            className="h-10 w-10 rounded-lg border-2 border-ring shadow-lg"
            style={{ backgroundColor: draggedColor.hex }}
          />
        )}
      </DragOverlay>
    </DndContext>
  )
}
