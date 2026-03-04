import { useState } from 'react'
import { ChevronDown, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CombinationGroup as CombinationGroupType } from '../../types'
import ColorSwatch from './ColorSwatch'

interface CombinationGroupProps {
  group: CombinationGroupType
}

export default function CombinationGroup({ group }: CombinationGroupProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="rounded-lg border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-accent/50 rounded-lg"
        aria-expanded={isOpen}
        aria-label={`${group.name} color group`}
      >
        <span className="font-medium">{group.name}</span>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Heart className="h-3 w-3" />
            {group.likes.toLocaleString()}
          </span>
          <ChevronDown
            className={cn(
              'h-4 w-4 text-muted-foreground transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </div>
      </button>
      {isOpen && (
        <div className="flex flex-wrap gap-2 px-3 pb-3">
          {group.colors.map((color) => (
            <ColorSwatch key={color.id} color={color} />
          ))}
        </div>
      )}
    </div>
  )
}
