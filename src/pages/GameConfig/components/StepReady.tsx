type Props = {
  startingTeam: string
}

export function StepReady({ startingTeam }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">El equipo que empieza es:</p>
      <h2 className="text-4xl font-black tracking-tight text-foreground">
        {startingTeam}
      </h2>
    </div>
  )
}
