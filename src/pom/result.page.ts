import { Locator, Page } from '@playwright/test';
import { Base, IBase } from '@pom/base.page';
import { Item, ItemResult } from '@components/item.component';

interface IResult extends IBase {
  page: Page

  header: Locator

  items(): Promise<Item[]> 
}

class Result extends Base implements IResult {

  get header(): Locator {
    return this.page.getByRole('heading', { name: 'Пошук: Coca-Cola' })
  }

  async items(): Promise<Item[]> {
    const items: Item[] = []
    const resultBlock: Locator[] = await this.page.locator('article[class*="catalog-item"]').all()
    for (const item of resultBlock) {
      items.push(new ItemResult(item))
    }

    return items
  }

  async open(): Promise<void> {
    await super.open('')
  }
}

export { Result, IResult }
