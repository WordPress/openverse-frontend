const { expect } = require('@playwright/test')

const openFilters = async (page) => {
  const filterButtonSelector =
    '[aria-controls="filter-sidebar"], [aria-controls="filter-modal"]'
  const isPressed = async () =>
    await page.getAttribute(filterButtonSelector, 'aria-pressed')
  if ((await isPressed()) !== 'true') {
    await page.click(filterButtonSelector)
    expect(await isPressed()).toEqual('true')
  }
}

const assertCheckboxCheckedStatus = async (page, label, checked = true) => {
  const checkbox = page.locator(`label:has-text("${label}")`)
  if (checked) {
    await expect(checkbox).toBeChecked()
  } else {
    await expect(checkbox).not.toBeChecked()
  }
}

const changeContentType = async (page, to) => {
  await page.click(
    `button[aria-controls="content-switcher-popover"], button[aria-controls="content-switcher-modal"]`
  )
  await page.click(`button[role="radio"]:has-text("${to}")`)
}
/**
 * Finds a button with a popup to the left of the filters button which doesn't have a 'menu' label
 * @param page
 * @returns {Promise<string>}
 */
const currentContentType = async (page) => {
  const contentSwitcherButton = await page.locator(
    `button[aria-controls="content-switcher-popover"], button[aria-controls="content-switcher-modal"]`
  )
  return contentSwitcherButton.textContent()
}

const mockProviderApis = async (context) => {
  await context.route('**.jamendo.com**', (route) => route.abort())
}

module.exports = {
  openFilters,
  changeContentType,
  currentContentType,
  assertCheckboxCheckedStatus,
  mockProviderApis,
}
