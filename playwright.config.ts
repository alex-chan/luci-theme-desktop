import * as path from 'path';
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const authFile = path.join(process.cwd(), 'playwright', '.auth', 'user.json');

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://lede';
const luciUser = process.env.LUCI_USER ?? 'root';
const luciPassword = process.env.LUCI_PASSWORD ?? '';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  globalTimeout: 120_000,
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
    ...(luciPassword
      ? {
          httpCredentials: {
            username: luciUser,
            password: luciPassword,
          },
        }
      : {}),
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: authFile },
      dependencies: ['setup'],
      testIgnore: /.*\.setup\.ts/,
    },
  ],
  globalSetup: './e2e/global-setup.ts',
});
