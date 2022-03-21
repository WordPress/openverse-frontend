import { test, expect } from '@playwright/test'

import {
  Breakpoints as AllBreakpoints,
  SCREEN_SIZES,
} from '~/constants/screens'

type Breakpoint = Exclude<AllBreakpoints, 'mob'>

type ScreenshotAble = {
  screenshot(): Promise<Buffer>
}

type ExpectSnapshot = (name: string, s: ScreenshotAble) => Promise<Buffer>

type BreakpointBlock = (options: {
  getConfigValues: (name: string) => {
    name: `${typeof name}-${Breakpoint}.png`
  }
  breakpoint: Breakpoint
  expectSnapshot: ExpectSnapshot
}) => void

const makeBreakpointDescribe =
  (breakpoint: Breakpoint, screenWidth: number) => (block: BreakpointBlock) => {
    test.describe(
      `screen at breakpoint ${breakpoint} with width ${screenWidth}`,
      () => {
        test.use({ viewport: { width: screenWidth, height: 700 } })
        const getConfigValues = (name: string) => ({
          name: `${name}-${breakpoint}.png` as const,
        })
        const expectSnapshot = async (
          name: string,
          screenshotAble: ScreenshotAble
        ) => {
          const { name: snapshotName } = getConfigValues(name)
          return expect(await screenshotAble.screenshot()).toMatchSnapshot({
            name: snapshotName,
          })
        }

        block({ breakpoint, getConfigValues, expectSnapshot })
      }
    )
  }

const capitalize = (s: string): Capitalize<typeof s> =>
  `${s[0].toUpperCase()}${s.slice(1)}`

const breakpointTests = Array.from(SCREEN_SIZES.entries()).reduce(
  (tests, [breakpoint, screenWidth]) =>
    Object.assign(tests, {
      [`describe${capitalize(breakpoint)}`]: makeBreakpointDescribe(
        breakpoint,
        screenWidth
      ),
    }),
  {} as Record<
    `describe${Capitalize<Breakpoint>}`,
    ReturnType<typeof makeBreakpointDescribe>
  >
)

const describeEachBreakpoint =
  (breakpoints: Breakpoint[]) => (block: BreakpointBlock) => {
    Object.entries(breakpointTests).forEach(([bp, describe]) => {
      if (
        breakpoints.includes(
          bp.replace('describe', '').toLowerCase() as Breakpoint
        )
      )
        describe(block)
    })
  }

const describeEvery = describeEachBreakpoint(Array.from(SCREEN_SIZES.keys()))
const describeEachDesktop = describeEachBreakpoint(['2xl', 'xl', 'lg', 'md'])
const describeEachMobile = describeEachBreakpoint(['sm', 'xs'])

export default {
  ...breakpointTests,
  describeEachBreakpoint,
  describeEvery,
  describeEachDesktop,
  describeEachMobile,
}
