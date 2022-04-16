import { test } from '@playwright/test'

import breakpoints from '~~/test/playwright/utils/breakpoints'
import { hideInputCursors } from '~~/test/playwright/utils/page'

test.describe('header search bar snapshots', () => {
  test.describe('ltr', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/search/?q=birds')
    })

    test.describe('search input', () => {
      breakpoints.describeEvery(({ expectSnapshot }) => {
        test('unfocused', async ({ page }) => {
          await expectSnapshot(
            'unfocused-search-ltr',
            page.locator('form:has(input)')
          )
        })

        test('focused', async ({ page }) => {
          await page.focus('input')
          await hideInputCursors(page)
          await expectSnapshot(
            'focused-search-ltr',
            page.locator('form:has(input)')
          )
        })

        test('hovered', async ({ page }) => {
          await page.hover('input')
          await hideInputCursors(page)
          await expectSnapshot(
            'hovered-search-ltr',
            page.locator('form:has(input)')
          )
        })
      })
    })
  })

  test.describe('rtl', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar/search/?q=birds')
    })

    test.describe('search input', () => {
      breakpoints.describeEvery(({ expectSnapshot }) => {
        test('unfocused', async ({ page }) => {
          await expectSnapshot(
            'unfocused-search-rtl',
            page.locator('form:has(input)')
          )
        })

        test('focused', async ({ page }) => {
          await page.focus('input')
          await hideInputCursors(page)
          await expectSnapshot(
            'focused-search-rtl',
            page.locator('form:has(input)')
          )
        })

        test('hovered', async ({ page }) => {
          await page.hover('input')
          await hideInputCursors(page)
          await expectSnapshot(
            'hovered-search-rtl',
            page.locator('form:has(input)')
          )
        })
      })
    })
  })
})
