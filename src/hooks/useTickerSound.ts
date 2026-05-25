import { useEffect, useRef } from 'react'

function playTick(ctx: AudioContext) {
  if (ctx.state === 'suspended') ctx.resume()
  const bufferSize = Math.floor(ctx.sampleRate * 0.018)
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    // White noise with linear decay
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
  }
  const source = ctx.createBufferSource()
  source.buffer = buffer
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 900
  filter.Q.value = 1.2
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.45, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.018)
  source.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  source.start(ctx.currentTime)
}

// Ticks in sync with GameTimer. Gets faster as timeLeft decreases — interval doubles every 10s band:
// timeLeft 1–10  →  250 ms (4 ticks/sec)  fastest
// timeLeft 11–20 →  500 ms (2 ticks/sec)
// timeLeft 21–30 → 1000 ms (1 tick/sec)
// timeLeft 31+   → 1000 ms (capped)
export function useTickerSound(timeLeft: number, active: boolean) {
  const ctxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    ctxRef.current = new AudioContext()
    return () => { ctxRef.current?.close() }
  }, [])

  useEffect(() => {
    if (!active || timeLeft <= 0) return
    const ctx = ctxRef.current
    if (!ctx) return

    const step = Math.floor((timeLeft - 1) / 10)        // 0 for last 10s, 1 for 11-20s, …
    const intervalMs = Math.min(1000, 250 * Math.pow(2, step))  // 250, 500, 1000, 1000, …
    const ticks = Math.round(1000 / intervalMs)          // 4, 2, 1, 1, …

    playTick(ctx)
    const timeouts: ReturnType<typeof setTimeout>[] = []
    for (let i = 1; i < ticks; i++) {
      timeouts.push(setTimeout(() => playTick(ctx), i * intervalMs))
    }
    return () => timeouts.forEach(clearTimeout)
  }, [timeLeft, active])
}
