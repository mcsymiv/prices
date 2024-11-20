import { Page, Locator } from '@playwright/test';
import { Base, IBase } from '@pom/base.page';
import { INavbar, Navbar } from '@components/navbar.compoment';
import { attr } from '@util/attr';

interface IHome extends IBase {
  page: Page
  logo: Locator
  loading: Locator
  navbar: INavbar
}

class Home extends Base implements IHome {

  get logo(): Locator {
    return this.page.getByLabel('Homepage');
  }

  get loading(): Locator {
    return this.page.getByText('Loading...');
  }

  get navbar(): INavbar {
    return new Navbar(this.page.locator(attr('class', 'header_root', '*')));
  } 

  async open(): Promise<void> {
    await super.open('')
  }
}

export { Home, IHome }
