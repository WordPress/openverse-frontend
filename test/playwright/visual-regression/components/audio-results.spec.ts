import { test } from '@playwright/test'

import breakpoints from '~~/test/playwright/utils/breakpoints'
import {
  closeFilters,
  enableNewHeader,
} from '~~/test/playwright/utils/navigation'

test.describe.configure({ mode: 'parallel' })

test.describe('audio results', () => {
  test.beforeEach(async ({ page }) => {
    await enableNewHeader(page)
    await page.goto('/search/audio?q=birds')
  })

  breakpoints.describeEachMobile({ uaMocking: false }, ({ expectSnapshot }) => {
    test('should render small row layout desktop UA with narrow viewport', async ({
      page,
    }) => {
      await expectSnapshot('audio-results-narrow-viewport-desktop-UA', page)
    })
  })

  breakpoints.describeEachMobile({ uaMocking: true }, ({ expectSnapshot }) => {
    test('should render small row layout mobile UA with narrow viewport', async ({
      page,
    }) => {
      await expectSnapshot('audio-results-narrow-viewport-mobile-UA', page)
    })
  })

  breakpoints.describeEachDesktop(({ expectSnapshot }) => {
    test('desktop audio results', async ({ page }) => {
      await closeFilters(page)
      // Make sure filters button is not hovered
      await page.mouse.move(0, 150)
      await expectSnapshot('audio-results-desktop', page)
    })
  })
})
