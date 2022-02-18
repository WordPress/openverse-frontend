const { test, expect } = require('@playwright/test')

test('Can see the translation banner and go to the correct link', async ({
  page,
}) => {
  await page.goto('/ru/search/')
  await page.click(
    'text=The translation for Russian locale is incomplete. Help us get to 100 percent by '
  )

  const [page1] = await Promise.all([
    page.waitForEvent('popup'),
    page.click('text=contributing a translation'),
  ])
  await expect(page1).toHaveURL(
    'https://translate.wordpress.org/projects/meta/openverse/ru/default/'
  )
})

test('Can close the translation banner', async ({ page }) => {
  await page.goto('/ru/search/')
  await page.click('[aria-label="Закрыть"]')

  const banner = page.locator(
    'text=The translation for Russian locale is incomplete. Help us get to 100 percent by '
  )
  await expect(banner).not.toBeVisible({ timeout: 10 })
})
