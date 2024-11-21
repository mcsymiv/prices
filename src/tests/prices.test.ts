import test from '@lib/fixture'
import { expect } from '@playwright/test'
import { Item } from '@pom/components/item.component'
import { Price } from 'src/data/prices'

let prices: Price[] = []

test.beforeAll('', async () => {
  console.log(prices)
})

test('Collect prices', async ({ result }) => {
  await result.open()
  await expect(result.header).toBeVisible()
  const items: Item[] = await result.items()

  for (const item of items) {
    let discount: string | null | undefined = ''
    const price: string | null = await item.price.textContent()
    const name: string | null = await item.name.textContent()

    if (await item.discount.isVisible()) {
      discount = await item.discount.textContent()
    }

    prices.push({
      name,
      price,
      discount
    });
  }
})

test.afterAll('', async () => {
  console.log(prices)
})