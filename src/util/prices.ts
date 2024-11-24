import { Price } from "src/data/prices"

export function calculateDiff(
  price: number,
  originalPrice: number
): number {
  let diff: number = 0

  if (price && originalPrice) {
    if (originalPrice === 0) return 0
    diff = (price / originalPrice) - 1
  }

  return parseFloat(diff.toFixed(2))
}

export function comparePrices(prev: Price[], next: Price[]): Price[] {
  let updatedPrices: Price[] = []

  let oldPrices: { [key:string]: Price } = {}
  let newPrices: { [key:string]: Price } = {}

  for (const item of prev) {
    oldPrices[item.name] = { name: item.name, previous: +item.previous, price: +item.price, original: +item.original } // postgres decimals return as strings
  }

  for (const item of next) {
    newPrices[item.name] = { name: item.name, previous: +item.previous, price: item.price, original: item.original }
  }

  // compare prices
  for (const name in oldPrices) {
    const p: Price = newPrices[name]
    // either price changed, or no more discount
    if (oldPrices[name].price !== newPrices[name].price) {
      p.difference = calculateDiff(newPrices[name].price, newPrices[name].original)
      p.prevDifference = calculateDiff(oldPrices[name].price, newPrices[name].price)
      p.previous = oldPrices[name].price
      p.changed = true

      updatedPrices.push(p)
    } else {
      updatedPrices.push(p)
    }
  }

  return updatedPrices
}
