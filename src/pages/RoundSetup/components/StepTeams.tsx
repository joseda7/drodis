import { useRef } from 'react'
import { Check, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import type { Team } from '../types'

type Props = {
  teams: Team[]
  onChange: (teams: Team[]) => void
  onBack?: () => void
  onNext: () => void
}

export function StepTeams({ teams, onChange, onBack, onNext }: Props) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const isAnyEditing = teams.some((t) => t.isEditing)

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

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-foreground">
          Equipos
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Elige los equipos</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {teams.map((team, idx) => (
          <Card
            key={idx}
            className="flex min-h-[90px] flex-col justify-between gap-2 p-4"
          >
            {team.isEditing ? (
              <>
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
                  className="self-end"
                  aria-label="Confirmar nombre"
                >
                  <Check />
                </Button>
              </>
            ) : (
              <>
                <span className="truncate text-sm font-semibold text-foreground">
                  {team.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => startEdit(idx)}
                  className="self-end"
                  aria-label={`Editar nombre de ${team.name}`}
                >
                  <Pencil />
                </Button>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {onBack && (
          <Button
            variant="outline"
            className="h-12 flex-1"
            onClick={onBack}
          >
            Atrás
          </Button>
        )}
        <Button
          className={cn('h-12 font-semibold', onBack ? 'flex-1' : 'w-full')}
          onClick={onNext}
          disabled={isAnyEditing}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}
