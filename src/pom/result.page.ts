import { Locator, Page } from '@playwright/test';
import { Base, IBase } from '@pom/base.page';
import { IProduct, Product } from '@components/item.component';

interface IResult extends IBase {
  page: Page

  header(name: string): Locator
  open(url: string): Promise<void>
  products(itemNames: string[]): Promise<IProduct[]> 
}

class Result extends Base implements IResult {

  header(name: string): Locator {
    return this.page.getByRole('heading', { name })
  }

  async products(itemNames: string[]): Promise<IProduct[]> {
    const items: Product[] = []

    for (const item of itemNames) {
      const product: Locator = this.page.locator('[class*="catalog-item"]').filter({ hasText: item })
      items.push(new Product(item, product))
    }

    return items
  }

  async open(url: string): Promise<void> {
    await super.open(url)
  }
}

export { Result, IResult }
