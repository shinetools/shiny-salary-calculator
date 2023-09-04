import { useRouter } from "next/router"
import { formatISO, isValid, parseISO } from "date-fns"

const stringifyParam = (param: string | number | boolean | Date | null) => {
  if (typeof param === "string") {
    return param
  }
  if (typeof param === "boolean" || typeof param === "number") {
    return param.toString()
  }
  if (param === null) {
    return "null"
  }
  return formatISO(param, { representation: "date" })
}

const parseParam = (param: string) => {
  if (param === "null") {
    return null
  }

  if (param === "false") {
    return false
  }

  if (param === "true") {
    return true
  }

  const parsedDate = parseISO(param)
  if (isValid(parsedDate)) {
    return parsedDate
  }

  const parsedNumber = Number(param)
  if (!isNaN(parsedNumber)) {
    return parsedNumber
  }

  return param
}

const computeSearchParams = (
  currentSearchParams: Record<string, string>,
  newSearchParams: Record<string, string | number | boolean | Date | null>
) => {
  const params = new URLSearchParams(currentSearchParams)

  for (const [param, value] of Object.entries(newSearchParams)) {
    if (value !== null) {
      params.set(param, stringifyParam(value))
    } else {
      params.delete(param)
    }
  }

  return params
}

export const useHandleSearchParams = () => {
  const router = useRouter()

  const set = (
    input: Record<string, string | number | boolean | Date | null>
  ) => {
    const params = computeSearchParams(
      router.query as Record<string, string>,
      input
    )

    router.replace(`${router.pathname}?${params.toString()}`, undefined, {
      shallow: true,
      scroll: false,
    })
  }

  return {
    get: (paramKey: string) => {
      const paramValue = router.query[paramKey] as string | undefined

      return paramValue ? parseParam(paramValue) : undefined
    },
    set,
  }
}
