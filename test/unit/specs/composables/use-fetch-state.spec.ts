import { useFetchState } from '~/composables/use-fetch-state'

describe('useFetchState', () => {
  it('should use the default values', () => {
    const fetchState = useFetchState()
    expect(fetchState.fetchingState).toEqual({
      isFetching: false,
      isFinished: false,
      fetchingError: null,
      canFetchAgain: true,
      hasStarted: false,
    })
  })
  it('should start fetching', () => {
    const fetchState = useFetchState()
    fetchState.startFetching()
    expect(fetchState.fetchingState).toEqual({
      isFetching: true,
      isFinished: false,
      fetchingError: null,
      canFetchAgain: false,
      hasStarted: true,
    })
  })
  it('should end fetching with success', () => {
    const fetchState = useFetchState()
    fetchState.endFetching()
    expect(fetchState.fetchingState).toEqual({
      isFetching: false,
      isFinished: false,
      fetchingError: null,
      canFetchAgain: true,
      hasStarted: true,
    })
  })
  it('should end fetching with error', () => {
    const fetchState = useFetchState()
    fetchState.endFetching({ errorMessage: 'Server Error' })
    expect(fetchState.fetchingState).toEqual({
      isFetching: false,
      isFinished: false,
      fetchingError: 'Server Error',
      canFetchAgain: false,
      hasStarted: true,
    })
  })
  it('should set fetching to finished', () => {
    const fetchState = useFetchState()
    fetchState.setFinished()
    expect(fetchState.fetchingState).toEqual({
      isFetching: false,
      isFinished: true,
      fetchingError: null,
      canFetchAgain: false,
      hasStarted: true,
    })
  })
})
