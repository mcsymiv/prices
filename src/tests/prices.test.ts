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

test.skip('insert new product prices', async ({ result }) => {
  const name: string = 'Jaffa'
  await result.open(name)
  await expect(result.header(`Пошук: ${name}`)).toBeVisible()

  const productNames: string[] = await client.getProductsName()
  const filteredProducts = productNames.filter(n => n.includes(name))
  const products: IProduct[] = await result.products(filteredProducts)

  const collected: Item[] = await result.collect(products)

  await client.insertPrices(collected)
})

test('compare Coca-Cola prices', async ({ result }) => {
  const name: string = 'Coca-Cola'
  await result.open(name)
  await expect(result.header(`Пошук: ${name}`)).toBeVisible()

  const productNames: string[] = await client.getProductsName()
  const filteredProducts = productNames.filter(n => n.includes(name))
  const products: IProduct[] = await result.products(filteredProducts)

  const collected: Item[] = await result.collect(products)
  const saved: Item[] = await client.getSavedProducts()
  const savedProducts = saved.filter(n => n.name.includes(name))

  const newPrices: Item[] = await comparePrices(savedProducts, collected)
  await client.updatePrices(newPrices)
})

test.only('compare Jaffa prices', async ({ result }) => {
  const name: string = 'Jaffa'
  await result.open(name)
  await expect(result.header(`Пошук: ${name}`)).toBeVisible()

  const productNames: string[] = await client.getProductsName()
  const filteredProducts = productNames.filter(n => n.includes(name))
  const products: IProduct[] = await result.products(filteredProducts)

  const collected: Item[] = await result.collect(products)
  const saved: Item[] = await client.getSavedProducts()
  const savedProducts = saved.filter(n => n.name.includes(name))

  const newPrices: Item[] = await comparePrices(savedProducts, collected)
  await client.updatePrices(newPrices)
})

test.afterAll('close db', async () => {
  // await client.pool.end();
})
