import { test, Page } from '@playwright/test'

import breakpoints from '~~/test/playwright/utils/breakpoints'
import { hideInputCursors } from '~~/test/playwright/utils/page'
import {
  dismissTranslationBanner,
  renderDirs,
} from '~~/test/playwright/utils/navigation'

const deleteImageCarousel = async (page: Page) => {
  const element = await page.$('[data-testid="image-carousel"]')
  await element?.evaluate((node) => node.remove())
  element?.dispose()
}
for (const dir of renderDirs) {
  test.describe(`${dir} homepage snapshots`, () => {
    const path = dir === 'rtl' ? '/ar' : '/'
    test.beforeEach(async ({ page }) => {
      await page.goto(path)
      await dismissTranslationBanner(page)
    })

    breakpoints.describeEvery(({ expectSnapshot }) =>
      test(`${dir} full page`, async ({ page }) => {
        await deleteImageCarousel(page)
        await expectSnapshot(`index-${dir}`, page)
      })
    )

    test.describe('search input', () => {
      breakpoints.describeEvery(({ expectSnapshot }) => {
        test('unfocused', async ({ page }) => {
          await expectSnapshot(
            `unfocused-search-${dir}`,
            page.locator('form:has(input)')
          )
        })

        test('focused', async ({ page }) => {
          await page.focus('input')
          await hideInputCursors(page)
          await expectSnapshot(
            `focused-search-${dir}`,
            page.locator('form:has(input)')
          )
        })
      })
    })
  })
}
