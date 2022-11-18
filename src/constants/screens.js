/**
 * This file cannot be converted to TypeScript because it's referenced in the
 * Tailwind config.
 *
 * @typedef {'2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs'} Breakpoint
 * @typedef {Exclude<Breakpoint, 'xs'>} RealBreakpoint
 * @typedef {{ name: string, styles: { width: string, height: string }}} Viewport
 */

/**
 * mapping of breakpoint names to the lower-bound of their screen width range
 *
 * @type {Record<RealBreakpoint, number>}
 */
const SCREEN_SIZES = {
  '2xl': 1536,
  xl: 1280,
  lg: 1024,
  md: 768,
  sm: 640,
}

/**
 * mapping of breakpoint names to the lower-bound of their screen width range,
 * with the 'px' suffix attached; This is used by Tailwind.
 */
const SCREENS = /** @type {Record<RealBreakpoint, string>} */ (
  Object.fromEntries(
    Object.entries(SCREEN_SIZES)
      .map(([key, val]) => [key, `${val}px`])
      .reverse()
  )
)

/**
 * mapping of breakpoint names to viewport specifications; This is used by
 * the viewports plugin of Storybook.
 */
const VIEWPORTS = /** @type {Record<Breakpoint, Viewport>} */ (
  Object.fromEntries(
    Object.entries(SCREEN_SIZES)
      .concat([['xs', 340]])
      .map(([key, val]) => [
        key,
        {
          name: `${key} (${val}px)`,
          styles: { width: `${val}px`, height: '768px' },
        },
      ])
  )
)

/**
 * This module is consumed by Nuxt and Tailwind config, so it needs to use CJS modules.
 */
module.exports = {
  SCREEN_SIZES,
  SCREENS,
  VIEWPORTS,
}
