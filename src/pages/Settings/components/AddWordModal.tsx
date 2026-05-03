import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fetchWords } from '@/services/wordsService'
import type { WordCategory } from '@/services/wordsService'

const CATEGORIES: { value: WordCategory; label: string }[] = [
  { value: 'objeto', label: 'Objeto' },
  { value: 'animal', label: 'Animal' },
  { value: 'alimento', label: 'Alimento' },
  { value: 'lugar', label: 'Lugar' },
  { value: 'misterio', label: 'Misterio' },
]

type Props = {
  open: boolean
  onAdd: (name: string, category: WordCategory) => void
  onClose: () => void
}

export function AddWordModal({ open, onAdd, onClose }: Props) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<WordCategory | ''>('')
  const [existingNames, setExistingNames] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!open) return
    setName('')
    setCategory('')
    fetchWords()
      .then((words) => setExistingNames(new Set(words.map((w) => w.name.toLowerCase().trim()))))
      .catch(() => {})
  }, [open])

  if (!open) return null

  const trimmedLower = name.trim().toLowerCase()
  const nameAlreadyExists = trimmedLower.length > 0 && existingNames.has(trimmedLower)
  const canCreate = name.trim().length > 0 && category !== '' && !nameAlreadyExists

  function handleSubmit() {
    if (!canCreate) return
    onAdd(name.trim(), category as WordCategory)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-6 sm:items-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
        <h2 className="text-lg font-bold text-foreground">Nueva palabra</h2>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Nombre *</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && canCreate) handleSubmit() }}
              placeholder="Ej. Escalera"
              className="h-10"
              autoFocus
            />
            {nameAlreadyExists && (
              <span className="text-xs text-destructive">Esta palabra ya existe</span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Categoría *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as WordCategory | '')}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value="">Selecciona una categoría</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="h-11 flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="h-11 flex-1" onClick={handleSubmit} disabled={!canCreate}>
            Crear
          </Button>
        </div>
      </div>
    </div>
  )
}
