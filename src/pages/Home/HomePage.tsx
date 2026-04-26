import { useNavigate } from 'react-router-dom'
import { Pencil, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GameLayout } from '@/components/layout/GameLayout'
import { useGame } from '@/context/GameContext'
import { generateTeamNames } from '@/services/teamNamesService'

function generateGameId(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export function HomePage() {
  const navigate = useNavigate()
  const { resetGame } = useGame()

  async function startNewGame() {
    const gameId = generateGameId()
    try {
      const names = await generateTeamNames(2)
      resetGame(names.map((name) => ({ name, playerCount: 2 })))
    } catch {
      resetGame()
    }
    navigate(`/${gameId}/config`)
  }

  const header = (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-black tracking-tighter text-foreground">Drodis</h1>
      <button
        onClick={() => navigate('/settings')}
        className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Configuración"
      >
        <Settings className="size-5" />
      </button>
    </div>
  )

  return (
    <GameLayout header={header}>
      <div className="flex flex-col items-center gap-14">

        {/* Logo */}
        <div className="flex size-18 items-center justify-center rounded-3xl bg-primary/10 ring-1 ring-primary/20">
          <Pencil className="size-9 text-primary" strokeWidth={1.75} />
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col gap-3">
          <p className="text-center text-sm text-muted-foreground">¡Alista papel y lápiz!</p>
          <Button className="h-12 w-full text-base font-semibold" onClick={startNewGame}>
            Nueva partida
          </Button>
          {/* <Button variant="ghost" className="h-11 w-full" disabled>
            Ayuda
          </Button> */}
        </div>

      </div>
    </GameLayout>
  )
}
