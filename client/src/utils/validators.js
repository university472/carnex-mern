import { z } from 'zod'

export const numberFromString = (schema) =>
  z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) {
      return undefined
    }

    if (typeof val === 'string') {
      const num = Number(val)
      return Number.isNaN(num) ? val : num
    }

    return val
  }, schema)