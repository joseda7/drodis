import { useEffect, useState } from 'react'

export function useCountdown(duration: number, active: boolean): number {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    if (!active) return          // going inactive: stop interval, do NOT reset
    setTimeLeft(duration)        // going active: reset then start
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(id); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [active, duration])

  return timeLeft
}
