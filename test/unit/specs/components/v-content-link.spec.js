import VContentLink from '~/components/VContentLink/VContentLink.vue'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import VueI18n from 'vue-i18n'

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
      props: { mediaType: 'image', resultsCount: 123 },
      mocks: {
        $nuxt: {
          context: {
            i18n,
          },
        },
      },
    }
  })

  it('is not selected by default', () => {
    render(VContentLink, options)
    const btn = screen.getByRole('radio')
    expect(btn).not.toHaveAttribute('aria-checked')
  })

  it('is marked as selected when indicated with the isSelected prop', () => {
    options.props.isSelected = true
    render(VContentLink, options)
    const btn = screen.getByRole('radio')
    expect(btn).toHaveAttribute('aria-checked')
    expect(btn.getAttribute('aria-checked')).toBeTruthy()
  })

  it('should emit selected event on click', () => {
    const { emitted } = render(VContentLink, options)
    const btn = screen.getByText('search-tab.image')
    userEvent.click(btn)
    expect(emitted().selected).toBeTruthy()
  })
})
