import { test, expect, Page } from '@playwright/test'
import breakpoints from './utils/breakpoints'

const deleteImageCarousel = async (page: Page) => {
  const element = await page.$('[data-testid="image-carousel"]')
  await element?.evaluate((node) => node.remove())
  element?.dispose()
}

test.describe('homepage snapshots', () => {
  test.describe('ltr', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/')
    })

    breakpoints.testEachDesktop('full page', async (breakpoint, { page }) => {
      await deleteImageCarousel(page)

      expect(await page.screenshot()).toMatchSnapshot({
        name: `index-ltr-${breakpoint}`,
      })
    })

    test.describe('search input', () => {
      breakpoints.testEvery('unfocused', async (breakpoint, { page }) => {
        expect(
          await page.locator('form:has(input)').screenshot()
        ).toMatchSnapshot({
          name: `unfocused-search-ltr-${breakpoint}`,
        })
      })

      breakpoints.testEvery('focused', async (breakpoint, { page }) => {
        await page.focus('input')
        expect(
          await page.locator('form:has(input)').screenshot()
        ).toMatchSnapshot({
          name: `focused-search-ltr-${breakpoint}`,
        })
      })
    })
  })

  test.describe('rtl', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ar')
    })

    breakpoints.testEachDesktop('full page', async (breakpoint, { page }) => {
      await deleteImageCarousel(page)

      expect(await page.screenshot()).toMatchSnapshot({
        name: `index-rtl-${breakpoint}`,
      })
    })

    test.describe('search input', () => {
      breakpoints.testEvery('unfocused', async (breakpoint, { page }) => {
        expect(
          await page.locator('form:has(input)').screenshot()
        ).toMatchSnapshot({
          name: `unfocused-search-rtl-${breakpoint}`,
        })
      })

      breakpoints.testEvery('focused', async (breakpoint, { page }) => {
        await page.focus('input')
        expect(
          await page.locator('form:has(input)').screenshot()
        ).toMatchSnapshot({
          name: `focused-search-rtl-${breakpoint}`,
        })
      })
    })
  })
})
