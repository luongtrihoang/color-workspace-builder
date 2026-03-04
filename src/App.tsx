import { useEffect } from 'react'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { useWorkspaceStore } from '@/features/workspace/stores/workspaceStore'
import AppLayout from '@/components/layout/AppLayout'

export default function App() {
  const isDarkMode = useWorkspaceStore((s) => s.isDarkMode)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  return (
    <ErrorBoundary>
      <TooltipProvider>
        <AppLayout />
        <Toaster richColors position="bottom-right" />
      </TooltipProvider>
    </ErrorBoundary>
  )
}
