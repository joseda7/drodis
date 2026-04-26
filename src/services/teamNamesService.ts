type TeamNamesData = {
  subjects: string[]
  adjectives: string[]
}

const TEAM_NAMES_URL = import.meta.env.VITE_TEAM_NAMES_URL ?? '/data/teamNames.json'

let cache: TeamNamesData | null = null

async function fetchTeamNamesData(): Promise<TeamNamesData> {
  if (cache) return cache
  const res = await fetch(TEAM_NAMES_URL)
  if (!res.ok) throw new Error(`Failed to fetch team names (${res.status})`)
  cache = await res.json()
  return cache!
}

// Picks `count` unique subjects and `count` unique adjectives, then zips them.
// Guarantees no two teams share a subject or adjective.
export async function generateTeamNames(count: number): Promise<string[]> {
  const data = await fetchTeamNamesData()
  const subjects = [...data.subjects].sort(() => Math.random() - 0.5).slice(0, count)
  const adjectives = [...data.adjectives].sort(() => Math.random() - 0.5).slice(0, count)
  return subjects.map((subject, i) => `${subject} ${adjectives[i]}`)
}
