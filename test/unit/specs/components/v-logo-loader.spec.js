import { render, screen } from '@testing-library/vue'
import VLogoLoader from '~/components/VLogoLoader/VLogoLoader.vue'

jest.mock('~/utils/warn', () => ({
  warn: jest.fn(),
}))

jest.mock('~/composables/use-media-query', () => ({
  useReducedMotion: jest.fn(() => true),
}))

describe('VLogoLoader', () => {
  it('should render the logo', () => {
    render(VLogoLoader)
    const element = screen.getByTestId('logo-loader')
    expect(element).toBeInTheDocument()
  })

  describe('accessibility', () => {
    it('should render differently when the user prefers reduced motion', () => {
      render(VLogoLoader, {
        props: { status: 'loading' },
      })
      const element = screen.getByTestId('logo-loader')
      expect(element).toHaveAttribute('data-prefers-reduced-motion', 'true')
    })

    it.todo('Should render as an aria live region when status is loading')
  })
})
