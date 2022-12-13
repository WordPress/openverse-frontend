import { test } from '@playwright/test'

import { removeHiddenOverflow } from '~~/test/playwright/utils/page'
import breakpoints from '~~/test/playwright/utils/breakpoints'
import {
  dismissTranslationBanner,
  enableNewHeader,
  goToSearchTerm,
  languageDirections,
  openFirstResult,
} from '~~/test/playwright/utils/navigation'

import { supportedMediaTypes } from '~/constants/media'

test.describe.configure({ mode: 'parallel' })

for (const mediaType of supportedMediaTypes) {
  for (const dir of languageDirections) {
    test.describe(`${mediaType} ${dir} single-result page snapshots`, () => {
      breakpoints.describeEvery(({ breakpoint, expectSnapshot }) => {
        test.beforeEach(async ({ page }) => {
          await enableNewHeader(page)
          await page.context().addCookies([
            {
              name: 'uiBreakpoint',
              value: JSON.stringify(breakpoint),
              domain: 'localhost',
              path: '/',
            },
            {
              name: 'uiIsFilterDismissed',
              value: 'true',
              domain: 'localhost',
              path: '/',
            },
            {
              name: 'uiDismissedBanners',
              value: JSON.stringify(['translation-ar']),
              domain: 'localhost',
              path: '/',
            },
          ])
          await goToSearchTerm(page, 'birds', { dir })
          await dismissTranslationBanner(page)
        })

        test(`from search results`, async ({ page }) => {
          // This will include the "Back to results" link.
          await openFirstResult(page, mediaType)
          await removeHiddenOverflow(page)
          await expectSnapshot(
            `${mediaType}-${dir}-from-search-results`,
            page,
            { fullPage: true }
          )
        })
      })
    })
  }
}
