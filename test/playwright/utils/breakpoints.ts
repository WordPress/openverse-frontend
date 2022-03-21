import { test } from '@playwright/test'

import {
  Breakpoints as AllBreakpoints,
  SCREEN_SIZES,
} from '~/constants/screens'

type Breakpoint = Exclude<AllBreakpoints, 'mob'>

const makeBreakpointDescribe =
  (breakpoint: Breakpoint, screenWidth: number) =>
  (block: (breakpoint: Breakpoint) => void) => {
    test.describe(
      `screen at breakpoint ${breakpoint} with width ${screenWidth}`,
      () => {
        test.use({ viewport: { width: screenWidth, height: 700 } })
        block(breakpoint)
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
  (breakpoints: Breakpoint[]) => (block: (breakpoint: Breakpoint) => void) => {
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
