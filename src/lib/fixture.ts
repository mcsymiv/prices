import { test as baseTest } from '@playwright/test';
import { Home, IHome } from '@pom/home.page';

type PagesFixture = {
  home: IHome
}

const test = baseTest.extend<PagesFixture>({
  home: async ({ page }, use) => await use(new Home(page)),
})

export default test;
