import { cn } from '@/lib/utils'
import type { TimeOption } from '../types'

const TIME_OPTIONS = [30, 60, 90] as const

type Props = {
  selected: TimeOption
  onSelect: (time: TimeOption) => void
}

export function StepTime({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-3 gap-3">
        {TIME_OPTIONS.map((time) => (
          <button
            key={time}
            onClick={() => onSelect(time)}
            className={cn(
              'flex flex-col items-center justify-center rounded-xl border py-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              selected === time
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
            )}
          >
            <span className="text-4xl font-black">{time}</span>
            <span className="mt-0.5 text-xs font-normal">seg</span>
          </button>
        ))}
      </div>
    </div>
  )
}
