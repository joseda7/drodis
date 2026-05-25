import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Check, Pause, Play, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GameLayout } from '@/components/layout/GameLayout'
import { ConfirmModal } from '@/components/ConfirmModal'
import { SelectWord } from './components/SelectWord'
import { GameTimer } from './components/GameTimer'
import { NextTeam } from './components/NextTeam'
import { useGame } from '@/context/GameContext'
import { useCountdown } from '@/hooks/useCountdown'
import { useBeepSound } from '@/hooks/useBeepSound'
import { useTickerSound } from '@/hooks/useTickerSound'

type SubView = 'select-word' | 'timer' | 'next-team'

export type WordRecord = {
  word: string
  guessed: boolean
  timeSpent: number
}

export function GamePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { gameId } = useParams<{ gameId: string }>()
  const { teams: gameTeams, resetGame } = useGame()

  const roundTime: number = location.state?.roundTime ?? 30
  const teamNames = gameTeams.map((t) => t.name)
  const playerCounts = gameTeams.map((t) => t.playerCount)

  const [subView, setSubView] = useState<SubView>('select-word')
  const [selectedWord, setSelectedWord] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0)
  const [selectKey, setSelectKey] = useState(0)
  const [teamRounds, setTeamRounds] = useState<WordRecord[][]>(() =>
    teamNames.map(() => [])
  )
  const [feedbackPhase, setFeedbackPhase] = useState<'none' | 'guessed' | 'skipped'>('none')
  const [showExitModal, setShowExitModal] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const isTimerActive = subView === 'timer'
  // Pause (not reset) the countdown during feedback phase or manual pause
  const countdownActive = isTimerActive && feedbackPhase === 'none' && !isPaused && !showExitModal
  const timeLeft = useCountdown(roundTime, countdownActive, () => triggerFeedback('skipped', roundTime), selectKey)
  const isExpired = timeLeft <= 0
  const roundEnded = feedbackPhase !== 'none' || isExpired

  const playBeep = useBeepSound()
  useEffect(() => {
    if (!countdownActive || timeLeft <= 0 || timeLeft > 5) return
    playBeep()
  }, [timeLeft])
  useTickerSound(timeLeft, countdownActive)
  const nextTeamIndex = (() => {
    for (let i = 1; i <= teamNames.length; i++) {
      const idx = (currentTeamIndex + i) % teamNames.length
      if (teamRounds[idx].length < playerCounts[idx]) return idx
    }
    return (currentTeamIndex + 1) % teamNames.length
  })()

  const FEEDBACK_BG: Record<'guessed' | 'skipped', string> = {
    guessed: '#74DA9E',
    skipped: '#FF6164',
  }
  const activeBgColor = isTimerActive
    ? feedbackPhase !== 'none' ? FEEDBACK_BG[feedbackPhase] : '#7964F9'
    : undefined

  function handleWordSelect(name: string, category: string) {
    setSelectedWord(name)
    setSelectedCategory(category)
    setSubView('timer')
  }

  function handleRoundEnd(guessed: boolean, timeSpent: number) {
    const record: WordRecord = { word: selectedWord, guessed, timeSpent }
    const newTeamRounds = teamRounds.map((rounds, i) =>
      i === currentTeamIndex ? [...rounds, record] : rounds
    )
    setTeamRounds(newTeamRounds)

    const roundsPlayed = newTeamRounds.map((r) => r.length)
    const gameOver = roundsPlayed.every((r, i) => r >= playerCounts[i])
    if (gameOver) {
      navigate(`/${gameId}/results`, {
        state: {
          results: teamNames.map((name, i) => ({ name, rounds: newTeamRounds[i] })),
        },
      })
    } else {
      setSubView('next-team')
    }
  }

  function handleNextTeam() {
    setCurrentTeamIndex(nextTeamIndex)
    setSelectedWord('')
    setSelectedCategory('')
    setSelectKey((k) => k + 1)
    setIsPaused(false)
    setSubView('select-word')
  }

  const currentPlayerNumber = teamRounds[currentTeamIndex].length + 1

  const header = (
    <div className="flex items-center justify-between">
      {subView !== 'next-team' && (
        <div className="flex flex-col">
          <span
            className={`text-xs font-semibold uppercase ${
              isTimerActive ? 'text-white' : 'text-foreground'
            }`}
          >
            {teamNames[currentTeamIndex]}
          </span>
          <span
            className={`text-xs ${
              isTimerActive ? 'text-white/60' : 'text-muted-foreground'
            }`}
          >
            Dibujante {currentPlayerNumber}
          </span>
        </div>
      )}
      <div className="ml-auto flex flex-col items-end gap-2">
        <button
          onClick={() => setShowExitModal(true)}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 active:opacity-75"
          aria-label="Salir de la partida"
        >
          <X className="size-4" />
        </button>
        {isTimerActive && !roundEnded && (
          <button
            onClick={() => setIsPaused((p) => !p)}
            className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-white transition-opacity hover:opacity-90 active:opacity-75 ${isPaused ? 'bg-[#74DA9E]' : 'bg-[#FF6164]'}`}
            aria-label={isPaused ? 'Reanudar' : 'Pausar'}
          >
            {isPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
          </button>
        )}
      </div>
    </div>
  )

  function triggerFeedback(phase: 'guessed' | 'skipped', timeSpent: number) {
    setFeedbackPhase(phase)
    setTimeout(() => {
      setFeedbackPhase('none')
      handleRoundEnd(phase === 'guessed', timeSpent)
    }, 1000)
  }

  const footer =
    subView === 'timer' ? (
      <div className="flex flex-col gap-3">
        <button
          disabled={roundEnded}
          onClick={() => triggerFeedback('guessed', roundTime - timeLeft)}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-green-500 text-2xl font-bold text-white transition-colors hover:bg-green-600 active:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Check className="size-5" />
          ADIVINADO
        </button>
        <button
          disabled={roundEnded}
          onClick={() => triggerFeedback('skipped', 0)}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-red-500 text-base font-medium text-white transition-colors hover:bg-red-600 active:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X className="size-4" />
          SALTAR
        </button>
      </div>
    ) : subView === 'next-team' ? (
      <Button className="h-14 w-full text-2xl font-bold" onClick={handleNextTeam}>
        ¡A JUGAR!
      </Button>
    ) : undefined

  return (
    <>
    <ConfirmModal
      open={showExitModal}
      title="¿Abandonar partida?"
      description="Si sales ahora perderás todo el progreso de la partida actual."
      confirmLabel="ABANDONAR"
      onConfirm={() => { resetGame(); navigate('/') }}
      onCancel={() => setShowExitModal(false)}
    />
    <GameLayout variant={isTimerActive ? 'timer' : 'default'} backgroundColor={activeBgColor} header={header} footer={footer} overlay={isPaused && isTimerActive}>
      {subView === 'select-word' && (
        <SelectWord key={selectKey} onSelect={handleWordSelect} />
      )}
      {subView === 'timer' && (
        <GameTimer word={selectedWord} category={selectedCategory} timeLeft={timeLeft} isExpired={isExpired} />
      )}
      {subView === 'next-team' && (
        <NextTeam nextTeam={teamNames[nextTeamIndex]} playerNumber={teamRounds[nextTeamIndex].length + 1} />
      )}
    </GameLayout>
    </>
  )
}
