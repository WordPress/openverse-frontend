import { test, expect, Page } from "@playwright/test"

import {
  LanguageDirection,
  pathWithDir,
  setCookies,
  t,
} from "~~/test/playwright/utils/navigation"

import { keycodes } from "~/constants/key-codes"

const isFilterButtonFocused = async (page: Page) => {
  return page.evaluate(() => document.activeElement?.id === "filter-button")
}

const walkToFilterButton = async (page: Page) => {
  while (!(await isFilterButtonFocused(page))) {
    await page.keyboard.press(keycodes.Tab)
  }
}

const firstFilterCheckbox = (page: Page, dir: LanguageDirection) => {
  return page
    .getByRole("region", { name: t("filters.filter-by", dir) })
    .getByRole("checkbox")
    .first()
}

test.describe.configure({ mode: "parallel" })

for (const dir of ["ltr", "rtl"]) {
  test.describe(`search header keyboard accessibility test in ${dir}`, () => {
    test.beforeEach(async ({ page }) => {
      await setCookies(page.context(), { uiBreakpoint: "lg" })
      /**
       * To simplify finding the last focusable element in the filters sidebar,
       * we use the image search page. After the removal of the "searchBy" filter,
       * the last element on the all media search page is the "license explanation"
       * button, not a checkbox.
       */
      await page.goto(pathWithDir("/search/image?q=birds", dir))
    })

    test("should move focus to the sidebar after header", async ({ page }) => {
      await walkToFilterButton(page)

      // Check that the filters sidebar is open
      expect(
        await page.locator("#filter-button").getAttribute("aria-expanded")
      ).toBe("true")

      await page.keyboard.press(keycodes.Tab)

      await expect(
        firstFilterCheckbox(page, dir as LanguageDirection)
      ).toBeFocused()
    })

    test("should move focus to main after filters sidebar", async ({
      page,
    }) => {
      await page.getByRole("checkbox").last().focus()

      await page.keyboard.press(keycodes.Tab)

      const href = await page.evaluate(
        () => (document.activeElement as HTMLAnchorElement | null)?.href
      )
      expect(href).toBeDefined()
    })
  })
}
