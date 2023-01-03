import { BrowserContext, expect, Page } from "@playwright/test"

import rtlMessages from "~~/test/locales/ar.json"

import {
  ALL_MEDIA,
  AUDIO,
  IMAGE,
  MediaType,
  MODEL_3D,
  SupportedSearchType,
  VIDEO,
} from "~/constants/media"
import { SCREEN_SIZES } from "~/constants/screens"

import enMessages from "~/locales/en.json"

const messages: Record<string, Record<string, unknown>> = {
  ltr: enMessages,
  rtl: rtlMessages,
}
/**
 * This is used during the transition period from the `old` header to the `new` one.
 * The new header is enabled using `new_header` feature flag. Some navigation methods
 * are different depending on the header version.
 */
export const OLD_HEADER = "old_header"
export const NEW_HEADER = "new_header"
export type HeaderMode = typeof OLD_HEADER | typeof NEW_HEADER

const getNestedProperty = (
  obj: Record<string, unknown>,
  path: string
): string => {
  const value = path
    .split(".")
    .reduce((acc: string | Record<string, unknown>, part) => {
      if (typeof acc === "string") {
        return acc
      }
      if (Object.keys(acc as Record<string, unknown>).includes(part)) {
        return (acc as Record<string, string | Record<string, unknown>>)[part]
      }
      return ""
    }, obj)
  return typeof value === "string" ? value : JSON.stringify(value)
}

/**
 * Simplified i18n t function that returns English messages for `ltr` and Arabic for `rtl`.
 * It can also handle nested labels using dot notation ('header.title').
 * @param path - The label to translate.
 * @param dir - The language direction.
 */
export const t = (path: string, dir: LanguageDirection = "ltr"): string => {
  let value = ""
  if (dir === "rtl") {
    value = getNestedProperty(messages.rtl, path)
  }
  return value === "" ? getNestedProperty(messages.ltr, path) : value
}

export const languageDirections = ["ltr", "rtl"] as const

export const renderingContexts = [
  ["SSR", "ltr"],
  ["SSR", "rtl"],
  ["CSR", "ltr"],
  ["CSR", "rtl"],
] as const

export const renderModes = ["SSR", "CSR"] as const
export type RenderMode = typeof renderModes[number]
export type LanguageDirection = "ltr" | "rtl"

export const buttonSelectors = {
  filter: 'button[aria-controls="filters"]',
  contentSwitcher: 'button[aria-controls="content-switcher-modal"]',
  mobileContentSettings: `button[aria-controls="content-settings-modal"]`,
}

export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export const searchTypePath = (searchType: SupportedSearchType) =>
  searchType === "all" ? "" : `${searchType}`

export const searchTypeNames = {
  ltr: {
    [ALL_MEDIA]: t("search-type.all", "ltr"),
    [AUDIO]: t("search-type.audio", "ltr"),
    [IMAGE]: t("search-type.image", "ltr"),
    [VIDEO]: t("search-type.video", "ltr"),
    [MODEL_3D]: t("search-type.model-3d", "ltr"),
  },
  rtl: {
    [ALL_MEDIA]: t("search-type.all", "rtl"),
    [AUDIO]: t("search-type.audio", "rtl"),
    [IMAGE]: t("search-type.image", "rtl"),
    [VIDEO]: t("search-type.video", "rtl"),
    [MODEL_3D]: t("search-type.model-3d", "rtl"),
  },
}

const isButtonPressed = async (
  page: Page,
  buttonSelector: string
): Promise<boolean> => {
  const viewportSize = page.viewportSize()
  if (!viewportSize) {
    return false
  }
  const pageWidth = viewportSize.width
  if (pageWidth > 640) {
    return await getPressed(page, buttonSelector)
  } else {
    return await page.locator("button", { hasText: "Close" }).isVisible()
  }
}

