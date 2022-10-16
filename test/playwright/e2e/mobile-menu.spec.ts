import { test, expect } from '@playwright/test'

import {
  closeFilters,
  closeMobileMenu,
  enableNewHeader,
  goToSearchTerm,
  isMobileMenuOpen,
  openContentTypes,
  openFilters,
} from '~~/test/playwright/utils/navigation'

const mockUaString =
  'Mozilla/5.0 (Android 7.0; Mobile; rv:54.0) Gecko/54.0 Firefox/54.0'
const mobileFixture = {
  viewport: { width: 640, height: 700 },
  userAgent: mockUaString,
}

test.describe.configure({ mode: 'parallel' })

test.describe('Mobile menu', () => {
  test.use(mobileFixture)
  test.beforeEach(async ({ page }) => {
    await enableNewHeader(page)
  })

  test('Can open filters menu on mobile at least twice', async ({ page }) => {
    await page.goto('/search/?q=cat')

    await openFilters(page)
    expect(await isMobileMenuOpen(page)).toBe(true)
    await closeFilters(page)

    await openFilters(page)
    expect(await isMobileMenuOpen(page)).toBe(true)
    await closeFilters(page)
    expect(await isMobileMenuOpen(page)).toBe(false)
  })

  test('Can open mobile menu at least twice', async ({ page }) => {
    await goToSearchTerm(page, 'cat')
    await openContentTypes(page)
    expect(await isMobileMenuOpen(page)).toBe(true)
    await closeMobileMenu(page)

    await openContentTypes(page)
    expect(await isMobileMenuOpen(page)).toBe(true)
    await closeMobileMenu(page)
    expect(await isMobileMenuOpen(page)).toBe(false)
  })
})
