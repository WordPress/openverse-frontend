import { test } from "@playwright/test"

// import breakpoints from "~~/test/playwright/utils/breakpoints"

test.describe("VSafeBrowsingFilter", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "/iframe.html?id=components-vsafebrowsingfilter--default-story"
    )
  })

  // breakpoints.describeEvery(({ expectSnapshot }) => {})
})