const openMenu = async (page: Page, button: "filter" | "contentSwitcher") => {
  const selector = buttonSelectors[button]
  if (!(await isButtonPressed(page, selector))) {
    await page.click(selector)
    expect(await isButtonPressed(page, selector)).toEqual(true)
  }
}

export const openFilters = async (
  page: Page,
  mode: HeaderMode = NEW_HEADER,
  dir: LanguageDirection = "ltr"
) => {
  if (mode === OLD_HEADER || (mode === NEW_HEADER && isPageDesktop(page))) {
    await openMenu(page, "filter")
  } else {
    await openContentSettingsTab(page, "filters", dir)
  }
}

export const openContentTypes = async (
  page: Page,
  mode: HeaderMode = NEW_HEADER,
  dir: LanguageDirection = "ltr"
) => {
  if (mode === OLD_HEADER || (mode === NEW_HEADER && isPageDesktop(page))) {
    await openMenu(page, "contentSwitcher")
  } else {
    await openContentSettingsTab(page, "contentTypes", dir)
  }
}

export const isPageDesktop = (page: Page, mode: HeaderMode = NEW_HEADER) => {
  const pageWidth = page.viewportSize()?.width
  if (!pageWidth) return false
  const desktopMinWidth = mode === NEW_HEADER ? 1024 : 768
  return pageWidth >= desktopMinWidth
}
/**
 * Returns `true` if the `selector`'s `aria-pressed` attribute is `true`.
 */
const getPressed = async (page: Page, selector: string) => {
  return (
    (await page.getAttribute(selector, "aria-pressed")) === "true" ||
    (await page.getAttribute(selector, "aria-expanded")) === "true"
  )
}

/**
 * Clicks the `selector` button if it is not already pressed.
 */
const ensureButtonPressed = async (page: Page, selector: string) => {
  if (!(await getPressed(page, selector))) {
    await page.click(selector)
    expect(await getPressed(page, selector)).toEqual(true)
  }
}
/**
 * Open the Content types tab in the mobile content settings modal.
 */
export const openContentSettingsTab = async (
  page: Page,
  tab: "contentTypes" | "filters" = "contentTypes",
  dir: LanguageDirection = "ltr"
) => {
  const selector = buttonSelectors.mobileContentSettings

  await ensureButtonPressed(page, selector)

  const tabLabel = t(
    tab === "contentTypes" ? "search-type.heading" : "filters.title",
    dir
  )
  await page.locator(`button[role="tab"]:has-text("${tabLabel}")`).click()
}

export const closeFilters = async (
  page: Page,
  mode: HeaderMode = NEW_HEADER
) => {
  if (mode === OLD_HEADER || (mode === NEW_HEADER && isPageDesktop(page))) {
    const selector = buttonSelectors["filter"]

    if (await isButtonPressed(page, selector)) {
      await page.click(selector)
      expect(await isButtonPressed(page, selector)).toEqual(false)
    }
  } else {
    await closeMobileMenu(page, mode)
  }
}

/**
 * Previous to the `new_header` milestone, the mobile menu had a text button, now it is an icon button.
 */
export const closeMobileMenu = async (
  page: Page,
  mode: HeaderMode = NEW_HEADER,
  dir: LanguageDirection = "ltr"
) => {
  if (mode === OLD_HEADER) {
    await page.click(`button:has-text('${t("modal.close", dir)}')`)
  } else {
    await page.click(`button[aria-label="${t("modal.aria-close", dir)}"]`)
  }
}

export const isMobileMenuOpen = async (page: Page) =>
  page.locator('[role="dialog"]').isVisible({ timeout: 100 })

