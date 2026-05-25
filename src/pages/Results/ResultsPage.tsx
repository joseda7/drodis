import { useLocation, useNavigate } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GameLayout } from '@/components/layout/GameLayout'
import { useGame } from '@/context/GameContext'
import type { WordRecord } from '@/pages/Game/GamePage'

type TeamData = {
  name: string
  rounds: WordRecord[]
}

function effectiveness(team: TeamData): number {
  if (team.rounds.length === 0) return 0
  return team.rounds.filter((r) => r.guessed).length / team.rounds.length
}

function totalTimeSpent(team: TeamData): number {
  return team.rounds
    .filter((r) => r.guessed)
    .reduce((sum, r) => sum + r.timeSpent, 0)
}

function fmtPct(ratio: number): string {
  const pct = (ratio * 100).toFixed(1)
  return pct.endsWith('.0') ? `${Math.round(ratio * 100)}%` : `${pct}%`
}

const MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

function getRank(results: TeamData[], idx: number): number {
  const eff = effectiveness(results[idx])
  const time = totalTimeSpent(results[idx])
  return results.filter((t) => {
    const tEff = effectiveness(t)
    return tEff > eff || (tEff === eff && totalTimeSpent(t) < time)
  }).length + 1
}

function findWinnerIndices(results: TeamData[]): number[] {
  const effValues = results.map(effectiveness)
  const maxEff = Math.max(...effValues)
  const topIdx = results.map((_, i) => i).filter((i) => effValues[i] === maxEff)

  if (topIdx.length === 1) return topIdx

  const timeValues = results.map(totalTimeSpent)
  const minTime = Math.min(...topIdx.map((i) => timeValues[i]))
  return topIdx.filter((i) => timeValues[i] === minTime)
}

export function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { resetGame } = useGame()

  const rawResults: TeamData[] = location.state?.results ?? []

  // Sort by rank: highest effectiveness first, then lowest time as tiebreaker
  const results = [...rawResults].sort((a, b) => {
    const effDiff = effectiveness(b) - effectiveness(a)
    if (effDiff !== 0) return effDiff
    return totalTimeSpent(a) - totalTimeSpent(b)
  })

  const winnerIndices = findWinnerIndices(results)
  const isTie = winnerIndices.length > 1

  const footer = (
    <Button
      className="h-14 w-full text-2xl font-bold"
      onClick={() => { resetGame(); navigate('/') }}
    >
      VOLVER AL INICIO
    </Button>
  )

  return (
    <GameLayout footer={footer}>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {isTie ? '¡Empate!' : '¡Ganador!'}
          </p>
          <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">
            {isTie
              ? winnerIndices.map((i) => results[i].name).join(' y ')
              : results[winnerIndices[0]]?.name}
          </h1>
        </div>

        {/* Team cards */}
        {results.map((team, i) => {
          const isWinner = winnerIndices.includes(i)
          const eff = effectiveness(team)
          const time = totalTimeSpent(team)
          const medal = MEDALS[getRank(results, i)]

          return (
            <Card
              key={i}
              className={cn(
                'flex flex-col gap-4 p-5',
                isWinner && !isTie ? 'border-primary bg-primary/5' : ''
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground uppercase">{team.name}</span>
                {medal && <span className="text-xl leading-none">{medal}</span>}
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col">
                  <span className="text-lg font-black tabular-nums text-foreground">
                    {team.rounds.filter((r) => r.guessed).length}/{team.rounds.length}
                  </span>
                  <span className="text-xs text-muted-foreground">adivinadas</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black tabular-nums text-foreground">
                    {fmtPct(eff)}
                  </span>
                  <span className="text-xs text-muted-foreground">efectividad</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black tabular-nums text-foreground">
                    {time}s
                  </span>
                  <span className="text-xs text-muted-foreground">tiempo total</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 border-t border-border pt-4">
                {team.rounds.map((round, j) => (
                  <div key={j} className="flex items-center gap-2 text-sm">
                    {round.guessed ? (
                      <Check className="size-3.5 shrink-0 text-green-500" />
                    ) : (
                      <X className="size-3.5 shrink-0 text-red-500" />
                    )}
                    <span
                      className={round.guessed ? 'text-foreground' : 'text-muted-foreground'}
                    >
                      {round.word}
                    </span>
                    {round.guessed && (
                      <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                        {round.timeSpent}s
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )
        })}
      </div>
    </GameLayout>
  )
}
