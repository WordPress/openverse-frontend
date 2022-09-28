import { render, screen } from '@testing-library/vue'
import VueI18n from 'vue-i18n'

import VContentLink from '~/components/VContentLink/VContentLink.vue'

const enMessages = require('~/locales/en.json')

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en: enMessages },
})

describe('VContentLink', () => {
  let options = {}

  beforeEach(() => {
    options = {
      props: { mediaType: 'image', resultsCount: 123, to: '/images' },
      mocks: {
        $nuxt: {
          context: {
            i18n,
          },
        },
      },
    }
  })

  it('is enabled when there are results', () => {
    render(VContentLink, options)
    const btn = screen.getByRole('link')

    expect(btn).toHaveAttribute('href')
    expect(btn).not.toHaveAttribute('aria-disabled')
  })

  // TODO: Fix the component disabled a11y
  xit('is disabled when there are no results', () => {
    options.props.resultsCount = 0
    render(VContentLink, options)
    const btn = screen.getByRole('link')

    expect(btn).not.toHaveAttribute('href')
    expect(btn).toHaveAttribute('aria-disabled')
    expect(btn.getAttribute('aria-disabled')).toBeTruthy()
  })
})
