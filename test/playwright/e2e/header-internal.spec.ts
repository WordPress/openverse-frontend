import { test, expect, Page } from "@playwright/test"

import {
  enableNewHeader,
  isMobileMenuOpen,
  scrollToBottom,
  setCookies,
  t,
} from "~~/test/playwright/utils/navigation"
import breakpoints from "~~/test/playwright/utils/breakpoints"

const modalCloseButton = 'div[role="dialog"] >> [aria-label="Close"]'
const currentPageLink = 'div[role="dialog"] >> [aria-current="page"]'
const currentPageLinkInPopover = '.popover-content >> [aria-current="page"]'
const menuButton = `[aria-label="${t("header.aria.menu")}"]`

const openMenu = async (page: Page) => await page.click(menuButton)
const closeMenu = async (page: Page) => await page.click(modalCloseButton)

const isPagesPopoverOpen = async (page: Page) =>
  page.locator(".popover-content").isVisible({ timeout: 100 })

test.describe("Header internal", () => {
  breakpoints.describeXs(() => {
    test.beforeEach(async ({ context, page }) => {
      await setCookies(context, { breakpoint: "sm" })
      await enableNewHeader(page)
      await page.goto("/about")
    })

    test("can open and close the modal under sm breakpoint", async ({
      page,
    }) => {
      await openMenu(page)
      expect(await isMobileMenuOpen(page)).toBe(true)
      await expect(page.locator(currentPageLink)).toBeVisible()
      await expect(page.locator(currentPageLink)).toHaveText("About")

      await closeMenu(page)
      expect(await isMobileMenuOpen(page)).toBe(false)
      await expect(page.locator(menuButton)).toBeVisible()
    })

    test("the modal locks the scroll under sm breakpoint", async ({
      context,
      page,
      storageState,
    }) => {
      await scrollToBottom(page)

      await openMenu(page)
      await closeMenu(page)
      console.log("cookies: ", storageState, context.cookies())

      const scrollPosition = await page.evaluate(() => window.scrollY)
      expect(scrollPosition).toBeGreaterThan(100)
    })

    test("the modal opens an external link in a new window and it doesn't close the modal", async ({
      page,
    }) => {
      await scrollToBottom(page)
      await openMenu(page)

      // Open the external link in a new tab, close the tab
      const [popup] = await Promise.all([
        page.waitForEvent("popup"),
        page.locator('div[role="dialog"] >> text=API').click(),
      ])
      await popup.close()

      expect(await isMobileMenuOpen(page)).toBe(true)
    })
  })

  breakpoints.describeMd(() => {
    test.beforeEach(async ({ context, page }) => {
      await setCookies(context, { breakpoint: "md" })
      await enableNewHeader(page)
      await page.goto("/about")
    })

    test("can open and close the popover on md breakpoint", async ({
      page,
    }) => {
      await openMenu(page)
      expect(await isPagesPopoverOpen(page)).toBe(true)
      await expect(page.locator(currentPageLinkInPopover)).toBeVisible()
      await expect(page.locator(currentPageLinkInPopover)).toHaveText("About")

      await page.locator('.popover-content >> [aria-label="Close"]').click()
      expect(await isPagesPopoverOpen(page)).toBe(false)
      await expect(page.locator(menuButton)).toBeVisible()
    })
  })
})
