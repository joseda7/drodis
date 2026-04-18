import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { GameLayout } from '@/components/layout/GameLayout'
import { StepTime } from './components/StepTime'
import { StepTeams } from './components/StepTeams'
import { StepReady } from './components/StepReady'
import { useGame } from '@/context/GameContext'
import type { Team, TimeOption, StepId } from './types'

// TODO: replace with settings context once Settings screen exists
const TIME_NOT_SET_IN_SETTINGS = true

const STEPS_WITH_TIME: StepId[] = ['time', 'teams', 'ready']
const STEPS_WITHOUT_TIME: StepId[] = ['teams', 'ready']

export function GameSetupPage() {
  const { gameId } = useParams<{ gameId: string }>()
  const navigate = useNavigate()
  const { teams: gameTeams, setTeams: setGameTeams, resetGame } = useGame()

  const steps = TIME_NOT_SET_IN_SETTINGS ? STEPS_WITH_TIME : STEPS_WITHOUT_TIME

  const [stepIndex, setStepIndex] = useState(0)
  const [teams, setTeams] = useState<Team[]>(
    gameTeams.map((t) => ({ ...t, isEditing: false, draftName: t.name }))
  )
  const [roundTime, setRoundTime] = useState<TimeOption>(60)

  const currentStep = steps[stepIndex]
  const canGoBack = stepIndex > 0
  const isAnyEditing = teams.some((t) => t.isEditing)

  function handleTeamsChange(updated: Team[]) {
    setTeams(updated)
    setGameTeams(updated.map(({ name, playerCount }) => ({ name, playerCount })))
  }

  function goNext() {
    setStepIndex((i) => Math.min(i + 1, steps.length - 1))
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0))
  }

  const salirBtn = (
    <button
      onClick={() => { resetGame(); navigate('/') }}
      className="flex items-center gap-1 rounded-md px-1 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      aria-label="Cancelar y volver al inicio"
    >
      Salir
      <X className="size-3.5" />
    </button>
  )

  const header = (
    <div className="flex items-center justify-between">
      {/* Invisible clone keeps stepper centered */}
      <div className="invisible flex items-center gap-1 px-1 py-1 text-sm font-medium">
        <X className="size-3.5" />
        Salir
      </div>
      <div className="flex items-center gap-2">
        {steps.map((_, i) => (
          <div
            key={i}
            className={cn(
              'size-2 rounded-full transition-colors duration-300',
              i === stepIndex ? 'bg-primary' : 'bg-muted'
            )}
          />
        ))}
      </div>
      {salirBtn}
    </div>
  )

  const footer = (
    <div className="flex gap-3">
      {canGoBack && (
        <Button variant="outline" className="h-12 flex-1" onClick={goBack}>
          Atrás
        </Button>
      )}
      {currentStep === 'ready' ? (
        <Button
          className="h-12 flex-1 font-semibold"
          onClick={() => navigate(`/${gameId}`, { state: { roundTime } })}
        >
          A dibujar!
        </Button>
      ) : (
        <Button
          className={cn('h-12 font-semibold', canGoBack ? 'flex-1' : 'w-full')}
          onClick={goNext}
          disabled={currentStep === 'teams' && isAnyEditing}
        >
          Siguiente
        </Button>
      )}
    </div>
  )

  return (
    <GameLayout header={header} footer={footer}>
      {currentStep === 'time' && (
        <StepTime selected={roundTime} onSelect={setRoundTime} />
      )}
      {currentStep === 'teams' && (
        <StepTeams teams={teams} onChange={handleTeamsChange} />
      )}
      {currentStep === 'ready' && (
        <StepReady startingTeam={teams[0].name} />
      )}
    </GameLayout>
  )
}
