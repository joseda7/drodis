import { useRef } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import type { Team } from '../types'

type Props = {
  teams: Team[]
  onChange: (teams: Team[]) => void
}

export function StepTeams({ teams, onChange }: Props) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  function startEdit(idx: number) {
    onChange(
      teams.map((t, i) =>
        i === idx ? { ...t, isEditing: true, draftName: t.name } : t
      )
    )
  }

  function confirmEdit(idx: number) {
    onChange(
      teams.map((t, i) =>
        i === idx
          ? { ...t, isEditing: false, name: t.draftName.trim() || t.name }
          : t
      )
    )
  }

  function setDraft(idx: number, value: string) {
    onChange(
      teams.map((t, i) => (i === idx ? { ...t, draftName: value } : t))
    )
  }

  function setPlayerCount(idx: number, raw: string) {
    const count = Math.max(1, parseInt(raw) || 1)
    onChange(teams.map((t, i) => (i === idx ? { ...t, playerCount: count } : t)))
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">Elige los equipos</p>

      <div className="grid grid-cols-2 gap-3">
        {teams.map((team, idx) => (
          <Card key={idx} className="flex flex-col gap-4 p-4">
            {team.isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  ref={(el) => { inputRefs.current[idx] = el }}
                  value={team.draftName}
                  onChange={(e) => setDraft(idx, e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && confirmEdit(idx)}
                  autoFocus
                  maxLength={20}
                  className="h-7 text-sm"
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => confirmEdit(idx)}
                  aria-label="Confirmar nombre"
                >
                  <Check />
                </Button>
              </div>
            ) : (
              <button
                onClick={() => startEdit(idx)}
                className="flex w-full items-center rounded-md text-left transition-colors hover:bg-muted/50 active:bg-muted"
                aria-label={`Editar nombre de ${team.name}`}
              >
                <span className="truncate text-sm font-semibold text-foreground">
                  {team.name}
                </span>
              </button>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground"># de jugadores</label>
              <Input
                type="number"
                min={1}
                max={20}
                value={team.playerCount}
                onChange={(e) => setPlayerCount(idx, e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
