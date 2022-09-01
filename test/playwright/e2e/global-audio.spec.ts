import { test, expect, Page, Locator } from '@playwright/test'

import { sleep } from '~~/test/playwright/utils/navigation'

const getNthAudioRow = async (page: Page, num: number) => {
  const rowSelector = `[aria-label*="Audio Player"] >> nth=${num}`
  const nthAudioRow = page.locator(rowSelector).locator('article')
  await expect(nthAudioRow).toHaveAttribute('status', 'paused')
  return nthAudioRow
}

const play = async (audioRow: Locator) => {
  await audioRow.locator('button[aria-label="Play"] >> visible=true').click()
  await expect(audioRow).toHaveAttribute('status', /(loading|playing)/)
}

test.describe('global audio', () => {
  test('track continues playing when navigating from audio search to its details page', async ({
    page,
  }) => {
    await page.goto('/search/audio?q=honey')
    // Find and play the first audio result
    const firstAudioRow = await getNthAudioRow(page, 0)
    await play(firstAudioRow)
    // Navigate to the details page of the playing audio track
    await Promise.all([
      page.waitForNavigation(),
      firstAudioRow.locator('a').click(),
    ])
    // and confirm is still playing (or loading to play)
    const mainPlayerButton = page.locator('.main-track >> button')
    await sleep(600) // Doesn't seem to make a difference for the status
    // When the audio is playing, the button's aria-label is 'Pause'
    await expect(mainPlayerButton).toHaveAttribute('aria-label', 'Pause')
  })

  test('player does not reproduce an audio different that the current audio in the details page', async ({
    page,
  }) => {
    await page.goto('/search/audio?q=honey')
    // Find and play the first audio result
    const firstAudioRow = await getNthAudioRow(page, 0)
    await play(firstAudioRow)
    // Navigate to the details page of the second audio track
    const secondAudioRow = await getNthAudioRow(page, 1)
    await Promise.all([
      page.waitForNavigation(),
      secondAudioRow.locator('a').click(),
    ])
    // and confirm is not playing
    const mainPlayerButton = page.locator('.main-track >> button')
    // When the audio is playing, the button's aria-label is 'Play'
    await expect(mainPlayerButton).toHaveAttribute('aria-label', 'Play')
  })
})
