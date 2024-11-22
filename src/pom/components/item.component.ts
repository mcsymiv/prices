import { Locator } from '@playwright/test';
import { Component, IComponent } from '@pom/base.page';

interface Item extends IComponent {
  name: string 
  price: Locator
  original: Locator 
}

class ItemResult extends Component implements Item {
  _name: string

  constructor(name: string, comp: Locator) {
    super(comp)
    this._name = name
  }

  get name(): string {
    return this._name;
  }

  get price(): Locator {
    return this.component.locator('[class="product-price__top"] span').first()
  }

  get original(): Locator {
    return this.component.locator('[class="product-price__bottom"] span').first()
  }

}

export { Item, ItemResult }
