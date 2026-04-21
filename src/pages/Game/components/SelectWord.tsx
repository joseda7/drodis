import { useEffect, useState } from 'react'
import { TriangleAlert } from 'lucide-react'
import { fetchWords, pickRandom } from '@/services/wordsService'
import type { Word } from '@/services/wordsService'

type Props = {
  onSelect: (word: string) => void
}

export function SelectWord({ onSelect }: Props) {
  const [words, setWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWords()
      .then((all) => setWords(pickRandom(all, 3)))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-black tracking-tight text-foreground">
          Elige una palabra
        </h2>
        <div className="flex items-start gap-2 text-muted-foreground">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <p className="text-sm leading-snug">
            No la muestres a tu equipo, deberán adivinarla mientras dibujas.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 w-full animate-pulse rounded-xl bg-muted" />
            ))
          : words.map((word) => (
              <button
                key={word.id}
                onClick={() => onSelect(word.name)}
                className="flex h-16 w-full items-center justify-center rounded-xl border border-border bg-card text-base font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98]"
              >
                {word.name}
              </button>
            ))}
      </div>
    </div>
  )
}
