import { Locator } from '@playwright/test';
import { Component, IComponent } from '@pom/base.page';
import { ISearch, Search } from './search.component';

interface INavbar extends IComponent {
  logo: Locator

  search: ISearch 
}

class Navbar extends Component implements INavbar {

  get search(): ISearch {
    return new Search(this.component.getByPlaceholder('Я шукаю'))
  }

  get logo(): Locator {
    return this.component.getByLabel('Homepage');
  }
}

export { Navbar, INavbar }
