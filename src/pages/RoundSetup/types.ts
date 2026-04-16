export type Team = {
  name: string
  isEditing: boolean
  draftName: string
}

export type TimeOption = 30 | 60 | 90

export type StepId = 'time' | 'teams' | 'ready'
