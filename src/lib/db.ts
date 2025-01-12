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

  async updatePrices(items: Item[]): Promise<void> {
    try {
      for (const item of items) {
        await this.pool.query(`
          UPDATE ${process.env.DB_TABLE_PRICE} 
          SET regular = $1, promo = $2, updated_at = current_timestamp
          FROM product
          WHERE price.product_id = product.id AND product.name = '${item.name}'
        `, [item.regular, item.promo]
        )
      }
    } catch (error) {
      console.error(error);
    }
  }

  async insertPrices(items: Item[]): Promise<void> {
    try {
      for (const item of items) {
        await this.pool.query(`
          INSERT INTO ${process.env.DB_TABLE_PRICE} (regular, promo, product_id, updated_at)
          VALUES ($1, $2, (SELECT id FROM product WHERE name = '${item.name}'), current_timestamp);
        `, [item.regular, item.promo]
        )
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getSavedProducts(productName: string): Promise<Item[]> {

    try {
      const result = await this.pool.query(`
        SELECT p.name, pr.regular, pr.promo
        FROM product p
        JOIN price pr ON p.id = pr.id AND p.name LIKE '%' || '${productName}' || '%';
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
