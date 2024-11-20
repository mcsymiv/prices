import { defineConfig, devices } from '@playwright/test';
import { config } from './config';
import { platform, arch } from 'os'

export default defineConfig({
  timeout: config.timeout,

  expect: {
    timeout: config.expectTimeout,
    toHaveScreenshot: { 
      maxDiffPixels: 1, 
    },
  },

  fullyParallel: true,
  forbidOnly: config.forbidOnly,
  retries: config.retries, 
  workers: config.workers, 

  reporter: [
    [
      `allure-playwright`,
      {
        detail: false,
        resultsDir: "allure-results",
        suiteTitle: false,

        environmentInfo: {
          OS: platform(),
          Architecture: arch(),
          NodeVersion: process.version,
        },
        // categories: [],
      }
    ], 

    [`html`, { outputFolder: 'html-report', open: 'never' }],
  ],

  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'qsetup',
      testMatch: /global\.setup\.ts/,
      testDir: config.setup,
      teardown: 'qteardown'
    },

    {
      name: 'qlogin',
      use: { 
        baseURL: config.baseUrl, 
        ...devices['Desktop Chrome'], 
        channel: 'chrome',
        headless: true,
        viewport: { width: 1936, height: 1056 },
      },
      testMatch: /login\.setup\.ts/,
      testDir: config.setup,
      dependencies: ['qsetup']
    },

    {
      name: 'prices',
      testDir: config.testDir,
      testMatch: `prices*.ts`,
      use: { 
        ...devices['Desktop Chrome'], 
        channel: 'chrome',
        headless: true,
        viewport: { width: 1936, height: 1056 },
        screenshot: 'only-on-failure',
        acceptDownloads: true,
      },
      grep: /prices/,
      dependencies: ['qsetup', 'qlogin']
    },

    {
      name: 'qteardown',
      testMatch: /global\.teardown\.ts/,
      testDir: config.teardown,
    },
  ],
});
