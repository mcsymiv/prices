import { Locator, Page } from '@playwright/test';
import { Base, IBase } from '@pom/base.page';
import { Item, ItemResult } from '@components/item.component';

interface IResult extends IBase {
  page: Page

  header: Locator

  products(): Promise<Item[]> 
}

class Result extends Base implements IResult {

  get header(): Locator {
    return this.page.getByRole('heading', { name: 'Пошук: Coca-Cola' })
  }

  async products(): Promise<Item[]> {
    const items: Item[] = []
    const itemNames: string[] = [
      'Напій 2 л Coca-Cola безалкoгoльний сильнoгазoваний',
      'Напій 1 л Coca-Cola безалкoгoльний сильнoгазoваний',
      'Напій 0,5 л Coca-Cola безалкoгoльний сильнoгазoваний',
      'Напій 250 мл Coca-Cola безалкогольний сильногазований ',
      'Нaпій 1 л Coca-Cola Zero бeзaлкoгoльний сильнoгaзoвaний ПЕТ',
      'Нaпій 2л Coca-Cola Zero бeзaлкoгoльний сильнoгaзoвaний ПЕТ',
      'Напій 0,5 л Coca-Cola Zero безалкoгoльний сильнoгазoваний',
      'Напій 250 мл Coca Cola plus coffee безалкогольний сильногазований',
    ]

    for (const item of itemNames) {
      const product: Locator = this.page.locator('[class*="catalog-item"]').filter({ hasText: item })
      items.push(new ItemResult(item, product))
    }

    return items
  }

  async open(): Promise<void> {
    await super.open('')
  }
}

export { Result, IResult }
