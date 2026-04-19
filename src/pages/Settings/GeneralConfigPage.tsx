import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { GameLayout } from '@/components/layout/GameLayout'
import { useSettings } from '@/context/SettingsContext'
import type { TimeOption } from '@/context/SettingsContext'

const TIME_OPTIONS: TimeOption[] = [30, 60, 90]

export function GeneralConfigPage() {
  const navigate = useNavigate()
  const { settings, saveSettings } = useSettings()
  const [draft, setDraft] = useState(settings)

  function handleSave() {
    saveSettings(draft)
    navigate('/')
  }

  const header = (
    <div className="flex items-center justify-between">
      <h1 className="text-lg font-bold text-foreground">Configuración</h1>
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1 rounded-md px-1 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Cerrar configuración"
      >
        Salir
        <X className="size-3.5" />
      </button>
    </div>
  )

  const footer = (
    <Button className="h-14 w-full text-base font-semibold" onClick={handleSave}>
      Guardar
    </Button>
  )

  return (
    <GameLayout header={header} footer={footer}>
      <div className="flex flex-col gap-8">

        {/* Round time */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            Tiempo para adivinar (segundos)
          </label>
          <div className="grid grid-cols-3 gap-3">
            {TIME_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => setDraft({ ...draft, roundTime: t })}
                className={cn(
                  'flex flex-col items-center justify-center rounded-xl border py-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  draft.roundTime === t
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                )}
              >
                <span className="text-3xl font-black">{t}</span>
                <span className="mt-0.5 text-xs font-normal">seg</span>
              </button>
            ))}
          </div>
        </div>

        {/* Apply to all games toggle */}
        <div className="flex items-center justify-between gap-4">
          <label className="text-sm font-medium text-foreground leading-snug">
            Aplicar a todas las partidas
          </label>
          <button
            role="switch"
            aria-checked={draft.applyToAllGames}
            onClick={() => setDraft({ ...draft, applyToAllGames: !draft.applyToAllGames })}
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              draft.applyToAllGames ? 'bg-primary' : 'bg-muted'
            )}
          >
            <span
              className={cn(
                'pointer-events-none inline-block size-5 rounded-full bg-white shadow-md transition-transform duration-200',
                draft.applyToAllGames ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
        </div>

        {draft.applyToAllGames && (
          <p className="text-xs text-muted-foreground">
            El paso de selección de tiempo será omitido al iniciar una nueva partida.
          </p>
        )}
      </div>
    </GameLayout>
  )
}
