import RelatedImages from '~/components/RelatedImages'
import render from '../../test-utils/render'
import { mount } from '@vue/test-utils'

const serviceMock = {
  getRelatedMedia: jest.fn(() =>
    Promise.resolve({ data: { results: ['img1', 'img2'] } })
  ),
}

const doRender = async () => {
  const wrapper = render(
    RelatedImages,
    {
      propsData: { imageId: 'foo' },
      mocks: { $fetchState: { pending: false, error: null, timestamp: null } },
      stubs: { GridImageGrid: true },
      data: () => ({
        service: serviceMock,
      }),
    },
    mount
  )
  await RelatedImages.fetch.call(wrapper.vm)
  return wrapper
}

describe('RelatedImage', () => {
  it('should render content when finished loading related images', async () => {
    const wrapper = await doRender()
    const relatedElement = wrapper.find('aside')
    expect(relatedElement).toBeDefined()
    const header = wrapper.find('h3').text()
    expect(header).toEqual('photo-details.related-images')
    const imageGridStub = wrapper.find('gridiagegrid-stub')
    expect(imageGridStub).toBeDefined()
    expect(serviceMock.getRelatedMedia).toHaveBeenCalledWith({ id: 'foo' })
  })
})
