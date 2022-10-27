import { test } from '@playwright/test'

import breakpoints from '~~/test/playwright/utils/breakpoints'
import { languageDirections } from '~~/test/playwright/utils/navigation'

const headerSelector = '.main-header'
const defaultUrl =
  '/iframe.html?id=components-vheader-vheaderinternal--default-story'
const pageUrl = (dir: typeof languageDirections[number]) =>
  dir === 'ltr' ? defaultUrl : `${defaultUrl}&globals=languageDirection:rtl`

test.describe('VHeaderInternal', () => {
  for (const dir of languageDirections) {
    breakpoints.describeEachDesktopWithMd(({ expectSnapshot }) => {
      test(`desktop-header-internal-${dir}`, async ({ page }) => {
        await page.goto(pageUrl(dir))
        await page.mouse.move(0, 150)
        await expectSnapshot(
          `desktop-header-internal-${dir}`,
          page.locator(headerSelector)
        )
      })
    })
    breakpoints.describeEachMobileWithoutMd(({ expectSnapshot }) => {
      test(`mobile-header-internal-${dir}`, async ({ page }) => {
        await page.goto(pageUrl(dir))
        await page.mouse.move(0, 150)
        await expectSnapshot(
          `mobile-header-internal-${dir}`,
          page.locator(headerSelector)
        )
      })
      test(`mobile-header-internal-modal-${dir}`, async ({ page }) => {
        await page.goto(pageUrl(dir))
        await page.locator('button[aria-haspopup="dialog"]').click()
        await expectSnapshot(`mobile-header-internal-modal-${dir}`, page)
      })
    })
  }
})
