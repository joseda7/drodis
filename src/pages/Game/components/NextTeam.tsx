type Props = {
  nextTeam: string
}

export function NextTeam({ nextTeam }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">Pasa el celular al equipo:</p>
      <h2 className="text-4xl font-black tracking-tight text-foreground">{nextTeam}</h2>
    </div>
  )
}
