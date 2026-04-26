import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { GameLayout } from '@/components/layout/GameLayout'
import { StepTime } from './components/StepTime'
import { StepTeams } from './components/StepTeams'
import { StepReady } from './components/StepReady'
import { useGame } from '@/context/GameContext'
import { useSettings } from '@/context/SettingsContext'
import { generateTeamNames } from '@/services/teamNamesService'
import { addTeamNameToHistory } from '@/services/teamNameHistoryService'
import type { Team, TimeOption, StepId } from './types'

const STEPS_WITH_TIME: StepId[] = ['time', 'teams', 'ready']
const STEPS_WITHOUT_TIME: StepId[] = ['teams', 'ready']

export function GameConfigPage() {
  const { gameId } = useParams<{ gameId: string }>()
  const navigate = useNavigate()
  const { teams: gameTeams, setTeams: setGameTeams, resetGame } = useGame()
  const { settings } = useSettings()

  const steps = settings.applyToAllGames ? STEPS_WITHOUT_TIME : STEPS_WITH_TIME

  const [stepIndex, setStepIndex] = useState(0)
  const [teams, setTeams] = useState<Team[]>(
    gameTeams.map((t) => ({ ...t, isEditing: false, draftName: t.name }))
  )
  const [roundTime, setRoundTime] = useState<TimeOption>(settings.roundTime)

  useEffect(() => {
    if (!teams.some((t) => /^Equipo \d+$/.test(t.name))) return
    generateTeamNames(teams.length)
      .then((names) => {
        const updated: Team[] = teams.map((t, i) => ({
          ...t,
          name: names[i] ?? t.name,
          draftName: names[i] ?? t.name,
        }))
        setTeams(updated)
        setGameTeams(updated.map(({ name, playerCount }) => ({ name, playerCount })))
      })
      .catch(() => {})
  }, [])

  const currentStep = steps[stepIndex]
  const canGoBack = stepIndex > 0
  const isAnyEditing = teams.some((t) => t.isEditing)
  const hasDuplicateNames = (() => {
    const names = teams.map((t) => t.name.toLowerCase().trim())
    return names.length !== new Set(names).size
  })()

  function handleTeamsChange(updated: Team[]) {
    setTeams(updated)
    setGameTeams(updated.map(({ name, playerCount }) => ({ name, playerCount })))
  }

  async function handleAddTeam() {
    try {
      const [name] = await generateTeamNames(1)
      const newTeam: Team = { name, playerCount: 2, isEditing: false, draftName: name }
      handleTeamsChange([...teams, newTeam])
    } catch {
      const name = `Equipo ${teams.length + 1}`
      const newTeam: Team = { name, playerCount: 2, isEditing: false, draftName: name }
      handleTeamsChange([...teams, newTeam])
    }
  }

  function goNext() {
    setStepIndex((i) => Math.min(i + 1, steps.length - 1))
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0))
  }

  function handleStartGame() {
    teams.forEach((t) => addTeamNameToHistory(t.name))
    navigate(`/${gameId}`, {
      state: { roundTime: settings.applyToAllGames ? settings.roundTime : roundTime },
    })
  }

  const STEP_LABELS: Record<StepId, string> = {
    time: 'Elige el tiempo de dibujo',
    teams: 'Elige los equipos',
    ready: '¿Todos preparados?',
  }

  const header = (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium text-foreground">
        {STEP_LABELS[currentStep] ?? ''}
      </span>
      <button
        onClick={() => { resetGame(); navigate('/') }}
        className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 active:opacity-75"
        aria-label="Cancelar y volver al inicio"
      >
        <X className="size-4" />
      </button>
    </div>
  )

  const footer = (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-center gap-2">
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
      <div className="flex gap-3">
        {canGoBack && (
          <Button variant="outline" className="h-12 flex-1" onClick={goBack}>
            Atrás
          </Button>
        )}
        {currentStep === 'ready' ? (
          <Button className="h-12 flex-1 font-semibold" onClick={handleStartGame}>
            A dibujar!
          </Button>
        ) : (
          <Button
            className={cn('h-12 font-semibold', canGoBack ? 'flex-1' : 'w-full')}
            onClick={goNext}
            disabled={currentStep === 'teams' && (isAnyEditing || hasDuplicateNames)}
          >
            Siguiente
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <GameLayout header={header} footer={footer}>
      {currentStep === 'time' && (
        <StepTime selected={roundTime} onSelect={setRoundTime} />
      )}
      {currentStep === 'teams' && (
        <StepTeams teams={teams} onChange={handleTeamsChange} onAddTeam={handleAddTeam} />
      )}
      {currentStep === 'ready' && (
        <StepReady startingTeam={teams[0].name} />
      )}
    </GameLayout>
  )
}
