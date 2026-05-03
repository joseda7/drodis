import type { WordCategory } from './wordsService'

const STORAGE_KEY = 'drodis_custom_words'

export type CustomWord = {
  id: string
  name: string
  category: WordCategory
  translations: { en: null; it: null }
}

export function getCustomWords(): CustomWord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CustomWord[]) : []
  } catch {
    return []
  }
}

export function addCustomWord(name: string, category: WordCategory): CustomWord {
  const words = getCustomWords()
  const word: CustomWord = {
    id: `custom_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    name: name.trim(),
    category,
    translations: { en: null, it: null },
  }
  words.push(word)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words))
  return word
}

export function removeCustomWord(id: string): void {
  const words = getCustomWords().filter((w) => w.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words))
}
