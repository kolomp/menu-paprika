import { afterEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import App from './App.tsx'
import { locales, sections } from './content.ts'

function setNavigatorLanguages(languages: string[]) {
  Object.defineProperty(window.navigator, 'languages', {
    configurable: true,
    get: () => languages,
  })

  Object.defineProperty(window.navigator, 'language', {
    configurable: true,
    get: () => languages[0],
  })
}

afterEach(() => {
  window.localStorage.clear()
  setNavigatorLanguages(['en-US'])
})

const localeSamples = [
  {
    buttonLabel: /中文/,
    menuButton: '打开菜单',
    quickMenuLabel: '快速菜单',
    samples: ['Kocabag Leo\'s 红葡萄酒', '加切达芝士', '意式浓缩', '亨德里克金酒 · 5 cl'],
  },
  {
    buttonLabel: /日本語/,
    menuButton: 'メニューを開く',
    quickMenuLabel: 'クイックメニュー',
    samples: ['コジャバグ レオズ レッド', 'チェダーチーズ追加', 'エスプレッソ', 'ヘンドリックス ジン · 5 cl'],
  },
  {
    buttonLabel: /Italiano/,
    menuButton: 'Apri menu',
    quickMenuLabel: 'Menu rapido',
    samples: ['Kocabag Leo\'s Rosso', 'Cheddar extra', 'Martini Prosecco', "Gin Hendrick's · 5 cl"],
  },
  {
    buttonLabel: /Русский/,
    menuButton: 'Открыть меню',
    quickMenuLabel: 'Быстрое меню',
    samples: ['Kocabag Leo\'s Красное', 'Дополнительный чеддер', 'Эспрессо', 'Егермейстер · 5 cl'],
  },
  {
    buttonLabel: /Español/,
    menuButton: 'Abrir menú',
    quickMenuLabel: 'Menú rápido',
    samples: ["Kocabag Leo's Tinto", 'Extra de queso cheddar', 'Espresso', "Ginebra Hendrick's · 5 cl"],
  },
] as const

describe('Paprika menu', () => {
  it('includes a non-empty name for every locale on every menu item', () => {
    for (const section of sections) {
      for (const subSection of section.subSections) {
        for (const menuItem of subSection.items) {
          for (const locale of locales) {
            expect(menuItem.name[locale].trim().length).toBeGreaterThan(0)
          }
        }
      }
    }
  })

  it('renders the qr menu in English by default', () => {
    setNavigatorLanguages(['en-US'])

    render(<App />)

    expect(screen.getByRole('link', { name: 'paprika' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument()
    expect(screen.getByText('Quick Menu')).toBeInTheDocument()
    expect(screen.getAllByText('Language')[0]).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Bar Selection' }),
    ).toBeInTheDocument()
  })

  it('uses the phone language when Japanese is detected', () => {
    setNavigatorLanguages(['ja-JP'])

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'メニューを開く' }))
    const drawer = screen.getByRole('dialog')

    expect(within(drawer).getByRole('button', { name: /日本語/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('falls back to English when Korean is detected', () => {
    setNavigatorLanguages(['ko-KR'])

    render(<App />)

    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument()
    expect(screen.getByText('Quick Menu')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /한국어/ })).not.toBeInTheDocument()
  })

  it('uses the phone language when Spanish is detected', () => {
    setNavigatorLanguages(['es-ES'])

    render(<App />)

    expect(screen.getByRole('button', { name: 'Abrir menú' })).toBeInTheDocument()
    expect(screen.getByText('Menú rápido')).toBeInTheDocument()
  })

  it('switches the menu language manually', () => {
    setNavigatorLanguages(['en-US'])

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    const drawer = screen.getByRole('dialog')
    fireEvent.click(within(drawer).getByRole('button', { name: /中文/ }))

    expect(screen.getByRole('button', { name: '打开菜单' })).toBeInTheDocument()
    expect(screen.getByText('快速菜单')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: '酒吧精选' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it.each(localeSamples)('renders localized menu item names for $buttonLabel', ({
    buttonLabel,
    menuButton,
    quickMenuLabel,
    samples,
  }) => {
    setNavigatorLanguages(['en-US'])

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    const drawer = screen.getByRole('dialog')
    fireEvent.click(within(drawer).getByRole('button', { name: buttonLabel }))

    expect(screen.getByRole('button', { name: menuButton })).toBeInTheDocument()
    expect(screen.getByText(quickMenuLabel)).toBeInTheDocument()

    for (const sample of samples) {
      expect(screen.getAllByText(sample).length).toBeGreaterThan(0)
    }
  })
})
