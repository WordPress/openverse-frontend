import { setActivePinia, createPinia } from 'pinia'

import { useLoadedAudio } from '~/stores/loaded-audio'

const audioId = '1234-asdf-1234-asdf'

describe('loaded-audio store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should return false by default', () => {
    expect(useLoadedAudio().isLoaded(audioId)).toBe(false)
  })

  it('should set the audio by id to loaded', () => {
    const loadedAudio = useLoadedAudio()
    loadedAudio.setLoaded(audioId)
    expect(loadedAudio.isLoaded(audioId)).toBe(true)
  })
})
