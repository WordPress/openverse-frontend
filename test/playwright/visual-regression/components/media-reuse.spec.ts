import { test } from '@playwright/test'

import breakpoints from '~~/test/playwright/utils/breakpoints'
import {
  dismissTranslationBanner,
  renderDirs,
} from '~~/test/playwright/utils/navigation'

const tabs = [
  { id: 'rich', name: 'Rich Text' },
  { id: 'html', name: 'HTML' },
  { id: 'plain', name: 'Plain text' },
]
test.describe('media-reuse', () => {
  for (const dir of renderDirs) {
    test.beforeEach(async ({ page }) => {
      await page.goto(
        `${
          dir === 'ltr' ? '' : '/ar'
        }/image/f9384235-b72e-4f1e-9b05-e1b116262a29`
      )
      await dismissTranslationBanner(page)
    })
    for (const tab of tabs) {
      breakpoints.describeEvery(({ expectSnapshot }) => {
        test(`Should render media reuse section with "${tab.name}" tab open on ${dir}`, async ({
          page,
        }) => {
          await page.locator(`text=${tab.name}`).click()
          // Make sure the tab is not focused and doesn't have a pink ring
          await page.locator('h3:has-text("Reuse content")').click()
          await expectSnapshot(
            `media-reuse-${dir}-${tab.id}-tab`,
            page.locator('.media-reuse')
          )
        })
      })
    }
  }
})
