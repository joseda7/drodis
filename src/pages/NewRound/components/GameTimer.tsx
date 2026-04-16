import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'

type Props = {
  word: string
  roundTime: number
  onGuessed: () => void
  onSkip: () => void
}

export function GameTimer({ word, roundTime, onGuessed, onSkip }: Props) {
  const [timeLeft, setTimeLeft] = useState(roundTime)
  const isExpired = timeLeft <= 0

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col items-center gap-10">
      {/* Word */}
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-sm font-medium text-white/60">Dibuja</p>
        <h2 className="text-4xl font-black tracking-tight text-white">{word}</h2>
      </div>

      {/* Countdown */}
      <div className="flex flex-col items-center">
        <span
          className={`text-[120px] leading-none font-black tabular-nums transition-colors ${
            isExpired ? 'text-white/40' : 'text-white'
          }`}
        >
          {timeLeft}
        </span>
        {isExpired && (
          <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-white/60">
            ¡Tiempo!
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex w-full flex-col gap-3">
        <button
          onClick={onGuessed}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-green-500 text-base font-semibold text-white transition-colors hover:bg-green-600 active:bg-green-700"
        >
          <Check className="size-5" />
          Adivinado
        </button>
        <button
          onClick={onSkip}
          className="flex h-10 w-full items-center justify-center rounded-xl bg-red-500 text-sm font-medium text-white transition-colors hover:bg-red-600 active:bg-red-700"
        >
          Saltar palabra
        </button>
      </div>
    </div>
  )
}
