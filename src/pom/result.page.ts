import { Locator, Page } from '@playwright/test';
import { Base, IBase } from '@pom/base.page';
import { IProduct, Product } from '@components/item.component';

interface IResult extends IBase {
  page: Page

  header: Locator

  products(itemNames: string[]): Promise<IProduct[]> 
}

class Result extends Base implements IResult {

  get header(): Locator {
    return this.page.getByRole('heading', { name: 'Пошук: Coca-Cola' })
  }

  async products(itemNames: string[]): Promise<IProduct[]> {
    const items: Product[] = []

    for (const item of itemNames) {
      const product: Locator = this.page.locator('[class*="catalog-item"]').filter({ hasText: item })
      items.push(new Product(item, product))
    }

    return items
  }

  async open(): Promise<void> {
    await super.open('')
  }
}

export { Result, IResult }
