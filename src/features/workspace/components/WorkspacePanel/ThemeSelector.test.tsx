import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import ThemeSelector from './ThemeSelector'

describe('ThemeSelector', () => {
  beforeEach(() => {
    const { themes } = useWorkspaceStore.getState()
    useWorkspaceStore.setState({
      activeThemeId: 'dracula',
      themes: themes.filter((t) => t.isBuiltIn),
    })
  })

  it('renders all built-in theme buttons', () => {
    render(<ThemeSelector />)
    expect(screen.getByText('Dracula')).toBeInTheDocument()
    expect(screen.getByText('One Dark')).toBeInTheDocument()
    expect(screen.getByText('VSCode Dark')).toBeInTheDocument()
  })

  it('switches active theme on click', async () => {
    const user = userEvent.setup()
    render(<ThemeSelector />)

    await user.click(screen.getByText('One Dark'))
    expect(useWorkspaceStore.getState().activeThemeId).toBe('one-dark')
  })

  it('shows reset button for active built-in theme', () => {
    render(<ThemeSelector />)
    expect(screen.getByLabelText('Reset Dracula to defaults')).toBeInTheDocument()
  })

  it('opens new theme dialog and creates a custom theme', async () => {
    const user = userEvent.setup()
    render(<ThemeSelector />)

    await user.click(screen.getByText('New'))
    expect(screen.getByText('Create Custom Theme')).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText('Theme name'), 'My Custom')
    await user.click(screen.getByRole('button', { name: 'Create' }))

    const { themes, activeThemeId } = useWorkspaceStore.getState()
    const custom = themes.find((t) => t.id === activeThemeId)
    expect(custom?.name).toBe('My Custom')
    expect(custom?.isBuiltIn).toBe(false)
  })

  it('shows delete button for custom theme when active', async () => {
    useWorkspaceStore.getState().addCustomTheme('Test Theme')
    const { activeThemeId } = useWorkspaceStore.getState()
    const theme = useWorkspaceStore.getState().themes.find((t) => t.id === activeThemeId)

    render(<ThemeSelector />)
    expect(screen.getByLabelText(`Delete ${theme?.name} theme`)).toBeInTheDocument()
  })
})
