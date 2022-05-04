import { test, expect } from '@playwright/test'

import {
  assertCheckboxStatus,
  closeFilters,
  closeMobileMenu,
  openFilters,
  openMobileMenu,
} from '~~/test/playwright/utils/navigation'

const mockUaString =
  'Mozilla/5.0 (Android 7.0; Mobile; rv:54.0) Gecko/54.0 Firefox/54.0'
const mobileFixture = {
  viewport: { width: 640, height: 700 },
  userAgent: mockUaString,
}
test.use(mobileFixture)

test('Can open filters menu on mobile at least twice', async ({ page }) => {
  await page.goto('/search/?q=cat&license_type=commercial')
  const expectedFilter = 'commercial'

  await openFilters(page)
  await assertCheckboxStatus(page, expectedFilter)

  await closeFilters(page)
  await expect(page.locator(`input[type="checkbox"]`)).toHaveCount(0, {
    timeout: 100,
  })

  await openFilters(page)
  await assertCheckboxStatus(page, expectedFilter)
})

test('Can open mobile menu at least twice', async ({ page }) => {
  await page.goto('/search/?q=cat&license_type=commercial')
  await openMobileMenu(page)
  await expect(page.locator(`button:has-text('Close)`)).toBeVisible()
  await closeMobileMenu(page)
  await expect(page.locator(`button:has-text('Close)`)).not.toBeVisible()
  await openMobileMenu(page)
  await expect(page.locator(`button:has-text('Close)`)).toBeVisible()
})
