import { useFetchState } from '~/composables/use-fetch-state'

describe('useFetchState', () => {
  it('should use the default values', () => {
    const fetchState = useFetchState()

    expect(fetchState.isFetching).toEqual(false)
    expect(fetchState.isFinished).toEqual(false)
    expect(fetchState.fetchingError).toEqual(null)
    expect(fetchState.canFetch).toEqual(true)
    expect(fetchState.hasStarted).toEqual(false)
  })
  it('should start fetching', () => {
    const fetchState = useFetchState()
    fetchState.startFetching()

    expect(fetchState.isFetching).toEqual(true)
    expect(fetchState.isFinished).toEqual(false)
    expect(fetchState.fetchingError).toEqual(null)
    expect(fetchState.canFetch).toEqual(false)
    expect(fetchState.hasStarted).toEqual(true)
  })
  it('should end fetching with success', () => {
    const fetchState = useFetchState()
    fetchState.endFetching()

    expect(fetchState.isFetching).toEqual(false)
    expect(fetchState.isFinished).toEqual(false)
    expect(fetchState.fetchingError).toEqual(null)
    expect(fetchState.canFetch).toEqual(true)
    expect(fetchState.hasStarted).toEqual(true)
  })
  it('should end fetching with error', () => {
    const fetchState = useFetchState()
    fetchState.endFetching('Server Error')

    expect(fetchState.isFetching).toEqual(false)
    expect(fetchState.isFinished).toEqual(false)
    expect(fetchState.fetchingError).toEqual('Server Error')
    expect(fetchState.canFetch).toEqual(false)
    expect(fetchState.hasStarted).toEqual(true)
  })
  it('should set fetching to finished', () => {
    const fetchState = useFetchState()
    fetchState.setFinished()

    expect(fetchState.isFetching).toEqual(false)
    expect(fetchState.isFinished).toEqual(true)
    expect(fetchState.fetchingError).toEqual(null)
    expect(fetchState.canFetch).toEqual(false)
    expect(fetchState.hasStarted).toEqual(true)
  })
})
