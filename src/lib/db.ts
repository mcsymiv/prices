import { Pool } from 'pg';
import { Item } from '@data/prices'

// const conString = `${process.env.DB_CONNECT}`
class DB {
  public readonly pool: Pool

  constructor() {
    this.pool = new Pool({
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
    })
  }

  async getProductsName(): Promise<string[]> {
    try {
      const result = await this.pool.query(`select name from ${process.env.DB_TABLE_PRODUCT};`)
      const products: string[] = result.rows.map(row => row.name);
      return products;
    } catch (error) {
      console.error(error);
    }

    return []
  }

  async getProductsId(): Promise<string[]> {
    try {
      const result = await this.pool.query(`select id from ${process.env.DB_TABLE_PRODUCT};`)
      const products: string[] = result.rows.map(row => row.id);
      return products;
    } catch (error) {
      console.error(error);
    }

    return []
  }

  async insertPrices(items: Item[]): Promise<void> {
    try {
      for (const item of items) {
        await this.pool.query(`
          INSERT INTO ${process.env.DB_TABLE_PRICE} (regular, promo, product_id, updated_at)
          VALUES ($1, $2, (SELECT id FROM ${process.env.DB_TABLE_PRODUCT} WHERE name = $3), current_timestamp);
        `, [item.regular, item.promo, item.name]
        )
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getSavedProducts(): Promise<Item[]> {

    try {
      const result = await this.pool.query(`
        SELECT p.name, pr.regular, pr.promo
        FROM product p
        JOIN price pr ON p.id = pr.id;
      `)

      const products = result.rows.map(row => ({
        name: row.name,
        regular: row.regular,
        promo: row.promo,
      } as Item))

      return products
    } catch (error) {
      console.error(error);
    }

    return []
  }
}


export {
  DB
}
