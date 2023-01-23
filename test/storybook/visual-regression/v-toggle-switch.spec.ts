import { test } from "@playwright/test"

// import breakpoints from "~~/test/playwright/utils/breakpoints"

test.describe("VToggleSwitch", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/iframe.html?id=components-vtoggleswitch--default-story")
  })

  // breakpoints.describeEvery(({ expectSnapshot }) => {})
})
