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
  const name: string = 'Coca-Cola'
  await result.open(name)
  await expect(result.header(`Пошук: ${name}`)).toBeVisible()

  const productNames: string[] = await client.getProductsName()
  const filteredProducts = productNames.filter(n => n.includes(name))
  const products: IProduct[] = await result.products(filteredProducts)

  const collected: Item[] = await result.collect(products)
  const saved: Item[] = await client.getSavedProducts(name)

  if (saved.every(p => p.regular === 0)) {
    await client.insertPrices(collected)
  } else {
    const newPrices: Item[] = await comparePrices(saved, collected)
    await client.updatePrices(newPrices)
  }
})

test('compare Jaffa prices', async ({ result }) => {
  const name: string = 'Jaffa'
  await result.open(name)
  await expect(result.header(`Пошук: ${name}`)).toBeVisible()

  const productNames: string[] = await client.getProductsName()
  const filteredProducts = productNames.filter(n => n.includes(name))
  const products: IProduct[] = await result.products(filteredProducts)

  const collected: Item[] = await result.collect(products)
  const saved: Item[] = await client.getSavedProducts(name)

  if (saved.every(p => p.regular === 0)) {
    await client.insertPrices(collected)
  } else {
    const newPrices: Item[] = await comparePrices(saved, collected)
    await client.updatePrices(newPrices)
  }
})

test.afterAll('close db', async () => {
  // await client.pool.end();
})
