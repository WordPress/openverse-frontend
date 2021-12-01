import { render, screen } from '@testing-library/vue'
import VLogoLoader, {
  noLoaderLabelWarning,
} from '~/components/VLogoLoader/VLogoLoader.vue'
import { warn } from '~/utils/warn'

jest.mock('~/utils/warn', () => ({
  warn: jest.fn(),
}))

jest.mock('~/composables/use-media-query', () => ({
  useReducedMotion: jest.fn(() => true),
}))

describe('VLogoLoader', () => {
  it('should render the logo', () => {
    render(VLogoLoader, { props: { loadingLabel: 'Loading images' } })
    const element = screen.getByTestId('loading-icon')
    expect(element).toBeInTheDocument()
  })

  it('should complain if there is not a label', () => {
    render(VLogoLoader, {})
    expect(warn).toHaveBeenCalledWith(noLoaderLabelWarning)
  })

  describe('accessibility', () => {
    it('should render differently when the user prefers reduced motion', () => {
      render(VLogoLoader, {
        props: { loadingLabel: 'Loading images', status: 'loading' },
      })
      const element = screen.getByRole('status')
      expect(element).toHaveAttribute('data-prefers-reduced-motion', 'true')
    })
  })
})
