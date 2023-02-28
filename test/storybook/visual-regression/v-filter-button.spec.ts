import { test } from "@playwright/test"

import breakpoints from "~~/test/playwright/utils/breakpoints"
import { makeGotoWithArgs } from "~~/test/storybook/utils/args"

const gotoWithArgs = makeGotoWithArgs(
  "components-vheader-vfilterbutton--default-story"
)

test.describe.configure({ mode: "parallel" })

const wrapper = "#wrapper"

test.describe("VFilterButton", () => {
  breakpoints.describeMobileAndDesktop(({ expectSnapshot }) => {
    for (const filterCount of [0, 1, 12]) {
      test(`resting, ${filterCount} filters`, async ({ page }) => {
        await gotoWithArgs(page, { appliedFilters: filterCount })
        await expectSnapshot(
          `filter-button-at-rest-${filterCount}-checked`,
          page.locator(wrapper)
        )
      })
      test(`focused, ${filterCount} filters`, async ({ page }) => {
        await gotoWithArgs(page, { appliedFilters: filterCount })
        await expectSnapshot(
          `filter-button-at-rest-${filterCount}-checked`,
          page.locator(wrapper)
        )
      })
      test(`pressed, ${filterCount} filters`, async ({ page }) => {
        await gotoWithArgs(page, {
          appliedFilters: filterCount,
          pressed: true,
        })
        await expectSnapshot(
          `filter-button-pressed-${filterCount}-checked`,
          page.locator(wrapper)
        )
      })
      test(`pressed, hovered, ${filterCount} filters`, async ({ page }) => {
        await gotoWithArgs(page, {
          appliedFilters: filterCount,
          pressed: true,
        })
        await page.locator("button", { hasText: "Filter" }).hover()
        await expectSnapshot(
          `filter-button-pressed-hovered-${filterCount}-checked`,
          page.locator(wrapper)
        )
      })
      test(`hovered, ${filterCount} filters`, async ({ page }) => {
        await gotoWithArgs(page, {
          appliedFilters: filterCount,
        })
        await page.locator("button", { hasText: "Filter" }).hover()
        await expectSnapshot(
          `filter-button-hovered-${filterCount}-checked`,
          page.locator(wrapper)
        )
      })
      test(`focused, pressed ${filterCount} filters`, async ({ page }) => {
        await gotoWithArgs(page, {
          appliedFilters: filterCount,
          pressed: true,
        })
        await page.locator("button", { hasText: "Filter" }).focus()
        await expectSnapshot(
          `filter-button-focused-pressed-${filterCount}-checked`,
          page.locator(wrapper)
        )
      })
    }
  })
})
