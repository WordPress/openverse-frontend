import { render, screen } from '@testing-library/vue'
import Checkbox from '~/components/Checkbox'
import ByIcon from '~/assets/licenses/by.svg?inline'

describe('Checkbox', () => {
  it('should render a checkbox with a string label', () => {
    render(Checkbox, { propsData: { id: 'simple', label: 'Is Code Poetry?' } })
    // Get throws an error if element is not found, so this serves as an assert
    screen.getByLabelText(/code/i, { checked: false })
  })

  it('should become checked when clicked', async () => {
    render(Checkbox, { propsData: { id: 'simple', label: 'Is Code Poetry?' } })
    const checkbox = screen.getByText(/code/i)
    await checkbox.click()
    screen.getByText(/code/i, { checked: true })
  })

  it('should render icons if provided in the default slot', async () => {
    // @obulat: I cannot pass a required prop to `License` object to use it in the slot,
    // nor can I check that svg is rendered using its accessible role. But if you use
    // `screen.debug()`, you can see it is rendered :)
    render(Checkbox, {
      propsData: { id: 'simple', label: 'Is Code Poetry?' },
      slots: { default: ByIcon },
    })
    const checkbox = screen.getByRole('checkbox')
    await checkbox.click()
    screen.getByRole('checkbox', { checked: true })
  })
})
