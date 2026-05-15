import { useNavigate } from 'react-router-dom'
import { Settings } from 'lucide-react'
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

  const footer = (
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
    <GameLayout footer={footer}>
      <div className="relative flex flex-col items-center gap-14">
        
        {/* Sticker */}  
        <span
            className="absolute -top-20 -right-0 inline-block rounded-lg bg-yellow-300 px-3 py-1.5 text-xs text-yellow-950"
            style={{
              transform: 'rotate(3deg)',
              boxShadow: '2px 4px 0 rgba(0,0,0,0.12), 0 4px 14px rgba(0,0,0,0.1)',
            }}
          >
            Un dispositivo, <br /> ¡todos juegan!
        </span>

        {/* Logo */}
        <div className="pb-16">
          <img src={`${import.meta.env.BASE_URL}logo-drodis.svg`} alt="Drodis" className="mx-auto" width={250} height='auto' />
          <p className="text-center text-md"> Dibuja rápido mientras <br /> tu equipo adivina </p>
        </div>

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
