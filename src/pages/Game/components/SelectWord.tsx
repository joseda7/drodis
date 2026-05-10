import { useEffect, useState } from 'react'
import { fetchWords, pickRandom } from '@/services/wordsService'
import type { Word } from '@/services/wordsService'

type Props = {
  onSelect: (name: string, category: string) => void
}

export function SelectWord({ onSelect }: Props) {
  const [words, setWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Word | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)

  useEffect(() => {
    fetchWords()
      .then((all) => setWords(pickRandom(all, 3)))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (countdown === null) return
    if (countdown === 0) {
      onSelect(selected!.name, selected!.category)
      return
    }
    const t = setTimeout(() => setCountdown((c) => c! - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  function handleClick(word: Word) {
    if (selected) return
    setSelected(word)
    setCountdown(3)
  }

  return (
    <div className="relative flex flex-col gap-8">
      <span
          className={`absolute -top-25 left-10 inline-block rounded-lg bg-yellow-300 px-3 py-1.5 text-xs text-yellow-950 ${selected ? 'opacity-0' : ''}`}
          style={{
            transform: 'rotate(-2deg)',
            boxShadow: '2px 4px 0 rgba(0,0,0,0.12), 0 4px 14px rgba(0,0,0,0.1)',
          }}
        >
         <strong> No muestres esta pantalla a tu equipo, </strong><br /> ya que adivinarán mientras dibujas.
      </span>
      <div className="flex flex-col gap-3">
        <h2 className={`text-center text-md tracking-tight text-foreground transition-opacity duration-400 ${selected ? 'opacity-0' : ''}`}>
          Elige una palabra a dibujar
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 w-full animate-pulse rounded-xl bg-muted" />
            ))
          : words.map((word) => {
              const isSelected = selected?.id === word.id
              const isFaded = selected !== null && !isSelected
              return (
                <button
                  key={word.id}
                  onClick={() => handleClick(word)}
                  disabled={selected !== null}
                  className={`h-20 w-full rounded-xl border transition-all duration-400
                    ${isSelected
                      ? 'flex items-center justify-between px-6 border-primary bg-primary/8 scale-[1.02]'
                      : isFaded
                        ? 'flex flex-col items-center justify-center gap-1 pointer-events-none border-border bg-card opacity-0'
                        : 'flex flex-col items-center justify-center gap-1 border-border bg-card hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98]'
                    }`}
                >
                  <div className={`flex flex-col gap-1 ${isSelected ? 'items-start' : 'items-center'}`}>
                    <span className="text-base font-semibold text-foreground">{word.name}</span>
                    <span className="text-xs capitalize text-muted-foreground">{word.category}</span>
                  </div>

                  {isSelected && countdown !== null && countdown > 0 && (
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                        empieza en
                      </span>
                      <span
                        key={countdown}
                        className="animate-countdown-pop text-4xl font-bold tabular-nums text-foreground"
                      >
                        {countdown}
                      </span>
                    </div>
                  )}
                </button>
              )
            })}
      </div>
    </div>
  )
}
