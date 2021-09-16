import HomeLicenseFilter from '~/components/HomeLicenseFilter'
import render from '../../test-utils/render'
import { FILTER } from '~/constants/store-modules'
import { TOGGLE_FILTER } from '~/constants/action-types'

describe('HomeLicenseFilter', () => {
  let options = {}
  let dispatchMock = null

  beforeEach(() => {
    dispatchMock = jest.fn()
    options = {
      mocks: {
        $store: {
          dispatch: dispatchMock,
          state: {
            filter: {
              filters: {
                licenseTypes: [
                  { code: 'commercial', name: 'Commercial usage' },
                  { code: 'modification', name: 'Allows modification' },
                ],
              },
            },
          },
        },
      },
    }
  })

  it('renders checkboxes', () => {
    const wrapper = render(HomeLicenseFilter, options)
    expect(wrapper.find('#commercial').element).toBeDefined()
    expect(wrapper.find('#modification').element).toBeDefined()
  })

  it('dispatches `TOGGLE_FILTER` when checkboxes selected', async () => {
    const wrapper = render(HomeLicenseFilter, options)
    const commercialChk = wrapper.find('#commercial')

    await commercialChk.setChecked(true)
    expect(dispatchMock).toHaveBeenCalledWith(`${FILTER}/${TOGGLE_FILTER}`, {
      code: 'commercial',
      filterType: 'licenseTypes',
    })
  })
})
