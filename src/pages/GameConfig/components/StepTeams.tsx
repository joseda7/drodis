import { useRef, useState } from 'react'
import { Check, Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import type { Team } from '../types'

type Props = {
  teams: Team[]
  onChange: (teams: Team[]) => void
  onAddTeam: () => void
}

export function StepTeams({ teams, onChange, onAddTeam }: Props) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [playerDrafts, setPlayerDrafts] = useState<Record<number, string>>({})

  const allNamesLower = teams.map((t) => t.name.toLowerCase().trim())
  const hasDuplicates = allNamesLower.length !== new Set(allNamesLower).size

  function startEdit(idx: number) {
    onChange(teams.map((t, i) => (i === idx ? { ...t, isEditing: true, draftName: t.name } : t)))
  }

  function confirmEdit(idx: number) {
    const team = teams[idx]
    const finalName = team.draftName.trim() || team.name
    onChange(teams.map((t, i) => (i === idx ? { ...t, isEditing: false, name: finalName } : t)))
  }

  function setDraft(idx: number, value: string) {
    onChange(teams.map((t, i) => (i === idx ? { ...t, draftName: value } : t)))
  }

  function removeTeam(idx: number) {
    onChange(teams.filter((_, i) => i !== idx))
  }

  function commitPlayerCount(idx: number, raw: string) {
    const parsed = parseInt(raw)
    const count = isNaN(parsed) ? teams[idx].playerCount : Math.min(20, Math.max(2, parsed))
    setPlayerDrafts((prev) => { const next = { ...prev }; delete next[idx]; return next })
    onChange(teams.map((t, i) => (i === idx ? { ...t, playerCount: count } : t)))
  }

  function adjustPlayerCount(idx: number, delta: number) {
    setPlayerDrafts((prev) => { const next = { ...prev }; delete next[idx]; return next })
    const current = teams[idx].playerCount
    const count = Math.min(20, Math.max(2, current + delta))
    onChange(teams.map((t, i) => (i === idx ? { ...t, playerCount: count } : t)))
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-center text-md">Elige número de jugadores por equipo</p>
      {teams.map((team, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <Card className="flex flex-col gap-4 p-4">
              {team.isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    ref={(el) => { inputRefs.current[idx] = el }}
                    value={team.draftName}
                    onChange={(e) => setDraft(idx, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') confirmEdit(idx)
                      if (e.key === 'Escape') confirmEdit(idx)
                    }}
                    onBlur={() => confirmEdit(idx)}
                    autoFocus
                    maxLength={20}
                    className="h-9 text-base font-semibold"
                  />
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onMouseDown={(e) => { e.preventDefault(); confirmEdit(idx) }}
                    aria-label="Confirmar nombre"
                  >
                    <Check />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(idx)}
                    className="flex min-w-0 flex-1 items-center rounded-md text-left transition-colors hover:bg-muted/50 active:bg-muted"
                    aria-label={`Editar nombre de ${team.name}`}
                  >
                    <span className="truncate font-bold text-foreground">
                      {team.name}
                    </span>
                  </button>
                  {teams.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeTeam(idx)}
                      aria-label={`Eliminar ${team.name}`}
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              )}

              <div className="flex flex-row items-center gap-3">
                <label className="text-xs text-muted-foreground"># de jugadores</label>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => adjustPlayerCount(idx, -1)}
                    disabled={team.playerCount <= 2}
                    aria-label="Reducir jugadores"
                  >
                    <Minus className="size-3" />
                  </Button>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={playerDrafts[idx] ?? String(team.playerCount)}
                    onFocus={() => setPlayerDrafts((prev) => ({ ...prev, [idx]: String(team.playerCount) }))}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '')
                      setPlayerDrafts((prev) => ({ ...prev, [idx]: val }))
                    }}
                    onBlur={() => commitPlayerCount(idx, playerDrafts[idx] ?? '')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { e.currentTarget.blur() }
                    }}
                    className="h-8 w-12 text-center text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => adjustPlayerCount(idx, 1)}
                    disabled={team.playerCount >= 20}
                    aria-label="Añadir jugador"
                  >
                    <Plus className="size-3" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ))}

      {hasDuplicates && (
        <p className="text-xs text-destructive">Cada equipo debe tener un nombre único.</p>
      )}

      <button
        type="button"
        onClick={onAddTeam}
        className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
      >
        <Plus className="size-4" />
        Añadir equipo
      </button>
    </div>
  )
}
