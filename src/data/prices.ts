export type Price = {
  name: string
  price: number
  previous: number
  original: number
  prevDifference?: number
  difference?: number
  changed?: boolean
}

export const prices: Price[] = []
