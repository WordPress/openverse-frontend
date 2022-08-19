import { test, expect } from '@playwright/test'

import {
  goToSearchTerm,
  languageDirections,
} from '~~/test/playwright/utils/navigation'

import { supportedSearchTypes } from '~/constants/media'

test.describe.configure({ mode: 'parallel' })

test.describe('additional sources section', () => {
  for (const dir of languageDirections) {
    for (const searchType of supportedSearchTypes) {
      test(`additional ${searchType} sources section - ${dir}`, async ({
        page,
      }) => {
        await goToSearchTerm(page, 'birds', { searchType, dir })
        const additionalSourcesSection = page.locator('.meta-search')

        expect(await additionalSourcesSection.screenshot()).toMatchSnapshot({
          name: `additional-sources-section-${dir}.png`,
        })
      })

      test(`additional ${searchType} sources popover - ${dir}`, async ({
        page,
      }) => {
        await goToSearchTerm(page, 'birds', { searchType, dir })
        const additionalSourcesButton = page.locator(
          '[aria-controls="source-list-popover"]'
        )

        await additionalSourcesButton.click()

        expect(
          await page.locator('[data-testid="source-list-popover"]').screenshot()
        ).toMatchSnapshot({
          name: `additional-${searchType}-sources-popover-${dir}.png`,
        })
      })
    }
  }
})
