import { Locator, Page } from '@playwright/test';
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
  open(url?: string | null | undefined): Promise<void>
}

export abstract class Base implements IBase {
  public readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(url?: string | null | undefined): Promise<void> {
    await this.page.goto(config.baseUrl + url);
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