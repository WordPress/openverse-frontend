import { test, PlaywrightTestArgs, TestInfo } from '@playwright/test'

import { Breakpoints, SCREEN_SIZES } from '../../../src/constants/screens'

export const testEachBreakpoint = (title: string, testCb: (breakpoint: Breakpoints, args: PlaywrightTestArgs,testInfo: TestInfo ) => Promise<void>) => {
  SCREEN_SIZES.forEach((screenWidth, breakpoint) => {
    test.describe(`screen at breakpoint ${breakpoint} with width ${screenWidth}`, () => {
      test(title, async ({ page, context, request }, testInfo) => {
        await page.setViewportSize({ width: screenWidth, height: 700 })
        await testCb(breakpoint, {page, context, request }, testInfo)
      })
    })
  })
}
