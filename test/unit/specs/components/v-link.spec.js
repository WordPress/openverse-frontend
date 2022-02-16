import { render, screen } from '@testing-library/vue'

import VLink from '~/components/VLink.vue'
const nuxtLinkStub = {
  template: '<a v-on="$listeners"><slot /></a>',
  props: ['to'],
}
const nuxtContextMock = {
  $nuxt: { context: { app: { localePath: (v) => v } } },
}
test.each`
  href                        | target      | rel
  ${'/about'}                 | ${null}     | ${null}
  ${'http://localhost:8443/'} | ${'_blank'} | ${'noopener noreferrer'}
`('Creates a correct link component based on href', ({ href, target, rel }) => {
  render(VLink, {
    attrs: { href },
    stubs: { NuxtLink: nuxtLinkStub },
    mocks: nuxtContextMock,
  })
  const link = screen.getByRole('link')
  const expectedHref = href.startsWith('/') ? `http://localhost${href}` : href

  expect(link.href).toEqual(expectedHref)
  expect(link.getAttribute('target')).toEqual(target)
  expect(link.getAttribute('rel')).toEqual(rel)
})