export const assertCheckboxStatus = async (
  page: Page,
  label: string,
  forValue = "",
  status: "checked" | "unchecked" | "disabled" = "checked"
) => {
  const selector =
    forValue === ""
      ? `label:has-text('${label}')`
      : `label[for="${forValue}"]:has-text('${label}')`
  const checkbox = page.locator(selector)
  switch (status) {
    case "checked": {
      await expect(checkbox).not.toBeDisabled()
      await expect(checkbox).toBeChecked()
      break
    }
    case "unchecked": {
      await expect(checkbox).not.toBeDisabled()
      await expect(checkbox).not.toBeChecked()
      break
    }
    case "disabled": {
      await expect(checkbox).toBeDisabled()
    }
  }
}

export const changeContentType = async (
  page: Page,
  to: "Audio" | "Images" | "All content",
  mode: HeaderMode = NEW_HEADER
) => {
  if (mode === OLD_HEADER || isPageDesktop(page)) {
    await page.click(
      `button[aria-controls="content-switcher-popover"], button[aria-controls="content-switcher-modal"]`
    )
    // Ensure that the asynchronous navigation is finished before next steps
    await Promise.all([
      page.waitForNavigation(),
      page.locator(`#content-switcher-popover a:has-text("${to}")`).click(),
    ])
  } else {
    await openContentTypes(page, mode)
    await page.locator(`a[role="radio"]:has-text("${to}")`).click()
    await closeMobileMenu(page, mode)
  }
}

/**
 * For desktop, returns the content of the Content switcher button.
 * For mobile, returns the selected content type from the modal.
 * @param page - Playwright page object.
 * @param mode - `new` if `new_header` flag is on, `old` otherwise.
 */
export const currentContentType = async (
  page: Page,
  mode: HeaderMode = NEW_HEADER
) => {
  if (isPageDesktop(page)) {
    const contentSwitcherButton = await page.locator(
      `button[aria-controls="content-switcher-popover"]`
    )
    return (await contentSwitcherButton.textContent())?.trim()
  } else {
    await openContentTypes(page, mode)
    const currentContentType = await page
      .locator('a[aria-current="page"]')
      .textContent()
    await closeMobileMenu(page, mode)
    return currentContentType
  }
}

/**
 * Dismisses the translation banner if it is visible. It does not wait for the banner to become visible,
 * so the page should finish rendering before calling `dismissTranslationBanner`.
 */
export const dismissTranslationBanner = async (page: Page) => {
  const bannerCloseButton = page.locator(
    '[data-testid="banner-translation"] button'
  )
  if (await bannerCloseButton.isVisible()) {
    await bannerCloseButton.click()
  }
}

export const selectHomepageSearchType = async (
  page: Page,
  searchType: SupportedSearchType,
  dir: LanguageDirection = "ltr",
  headerMode: HeaderMode = NEW_HEADER
) => {
  const pageWidth = page.viewportSize()?.width
  // TODO: replace when the search types can only be selected using the popover/modal
  console.log("Selecting homepage search type in header mode", headerMode)
  // if (headerMode === NEW_HEADER || (pageWidth && pageWidth > SCREEN_SIZES.sm)) {
  //   await page.getByRole("button", { name: t("search-type.all", dir) }).click()
  //
  //   await page
  //     .getByRole("radio", { name: searchTypeNames[dir][searchType] })
  //     .click()
  // } else {
  //   await page.click(`button:has-text("${searchTypeNames[dir][searchType]}")`)
  // }

  if (pageWidth && pageWidth > SCREEN_SIZES.sm) {
    await page.click(`[aria-label="${t("search-type.all", dir)}"]`)
    await page.click(
      `button[role="radio"]:has-text("${searchTypeNames[dir][searchType]}")`
    )
  } else {
    await page.click(`button:has-text("${searchTypeNames[dir][searchType]}")`)
  }
}

