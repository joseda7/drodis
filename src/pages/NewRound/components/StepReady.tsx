import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function StepReady() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-foreground">
          ¿Estás listo?
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tu equipo adivinará los dibujos que hagas antes de que se acabe el
          tiempo
        </p>
      </div>

      <Button
        className="h-12 w-full text-base font-semibold"
        onClick={() => navigate('/seleccionar-palabra')}
      >
        Seleccionar palabra
      </Button>
    </div>
  )
}
