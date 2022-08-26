import { test, expect, Page } from '@playwright/test'

import { mockProviderApis } from '~~/test/playwright/utils/route'

const goToCustomAudioPage = async (page: Page) => {
  // Test in a custom audio detail page, it should apply the same for any audio.
  await page.goto('audio/7e063ee6-343f-48e4-a4a5-f436393730f6')
}

const showsErrorPage = async (page: Page) => {
  await expect(page.locator('h1')).toHaveText(
    /The content you’re looking for seems to have disappeared/
  )
}

test.describe.configure({ mode: 'parallel' })

test.beforeEach(async ({ context }) => {
  await mockProviderApis(context)
})

test('shows the author and title of the audio', async ({ page }) => {
  await goToCustomAudioPage(page)
  const author = page.locator('a[aria-label^="author"]')
  await expect(author).toBeVisible()
  const audioTitle = page.locator('h1')
  await expect(audioTitle).toBeVisible()
})

test('shows the data that is only available in single result, not search response', async ({
  page,
}) => {
  await goToCustomAudioPage(page)
  const albumLink = page.locator('a[href*="/album/"]')
  await expect(albumLink).toHaveText('I Love My Dog You Love Your Cat')
})

test('shows the 404 error page when no valid id', async ({ page }) => {
  await page.goto('audio/foo')
  await showsErrorPage(page)
})

test('shows the 404 error page when no id', async ({ page }) => {
  await page.goto('audio/')
  await showsErrorPage(page)
})
