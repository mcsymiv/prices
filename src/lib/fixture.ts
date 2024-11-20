import { test as baseTest } from '@playwright/test';
import { Home, IHome } from '@pom/home.page';
import { IResult, Result } from '@pom/result.page';

type PagesFixture = {
  home: IHome
  result: IResult
}

const test = baseTest.extend<PagesFixture>({
  home: async ({ page }, use) => await use(new Home(page)),
  result: async ({ page }, use) => await use(new Result(page)),
})

export default test;
