import test from '@lib/fixture'
import { expect } from '@playwright/test'
import { Item } from '@pom/components/item.component'
import { prices } from 'src/data/prices'

test('Collect prices', async ({ home, result }) => {

  await home.open()
  await expect(result.header).toBeVisible()
  const items: Item[] = await result.items()
  for (const item of items) {
    let discount: string | null | undefined = ''
    const price: string | null = await item.price.textContent()
    if (await item.discount.isVisible()) {
      discount = await item.discount.textContent()
    }
    prices.push({
      name: '',
      price,
      discount
    });
  }

  console.log(prices)
})