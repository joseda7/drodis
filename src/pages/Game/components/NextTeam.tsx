type Props = {
  nextTeam: string
  playerNumber: number
}

export function NextTeam({ nextTeam, playerNumber }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm">Pasa el dispositivo al <strong>dibujante {playerNumber}</strong>  del equipo:</p>
      <h2 className="text-4xl font-black tracking-tight text-foreground uppercase">{nextTeam}</h2>
    </div>
  )
}
