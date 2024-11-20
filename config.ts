import appRootPath from 'app-root-path'

const waitTimeout: number = process.env.timeout ? Number(process.env.timeout) : 20000;

export const config = {

  // testdrive paths
  baseUrl: 'https://www.atbmarket.com/',

  // timeouts
  timeout: process.env.testTimeout ? Number(process.env.testTimeout) : (1000 * 60),
  waitForElement: waitTimeout,
  waitForDouble: waitTimeout * 2,
  waitForHalf: waitTimeout / 2,
  waitTimeoutFactor: 2,
  expectTimeout: waitTimeout,

  // playwright
  workers: process.env.workers ? Number(process.env.workers) : 5,
  retries: process.env.retries ? Number(process.env.retries) : 0,
  forbidOnly: !!process.env.forbidOnly,
  testDir: process.env.testDir || `${appRootPath.path}/src/tests`,

  downloads: `${appRootPath.path}/downloads`,
  allure: `${appRootPath.path}/allure-results`,
  htmlReport: `${appRootPath.path}/html-report`,
  playwrightReport: `${appRootPath.path}/playwright-report`,

  setup: `${appRootPath.path}/src/setup`,
  teardown: `${appRootPath.path}/src/teardown`,
}
