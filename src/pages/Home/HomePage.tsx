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
    <div className="flex justify-end">
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
        <div>
          <h1 className="text-center text-7xl font-black tracking-tighter text-foreground">
            Drodis
          </h1>
          <p className="text-center text-md"> Dibuja mientras tu equipo adivina </p>
        </div>

        <div></div>

        {/* Actions */}
        <div className="flex w-full flex-col gap-3">
          <Button className="h-12 w-full text-base font-semibold" onClick={startNewGame}>
            Comenzar juego
          </Button>
          <p className="text-center text-sm text-muted-foreground">* Prepara tus implementos de dibujo</p>
          {/* <Button variant="ghost" className="h-11 w-full" disabled>
            Ayuda
          </Button> */}
        </div>

      </div>
    </GameLayout>
  )
}
