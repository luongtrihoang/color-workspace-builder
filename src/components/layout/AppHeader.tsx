import { Moon, Sun, Download, Upload } from 'lucide-react'
import { useRef } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useWorkspaceStore } from '@/features/workspace/stores/workspaceStore'
import type { WorkspaceTheme } from '@/features/workspace/types'

export default function AppHeader() {
  const { isDarkMode, toggleDarkMode, themes, activeThemeId, importTheme } =
    useWorkspaceStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const activeTheme = themes.find((t) => t.id === activeThemeId)

  function handleExport() {
    if (!activeTheme) return
    const json = JSON.stringify(activeTheme, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeTheme.name.toLowerCase().replace(/\s+/g, '-')}-theme.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Theme exported successfully')
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string) as WorkspaceTheme
        if (!parsed.name || !parsed.roles) {
          toast.error('Invalid theme file format')
          return
        }
        importTheme(parsed)
        toast.success(`Theme "${parsed.name}" imported`)
      } catch {
        toast.error('Failed to parse JSON file')
      }
    }
    reader.readAsText(file)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <header className="flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-orange-400 to-teal-400">
          <span className="text-xs font-bold text-white">CW</span>
        </div>
        <h1 className="text-lg font-semibold">Color Workspace Builder</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={handleExport} aria-label="Export theme">
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Import theme"
        >
          <Upload className="h-4 w-4" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleImport}
          aria-label="Import theme file"
        />

        <Separator orientation="vertical" className="h-6" />

        <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  )
}
