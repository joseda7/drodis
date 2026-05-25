import { useEffect, useState } from 'react'

export function useCountdown(duration: number, active: boolean, onExpire?: () => void, resetKey?: number): number {
  const [timeLeft, setTimeLeft] = useState(duration)

  // Reset only when a new round starts (resetKey changes), not on every pause/resume
  useEffect(() => {
    setTimeLeft(duration)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey])

  useEffect(() => {
    if (!active) return
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(id); onExpire?.(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [active])

  return timeLeft
}
