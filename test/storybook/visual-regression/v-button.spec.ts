import { expect, test } from '@playwright/test'

import { makeGotoWithArgs } from '~~/test/storybook/utils/args'

import { buttonVariants } from '~/types/button'

const buttonLocator = 'text=Code is Poetry'

test.describe('VButton', () => {
  const gotoWithArgs = makeGotoWithArgs('components-vbutton--v-button')
  const nonPressedVariants = buttonVariants.filter(
    (name) => !name.endsWith('pressed')
  )
  for (const variant of nonPressedVariants) {
    test(`resting ${variant}`, async ({ page }) => {
      await gotoWithArgs(page, { variant })
      expect(await page.locator(buttonLocator).screenshot()).toMatchSnapshot({
        name: `${variant}-resting.png`,
      })
    })
    test(`focused ${variant}`, async ({ page }) => {
      await gotoWithArgs(page, { variant })
      await page.focus(buttonLocator)
      expect(await page.locator(buttonLocator).screenshot()).toMatchSnapshot({
        name: `${variant}-hovered.png`,
      })
    })
    test(`hovered ${variant}`, async ({ page }) => {
      await gotoWithArgs(page, { variant })
      await page.hover(buttonLocator)
      expect(await page.locator(buttonLocator).screenshot()).toMatchSnapshot({
        name: `${variant}-hovered.png`,
      })
    })

    test(`pressed ${variant}`, async ({ page }) => {
      await gotoWithArgs(page, { variant, pressed: true })
      expect(await page.locator(buttonLocator).screenshot()).toMatchSnapshot({
        name: `${variant}-pressed.png`,
      })
    })

    test(`pressed hovered ${variant}`, async ({ page }) => {
      await gotoWithArgs(page, { variant })
      await page.hover(buttonLocator)
      expect(await page.locator(buttonLocator).screenshot()).toMatchSnapshot({
        name: `${variant}-hovered.png`,
      })
    })

    test(`pressed focused ${variant}`, async ({ page }) => {
      await gotoWithArgs(page, { variant })
      await page.focus(buttonLocator)
      expect(await page.locator(buttonLocator).screenshot()).toMatchSnapshot({
        name: `${variant}-hovered.png`,
      })
    })
  }
})
