'use client'

import { useEffect, useState } from 'react'

export function RealTimeClock() {
  const [time, setTime] = useState<Date | null>(null)

  useEffect(() => {
    setTime(new Date())
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!time) return null

  return (
    <time 
      className="text-xs sm:text-sm font-medium tracking-widest text-muted-foreground/80 tabular-nums" 
      suppressHydrationWarning
    >
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
    </time>
  )
}
