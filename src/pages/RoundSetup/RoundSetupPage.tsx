import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { StepTime } from './components/StepTime'
import { StepTeams } from './components/StepTeams'
import { StepReady } from './components/StepReady'
import type { Team, TimeOption, StepId } from './types'

// TODO: replace with settings context once Settings screen exists
const TIME_NOT_SET_IN_SETTINGS = true

const STEPS_WITH_TIME: StepId[] = ['time', 'teams', 'ready']
const STEPS_WITHOUT_TIME: StepId[] = ['teams', 'ready']

const DEFAULT_TEAMS: Team[] = [
  { name: 'Equipo 1', isEditing: false, draftName: 'Equipo 1' },
  { name: 'Equipo 2', isEditing: false, draftName: 'Equipo 2' },
]

export function RoundSetupPage() {
  const { roundId } = useParams<{ roundId: string }>()
  const navigate = useNavigate()

  const steps = TIME_NOT_SET_IN_SETTINGS ? STEPS_WITH_TIME : STEPS_WITHOUT_TIME

  const [stepIndex, setStepIndex] = useState(0)
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS)
  const [roundTime, setRoundTime] = useState<TimeOption>(60)

  const currentStep = steps[stepIndex]
  const canGoBack = stepIndex > 0

  function goNext() {
    setStepIndex((i) => Math.min(i + 1, steps.length - 1))
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0))
  }

  return (
    <div className="relative flex min-h-dvh overflow-hidden bg-background">
      <div className="absolute inset-0 bg-dot-pattern" />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-sm flex-col px-6">

        {/* Top bar: stepper (centered) + cancel (right) */}
        <div className="flex items-center justify-between py-6">
          <div className="w-7 shrink-0" />
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
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
            onClick={() => navigate('/')}
            aria-label="Cancelar y volver al inicio"
          >
            <X />
          </Button>
        </div>

        {/* Step content — vertically centered in remaining space */}
        <div className="flex flex-1 flex-col justify-center pb-10">
          {currentStep === 'time' && (
            <StepTime
              selected={roundTime}
              onSelect={setRoundTime}
              onNext={goNext}
            />
          )}
          {currentStep === 'teams' && (
            <StepTeams
              teams={teams}
              onChange={setTeams}
              onBack={canGoBack ? goBack : undefined}
              onNext={goNext}
            />
          )}
          {currentStep === 'ready' && (
            <StepReady
              startingTeam={teams[0].name}
              roundId={roundId!}
              roundTime={roundTime}
              onBack={goBack}
            />
          )}
        </div>

      </div>
    </div>
  )
}
