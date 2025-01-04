import 'dotenv/config'
import test from '@lib/fixture'
import { expect } from '@playwright/test'
import { IProduct } from '@pom/components/item.component'
import { Item } from 'src/data/prices'
import { comparePrices } from '@util/prices'
import { DB } from '@lib/db'

let client: DB

test.beforeAll('connect to db', async () => {
  client = new DB()
  await client.pool.connect();
})

test('compare Coca-Cola prices', async ({ result }) => {
  await result.open('Coca-Cola')
  await expect(result.header('Пошук: Coca-Cola')).toBeVisible()

  const productNames: string[] = await client.getProductsName()
  const products: IProduct[] = await result.products(productNames)

  const collected: Item[] = await result.collect(products)

  const saved = await client.getSavedProducts()

  if (saved.every(p => p.regular === 0)) {
    await client.insertPrices(collected)
  } else {
    const newPrices: Item[] = await comparePrices(saved, collected)
    await client.insertPrices(newPrices)
  }
})

test.afterAll('close db', async () => {
  // await client.pool.end();
})
