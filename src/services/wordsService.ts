export type WordCategory = 'animal' | 'objeto' | 'alimento' | 'lugar' | 'misterio'

export type Word = {
  id: string
  name: string
  category: WordCategory
  translations: {
    en: string | null
    it: string | null
  }
}

const WORDS_URL = import.meta.env.VITE_WORDS_URL ?? `${import.meta.env.BASE_URL}data/words.json`
const CUSTOM_WORDS_KEY = 'drodis_custom_words'

let cache: Word[] | null = null

function readCustomWords(): Word[] {
  try {
    const raw = localStorage.getItem(CUSTOM_WORDS_KEY)
    return raw ? (JSON.parse(raw) as Word[]) : []
  } catch {
    return []
  }
}

export async function fetchWords(): Promise<Word[]> {
  if (!cache) {
    const res = await fetch(WORDS_URL)
    if (!res.ok) throw new Error(`Failed to fetch words (${res.status})`)
    const data: { words: Word[] } = await res.json()
    cache = data.words
  }
  return [...cache, ...readCustomWords()]
}

export function pickRandom<T>(items: T[], count: number): T[] {
  return [...items].sort(() => Math.random() - 0.5).slice(0, count)
}
