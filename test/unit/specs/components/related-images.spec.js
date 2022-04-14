import VueI18n from 'vue-i18n'
import { createLocalVue } from '@vue/test-utils'
import { render, screen } from '@testing-library/vue'
import { createPinia, PiniaVuePlugin } from 'pinia'

import messages from '~/locales/en.json'

import VRelatedImages from '~/components/VImageDetails/VRelatedImages.vue'

const serviceMock = jest.fn(() =>
  Promise.resolve({
    results: [
      { id: 'img1', url: 'https://wp.org/img1.jpg' },
      { id: 'img2', url: 'https://wp.org/img2.jpg' },
    ],
  })
)
const failedMock = jest.fn(() => Promise.reject('No result'))
const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en: messages },
})
const localVue = createLocalVue()
localVue.use(VueI18n)
localVue.use(PiniaVuePlugin)
// without nbFetching property on $nuxt, Nuxt's `fetch` hook throws an error:
//  [Vue warn]: Error in beforeMount hook (Promise/async):
//  "TypeError: Cannot read property 'nbFetching' of undefined"
localVue.prototype.$nuxt = {
  nbFetching: 0,
  context: i18n,
}

describe('RelatedImage', () => {
  let props
  let options
  let pinia
  beforeEach(() => {
    pinia = createPinia()
    props = {
      imageId: 'foo',
      service: { getRelatedMedia: serviceMock },
    }
    options = {
      localVue,
      pinia,
      propsData: props,
      stubs: ['VLicense', 'NuxtLink'],
      mocks: { $nuxt: { context: { i18n } } },
    }
  })
  it('should render an image grid', async () => {
    // await `render` to get the component after Nuxt's `fetch` call
    await render(VRelatedImages, options)

    expect(screen.getByRole('heading').textContent).toContain(
      'image-details.related-images'
    )
    expect(screen.queryAllByRole('img').length).toEqual(2)
    expect(screen.queryAllByRole('figure').length).toEqual(2)
  })

  it('should not render data service rejects with an error', async () => {
    options.propsData.service.getRelatedMedia = failedMock
    // await `render` to get the component after Nuxt's `fetch` call
    await render(VRelatedImages, options)
    expect(screen.getByRole('heading').textContent).toContain(
      'image-details.related-images'
    )
    expect(screen.queryAllByRole('img').length).toEqual(0)
  })
})
