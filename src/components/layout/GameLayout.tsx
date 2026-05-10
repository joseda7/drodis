type Props = {
  variant?: 'default' | 'timer'
  backgroundColor?: string
  header?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
}

export function GameLayout({ variant = 'default', backgroundColor, header, footer, children }: Props) {
  const resolvedBg = backgroundColor ?? (variant === 'timer' ? '#7964F9' : undefined)

  return (
    <div
      className="relative flex h-dvh flex-col overflow-hidden transition-colors duration-500"
      style={resolvedBg ? { backgroundColor: resolvedBg } : undefined}
    >
      {!resolvedBg && <div className="absolute inset-0 bg-background" />}

      <div className="relative z-10 mx-auto flex h-full w-full max-w-sm flex-col">
        {header !== undefined && (
          <div className="shrink-0 px-6 py-4">{header}</div>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="flex min-h-full flex-col justify-center px-6 py-6">
            {children}
          </div>
        </div>

        {footer !== undefined && (
          <div className="shrink-0 px-6 pb-6 pt-3">{footer}</div>
        )}
      </div>

      <div className="noise-overlay" />
    </div>
  )
}
