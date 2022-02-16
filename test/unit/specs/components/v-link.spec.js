import { render, screen } from '@testing-library/vue'
import { warn } from '~/utils/warn'
import VLink from '~/components/VLink.vue'

jest.mock('~/utils/warn', () => ({ warn: jest.fn() }))

const nuxtLinkStub = {
  template: '<a v-on="$listeners"><slot /></a>',
  props: ['to'],
}
const nuxtContextMock = {
  $nuxt: { context: { app: { localePath: jest.fn() } } },
}
describe('VLink', () => {
  afterEach(() => {
    warn.mockReset()
  })

  it.each`
    href                        | target      | rel
    ${'/about'}                 | ${null}     | ${null}
    ${'http://localhost:8443/'} | ${'_blank'} | ${'noopener noreferrer'}
  `(
    'Creates a correct link component based on href',
    ({ href, target, rel }) => {
      render(VLink, {
        attrs: { href },
        stubs: { NuxtLink: nuxtLinkStub },
        mocks: nuxtContextMock,
      })
      const link = screen.getByRole('link')
      const expectedHref = href.startsWith('/')
        ? `http://localhost${href}`
        : href

      expect(link.href).toEqual(expectedHref)
      expect(link.getAttribute('target')).toEqual(target)
      expect(link.getAttribute('rel')).toEqual(rel)
    }
  )

  it.each([undefined, '', null, '#'])(
    'should warn if an anchor is used without a valid href: %s',
    async (href) => {
      render(VLink, {
        attrs: { href },
        stubs: { NuxtLink: nuxtLinkStub },
        mocks: nuxtContextMock,
        slots: { default: 'Code is Poetry' },
      })

      await screen.findByText(/code is poetry/i)

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(
        'VLink is missing a valid `href` attribute.'
      )
    }
  )
})
