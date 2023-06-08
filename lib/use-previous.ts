import { useState } from "react"

export const usePrevious = <TValue>(value: TValue) => {
  const [state, setState] = useState<{
    value: TValue
    prev: TValue | null
  }>({
    value: value,
    prev: null,
  })

  const current = state.value

  if (value !== current) {
    setState({
      value: value,
      prev: current,
    })
  }

  return state.prev
}
