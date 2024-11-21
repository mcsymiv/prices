import { clearAllureResults, clearDir } from '@lib/fs';
import { test as setup } from '@playwright/test';
import { config } from 'config';

setup('Delete reporting', async ({}) => {
  const paths: string[] = [ 
    config.downloads,
    config.playwrightReport,
  ];
  for (const dir of paths) {
    await clearDir(dir)
  }

  await clearAllureResults();
});
