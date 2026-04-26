import { useRef, useState } from 'react'
import { Check, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { getTeamNameHistory } from '@/services/teamNameHistoryService'
import type { Team } from '../types'

type Props = {
  teams: Team[]
  onChange: (teams: Team[]) => void
  onAddTeam: () => void
}

export function StepTeams({ teams, onChange, onAddTeam }: Props) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [openDropdownIdx, setOpenDropdownIdx] = useState<number | null>(null)

  const allNamesLower = teams.map((t) => t.name.toLowerCase().trim())
  const hasDuplicates = allNamesLower.length !== new Set(allNamesLower).size

  function startEdit(idx: number) {
    setOpenDropdownIdx(idx)
    onChange(teams.map((t, i) => (i === idx ? { ...t, isEditing: true, draftName: t.name } : t)))
  }

  function confirmEdit(idx: number) {
    const team = teams[idx]
    const finalName = team.draftName.trim() || team.name
    setOpenDropdownIdx(null)
    onChange(teams.map((t, i) => (i === idx ? { ...t, isEditing: false, name: finalName } : t)))
  }

  function setDraft(idx: number, value: string) {
    onChange(teams.map((t, i) => (i === idx ? { ...t, draftName: value } : t)))
  }

  function selectSuggestion(idx: number, name: string) {
    onChange(teams.map((t, i) => (i === idx ? { ...t, draftName: name } : t)))
  }

  function removeTeam(idx: number) {
    setOpenDropdownIdx(null)
    onChange(teams.filter((_, i) => i !== idx))
  }

  function setPlayerCount(idx: number, raw: string) {
    const count = Math.max(2, parseInt(raw) || 2)
    onChange(teams.map((t, i) => (i === idx ? { ...t, playerCount: count } : t)))
  }

  const history = getTeamNameHistory()

  return (
    <div className="flex flex-col gap-3">
      <p className="text-center text-md">Elige número de jugadores por equipo</p>
      {teams.map((team, idx) => {
        const otherNames = teams.filter((_, i) => i !== idx).map((t) => t.name.toLowerCase())
        const suggestions = history.filter((n) => !otherNames.includes(n.toLowerCase()))
        const isDropdownOpen = openDropdownIdx === idx && team.isEditing && suggestions.length > 0

        return (
          <div key={idx} className="flex flex-col gap-2">   
            <Card className="flex flex-col gap-4 p-4">
              {team.isEditing ? (
                <div className="relative flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Input
                      ref={(el) => { inputRefs.current[idx] = el }}
                      value={team.draftName}
                      onChange={(e) => setDraft(idx, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') confirmEdit(idx)
                        if (e.key === 'Escape') { setOpenDropdownIdx(null); confirmEdit(idx) }
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

                  {isDropdownOpen && (
                    <div className="absolute left-0 right-10 top-full z-20 mt-1 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                      {suggestions.map((name) => (
                        <button
                          key={name}
                          type="button"
                          onMouseDown={(e) => { e.preventDefault(); selectSuggestion(idx, name) }}
                          className="w-full px-3 py-2.5 text-left text-sm text-foreground hover:bg-muted"
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  )}
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

              <div className="flex flex-row items-center gap-5">
                <label className="text-xs text-muted-foreground"># de jugadores</label>
                <Input
                  type="number"
                  min={2}
                  max={20}
                  value={team.playerCount}
                  onChange={(e) => setPlayerCount(idx, e.target.value)}
                  className="h-8 w-15 text-sm"
                />
              </div>
            </Card>
          </div>
        )
      })}

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
