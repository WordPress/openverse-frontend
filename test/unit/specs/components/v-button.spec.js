import Vue from 'vue'
import { render, screen } from '@testing-library/vue'

import VButton from '~/components/VButton.vue'

/**
 * Throughout this suite we use the `screen.findBy*` functions to asynchronously
 * wait for the component to re-render. There might be some kind of performance
 * problem with the component's implementation, but if we don't "wait" for it
 * to settle, then all the props that are changed after `onMounted` completes
 * won't be rendered.
 */
describe('VButton', () => {
  it('should render a `button` by default with type="button" and no tabindex', async () => {
    render(VButton, {
      slots: { default: 'Code is Poetry' },
    })

    const element = await screen.findByRole('button')

    expect(element.tagName).toBe('BUTTON')
    expect(element).toHaveAttribute('type', 'button')
    expect(element).not.toHaveAttribute('tabindex')
  })

  it('should allow passing an explicit type', async () => {
    render(VButton, {
      props: { type: 'submit' },
      slots: { default: 'Code is Poetry' },
    })

    const element = await screen.findByRole('button')

    expect(element).toHaveAttribute('type', 'submit')
  })

  it('should allow passing in an explicit tabindex', async () => {
    render(VButton, {
      props: { tabindex: '-1' },
      slots: { default: 'Code is Poetry' },
    })

    const element = await screen.findByRole('button')

    expect(element).toHaveAttribute('tabindex', '-1')
  })

  it.each(['button', 'submit', 'reset', 'color', 'file', 'image'])(
    'should allow an input element that renders a button with the type %s',
    async (type) => {
      const TestWrapper = Vue.component('TestWrapper', {
        components: { VButton },
        template: `<label>Code is Poetry<VButton as="input" type="${type}" /></label>`,
      })
      render(TestWrapper)

      const element = await screen.findByLabelText(/code is poetry/i)

      expect(element.tagName).toBe('INPUT')
      expect(element).toHaveAttribute('type', type)
    }
  )

  // @todo(sarayourfriend) fix this failing test!
  it.skip('should render an anchor with no type attribute', async () => {
    render(VButton, {
      props: { as: 'a' },
      slots: { default: 'Code is Poetry' },
    })

    const element = await screen.findByText(/code is poetry/i)

    screen.debug(element)

    expect(element.tagName).toBe('A')
    expect(element).not.toHaveAttribute('type')
  })

  it('should render as a div with role and tabindex', async () => {
    render(VButton, {
      props: { as: 'div' },
      slots: { default: 'Code is Poetry' },
    })

    const element = await screen.findByRole('button')

    expect(element.tagName).toBe('DIV')
    expect(element).toHaveAttribute('role', 'button')
    expect(element).toHaveAttribute('tabindex', '0')
  })

  it('should render the disabled attribute on a button when the element is explicitly unfocusable and is disabled', async () => {
    render(VButton, {
      props: { disabled: true, focusable: false },
      slots: { default: 'Code is Poetry' },
    })

    const element = await screen.findByRole('button')

    // Vue renders the disabled attribute having a `true` value as `[disabled="disabled"]`
    expect(element).toHaveAttribute('disabled', 'disabled')
  })

  it('should not render the disabled attribute if the element is focusable', async () => {
    render(VButton, {
      props: { disabled: true, focusable: true },
      slots: { default: 'Code is Poetry' },
    })

    const element = await screen.findByRole('button')

    expect(element).not.toHaveAttribute('disabled')
  })

  it('should not render the disabled attribute on elements that do not support it', async () => {
    render(VButton, {
      props: { as: 'div', disabled: true, focusable: false },
      slots: { default: 'Code is Poetry' },
    })

    const element = await screen.findByRole('button')

    expect(element).not.toHaveAttribute('disabled')
  })
})
