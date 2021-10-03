import RelatedImages from '~/components/ImageDetails/RelatedImages'
import render from '../../test-utils/render'
import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'

const serviceMock = {
  getRelatedMedia: jest.fn(() =>
    Promise.resolve({ data: { results: ['img1', 'img2'] } })
  ),
}

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueI18n)
localVue.prototype.$nuxt = {
  nbFetching: 0,
}

const doRender = async () => {
  return render(
    RelatedImages,
    {
      localVue,
      propsData: { imageId: 'foo', service: serviceMock },
      mocks: { $fetchState: { pending: false, error: null, timestamp: null } },
      stubs: { ImageGrid: true },
    },
    mount
  )
}

describe('RelatedImage', () => {
  it('should render content when finished loading related images', async () => {
    const wrapper = await doRender()

    const header = wrapper.find('h3').text()
    expect(header).toEqual('photo-details.related-images')

    const imageGridStub = wrapper.find('imagegrid-stub')
    expect(imageGridStub.attributes().images).toEqual('img1,img2')

    expect(serviceMock.getRelatedMedia).toHaveBeenCalledTimes(1)
  })
})
