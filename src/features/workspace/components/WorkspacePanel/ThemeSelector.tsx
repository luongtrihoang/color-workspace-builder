import { useState } from 'react'
import { Plus, Trash2, Lock, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import { cn } from '@/lib/utils'

export default function ThemeSelector() {
  const { themes, activeThemeId, setActiveTheme, addCustomTheme, deleteTheme, resetTheme } =
    useWorkspaceStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newThemeName, setNewThemeName] = useState('')

  function handleAddTheme() {
    const name = newThemeName.trim()
    if (!name) return
    addCustomTheme(name)
    setNewThemeName('')
    setDialogOpen(false)
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-wrap gap-1">
        {themes.map((theme) => (
          <div key={theme.id} className="flex items-center">
            <button
              onClick={() => setActiveTheme(theme.id)}
              className={cn(
                'inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors',
                theme.id === activeThemeId
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              {theme.isBuiltIn && <Lock className="h-3 w-3" />}
              {theme.name}
            </button>
            {theme.id === activeThemeId && theme.isBuiltIn && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 ml-1"
                onClick={() => resetTheme(theme.id)}
                aria-label={`Reset ${theme.name} to defaults`}
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            )}
            {theme.id === activeThemeId && !theme.isBuiltIn && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 ml-1"
                onClick={() => deleteTheme(theme.id)}
                aria-label={`Delete ${theme.name} theme`}
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setDialogOpen(true)}
        className="gap-1"
      >
        <Plus className="h-4 w-4" />
        New
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Custom Theme</DialogTitle>
            <DialogDescription>
              Enter a name for your new custom theme.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Theme name"
            value={newThemeName}
            onChange={(e) => setNewThemeName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTheme()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTheme} disabled={!newThemeName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
