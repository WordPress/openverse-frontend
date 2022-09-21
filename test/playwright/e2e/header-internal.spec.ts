import { test, expect } from '@playwright/test'

import { enableNewHeader, t } from '~~/test/playwright/utils/navigation'

test.use({
  viewport: { width: 640, height: 700 },
})

test('can open a modal on md breakpoint', async ({ page }) => {
  await enableNewHeader(page)

  await page.goto('/about')
  const menuAriaLabel = t('header.aria.menu')

  await page.locator(`[aria-label="${menuAriaLabel}"]`).click()
  await expect(page.locator('[role="dialog"]')).toBeVisible()
  await expect(
    page.locator('div[role="dialog"] >> [aria-current="page"]')
  ).toBeVisible()
  await expect(
    page.locator('div[role="dialog"] >> [aria-current="page"]')
  ).toHaveText('About')

  await page.locator('div[role="dialog"] >> [aria-label="Close"]').click()
  await expect(page.locator(`[aria-label="${menuAriaLabel}"]`)).toBeVisible()
})
