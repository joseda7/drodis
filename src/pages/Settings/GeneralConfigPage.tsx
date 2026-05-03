import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GameLayout } from '@/components/layout/GameLayout'
import { useSettings } from '@/context/SettingsContext'
import { AddWordModal } from './components/AddWordModal'
import { getCustomWords, addCustomWord, removeCustomWord } from '@/services/customWordsService'
import type { CustomWord } from '@/services/customWordsService'
import type { WordCategory } from '@/services/wordsService'

export function GeneralConfigPage() {
  const navigate = useNavigate()
  const { settings, saveSettings } = useSettings()
  const [draft, setDraft] = useState(settings)
  const [timeInput, setTimeInput] = useState(String(settings.roundTime))
  const [customWords, setCustomWords] = useState<CustomWord[]>(getCustomWords)
  const [addModalOpen, setAddModalOpen] = useState(false)

  function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/[^0-9]/g, '')
    setTimeInput(val)
    const n = parseInt(val, 10)
    if (!isNaN(n) && n > 0) {
      setDraft((d) => ({ ...d, roundTime: n }))
    }
  }

  function handleRemoveWord(id: string) {
    removeCustomWord(id)
    setCustomWords(getCustomWords())
  }

  function handleWordAdd(name: string, category: WordCategory) {
    addCustomWord(name, category)
    setCustomWords(getCustomWords())
    setAddModalOpen(false)
  }

  function handleSave() {
    const n = parseInt(timeInput, 10)
    saveSettings({ ...draft, roundTime: isNaN(n) || n <= 0 ? 60 : n })
    navigate('/')
  }

  const header = (
    <div className="flex items-center justify-between">
      <h1 className="text-lg font-bold text-foreground">Configuración</h1>
      <button
        onClick={() => navigate('/')}
        className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 active:opacity-75"
        aria-label="Cerrar configuración"
      >
        <X className="size-4" />
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
          <Input
            type="text"
            inputMode="numeric"
            value={timeInput}
            onChange={handleTimeChange}
            className="h-12 text-center text-xl font-bold"
            placeholder="60"
          />
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

        {/* Custom words */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">Mis palabras</span>
            <p className="text-xs text-muted-foreground">
              Palabras extra que se añadirán a las partidas
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 flex flex-col gap-3">
            {customWords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {customWords.map((word) => (
                  <span
                    key={word.id}
                    className="flex items-center gap-1.5 rounded-md bg-foreground px-2.5 py-1 text-sm font-medium text-background"
                  >
                    {word.name}
                    <button
                      onClick={() => handleRemoveWord(word.id)}
                      aria-label={`Eliminar ${word.name}`}
                      className="flex items-center opacity-60 hover:opacity-100 transition-opacity"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="flex items-center justify-center gap-1 rounded-lg border border-dashed border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              Añadir palabra +
            </button>
          </div>
        </div>
      </div>

      <AddWordModal
        open={addModalOpen}
        onAdd={handleWordAdd}
        onClose={() => setAddModalOpen(false)}
      />
    </GameLayout>
  )
}
