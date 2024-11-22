export function calculateDiff(
  price: string | null | undefined,
  originalPrice: string | null | undefined
): string {

  let diff: number = 0

  if (price && originalPrice) {
    const p = parseFloat(price)
    const o = parseFloat(originalPrice)

    diff = (p / o) - 1
  }

  return diff.toFixed(2).toString()
}

