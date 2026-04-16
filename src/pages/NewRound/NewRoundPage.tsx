import { useState } from 'react'
import { StepTeams } from './components/StepTeams'
import { StepTime } from './components/StepTime'
import { StepReady } from './components/StepReady'
import type { Team, TimeOption } from './types'

// TODO: derive from settings context once Settings screen exists
const TIME_NOT_SET_IN_SETTINGS = true

const DEFAULT_TEAMS: Team[] = [
  { name: 'Equipo 1', isEditing: false, draftName: 'Equipo 1' },
  { name: 'Equipo 2', isEditing: false, draftName: 'Equipo 2' },
]

export function NewRoundPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS)
  const [roundTime, setRoundTime] = useState<TimeOption>(60)

  function handleStep1Next() {
    setStep(TIME_NOT_SET_IN_SETTINGS ? 2 : 3)
  }

  function handleStep2Next() {
    setStep(3)
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 bg-dot-pattern" />

      <div className="relative z-10 w-full max-w-sm px-6 py-12">
        {step === 1 && (
          <StepTeams
            teams={teams}
            onChange={setTeams}
            onNext={handleStep1Next}
          />
        )}
        {step === 2 && (
          <StepTime
            selected={roundTime}
            onSelect={setRoundTime}
            onNext={handleStep2Next}
          />
        )}
        {step === 3 && <StepReady />}
      </div>
    </div>
  )
}
