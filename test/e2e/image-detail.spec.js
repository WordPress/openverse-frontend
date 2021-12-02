const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ context }) => {
  // Block any image request for each test in this file.
  await context.route(/\.(png|jpeg|jpg|svg)$/, (route) => route.abort())
})

test('shows the author of the image', async ({ page }) => {
  await page.goto('image/e9d97a98-621b-4ec2-bf70-f47a74380452')
  const author = page.locator('a[aria-label^="author"]')
  await expect(author).toHaveText('mutednarayan')
})
