import { useEffect, useRef } from 'react'

export function useBeepSound() {
  const ctxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    ctxRef.current = new AudioContext()
    return () => { ctxRef.current?.close() }
  }, [])

  // Stable function ref — safe to call inside effects without adding to deps
  const playBeep = useRef(() => {
    const ctx = ctxRef.current
    if (!ctx) return
    if (ctx.state === 'suspended') ctx.resume()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.35, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.12)
  })

  return playBeep.current
}
