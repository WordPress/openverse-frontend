import { createApp } from 'vue-demi'

import { createPinia, setActivePinia } from '~~/test/unit/test-utils/pinia'

import useUiState from '~/composables/use-ui-state'
import { useUiStore } from '~/stores/ui'

const cookieOptions = {
  maxAge: 5184000,
  path: '/',
  sameSite: 'strict',
  secure: false,
}

describe('useUiState', () => {
  const app = { $cookies: { set: jest.fn() } }
  const vueApp = createApp({})
  let pinia = null
  beforeEach(() => {
    pinia = createPinia()
    vueApp.use(pinia)
    setActivePinia(pinia)
  })
  afterEach(() => {
    app.$cookies.set.mockReset()
  })

  it.each`
    initialState | updateState | expectedState
    ${true}      | ${false}    | ${false}
    ${true}      | ${true}     | ${true}
    ${false}     | ${true}     | ${true}
    ${false}     | ${false}    | ${false}
  `(
    'updateBreakpoint($updateState) changes $initialState to $expectedState',
    ({ initialState, updateState, expectedState }) => {
      const uiStore = useUiStore()
      const { updateBreakpoint } = useUiState(app)
      uiStore.$patch({ isDesktopLayout: initialState })
      expect(uiStore.isDesktopLayout).toEqual(initialState)

      updateBreakpoint(updateState)

      expect(uiStore.isDesktopLayout).toBe(expectedState)
      if (initialState !== expectedState) {
        expect(app.$cookies.set).toHaveBeenCalledWith(
          'uiIsDesktopLayout',
          expectedState,
          cookieOptions
        )
      } else {
        expect(app.$cookies.set).not.toHaveBeenCalled()
      }
    }
  )

  it.each`
    isFilterDismissed | layout       | visible  | expectedState
    ${true}           | ${'mobile'}  | ${false} | ${false}
    ${true}           | ${'mobile'}  | ${true}  | ${true}
    ${false}          | ${'mobile'}  | ${true}  | ${true}
    ${false}          | ${'mobile'}  | ${false} | ${false}
    ${true}           | ${'desktop'} | ${false} | ${false}
    ${true}           | ${'desktop'} | ${true}  | ${true}
    ${false}          | ${'desktop'} | ${true}  | ${true}
    ${false}          | ${'desktop'} | ${false} | ${false}
  `(
    'setFiltersState($visible) on $layout when isFiltersDismissed is $isFilterDismissed sets isFilterVisible to $expectedState',
    ({ isFilterDismissed, layout, visible, expectedState }) => {
      const uiStore = useUiStore()
      const { setFiltersState } = useUiState(app)
      const isDesktopLayout = layout === 'desktop'
      uiStore.$patch({ isFilterDismissed, isDesktopLayout })

      setFiltersState(visible)

      expect(uiStore.isFilterVisible).toBe(expectedState)

      if (isDesktopLayout && isFilterDismissed === visible) {
        expect(app.$cookies.set).toHaveBeenCalledWith(
          'uiIsFilterDismissed',
          !expectedState,
          cookieOptions
        )
      } else {
        expect(app.$cookies.set).not.toHaveBeenCalled()
      }
    }
  )
})
