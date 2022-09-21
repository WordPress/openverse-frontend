import { test, expect } from '@playwright/test'

import {
  enableNewHeader,
  scrollToBottom,
  t,
} from '~~/test/playwright/utils/navigation'

test.use({
  viewport: { width: 640, height: 600 },
})

test('can open and close the modal on md breakpoint', async ({ page }) => {
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

test('the modal locks the scroll on md breakpoint', async ({ page }) => {
  await enableNewHeader(page)

  await page.goto('/about')
  const menuAriaLabel = t('header.aria.menu')

  await scrollToBottom(page)
  await page.locator(`[aria-label="${menuAriaLabel}"]`).click()
  await page.locator('div[role="dialog"] >> [aria-label="Close"]').click()

  const scrollPosition = await page.evaluate(() => window.scrollY)
  expect(scrollPosition).toBeGreaterThan(100)
})
