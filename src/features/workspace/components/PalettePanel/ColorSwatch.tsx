import { useRef } from 'react'
import { useDraggable } from '@dnd-kit/core'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import {
  getContrastRatio,
  isWcagAaPass,
  formatContrastRatio,
} from '@/lib/colorUtils'
import { useWorkspace } from '../../hooks/useWorkspace'
import type { PaletteColor } from '../../types'

interface ColorSwatchProps {
  color: PaletteColor
}

export default function ColorSwatch({ color }: ColorSwatchProps) {
  const { activeTheme, assignToFirstEmptyRole } = useWorkspace()
  const bgHex = activeTheme?.roles.background
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null)

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: color.id,
      data: { color },
    })

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined

  const contrastRatio = bgHex ? getContrastRatio(color.hex, bgHex) : null
  const passes = contrastRatio !== null ? isWcagAaPass(contrastRatio) : null

  function handlePointerDown(e: React.PointerEvent) {
    pointerStartRef.current = { x: e.clientX, y: e.clientY }
    listeners?.onPointerDown?.(e)
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (!pointerStartRef.current) return
    const dx = Math.abs(e.clientX - pointerStartRef.current.x)
    const dy = Math.abs(e.clientY - pointerStartRef.current.y)
    // Only treat as click if pointer didn't move (not a drag)
    if (dx < 5 && dy < 5) {
      assignToFirstEmptyRole(color.hex)
    }
    pointerStartRef.current = null
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      assignToFirstEmptyRole(color.hex)
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-label={`${color.name} ${color.hex} — click to auto-fill or drag to assign`}
          className="group flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing"
          style={{
            ...style,
            opacity: isDragging ? 0.5 : 1,
          }}
        >
          <div
            className="h-10 w-10 rounded-lg border-2 border-transparent shadow-sm transition-all hover:scale-110 hover:border-ring"
            style={{ backgroundColor: color.hex }}
          />
          <span className="text-[10px] font-mono text-muted-foreground">
            {color.hex}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="space-y-1">
          <p className="font-medium">{color.name}</p>
          <p className="font-mono text-xs">{color.hex}</p>
          {contrastRatio !== null && (
            <div className="flex items-center gap-1">
              <span className="text-xs">vs Background:</span>
              <Badge variant={passes ? 'success' : 'warning'} className="text-[10px]">
                {formatContrastRatio(contrastRatio)} {passes ? 'AA' : 'Fail'}
              </Badge>
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
