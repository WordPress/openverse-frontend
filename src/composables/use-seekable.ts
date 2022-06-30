import { computed, ToRefs } from '@nuxtjs/composition-api'

import { useI18n } from '~/composables/use-i18n'
import { timeFmt } from '~/utils/time-fmt'
import { keycodes } from '~/constants/key-codes'

export interface UseSeekableOptions
  extends ToRefs<{
    duration: number
    currentTime: number
    isReady: boolean
  }> {
  onSeek: (frac: number) => void
  onTogglePlayback: () => void
}

export const useSeekable = ({
  duration,
  currentTime,
  isReady,
  onSeek,
  onTogglePlayback,
}: UseSeekableOptions) => {
  const i18n = useI18n()

  const attributes = computed(() => ({
    'aria-valuemax': duration.value,
    'aria-valuenow': currentTime.value,
    'aria-valuetext': i18n
      .t('waveform.current-time', {
        time: timeFmt(currentTime.value),
      })
      .toString(),
    'aria-orientation': 'horizontal' as const,
    'aria-valuemin': '0',
  }))

  const seekDelta = 1 // seconds
  const modSeekDelta = 15 // seconds
  const modSeekDeltaFrac = computed(() =>
    isReady.value ? modSeekDelta / duration.value : 0
  )
  const seekDeltaFrac = computed(() =>
    isReady.value ? seekDelta / duration.value : 0
  )
  const currentFrac = computed(() =>
    isReady.value ? currentTime.value / duration.value : 0
  )

  const handleArrowKeys = (event: KeyboardEvent) => {
    const { key, shiftKey, metaKey } = event
    if (metaKey) {
      // Always false on Windows
      onSeek(key.includes('Left') ? 0 : 1)
    } else {
      const direction = key.includes('Left') ? -1 : 1
      const magnitude = shiftKey ? modSeekDeltaFrac.value : seekDeltaFrac.value
      const delta = magnitude * direction
      onSeek(currentFrac.value + delta)
    }
  }

  const willBeHandled = (event: KeyboardEvent) =>
    (
      [
        keycodes.ArrowLeft,
        keycodes.ArrowRight,
        keycodes.Home,
        keycodes.End,
        keycodes.Spacebar,
      ] as string[]
    ).includes(event.key)

  const handleKeys = (event: KeyboardEvent) => {
    if (!willBeHandled(event)) return

    event.preventDefault()
    if (
      ([keycodes.ArrowLeft, keycodes.ArrowRight] as string[]).includes(
        event.key
      )
    )
      return handleArrowKeys(event)
    if (event.key === keycodes.Home) return onSeek(0)
    if (event.key === keycodes.End) return onSeek(1)
    if (event.key === keycodes.Spacebar) return onTogglePlayback()
  }

  const listeners = {
    keydown: handleKeys,
  }

  const meta = {
    modSeekDeltaFrac,
    seekDeltaFrac,
    currentFrac,
  }

  return { attributes, listeners, meta }
}
