import { useDroppable } from '@dnd-kit/core'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  getContrastRatio,
  isWcagAaPass,
  formatContrastRatio,
} from '@/lib/colorUtils'
import { useWorkspace } from '../../hooks/useWorkspace'
import type { ThemeRole } from '../../types'

interface ThemeRoleSlotProps {
  role: ThemeRole
  hex: string | null
  backgroundHex: string | null
}

function getTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? '#000000' : '#ffffff'
}

export default function ThemeRoleSlot({ role, hex, backgroundHex }: ThemeRoleSlotProps) {
  const { clearRole } = useWorkspace()
  const { isOver, setNodeRef } = useDroppable({ id: role })

  const contrastRatio =
    hex && backgroundHex && role !== 'background'
      ? getContrastRatio(hex, backgroundHex)
      : null
  const passes = contrastRatio !== null ? isWcagAaPass(contrastRatio) : null

  return (
    <div
      ref={setNodeRef}
      aria-label={`${role} color slot${hex ? `: ${hex}` : ' — empty, drop color here'}`}
      className={cn(
        'relative flex flex-col items-center justify-center rounded-lg border-2 p-3 transition-all min-h-[100px]',
        hex ? 'border-solid' : 'border-dashed border-muted-foreground/30',
        isOver && 'border-ring ring-2 ring-ring/20 scale-105'
      )}
      style={
        hex
          ? { backgroundColor: hex, color: getTextColor(hex) }
          : undefined
      }
    >
      <span
        className={cn(
          'text-xs font-semibold uppercase tracking-wider',
          !hex && 'text-muted-foreground'
        )}
      >
        {role}
      </span>

      {hex ? (
        <>
          <span className="mt-1 font-mono text-sm">{hex}</span>
          {contrastRatio !== null && (
            <Badge
              variant={passes ? 'success' : 'warning'}
              className="mt-1 text-[10px]"
            >
              {formatContrastRatio(contrastRatio)} {passes ? 'AA' : 'Fail'}
            </Badge>
          )}
          <button
            onClick={() => clearRole(role)}
            className="absolute right-1 top-1 rounded-full p-0.5 opacity-0 transition-opacity hover:bg-black/20 group-hover:opacity-100"
            style={{ opacity: 1 }}
            aria-label={`Clear ${role} color`}
          >
            <X className="h-3 w-3" />
          </button>
        </>
      ) : (
        <span className="mt-1 text-xs text-muted-foreground">
          Drop color here
        </span>
      )}
    </div>
  )
}
