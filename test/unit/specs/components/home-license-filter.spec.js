import Vuex from 'vuex'
import { render, screen } from '@testing-library/vue'
import { createLocalVue } from '@vue/test-utils'
import HomeLicenseFilter from '~/components/HomeLicenseFilter'
import Checkbox from '~/components/Checkbox'

describe('HomeLicenseFilter', () => {
  let options = {}
  let localVue = null
  let propsData = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.component('Checkbox', Checkbox)
    propsData = {
      filters: { commercial: false, modification: false },
    }
    options = {
      localVue,
      props: propsData,
    }
  })

  it('renders checkboxes', async () => {
    await render(HomeLicenseFilter, options)
    screen.debug()
    const checkboxes = screen.queryAllByRole('checkbox')
    expect(checkboxes.length).toEqual(2)

    const commercialCheckbox = screen.queryByLabelText(/commercial/i)
    expect(commercialCheckbox).toBeTruthy()

    const modificationCheckbox = screen.queryByLabelText(/modification/i)
    expect(modificationCheckbox).toBeTruthy()
  })

  it('toggles checkboxes', async () => {
    render(HomeLicenseFilter, options)
    const commercialCheckbox = screen.queryByLabelText(/commercial/i)
    await commercialCheckbox.click()
    const checked = screen.queryAllByRole('checkbox', { checked: true })

    expect(checked.length).toEqual(1)
  })
})
