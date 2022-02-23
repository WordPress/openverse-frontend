import { test, expect, Page } from '@playwright/test'
import { testEachBreakpoint } from './utils'

const deleteImageCarousel = async (page: Page) => {
  const element = await page.$('[data-testid="image-carousel"]')
  await element.evaluate((node) => node.remove())
  element.dispose()
}

test.describe('homepage snapshots', () => {
  test.describe('ltr', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/')
    })

    testEachBreakpoint('full page', async (breakpoint, { page }) => {
      await deleteImageCarousel(page)

      expect(await page.screenshot()).toMatchSnapshot({
        name: `index-ltr-${breakpoint}`,
      })
    })

    test.describe('search input', () => {
      testEachBreakpoint('unfocused', async (breakpoint, { page }) => {
        expect(
          await page.locator('form:has(input)').screenshot()
        ).toMatchSnapshot({
          name: `unfocused-search-ltr-${breakpoint}`,
        })
      })

      testEachBreakpoint('focused', async (breakpoint, { page }) => {
        await page.focus('input')
        expect(
          await page.locator('form:has(input)').screenshot()
        ).toMatchSnapshot({
          name: `focused-search-ltr-${breakpoint}`,
        })
      })
    })

    test('open search type selector', async ({ page }) => {
      await page.focus('[aria-controls="content-switcher-popover"]')
      await page.keyboard.down('Enter')
      expect(
        await page
          .locator('[aria-label="Type of content to search"]')
          .screenshot()
      ).toMatchSnapshot({
        name: 'search-type-switcher-ltr',
      })
    })
  })

  test.describe('rtl', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar')
    })

    testEachBreakpoint('full page', async (breakpoint, { page }) => {
      await deleteImageCarousel(page)

      expect(await page.screenshot()).toMatchSnapshot({
        name: `index-rtl-${breakpoint}`,
      })
    })

    test.describe('search input', () => {
      testEachBreakpoint('unfocused', async (breakpoint, { page }) => {
        expect(
          await page.locator('form:has(input)').screenshot()
        ).toMatchSnapshot({
          name: `unfocused-search-rtl-${breakpoint}`,
        })
      })
      testEachBreakpoint('focused', async (breakpoint, { page }) => {
        await page.focus('input')
        expect(
          await page.locator('form:has(input)').screenshot()
        ).toMatchSnapshot({
          name: `focused-search-rtl-${breakpoint}`,
        })
      })
    })

    test('open search type selector', async ({ page }) => {
      await page.focus('[aria-controls="content-switcher-popover"]')
      await page.keyboard.down('Enter')
      expect(
        await page
          .locator('[aria-label="Type of content to search"]')
          .screenshot()
      ).toMatchSnapshot({
        name: 'search-type-switcher-rtl',
      })
    })
  })
})
