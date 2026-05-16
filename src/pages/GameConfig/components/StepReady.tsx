type Props = {
  startingTeam: string
}

export function StepReady({ startingTeam }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-md">Comienza el <strong>dibujante 1</strong> del equipo</p>
      <h2 className="text-3xl font-black tracking-tight text-foreground uppercase">
        {startingTeam}
      </h2>
    </div>
  )
}
