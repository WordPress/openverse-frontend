import { test } from '@playwright/test'

import breakpoints from '~~/test/playwright/utils/breakpoints'
import {
  closeFilters,
  goToSearchTerm,
  languageDirections,
} from '~~/test/playwright/utils/navigation'

test.describe.configure({ mode: 'parallel' })

const headerSelector = '.main-header'

test.describe('header desktop snapshots', () => {
  for (const dir of languageDirections) {
    test.describe(dir, () => {
      test.beforeEach(async ({ page }) => {
        await goToSearchTerm(page, 'birds', { dir: dir, flag: 'new_header' })
      })

      test.describe('header-desktop', () => {
        breakpoints.describeEachDesktopFromLg(({ expectSnapshot }) => {
          test('filters open', async ({ page }) => {
            await page.mouse.move(0, 150)
            await expectSnapshot(
              `filters-open-${dir}`,
              page.locator(headerSelector)
            )
          })
          test('filters closed', async ({ page }) => {
            await closeFilters(page)
            await page.mouse.move(0, 150)
            await expectSnapshot(
              `filters-closed-${dir}`,
              page.locator(headerSelector)
            )
          })
        })
      })
    })
  }
})
