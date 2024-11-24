import { Locator } from '@playwright/test';
import { Component, IComponent } from '@pom/base.page';

interface IProduct extends IComponent {
  name: string 
  sale: Locator
  price: Locator
  original: Locator 
}

class Product extends Component implements IProduct {
  _name: string

  constructor(name: string, comp: Locator) {
    super(comp)
    this._name = name
  }

  get name(): string {
    return this._name;
  }

  get sale(): Locator {
    return this.component.locator('[class*="product-price--sale"] span').first()
  }

  get price(): Locator {
    return this.component.locator('[class="product-price__top"] span').first()
  }

  get original(): Locator {
    return this.component.locator('[class="product-price__bottom"] span').first()
  }

}

export { Product, IProduct }
