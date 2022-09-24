import { test } from '@playwright/test'

import breakpoints from '~~/test/playwright/utils/breakpoints'
import { makeGotoWithArgs } from '~~/test/storybook/utils/args'

const gotoWithArgs = makeGotoWithArgs(
  'components-vheader-vsearchtypebutton--default-story'
)

test.describe('VSearchTypeButton', () => {
  breakpoints.describeLg(({ expectSnapshot }) => {
    test('resting', async ({ page }) => {
      await gotoWithArgs(page)
      await expectSnapshot(
        'v-search-type-button-at-rest',
        page.locator('button')
      )
    })

    test('hovered', async ({ page }) => {
      await gotoWithArgs(page)
      await page.hover('button')
      await expectSnapshot(
        'v-search-type-button-hovered',
        page.locator('button')
      )
    })

    test('pressed', async ({ page }) => {
      await gotoWithArgs(page, { a11yProps: { 'aria-pressed': true } })
      await expectSnapshot(
        'v-search-type-button-hovered',
        page.locator('button')
      )
    })

    test('pressed-hovered', async ({ page }) => {
      await gotoWithArgs(page, { a11yProps: { 'aria-pressed': true } })
      await page.hover('button')
      await expectSnapshot(
        'v-search-type-button-hovered',
        page.locator('button')
      )
    })
  })

  breakpoints.describeXl(({ expectSnapshot }) => {
    test('resting', async ({ page }) => {
      await gotoWithArgs(page)
      await expectSnapshot(
        'v-search-type-button-xl-at-rest',
        page.locator('button')
      )
    })

    test('hovered', async ({ page }) => {
      await gotoWithArgs(page)
      await page.hover('button')
      await expectSnapshot(
        'v-search-type-button-xl-hovered',
        page.locator('button')
      )
    })

    test('pressed', async ({ page }) => {
      await gotoWithArgs(page, { a11yProps: { 'aria-pressed': true } })
      await expectSnapshot(
        'v-search-type-button-xl-hovered',
        page.locator('button')
      )
    })

    test('pressed-hovered', async ({ page }) => {
      await gotoWithArgs(page, { a11yProps: { 'aria-pressed': true } })
      await page.hover('button')
      await expectSnapshot(
        'v-search-type-button-xl-hovered',
        page.locator('button')
      )
    })
  })
})
