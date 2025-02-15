import { MyBot, Telegram } from "@lib/telegram"
import { Item } from "src/data/prices"

export function calculateDiff(
  price: number,
  newPrice: number
): number {
  let diff: number = 0

  if (price && newPrice) {
    if (newPrice === 0) return 0
    diff = (price / newPrice) - 1
  }

  return parseFloat(diff.toFixed(4))
}

export async function comparePrices(prev: Item[], next: Item[]): Promise<Item[]> {
  let updatedPrices: Item[] = []

  let oldItems: { [key:string]: Item } = {}
  let newItems: { [key:string]: Item } = {}

  for (const item of prev) {
    oldItems[item.name] = { 
      name: item.name, 
      regular: +item.regular, 
      promo: +item.promo,
    } // postgres decimals return as strings
  }

  for (const item of next) {
    newItems[item.name] = {
      name: item.name, 
      regular: item.regular, 
      promo: item.promo,
    }
  }

  const bot: MyBot = new Telegram()

  for (const name in oldItems) {
    const item: Item = newItems[name]

    if (oldItems[name].promo === 0 && newItems[name].promo !== 0 && (oldItems[name].regular !== newItems[name].regular)) {
      // product is in promo with regular price change

      const diff: number = calculateDiff(newItems[name].promo, newItems[name].regular)
      await bot.send(`Продукт "${item.name}" зайшов у промо "${diff}", змінивши регулярну ціну. Попередня: ${oldItems[name].regular}. Тепер: ${newItems[name].regular}`)
      updatedPrices.push(item)

    } else if (oldItems[name].promo !== 0 && newItems[name].promo === 0 && (oldItems[name].regular === newItems[name].regular)) {
      // product is out of promo without price change

      await bot.send(`Продукт "${item.name}" вийшов з промо, без зміни регулярної ціни: ${newItems[name].regular}. Попереднє промо: ${oldItems[name].promo}`)
      updatedPrices.push(item)
    } else if (oldItems[name].promo !== 0 && newItems[name].promo === 0 && (oldItems[name].regular !== newItems[name].regular) ) {
      // product is out of promo with price change

      await bot.send(`Продукт "${item.name}" вийшов з промо змінивши регулярну ціну: ${newItems[name].regular}`)
      updatedPrices.push(item)

    } else if (oldItems[name].promo !== newItems[name].promo) {
      // product promo price changed

      const diff: number = calculateDiff(newItems[name].promo, oldItems[name].regular)
      await bot.send(`Продукт "${item.name}" зайшов у промо: ${diff}. Попередня: ${oldItems[name].regular}. Тепер: ${newItems[name].promo}`)
      updatedPrices.push(item)

    } else if (oldItems[name].regular !== newItems[name].regular) {
      // product regular price changed

      const diff: number = calculateDiff(newItems[name].regular, oldItems[name].regular)
      const displayDiff: number = Math.abs(diff * 100)
      await bot.send(`Продукт "${item.name}" змінив регулярну ціну на ${displayDiff}%. Попередня: ${oldItems[name].regular}. Тепер: ${newItems[name].regular}`)
      updatedPrices.push(item)
    } else if (oldItems[name].promo === 0 && newItems[name].promo !== 0) {

      const diff: number = calculateDiff(newItems[name].promo, newItems[name].regular)
      await bot.send(`Продукт "${item.name}" зайшов у промо "${diff}"`)
      updatedPrices.push(item)

    }

  }

  return updatedPrices
}
