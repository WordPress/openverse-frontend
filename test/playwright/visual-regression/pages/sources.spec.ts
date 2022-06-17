import { test } from '@playwright/test'

import breakpoints from '~~/test/playwright/utils/breakpoints'
import { removeHiddenOverflow } from '~~/test/playwright/utils/page'
import { pathWithDir, renderDirs } from '~~/test/playwright/utils/navigation'

test.describe('sources page snapshots', () => {
  for (const dir of renderDirs) {
    test.describe(dir, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(pathWithDir('sources', dir))
      })
      breakpoints.describeEvery(({ expectSnapshot }) => {
        test('top', async ({ page }) => {
          await removeHiddenOverflow(page)
          await expectSnapshot(`sources-${dir}`, page, { fullPage: true })
        })
      })
    })
  }
})
