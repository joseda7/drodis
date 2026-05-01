export type WordCategory = 'animal' | 'objeto' | 'alimento' | 'lugar'

export type Word = {
  id: string
  name: string
  category: WordCategory
  translations: {
    en: string
    it: string
  }
}

// Set VITE_WORDS_URL in .env to point at a real backend endpoint
const WORDS_URL = import.meta.env.VITE_WORDS_URL ?? `${import.meta.env.BASE_URL}data/words.json`

let cache: Word[] | null = null

export async function fetchWords(): Promise<Word[]> {
  if (cache) return cache
  const res = await fetch(WORDS_URL)
  if (!res.ok) throw new Error(`Failed to fetch words (${res.status})`)
  const data: { words: Word[] } = await res.json()
  cache = data.words
  return cache
}

export function pickRandom<T>(items: T[], count: number): T[] {
  return [...items].sort(() => Math.random() - 0.5).slice(0, count)
}
