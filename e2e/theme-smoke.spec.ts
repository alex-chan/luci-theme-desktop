import { test, expect } from '@playwright/test';

test.describe('luci-theme-desktop on device', () => {
  test('desktop shell renders after login', async ({ page }) => {
    await page.goto('/cgi-bin/luci/admin', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.status-bar')).toBeVisible();
    await expect(page.locator('.desktop-grid')).toBeVisible();
  });

  test('theme static assets load', async ({ page }) => {
    const res = await page.goto('/luci-static/desktop/css/cascade.css', {
      waitUntil: 'domcontentloaded',
    });
    expect(res?.ok()).toBeTruthy();
  });
});
