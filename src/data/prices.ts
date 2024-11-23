export type Price = {
  name: string
  price: number
  original: number
  difference?: number
  changed?: boolean
}

export const prices: Price[] = []
