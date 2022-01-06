import VSearchResultsTitle from '~/components/VSearchResultsTitle'
import { render, screen } from '@testing-library/vue'

describe('VSearchResultsTitle', () => {
  let options = {
    props: {
      size: 'large',
    },
    slots: {
      default: () => 'zack',
    },
  }

  it('should render an h1 tag containing the correct text', async () => {
    render(VSearchResultsTitle, options)
    const button = await screen.findByText('zack')
    expect(button.tagName).toBe('H1')
  })
})
