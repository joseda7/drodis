import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SelectWord } from './components/SelectWord'
import { GameTimer } from './components/GameTimer'

type SubView = 'select-word' | 'timer'

export function NewRoundPage() {
  const location = useLocation()
  const navigate = useNavigate()

  // roundTime is passed via router state from StepReady; fall back to 60s
  const roundTime: number = location.state?.roundTime ?? 60

  const [subView, setSubView] = useState<SubView>('select-word')
  const [selectedWord, setSelectedWord] = useState('')
  // Incrementing this key forces SelectWord to re-mount (new random words) on skip
  const [selectKey, setSelectKey] = useState(0)

  const isTimer = subView === 'timer'

  function handleWordSelect(word: string) {
    setSelectedWord(word)
    setSubView('timer')
  }

  function handleGuessed() {
    // TODO: navigate to score / next-team screen
    navigate('/')
  }

  function handleSkip() {
    setSubView('select-word')
    setSelectedWord('')
    setSelectKey((k) => k + 1)
  }

  return (
    <div
      className="relative flex min-h-dvh items-center justify-center overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: isTimer ? '#7964F9' : undefined }}
    >
      {/* Dot pattern only on SelectWord */}
      {!isTimer && (
        <>
          <div className="absolute inset-0 bg-background" />
          <div className="absolute inset-0 bg-dot-pattern" />
        </>
      )}

      <div className="relative z-10 w-full max-w-sm px-6 py-12">
        {subView === 'select-word' && (
          <SelectWord key={selectKey} onSelect={handleWordSelect} />
        )}
        {subView === 'timer' && (
          <GameTimer
            word={selectedWord}
            roundTime={roundTime}
            onGuessed={handleGuessed}
            onSkip={handleSkip}
          />
        )}
      </div>
    </div>
  )
}
