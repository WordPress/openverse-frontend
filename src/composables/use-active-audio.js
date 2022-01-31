import { useState } from '#app'

export function useActiveAudio() {
  const obj = useState(
    'active-audio',
    () => /** @type {HTMLAudioElement | undefined} */ (undefined)
  )
  return Object.freeze({ obj })
}
