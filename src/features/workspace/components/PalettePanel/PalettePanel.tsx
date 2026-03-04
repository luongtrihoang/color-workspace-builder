import { ScrollArea } from '@/components/ui/scroll-area'
import { usePalette } from '../../hooks/usePalette'
import CombinationGroup from './CombinationGroup'

export default function PalettePanel() {
  const { groups } = usePalette()

  return (
    <aside className="w-full border-b lg:w-80 lg:border-b-0 lg:border-r">
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Color Palette
        </h2>
      </div>
      <ScrollArea className="h-[200px] lg:h-[calc(100vh-7rem)]">
        <div className="space-y-1 p-2">
          {groups.map((group) => (
            <CombinationGroup key={group.id} group={group} />
          ))}
        </div>
      </ScrollArea>
    </aside>
  )
}
