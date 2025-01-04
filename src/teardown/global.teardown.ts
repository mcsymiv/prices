import { MyBot, Telegram } from '@lib/telegram';
import { test as teardown } from '@playwright/test'
import appRootPath from 'app-root-path'
import path from 'path';
import fs from "node:fs";

teardown('teardown', async ({ page }) => {
  await page.goto(`file://${appRootPath.path}/html-report/index.html`)

  const imagePath = path.join(appRootPath.path, 'src', 'images', 'report.png')
  await page.screenshot({ path: imagePath })

  if (!fs.existsSync(imagePath)) {
    await page.waitForTimeout(5000)
  }

  const bot: MyBot = new Telegram()
  await bot.sendPhoto(imagePath)
});
