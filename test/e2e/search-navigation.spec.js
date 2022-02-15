const { expect, test } = require('@playwright/test')
const { mockAllSearch, openFilters } = require('./utils')

test.beforeEach(async ({ context }) => {
  await context.route('**.jamendo.**', (r) => r.abort())
  await context.route('**.freesound.**', (r) => r.abort())
  await mockAllSearch(context)
})

test.describe('search history navigation', () => {
  test('should update search results when back navigation changes filters', async ({
    page,
  }) => {
    await page.goto('/search/?q=galah')
    // Open filter sidebar
    await openFilters(page)

    // Apply a filter
    await page.click('#modification')

    // Verify the filter is appled to the URL and the checkbox is checked
    // Note: Need to add that a search was actually executed with the new
    // filters and that the page results have been updated for the new filters
    // @todo(sarayourfriend): ^?
    expect(page.url()).toContain('license_type=modification')
    expect(await page.isChecked('#modification')).toBe(true)

    // Navigate backwards and verify URL is updated and the filter is unapplied
    await page.goBack()

    // Ditto here about the note above, need to verify a new search actually happened with new results
    expect(page.url()).not.toContain('license_type=modification')
    expect(await page.isChecked('#modification')).toBe(false)
  })
})
