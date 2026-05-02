import * as fs from 'fs';
import * as path from 'path';
import { test as setup, expect } from '@playwright/test';

const authFile = path.join(process.cwd(), 'playwright', '.auth', 'user.json');

setup('authenticate LuCI', async ({ page }) => {
  const user = process.env.LUCI_USER ?? 'root';
  const pass = process.env.LUCI_PASSWORD;
  if (!pass) {
    throw new Error(
      'LUCI_PASSWORD is required. Copy .env.example to .env or export LUCI_PASSWORD.',
    );
  }

  await page.goto('/cgi-bin/luci', { waitUntil: 'domcontentloaded' });

  const passwordInput = page.locator('input[name="luci_password"]');
  const hasForm = await passwordInput
    .isVisible({ timeout: 15_000 })
    .catch(() => false);

  if (hasForm) {
    await page.locator('input[name="luci_username"]').fill(user);
    await passwordInput.fill(pass);
    // Desktop theme (sysauth.ut): <button type="submit" class="login-btn">.
    // Stock LuCI: <input type="submit" class="cbi-button-apply" />.
    await page
      .locator(
        'form button[type="submit"], input.cbi-button-apply[type="submit"]',
      )
      .first()
      .click();
  }

  await expect(page.locator('.status-bar')).toBeVisible({ timeout: 45_000 });

  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
});
