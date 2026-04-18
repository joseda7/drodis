import { createContext, useContext, useState } from 'react'

export type GameTeam = {
  name: string
  playerCount: number
}

type GameContextValue = {
  teams: GameTeam[]
  setTeams: (teams: GameTeam[]) => void
  resetGame: () => void
}

const GameContext = createContext<GameContextValue | null>(null)

const DEFAULT_GAME_TEAMS: GameTeam[] = [
  { name: 'Equipo 1', playerCount: 1 },
  { name: 'Equipo 2', playerCount: 1 },
]

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [teams, setTeams] = useState<GameTeam[]>(DEFAULT_GAME_TEAMS)

  function resetGame() {
    setTeams(DEFAULT_GAME_TEAMS)
  }

  return (
    <GameContext.Provider value={{ teams, setTeams, resetGame }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}
