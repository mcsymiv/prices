import 'dotenv/config'
import test from '@lib/fixture'
import { expect } from '@playwright/test'
import { Item } from '@pom/components/item.component'
import { Price } from 'src/data/prices'
import pg from 'pg';
import { calculateDiff, comparePrices } from '@util/prices'

let collected: Price[] = []
let saved: Price[] = []

const conString = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB_NAME}`
const client = new pg.Client(conString);

test.beforeAll('connect to db', async () => {
  await client.connect();
})

test('prices', async ({ result }) => {
  await result.open()
  await expect(result.header).toBeVisible()
  const items: Item[] = await result.products()

  for (const item of items) {
    let original: number = 0
    let price: number = 0
    let previous: number = 0

    const priceRaw: string | null = await item.price.textContent()
    if (priceRaw) {
      price = parseFloat(priceRaw)
    }

    if (await item.original.isVisible()) {
      const originalPriceRaw: string | null = await item.original.textContent()
      if (originalPriceRaw) {
        original = parseFloat(originalPriceRaw)
      }
    }

    collected.push({
      name: item.name,
      previous,
      price,
      original,
      difference: calculateDiff(price, original),
    })
  }

  // get existing prices
  const query = await client.query(`select * from ${process.env.POSTGRES_DB_NAME}`)
  saved = query.rows

  if (saved.length === 0) {

    // write new
    await client.query(
      `
      insert into ${process.env.POSTGRES_DB_NAME} (name, previous, price, original, difference)
      select name, previous, price, original, difference from json_populate_recordset(null::prices, '${[JSON.stringify(collected)]}'); 
      `,
    );

  } else {

    const newPrices: Price[] = comparePrices(saved, collected)

    for (const item of newPrices) {
      if (item.changed) {
        await client.query(
          `
          update ${process.env.POSTGRES_DB_NAME} set previous = $1, price = $2, original = $3, difference = $4, prevDifference = $5 where name = $6; 
          `,
          [item.previous, item.price, item.original, item.difference, item.prevDifference, item.name]
        );
      }
    }

  }
})

test.afterAll('close db', async () => {
  await client.end();
})
