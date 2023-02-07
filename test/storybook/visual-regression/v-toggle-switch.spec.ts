import { test, expect } from "@playwright/test"

test.describe.configure({ mode: "parallel" })

test.describe("VToggleSwitch", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/iframe.html?id=components-vtoggleswitch--default-story")
  })

  test("default", async ({ page }) => {
    expect(
      await page.locator(".toggle-switch-container").screenshot()
    ).toMatchSnapshot({ name: "default.png" })
  })

  test("on", async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]')
    await checkbox.click()
    expect(
      await page.locator(".toggle-switch-container").screenshot()
    ).toMatchSnapshot({ name: "on.png" })
  })

  test("on-and-off", async ({ page }) => {
    // toggle on and off again
    const checkbox = page.locator('input[type="checkbox"]')
    await checkbox.click()

    await checkbox.click()
    expect(
      await page.locator(".toggle-switch-container").screenshot()
    ).toMatchSnapshot({
      name: "on-and-off.png",
    })
  })
})
