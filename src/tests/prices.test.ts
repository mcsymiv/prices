import test from '@lib/fixture'
import { expect } from '@playwright/test'
import { Item } from '@pom/components/item.component'
import { Price } from 'src/data/prices'
import pg from 'pg';

let prices: Price[] = []
const conString = `postgres://${process.env.user}:${process.env.password}@${process.env.host}:${process.env.port}/${process.env.dbname}`
const client = new pg.Client(conString);

test.beforeAll('', async () => {
  await client.connect();
})

test('Collect prices', async ({ result }) => {
  await result.open()
  await expect(result.header).toBeVisible()
  const items: Item[] = await result.items()

  for (const item of items) {
    let discounted: string | null | undefined = ''
    let price: string | null | undefined = ''
    const name: string | null = await item.name.textContent()

    if (await item.discounted.isVisible()) {
      price = await item.discounted.textContent()
    } else {
      price = await item.price.textContent()
    }

    prices.push({
      name,
      price,
      discounted, 
    });
  }
})

test.afterAll('', async () => {
  const query = await client.query("select * from product;");
  console.log(query.rows);
  await client.end();
})
