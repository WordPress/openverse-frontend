import MediaProviderStore from '~/store/provider'

const store = {
  state: Object.assign(MediaProviderStore.state),
  dispatch: jest.fn(),
  commit: jest.fn(),
}

export default store
