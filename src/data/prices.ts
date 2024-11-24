export type Item = {
  name: string
  regular: number
  promo: number
  changed?: boolean
  difference?: number
}

export type PromoPrice = {
  previousPrice: number
  promoPrice: number
  lastUpdated: string
}

export type RegularPrice = {
  previousPrice: number
  regularPrice: number
  lastUpdated: string
}
