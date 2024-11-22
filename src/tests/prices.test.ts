import 'dotenv/config'
import test from '@lib/fixture'
import { expect } from '@playwright/test'
import { Item } from '@pom/components/item.component'
import { Price } from 'src/data/prices'
import pg from 'pg';

let prices: Price[] = []
const conString = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB_NAME}`
const client = new pg.Client(conString);

test.beforeAll('', async () => {
  await client.connect();
})

test('Collect prices', async ({ result }) => {
  await result.open()
  await expect(result.header).toBeVisible()
  const items: Item[] = await result.products()

  for (const item of items) {
    let difference: number = 0
    let originalPrice: number = 0
    let price: number = 0

    const priceRaw: string | null = await item.price.textContent()
    if (priceRaw) {
      price = parseFloat(priceRaw)
    }

    if (await item.originalPrice.isVisible()) {
      const originalPriceRaw: string | null = await item.originalPrice.textContent()
      if (originalPriceRaw) {
        originalPrice = parseFloat(originalPriceRaw)
      }
    }

    prices.push({
      name: item.name,
      price,
      originalPrice,
      difference, 
    });
  }
})

test.afterAll('', async ({}, testInfo) => {
  if (testInfo.errors.length === 0) {

    // get existing prices
    const query = await client.query(`select * from ${process.env.POSTGRES_DB_NAME}`)
    console.log(query.rows);

    if (false) {
      // compare prices

      // write new if changed
      await client.query(
        `
        insert into ${process.env.POSTGRES_DB_NAME} (name, price, original_price, difference)
        select name, price, original_price, difference from json_populate_recordset(null::prices, '${[JSON.stringify(prices)]}'); 
        `,
      );
    }

  }
  await client.end();
})
