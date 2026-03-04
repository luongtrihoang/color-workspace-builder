import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useWorkspaceStore } from '@/features/workspace/stores/workspaceStore'
import AppHeader from './AppHeader'

function renderWithProviders() {
  return render(
    <TooltipProvider>
      <AppHeader />
    </TooltipProvider>
  )
}

describe('AppHeader', () => {
  beforeEach(() => {
    const { themes } = useWorkspaceStore.getState()
    useWorkspaceStore.setState({
      activeThemeId: 'dracula',
      themes: themes.filter((t) => t.isBuiltIn),
      isDarkMode: true,
    })
  })

  it('renders the app title', () => {
    renderWithProviders()
    expect(screen.getByText('Color Workspace Builder')).toBeInTheDocument()
  })

  it('renders export, import, and dark mode buttons with aria-labels', () => {
    renderWithProviders()
    expect(screen.getByLabelText('Export theme')).toBeInTheDocument()
    expect(screen.getByLabelText('Import theme')).toBeInTheDocument()
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument()
  })

  it('toggles dark mode on button click', async () => {
    const user = userEvent.setup()
    renderWithProviders()

    expect(useWorkspaceStore.getState().isDarkMode).toBe(true)
    await user.click(screen.getByLabelText('Switch to light mode'))
    expect(useWorkspaceStore.getState().isDarkMode).toBe(false)
  })

  it('updates dark mode button label after toggle', async () => {
    const user = userEvent.setup()
    renderWithProviders()

    await user.click(screen.getByLabelText('Switch to light mode'))
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument()
  })
})