export const goToSearchTerm = async (
  page: Page,
  term: string,
  options: {
    searchType?: SupportedSearchType
    mode?: RenderMode
    dir?: LanguageDirection
    query?: string // Only for SSR mode
    headerMode?: HeaderMode
  } = {}
) => {
  const searchType = options.searchType || ALL_MEDIA
  const dir = options.dir || "ltr"
  const mode = options.mode ?? "SSR"
  const query = options.query ? `&${options.query}` : ""
  const headerMode = options.headerMode ?? NEW_HEADER

  if (mode === "SSR") {
    const path = `search/${searchTypePath(searchType)}?q=${term}${query}`
    await page.goto(pathWithDir(path, dir))
    await dismissTranslationBanner(page)
  } else {
    await page.goto(pathWithDir(`/${query}`, dir))
    await dismissTranslationBanner(page)
    // Select the search type
    if (searchType !== "all") {
      await selectHomepageSearchType(page, searchType, dir, headerMode)
    }
    // Type search term
    const searchInput = page.locator('main input[type="search"]')
    await searchInput.type(term)
    // Click search button
    // Wait for navigation
    await Promise.all([
      page.waitForNavigation(),
      await page.getByRole("button", { name: t("search.search", dir) }).click(),
    ])
    await page.waitForLoadState("load")
  }
  await scrollDownAndUp(page)
}

/**
 * Fills the search input in the page header, clicks on submit
 * and waits for navigation.
 */
export const searchFromHeader = async (page: Page, term: string) => {
  // Double click on the search bar to remove previous value
  await page.dblclick("id=search-bar")
  await page.fill("id=search-bar", term)
  await Promise.all([page.waitForNavigation(), page.keyboard.press("Enter")])
}

/**
 * Click on the first <mediaType> result: a link that contains
 * /<mediaType>/ in its URL. We cannot use the 'startsWith' `^` matcher
 * because localized routes start with the locale prefix (e.g. /ar/image/).
 * Scroll down and up to load all lazy-loaded content.
 */
export const openFirstResult = async (page: Page, mediaType: MediaType) => {
  await Promise.all([
    page.waitForNavigation(),
    page
      .locator(`a[href*="/${mediaType}/"]`)
      .first()
      .click({
        position: { x: 32, y: 32 },
      }),
  ])
  await scrollDownAndUp(page)
}

/**
 * Click on the first <mediaType> related result: a link that contains
 * /<mediaType>/ in its URL in the 'aside' element for related media.
 * We cannot use the 'startsWith' `^` matcher because localized routes
 * start with the locale prefix (e.g. /ar/image/).
 * Scroll down and up to load all lazy-loaded content.
 */
export const openFirstRelatedResult = async (
  page: Page,
  mediaType: MediaType
) => {
  await page.locator(`aside a[href*="/${mediaType}/"]`).first().click()
  await scrollDownAndUp(page)
}

export const scrollToBottom = async (page: Page) => {
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight)
  })
}

export const scrollToTop = async (page: Page) => {
  await page.evaluate(() => {
    window.scrollTo(0, 0)
  })
  await sleep(200)
}

/**
 * Used to load all lazy-loaded images in the page.
 */
export const scrollDownAndUp = async (page: Page) => {
  await scrollToBottom(page)
  await page.waitForLoadState("load")
  await scrollToTop(page)
}

/**
 * Adds '/ar' prefix to a rtl route. The path should start with '/'
 */
export const pathWithDir = (rawPath: string, dir: string) => {
  const path = rawPath.startsWith("/") ? rawPath : `/${rawPath}`
  return dir === "rtl" ? `/ar${path}` : path
}

export const enableNewHeader = async (page: Page) => {
  // Add the new_header cookie
  await page.context().addCookies([
    {
      name: "features",
      value: "%7B%22new_header%22%3A%22on%22%7D",
      domain: "localhost",
      path: "/",
    },
  ])
}

export const setCookies = async (
  context: BrowserContext,
  cookies: Record<string, string | boolean | string[]>
) => {
  await context.addCookies(
    Object.entries(cookies).map(([name, value]) => ({
      name,
      value: typeof value === "string" ? value : JSON.stringify(value),
      domain: "localhost",
      path: "/",
      maxAge: 60 * 5,
    }))
  )
}
