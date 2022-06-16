import { defineStore } from 'pinia'

export const useLoadedAudio = defineStore('loaded-audio', {
  state: (): Record<string, boolean> => ({}),
  actions: {
    setLoaded(id: string) {
      this[id] = true
    },
  },
  getters: {
    isLoaded: (state) => (id: string) => {
      return state[id] === true
    },
  },
})
