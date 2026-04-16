import { useNavigate } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'

function generateRoundId(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export function HomePage() {
  const navigate = useNavigate()

  function startNewRound() {
    const roundId = generateRoundId()
    navigate(`/${roundId}/setup`)
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-dot-pattern" />

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-xs flex-col items-center gap-14 px-6">

        {/* Logo */}
        <div className="flex flex-col items-center gap-5">
          <div className="flex size-20 items-center justify-center rounded-3xl bg-primary/10 ring-1 ring-primary/20">
            <Pencil className="size-9 text-primary" strokeWidth={1.75} />
          </div>
          <h1 className="text-7xl font-black tracking-tighter text-foreground">
            Drodis
          </h1>
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col gap-3">
          <Button
            className="h-12 w-full text-base font-semibold"
            onClick={startNewRound}
          >
            Nueva partida
          </Button>
          <Button variant="outline" className="h-11 w-full">
            Configuración
          </Button>
          <Button variant="ghost" className="h-11 w-full">
            Ayuda
          </Button>
        </div>

      </div>
    </div>
  )
}
