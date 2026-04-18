import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GameLayout } from '@/components/layout/GameLayout'
import { SelectWord } from './components/SelectWord'
import { GameTimer } from './components/GameTimer'
import { NextTeam } from './components/NextTeam'
import { useGame } from '@/context/GameContext'
import { useCountdown } from '@/hooks/useCountdown'

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

  const roundTime: number = location.state?.roundTime ?? 60
  const teamNames = gameTeams.map((t) => t.name)
  const playerCounts = gameTeams.map((t) => t.playerCount)

  const [subView, setSubView] = useState<SubView>('select-word')
  const [selectedWord, setSelectedWord] = useState('')
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0)
  const [selectKey, setSelectKey] = useState(0)
  const [teamRounds, setTeamRounds] = useState<WordRecord[][]>(() =>
    teamNames.map(() => [])
  )

  const isTimerActive = subView === 'timer'
  const timeLeft = useCountdown(roundTime, isTimerActive)
  const isExpired = timeLeft <= 0
  const nextTeamIndex = (currentTeamIndex + 1) % teamNames.length

  function handleWordSelect(word: string) {
    setSelectedWord(word)
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
    setSelectKey((k) => k + 1)
    setSubView('select-word')
  }

  const header = (
    <div className="flex items-center justify-between">
      <span
        className={`text-sm font-medium ${
          isTimerActive ? 'text-white/60' : 'text-muted-foreground'
        }`}
      >
        {teamNames[currentTeamIndex]}
      </span>
      <button
        onClick={() => { resetGame(); navigate('/') }}
        className={`flex items-center gap-1 rounded-md px-1 py-1 text-sm font-medium transition-colors ${
          isTimerActive
            ? 'text-white/60 hover:text-white'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        Salir
        <X className="size-3.5" />
      </button>
    </div>
  )

  const footer =
    subView === 'timer' ? (
      <div className="flex flex-col gap-3">
        <button
          onClick={() => handleRoundEnd(true, roundTime - timeLeft)}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-green-500 text-base font-semibold text-white transition-colors hover:bg-green-600 active:bg-green-700"
        >
          <Check className="size-5" />
          Adivinado
        </button>
        <button
          onClick={() => handleRoundEnd(false, 0)}
          className="flex h-10 w-full items-center justify-center rounded-xl bg-red-500 text-sm font-medium text-white transition-colors hover:bg-red-600 active:bg-red-700"
        >
          <X className="size-4" />
          Saltar palabra
        </button>
      </div>
    ) : subView === 'next-team' ? (
      <Button className="h-14 w-full text-base font-semibold" onClick={handleNextTeam}>
        A dibujar!
      </Button>
    ) : undefined

  return (
    <GameLayout variant={isTimerActive ? 'timer' : 'default'} header={header} footer={footer}>
      {subView === 'select-word' && (
        <SelectWord key={selectKey} onSelect={handleWordSelect} />
      )}
      {subView === 'timer' && (
        <GameTimer word={selectedWord} timeLeft={timeLeft} isExpired={isExpired} />
      )}
      {subView === 'next-team' && (
        <NextTeam nextTeam={teamNames[nextTeamIndex]} />
      )}
    </GameLayout>
  )
}
