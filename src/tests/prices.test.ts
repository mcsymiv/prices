import 'dotenv/config'
import test from '@lib/fixture'
import { expect } from '@playwright/test'
import { IProduct } from '@pom/components/item.component'
import { Item } from 'src/data/prices'
import pg from 'pg';
import { comparePrices } from '@util/prices'

let collected: Item[] = []
let saved: Item[] = []

const conString = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB_NAME}`
const client = new pg.Client(conString);

test.beforeAll('connect to db', async () => {
  await client.connect();
})

test('prices', async ({ result }) => {
  await result.open()
  await expect(result.header).toBeVisible()
  const products: IProduct[] = await result.products()

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
  const query = await client.query(`select * from ${process.env.POSTGRES_DB_NAME}`)
  saved = query.rows

  if (saved.length === 0) {

    // write new
    await client.query(
      `
      insert into ${process.env.POSTGRES_DB_NAME} (name, regular, promo)
      select name, regular, promo from json_populate_recordset(null::prices, '${[JSON.stringify(collected)]}'); 
      `,
    );

  } else {

    const newPrices: Item[] = await comparePrices(saved, collected)

    for (const item of newPrices) {
      if (item.changed) {
        await client.query(
          `
          update ${process.env.POSTGRES_DB_NAME} set regular = $1, promo = $2 where name = $3; 
          `,
          [item.regular, item.promo, item.name]
        );

      }
    }

  }

})

test.afterAll('close db', async () => {
  await client.end();
})
