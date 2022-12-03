/**
 */

export * from '~~/.nuxt-storybook/storybook/preview'
import {
  globalTypes as nuxtGlobalTypes,
  decorators as nuxtDecorators,
} from '~~/.nuxt-storybook/storybook/preview'

// eslint-disable-next-line import/order
import { WithRTL } from './decorators/with-rtl'
import { WithUiStore } from './decorators/with-ui-store'

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

export const decorators = [...nuxtDecorators, WithRTL, WithUiStore]
