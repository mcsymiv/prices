import 'dotenv/config'
import test from '@lib/fixture'
import { expect } from '@playwright/test'
import { IProduct } from '@pom/components/item.component'
import { Item } from 'src/data/prices'
import { comparePrices } from '@util/prices'
import { DB } from '@lib/db'

let collected: Item[] = []
let saved: Item[] = []
let client: DB

test.beforeAll('connect to db', async () => {
  client = new DB()
  await client.pool.connect();
})

test.only('test', async ({ result }) => {
  await result.open()
  await expect(result.header).toBeVisible()

  const productNames: string[] = await client.getProductsName()
  const products: IProduct[] = await result.products(productNames)

  for (const product of products) {
    let regular: number = 0
    let promo: number = 0

    if (await product.sale.isVisible()) {
      const priceRaw: string | null = await product.price.textContent()
      if (priceRaw) {
        promo = parseFloat(priceRaw)
      }

      const originalPriceRaw: string | null = await product.original.textContent()
      if (originalPriceRaw) {
        regular = parseFloat(originalPriceRaw) 
      }
      
    } else {
      const priceRaw: string | null = await product.price.textContent()
      if (priceRaw) {
        regular = parseFloat(priceRaw)
      }
    }

    collected.push({
      name: product.name,
      regular,
      promo,
    })
  }

  const saved = await client.getSavedProducts()

  if (saved.every(p => p.regular === 0)) {
    await client.insertPrices(collected)
  } else {
    const newPrices: Item[] = await comparePrices(saved, collected)
    await client.insertPrices(newPrices)
  }
})

test('prices', async ({ result }) => {
  await result.open()
  await expect(result.header).toBeVisible()
  const products: IProduct[] = await result.products([''])

  for (const product of products) {
    let regular: number = 0
    let promo: number = 0

    if (await product.sale.isVisible()) {
      const priceRaw: string | null = await product.price.textContent()
      if (priceRaw) {
        promo = parseFloat(priceRaw)
      }

      const originalPriceRaw: string | null = await product.original.textContent()
      if (originalPriceRaw) {
        regular = parseFloat(originalPriceRaw) 
      }
      
    } else {
      const priceRaw: string | null = await product.price.textContent()
      if (priceRaw) {
        regular = parseFloat(priceRaw)
      }
    }

    collected.push({
      name: product.name,
      regular,
      promo,
    })
  }

  // get existing prices
  const query = await client.pool.query(`select * from ${process.env.DB_PRICE}`)
  saved = query.rows

  if (saved.length === 0) {

    // write new
    await client.pool.query(
      `
      insert into ${process.env.DB_NAME} (name, regular, promo)
      select name, regular, promo from json_populate_recordset(null::prices, '${[JSON.stringify(collected)]}'); 
      `,
    );

  } else {

    const newPrices: Item[] = await comparePrices(saved, collected)

    for (const item of newPrices) {
      if (item.changed) {
        await client.pool.query(
          `
          update ${process.env.DB_PRICE} set regular = $1, promo = $2 where name = $3; 
          `,
          [item.regular, item.promo, item.name]
        );

      }
    }

  }

})

test.afterAll('close db', async () => {
  // await client.pool.end();
})
