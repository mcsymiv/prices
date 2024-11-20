import { Locator } from '@playwright/test';
import { Component, IComponent } from '@pom/base.page';

interface Item extends IComponent {
  price: Locator
  discount: Locator 
}

class ItemResult extends Component implements Item {

  get price(): Locator {
    return this.component.locator('[class="product-price__top"] span').first()
  }

  get discount(): Locator {
    return this.component.locator('[class="product-price__bottom"] span').first()
  }

}

export { Item, ItemResult }
