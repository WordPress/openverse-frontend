import type * as CSS from 'csstype' // eslint-disable-line @typescript-eslint/no-unused-vars
/**
 * To use CSS custom properties in a component that uses TypeScript, add them here.
 * See example in `VWaveform.vue`
 */
declare module 'csstype' {
  interface Properties {
    '--usable-height'?: string
    '--unusable-height'?: string
    '--progress-time-left'?: string
    '--seek-time-left'?: string
    '--popover-height'?: string
  }
}
