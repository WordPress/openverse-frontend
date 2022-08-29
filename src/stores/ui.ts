import { defineStore } from 'pinia'

export interface UiState {
  instructionsVisible: boolean
}

export const useUiStore = defineStore('ui', {
  state: (): UiState => ({
    instructionsVisible: true,
  }),

  actions: {
    dismissInstructions() {
      this.instructionsVisible = false
    },
  },
})
