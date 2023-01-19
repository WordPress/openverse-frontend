import { test, expect } from "@playwright/test"

import { openFirstResult } from "../utils/navigation"

/**
 * When clicking on a result, the opened result page url query param 'q' value
 * should be equal to the search term
 */
test.describe(
  "The url`s query param q value should be set to the search term",
  () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/search?q=cat`)
    })

    test("image type result", async ({ page }) => {
      await openFirstResult(page, "image")
      const url = page.url()
      const query = url.substring(url.indexOf("=") + 1)

      expect(query).toEqual("cat")
    })

    test("audio type result", async ({ page }) => {
      await openFirstResult(page, "audio")
      const url = page.url()
      const query = url.substring(url.indexOf("=") + 1)

      expect(query).toEqual("cat")
    })
  }
)

test.describe(
  "search term inside header should be the same as search query inside the url when navigatin back from a new search",
  () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/search?q=cat`)
    })

    test("image type", async ({ page }) => {
      await openFirstResult(page, "image")
      // Type search term
      let searchInput = page.locator('header input[type="search"]')
      await searchInput.clear()
      await searchInput.type("dog")

      await Promise.all([
        page.waitForNavigation(),
        await page.getByRole("button", { name: "Search" }).click(),
      ])

      await page.waitForLoadState("load")
      await page.goBack()

      searchInput = page.locator('header input[type="search"]')
      const queryParam = page.url().substring(page.url().indexOf("=") + 1)

      expect(queryParam).toEqual(await searchInput.inputValue())
    })
  }
)
