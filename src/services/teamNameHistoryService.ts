const STORAGE_KEY = 'drodis_team_name_history'
const MAX_HISTORY = 10

export function getTeamNameHistory(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function addTeamNameToHistory(name: string) {
  const trimmed = name.trim()
  if (!trimmed) return
  const current = getTeamNameHistory().filter((n) => n !== trimmed)
  localStorage.setItem(STORAGE_KEY, JSON.stringify([trimmed, ...current].slice(0, MAX_HISTORY)))
}
