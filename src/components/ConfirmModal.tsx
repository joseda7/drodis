import { Button } from '@/components/ui/button'

type Props = {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({ open, title, description, confirmLabel, onConfirm, onCancel }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-6 sm:items-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="h-11 flex-1" onClick={onCancel}>
            CANCELAR
          </Button>
          <Button
            className="h-11 flex-1 bg-[#FF6164] hover:bg-[#e05255] text-white"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
