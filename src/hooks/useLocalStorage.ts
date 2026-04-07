import { useCallback, useEffect, useState } from 'react'

type SetValue<T> = (value: T | ((prev: T) => T)) => void

export const useLocalStorage = <T,>(
  key: string,
  initialValue: T,
): [T, SetValue<T>] => {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const stored = window.localStorage.getItem(key)
      if (stored) {
        return JSON.parse(stored) as T
      }
    } catch {
      // ignore parse errors
    }

    return initialValue
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // ignore write errors
    }
  }, [key, state])

  const setValue: SetValue<T> = useCallback(
    (value) => {
      setState((prev) => {
        const next =
          typeof value === 'function' ? (value as (prevState: T) => T)(prev) : value
        return next
      })
    },
    [setState],
  )

  return [state, setValue]
}
