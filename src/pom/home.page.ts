import { Locator, Page } from '@playwright/test';
import { Base, IBase } from '@pom/base.page';
import { INavbar, Navbar } from '@components/navbar.compoment';
import { attr } from '@util/attr';
import { IOverlay, Overlay } from '@components/overlay.component';

interface IHome extends IBase {
  page: Page

  overlay: IOverlay
  navbar: INavbar
  searchInput: Locator 
}

class Home extends Base implements IHome {

  get navbar(): INavbar {
    return new Navbar(this.page.locator(attr('class', 'site-header')));
  } 

  get overlay(): IOverlay {
    return new Overlay(this.page.locator('#promocodePopup').getByRole('document'))
  }

  get searchInput(): Locator {
    return this.page.locator(attr('id', 'q'))
  }

  async open(): Promise<void> {
    await super.open('')
  }
}

export { Home, IHome }
