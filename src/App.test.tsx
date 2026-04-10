import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App.tsx'

describe('Paprika microsite', () => {
  it('shows the welcome step', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Spin. Win. Review. Claim.' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
  })

  it('switches headline when locale changes', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Change language' }))
    const languageSwitcher = screen.getByRole('dialog', {
      name: 'Change language',
    })

    fireEvent.click(within(languageSwitcher).getByRole('button', { name: 'ES' }))

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Gira. Gana. Reseña. Reclama.',
      }),
    ).toBeInTheDocument()
  })
})
