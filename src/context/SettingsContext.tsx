import { createContext, useContext, useState } from 'react'

export type GameSettings = {
  roundTime: number
  applyToAllGames: boolean
}

const DEFAULT_SETTINGS: GameSettings = {
  roundTime: 60,
  applyToAllGames: false,
}

type SettingsContextValue = {
  settings: GameSettings
  saveSettings: (s: GameSettings) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS)
  return (
    <SettingsContext.Provider value={{ settings, saveSettings: setSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider')
  return ctx
}
