export const WORDS: string[] = [
  'Elefante',
  'Guitarra',
  'Castillo',
  'Mariposa',
  'Submarino',
  'Cohete',
  'Volcán',
  'Jirafa',
  'Paraguas',
]

export function pickRandom(words: string[], count: number): string[] {
  return [...words].sort(() => Math.random() - 0.5).slice(0, count)
}
