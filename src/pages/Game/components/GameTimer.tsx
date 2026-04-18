type Props = {
  word: string
  timeLeft: number
  isExpired: boolean
}

export function GameTimer({ word, timeLeft, isExpired }: Props) {
  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-sm font-medium text-white/60">Dibuja</p>
        {/* <h2 className="text-4xl font-black tracking-tight text-white">{word}</h2> */}
      </div>

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
            ¡Se acabó el tiempo!
          </p>
        )}
      </div>
    </div>
  )
}
