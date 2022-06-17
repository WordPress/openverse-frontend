import { test } from '@playwright/test'

import breakpoints from '~~/test/playwright/utils/breakpoints'
import { removeHiddenOverflow } from '~~/test/playwright/utils/page'
import {
  dismissTranslationBanner,
  pathWithDir,
  renderDirs,
} from '~~/test/playwright/utils/navigation'

const contentPages = ['extension', 'about', 'meta-search', 'search-help']
for (const contentPage of contentPages) {
  for (const dir of renderDirs) {
    test.describe(`${contentPage} ${dir} page snapshots`, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(pathWithDir(contentPage, dir))
        await dismissTranslationBanner(page)
      })

      breakpoints.describeEvery(({ expectSnapshot }) => {
        test('full page', async ({ page }) => {
          await removeHiddenOverflow(page)
          await expectSnapshot(`${contentPage}-${dir}`, page, {
            fullPage: true,
          })
        })
      })
    })
  }
}
