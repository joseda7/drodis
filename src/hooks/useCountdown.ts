import { useEffect, useState } from 'react'

export function useCountdown(duration: number, active: boolean, onExpire?: () => void): number {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    if (!active) return
    setTimeLeft(duration)
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(id); onExpire?.(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [active, duration])

  return timeLeft
}
