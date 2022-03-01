import { test, PlaywrightTestArgs, TestInfo } from '@playwright/test'

import {
  Breakpoints as AllBreakpoints,
  SCREEN_SIZES,
} from '../../../src/constants/screens'

type Breakpoint = Exclude<AllBreakpoints, 'mob'>

type TestCallback = (
  breakpoint: Breakpoint,
  args: PlaywrightTestArgs,
  testInfo: TestInfo
) => Promise<void>

type BreakpointTest = {
  (title: string, testCb: TestCallback): void
  skip: (title: string, testCb: TestCallback) => void
  only: (title: string, testCb: TestCallback) => void
}

const makeBreakpointTest = (breakpoint: Breakpoint, screenWidth: number) => {
  const makeTest =
    (modifier?: 'skip' | 'only') => (title: string, testCb: TestCallback) => {
      test.describe(
        `screen at breakpoint ${breakpoint} with width ${screenWidth}`,
        () => {
          const testFn = modifier ? test[modifier] : test
          testFn(title, async ({ page, context, request }, testInfo) => {
            await page.setViewportSize({ width: screenWidth, height: 700 })
            await testCb(breakpoint, { page, context, request }, testInfo)
          })
        }
      )
    }

  const fn = makeTest() as BreakpointTest

  fn.skip = makeTest('skip')
  fn.only = makeTest('only')

  return fn
}

const capitalize = (s: string) => `${s[0].toUpperCase()}${s.slice(1)}`

const breakpointTests = Array.from(SCREEN_SIZES.entries()).reduce(
  (tests, [breakpoint, screenWidth]) =>
    Object.assign(tests, {
      [`test${capitalize(breakpoint)}`]: makeBreakpointTest(
        breakpoint,
        screenWidth
      ),
    }),
  {} as Record<
    `test${Capitalize<Breakpoint>}`,
    ReturnType<typeof makeBreakpointTest>
  >
)

const testEachBreakpoint =
  (breakpoints: Breakpoint[]) => (title: string, testCb: TestCallback) => {
    Object.entries(breakpointTests).forEach(([bp, t]) => {
      if (
        breakpoints.includes(bp.replace('test', '').toLowerCase() as Breakpoint)
      )
        t(title, testCb)
    })
  }

const testEvery = testEachBreakpoint(Array.from(SCREEN_SIZES.keys()))
const testEachDesktop = testEachBreakpoint(['2xl', 'xl', 'lg', 'md'])
const testEachMobile = testEachBreakpoint(['sm', 'xs'])

export default {
  ...breakpointTests,
  testEachBreakpoint,
  testEvery,
  testEachDesktop,
  testEachMobile,
}
