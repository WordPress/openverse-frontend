import HeroSection from '~/components/HeroSection'
import render from '../../test-utils/render'
import { SET_QUERY } from '~/constants/mutation-types'
import { SEARCH } from '~/constants/store-modules'

describe('HeroSection', () => {
  let options = {}
  let commitMock = null

  beforeEach(() => {
    commitMock = jest.fn()
    options = {
      stubs: { HomeLicenseFilter: true },
      mocks: {
        $router: {
          push: () => {},
        },
        $store: {
          commit: commitMock,
        },
      },
    }
  })
  it('should render correct contents', () => {
    const wrapper = render(HeroSection, options)
    expect(wrapper.find('.hero').element).toBeDefined()
    expect(wrapper.find('.hero-search__form').element).toBeDefined()
  })

  it('should search when a query is entered', async () => {
    const wrapper = render(HeroSection, options)
    const form = wrapper.find('.hero-search__form')
    const input = wrapper.find('input[type="search"]')

    await input.setValue('me')
    await input.trigger('change')
    await form.trigger('submit.prevent')

    expect(commitMock).toHaveBeenCalledWith(`${SEARCH}/${SET_QUERY}`, {
      query: { q: 'me' },
    })
  })
})
