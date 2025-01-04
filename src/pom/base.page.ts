import { Locator, Page } from '@playwright/test';
import { IProduct } from '@pom/components/item.component'
import { Item } from 'src/data/prices'
import { config } from 'config';

export interface IComponent {
  component: Locator
}

export abstract class Component implements IComponent {
  public readonly component: Locator;
  constructor(component: Locator) {
    this.component = component;
  }
}

export interface IBase {
  open(url: string): Promise<void>
  collect(products: IProduct[]): Promise<Item[]>
}

export abstract class Base implements IBase {
  public readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(url: string): Promise<void> {
    await this.page.goto(config.baseUrl + url);
  }

  async collect(products: IProduct[]): Promise<Item[]> {

    let collected: Item[] = []
        
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

    return collected
  }
}

export interface ILogin extends IBase {
  page: Page
}

export abstract class Login extends Base {
  public readonly page: Page;

  constructor(page: Page) {
    super(page)
    this.page = page;
  }

}
