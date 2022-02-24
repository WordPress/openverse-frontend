const { test, expect } = require('@playwright/test')
const {
  assertCheckboxStatus,
  openFilters,
  mockAllSearch,
  changeContentType,
} = require('./utils')

test.beforeEach(async ({ context }) => {
  // Block any audio (jamendo.com) requests for each test in this file.
  await context.route(/.+jamendo.com.+/, (route) => route.abort())

  await mockAllSearch(context)
})

test('common filters are retained when media type changes from all media to single type', async ({
  page,
}) => {
  await page.goto(
    '/search/?q=cat&license_type=commercial&license=cc0&searchBy=creator'
  )
  await openFilters(page)

  for (let checkbox of ['cc0', 'commercial', 'creator']) {
    await assertCheckboxStatus(page, checkbox)
  }
  await changeContentType(page, 'Images')

  await expect(page).toHaveURL(
    '/search/image?q=cat&license_type=commercial&license=cc0&searchBy=creator'
  )

  for (let checkbox of ['cc0', 'commercial', 'creator']) {
    await assertCheckboxStatus(page, checkbox)
  }
})

test('common filters are retained when media type changes from single type to all media', async ({
  page,
}) => {
  await page.goto(
    '/search/audio?q=cat&license_type=commercial&license=cc0&searchBy=creator'
  )
  await openFilters(page)

  for (let checkbox of ['cc0', 'commercial', 'creator']) {
    await assertCheckboxStatus(page, checkbox)
  }

  await changeContentType(page, 'All content')

  await expect(page).toHaveURL(
    '/search/?q=cat&license_type=commercial&license=cc0&searchBy=creator'
  )

  for (let checkbox of ['cc0', 'commercial', 'creator']) {
    await assertCheckboxStatus(page, checkbox)
  }
})

test('selecting some filters can disable dependent filters', async ({
  page,
}) => {
  await page.goto('/search/audio?q=cat&license_type=commercial')
  await openFilters(page)

  // by-nc is special because we normally test for fuzzy match, and by-nc matches 3 labels.
  const byNc = page.locator('input[value="by-nc"]')
  await expect(byNc).toBeDisabled()
  for (let checkbox of ['by-nc-sa', 'by-nc-nd']) {
    await assertCheckboxStatus(page, checkbox, 'disabled')
  }
  await assertCheckboxStatus(page, 'commercial')

  await page.click('label:has-text("commercial")')

  await assertCheckboxStatus(page, 'commercial', 'unchecked')
  await expect(byNc).not.toBeDisabled()
  for (let checkbox of ['commercial', 'by-nc-sa', 'by-nc-nd']) {
    await assertCheckboxStatus(page, checkbox, 'unchecked')
  }
})

test('filters are updated when media type changes', async ({ page }) => {
  await page.goto('/search/image?q=cat&aspect_ratio=tall&license=cc0')
  await openFilters(page)

  await assertCheckboxStatus(page, 'tall')
  await assertCheckboxStatus(page, 'cc0')

  await changeContentType(page, 'Audio')

  await expect(page).toHaveURL('/search/audio?q=cat&license=cc0')

  await expect(page.locator('label:has-text("Tall")')).toHaveCount(0, {
    timeout: 300,
  })
  await assertCheckboxStatus(page, 'cc0')
})

test('new media request is sent when a filter is selected', async ({
  page,
}) => {
  let apiRequest
  // Serve mock data on all image search requests and save the API request url
  // There must be a better way to get the request url than this
  await page.route(
    'https://api.openverse.engineering/v1/images/?**',
    (route) => {
      apiRequest = route.request().url()
      route.fulfill({
        path: 'test/e2e/resources/mock_image_data.json',
        headers: { 'Access-Control-Allow-Origin': '*' },
      })
    }
  )
  await page.goto('/search/image?q=cat')
  await openFilters(page)

  await assertCheckboxStatus(page, 'cc0', 'unchecked')
  await page.click('label:has-text("CC0")')

  await assertCheckboxStatus(page, 'cc0')
  await expect(apiRequest).toEqual(
    'https://api.openverse.engineering/v1/images/?q=cat&license=cc0'
  )
})
