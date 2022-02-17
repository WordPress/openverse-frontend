import { test, expect, Page } from '@playwright/test'

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

    test('full page', async ({ page }) => {
      await deleteImageCarousel(page)

      expect(await page.screenshot()).toMatchSnapshot({
        name: 'index-ltr',
      })
    })

    test.describe('search input', () => {
      test('unfocused', async ({ page }) => {
        expect(
          await page.locator('form:has(input)').screenshot()
        ).toMatchSnapshot({
          name: 'unfocused-search-ltr',
        })
      })
      test('focused', async ({ page }) => {
        await page.focus('input')
        expect(
          await page.locator('form:has(input)').screenshot()
        ).toMatchSnapshot({
          name: 'focused-search-ltr',
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

    test('full page', async ({ page }) => {
      await deleteImageCarousel(page)

      expect(await page.screenshot()).toMatchSnapshot({
        name: 'index-rtl',
      })
    })

    test.describe('search input', () => {
      test('unfocused', async ({ page }) => {
        expect(
          await page.locator('form:has(input)').screenshot()
        ).toMatchSnapshot({
          name: 'unfocused-search-rtl',
        })
      })
      test('focused', async ({ page }) => {
        await page.focus('input')
        expect(
          await page.locator('form:has(input)').screenshot()
        ).toMatchSnapshot({
          name: 'focused-search-rtl',
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
