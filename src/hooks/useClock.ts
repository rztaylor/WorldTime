import { useEffect, useState } from 'react'

export function useClock() {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const update = () => setNow(Date.now())
    let interval: number | undefined
    const timeout = window.setTimeout(() => {
      update()
      interval = window.setInterval(update, 30_000)
    }, 30_000 - (Date.now() % 30_000))
    return () => {
      window.clearTimeout(timeout)
      if (interval) window.clearInterval(interval)
    }
  }, [])

  return now
}
