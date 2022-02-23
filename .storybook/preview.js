// eslint-disable-next-line import/export
export * from '~~/.nuxt-storybook/storybook/preview.js'
import {
  globalTypes as nuxtGlobalTypes,
  decorators as nuxtDecorators,
} from '~~/.nuxt-storybook/storybook/preview.js'

import { WithRTL } from './decorators/with-rtl'

// eslint-disable-next-line import/export
export const globalTypes = {
  ...nuxtGlobalTypes,
  languageDirection: {
    name: 'RTL',
    description: 'Simulate an RTL language.',
    defaultValue: 'ltr',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'ltr', title: 'LTR' },
        { value: 'rtl', title: 'RTL' },
      ],
    },
  },
}

// eslint-disable-next-line import/export
export const decorators = [...nuxtDecorators, WithRTL]
