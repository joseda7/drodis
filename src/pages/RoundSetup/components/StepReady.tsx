import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

type Props = {
  startingTeam: string
  roundId: string
  roundTime: number
  onBack: () => void
}

export function StepReady({ startingTeam, roundId, roundTime, onBack }: Props) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">El equipo que empieza es:</p>
        <h2 className="text-4xl font-black tracking-tight text-foreground">
          {startingTeam}
        </h2>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="h-12 flex-1"
          onClick={onBack}
        >
          Atrás
        </Button>
        <Button
          className="h-12 flex-1 font-semibold"
          onClick={() => navigate(`/${roundId}`, { state: { roundTime } })}
        >
          A jugar!
        </Button>
      </div>
    </div>
  )
}
